import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useContext } from 'react';
import { UIContext } from '../context/uiContext';
import logo from '../assets/Epic-Logo-square.png';
import AppButton from '../shared/components/AppButton';
import AppInput from '../shared/forms/AppInput';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { showToast } = useContext(UIContext);

  if (isAuthenticated) {
    return <Navigate to="/inventory" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (!result.success) {
      setError(result.error);
    } else {
      showToast('Login successful', 'success');
      navigate('/inventory', { replace: true });
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="app-card max-w-md w-full space-y-8 p-8 md:p-10">
        <div>
          <img className="mx-auto h-30 w-auto" src={logo} alt="Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text)]">
            Sign in to the Epic Inventory
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
            Access inventory modules with your current credentials.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <AppInput
              id="username"
              name="username"
              type="text"
              label="Username"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <AppInput
              id="password"
              name="password"
              type="password"
              label="Password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-2xl border px-3 py-2 text-center text-sm" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-soft)', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          <div>
            <AppButton type="submit" block size="lg">
              Sign in
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
