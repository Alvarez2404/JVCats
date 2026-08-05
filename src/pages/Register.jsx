import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

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
          <img src="https://jvcats.com/wp-content/uploads/2022/03/LOGO-JVC-1-1.png" alt="JV Cats" />
        </div>
        <h2>Crea tu cuenta</h2>
        <p className="auth-subtitle">Regístrate para comprar los mejores productos para tu gato</p>

        {error && <div className="auth-error">⚠️ {error}</div>}

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
