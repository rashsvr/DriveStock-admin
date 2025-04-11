import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    const { success, message } = await login(formData.email, formData.password);
    setLoading(false);
    if (success) {
      setAlert({ type: 'success', message });
      setTimeout(() => {
        navigate('/dashboard'); // Buyer redirection handled in AuthContext
      }, 1000);
    } else if (message) {
      setAlert({ type: 'error', message });
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-2xl text-center">Login</h2>
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="card-actions justify-center mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </div>
            <p className="text-center mt-4">
              Don't have an account?{' '}
              <a href="/register" className="link link-primary">
                Register (Sellers Only)
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;