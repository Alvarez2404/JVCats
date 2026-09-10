import { getItem, setItem } from '../utils/storage';

// Llave pública oficial de prueba (Sandbox) de Wompi Colombia
export const DEFAULT_WOMPI_TEST_KEY = 'pub_test_Q5yDA9xoKdePuotLdvd900kJBHpy1uvn';

export const DEFAULT_WOMPI_CONFIG = {
  isSandbox: true,
  publicKey: DEFAULT_WOMPI_TEST_KEY,
  integritySecret: '', // Opcional en sandbox, recomendado para validar montos
  enabledMethods: ['CARD', 'NEQUI', 'PSE', 'BANCOLOMBIA_TRANSFER', 'BANCOLOMBIA_COLLECT']
};

/**
 * Obtiene la configuración actual de Wompi guardada o la predeterminada
 */
export function getWompiConfig() {
  const saved = getItem('wompi_config');
  if (!saved || saved.publicKey === 'pub_test_X0zDA9xoKdePuotLdvd900kJBHpy1uvn') {
    return DEFAULT_WOMPI_CONFIG;
  }
  return {
    ...DEFAULT_WOMPI_CONFIG,
    ...saved
  };
}

/**
 * Guarda la configuración de Wompi (llaves, modo sandbox/producción)
 */
export function saveWompiConfig(newConfig) {
  const current = getWompiConfig();
  const updated = {
    ...current,
    ...newConfig
  };
  setItem('wompi_config', updated);
  return updated;
}

/**
 * Genera una referencia única de orden para Wompi
 * Ejemplo: JVC-17154-8A3F2
 */
export function generateWompiReference(prefix = 'JVC') {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Carga de forma asíncrona el script oficial del Widget de Wompi
 */
let wompiScriptPromise = null;
export function loadWompiScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));

  if (window.WidgetCheckout) {
    return Promise.resolve(window.WidgetCheckout);
  }

  if (wompiScriptPromise) {
    return wompiScriptPromise;
  }

  wompiScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('wompi-checkout-script');
    if (existing) {
      if (window.WidgetCheckout) {
        resolve(window.WidgetCheckout);
        return;
      }
      existing.addEventListener('load', () => resolve(window.WidgetCheckout));
      existing.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.id = 'wompi-checkout-script';
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;

    script.onload = () => {
      if (window.WidgetCheckout) {
        resolve(window.WidgetCheckout);
      } else {
        reject(new Error('WidgetCheckout no disponible tras cargar script'));
      }
    };

    script.onerror = (err) => {
      console.error('Error al cargar el script oficial de Wompi:', err);
      reject(err);
    };

    document.head.appendChild(script);
  });

  return wompiScriptPromise;
}

/**
 * Genera la firma de integridad SHA-256 requerida por Wompi si se tiene el secreto
 * Fórmula oficial: SHA256(reference + amountInCents + currency + integritySecret)
 */
export async function generateIntegritySignature(reference, amountInCents, currency, integritySecret) {
  if (!integritySecret) return null;

  try {
    const rawString = `${reference}${amountInCents}${currency}${integritySecret}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(rawString);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.warn('No se pudo calcular la firma de integridad con Web Crypto API:', err);
    return null;
  }
}

/**
 * Abre el Widget oficial de Wompi con los parámetros del pedido
 */
export async function openWompiCheckout({
  total,
  orderReference,
  customer = {},
  shipping = {},
  onSuccess,
  onPending,
  onDeclined,
  onError,
  onClose
}) {
  const config = getWompiConfig();
  const amountInCents = Math.round(total * 100);
  const currency = 'COP';

  try {
    const WidgetCheckoutClass = await loadWompiScript();

    const checkoutOptions = {
      currency,
      amountInCents,
      reference: orderReference,
      publicKey: config.publicKey
    };

    if (customer.email) {
      checkoutOptions.customerData = {
        email: customer.email,
        fullName: customer.name || 'Cliente JV Cats'
      };
      const phoneDigits = (customer.phone || shipping.phone || '').replace(/\D/g, '').slice(-10);
      if (phoneDigits.length === 10) {
        checkoutOptions.customerData.phoneNumber = phoneDigits;
        checkoutOptions.customerData.phoneNumberPrefix = '+57';
      }
    }

    // Calcular firma de integridad si está configurado el secreto
    if (config.integritySecret) {
      const signature = await generateIntegritySignature(orderReference, amountInCents, currency, config.integritySecret);
      if (signature) {
        checkoutOptions.signature = { integrity: signature };
      }
    }

    const checkout = new WidgetCheckoutClass(checkoutOptions);

    checkout.open((result) => {
      const transaction = result?.transaction;
      if (!transaction) {
        if (onClose) onClose();
        return;
      }

      console.log('Respuesta Wompi:', transaction);

      switch (transaction.status) {
        case 'APPROVED':
          if (onSuccess) {
            onSuccess({
              transactionId: transaction.id,
              reference: transaction.reference,
              paymentMethod: transaction.payment_method_type || 'WOMPI',
              paymentMethodName: formatWompiPaymentMethod(transaction.payment_method_type),
              amountInCents: transaction.amount_in_cents,
              status: 'APPROVED',
              raw: transaction
            });
          }
          break;

        case 'PENDING':
          if (onPending) {
            onPending({
              transactionId: transaction.id,
              reference: transaction.reference,
              paymentMethod: transaction.payment_method_type || 'WOMPI',
              paymentMethodName: formatWompiPaymentMethod(transaction.payment_method_type),
              amountInCents: transaction.amount_in_cents,
              status: 'PENDING',
              raw: transaction
            });
          }
          break;

        case 'DECLINED':
        case 'VOIDED':
          if (onDeclined) {
            onDeclined({
              transactionId: transaction.id,
              status: transaction.status,
              statusMessage: transaction.status_message || 'Transacción no aprobada por la entidad financiera.',
              raw: transaction
            });
          }
          break;

        case 'ERROR':
        default:
          if (onError) {
            onError({
              transactionId: transaction.id,
              status: transaction.status,
              statusMessage: transaction.status_message || 'Ocurrió un error al procesar el pago.',
              raw: transaction
            });
          }
          break;
      }
    });

  } catch (error) {
    console.error('Error al instanciar Wompi Widget:', error);
    if (onError) {
      onError({
        error,
        message: 'No fue posible abrir el módulo seguro de Wompi. Verifica tu conexión o intenta nuevamente.'
      });
    }
  }
}

/**
 * Traduce el tipo de método de pago devuelto por Wompi a un nombre legible en español
 */
export function formatWompiPaymentMethod(methodType) {
  switch (methodType) {
    case 'CARD':
      return 'Tarjeta de Crédito / Débito (Wompi)';
    case 'NEQUI':
      return 'Nequi (Wompi)';
    case 'PSE':
      return 'PSE Débito Bancario (Wompi)';
    case 'BANCOLOMBIA_TRANSFER':
      return 'Botón Bancolombia / Transferencia (Wompi)';
    case 'BANCOLOMBIA_COLLECT':
      return 'Corresponsal Bancario Bancolombia (Wompi)';
    default:
      return methodType ? `Wompi (${methodType})` : 'Wompi Colombia';
  }
}
