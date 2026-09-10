import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleGoogleSignup = async () => {
    setError('');
    setLoadingGoogle(true);
    const result = await loginWithGoogle();
    setLoadingGoogle(false);
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/tienda');
      }
    } else {
      setError(result.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (form.password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    const result = register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      password: form.password
    });
    if (result.success) {
      navigate('/tienda');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-logo">
          <img src="/logo-jvcats.png" alt="JV Cats La Tienda" />
        </div>
        <h2>Crea tu cuenta</h2>
        <p className="auth-subtitle">Regístrate para comprar los mejores productos para tu gato</p>

        {error && <div className="auth-error">{error}</div>}

        {/* Botón de Registro Rápido con Google */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="btn-google-auth"
          disabled={loadingGoogle}
          id="btn-google-register"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{loadingGoogle ? 'Conectando con Google...' : 'Registrarse con Google'}</span>
        </button>

        <div className="auth-divider">
          <span>o completa el formulario</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input type="text" className="form-input" value={form.name}
              onChange={e => handleChange('name', e.target.value)} placeholder="María Fernanda López" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input" value={form.email}
              onChange={e => handleChange('email', e.target.value)} placeholder="tu@email.com" required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Teléfono</label>
              <input type="tel" className="form-input" value={form.phone}
                onChange={e => handleChange('phone', e.target.value)} placeholder="300 123 4567" required />
            </div>
            <div className="form-group">
              <label>Ciudad</label>
              <input type="text" className="form-input" value={form.city}
                onChange={e => handleChange('city', e.target.value)} placeholder="Bogotá" required />
            </div>
          </div>
          <div className="form-group">
            <label>Dirección</label>
            <input type="text" className="form-input" value={form.address}
              onChange={e => handleChange('address', e.target.value)} placeholder="Cra 15 #82-30, Apto 501" required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" className="form-input" value={form.password}
                onChange={e => handleChange('password', e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label>Confirmar</label>
              <input type="password" className="form-input" value={form.confirm}
                onChange={e => handleChange('confirm', e.target.value)} placeholder="••••••••" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}>
            Crear Cuenta
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
