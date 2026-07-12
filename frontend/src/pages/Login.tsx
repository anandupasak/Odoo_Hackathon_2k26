import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../services/db';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { login, registerUser } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !password) {
        setError('Please enter email and password.');
        return;
      }
      
      const success = login(email);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials or account is inactive.');
      }
    } else {
      // Signup flow
      if (!email || !password || !name) {
        setError('Please fill all fields.');
        return;
      }
      
      const newUser: User = {
        id: uuidv4(),
        name,
        email,
        role: 'Employee', // All new signups are employees by default
        departmentId: null,
        status: 'Active'
      };
      
      registerUser(newUser);
      
      // Auto-login after signup
      login(email);
      navigate('/');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'radial-gradient(circle at center, var(--bg-secondary), var(--bg-primary))' }}>
      <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-circle" style={{ width: '64px', height: '64px', fontSize: '1.5rem', margin: '0 auto 1rem auto' }}>AF</div>
          <h2>AssetFlow - {isLogin ? 'Login' : 'Sign Up'}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {isLogin ? 'Enter your credentials to access your account' : 'Create an employee account to get started'}
          </p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ display: 'block', padding: '0.75rem', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
          )}
          
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="name@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          {isLogin && (
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <a href="#" style={{ fontSize: '0.85rem' }}>Forgot password?</a>
            </div>
          )}
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            {isLogin ? 'Login to AssetFlow' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {isLogin ? 'New here?' : 'Already have an account?'}
          </p>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ marginTop: '0.5rem', width: '100%' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up creates an employee account' : 'Back to Login'}
          </button>
          {!isLogin && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Admin roles are assigned later by system administrators.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
