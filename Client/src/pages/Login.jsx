import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, user, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Clear errors when entering login screen
  useEffect(() => {
    setError(null);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = location.state?.from || (user.role === 'admin' ? '/admin' : '/');
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await loginUser(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-b from-primary-50/20 via-white to-slate-50">
      <div className="max-w-md w-full space-y-8 p-8 rounded-3xl glass-card shadow-xl border border-slate-100 animate-fade-in">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to your ShopEZ account to start shopping</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-600 animate-slide-down">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium pl-10"
                />
              </div>
            </div>

          </div>

          <div>
            <button type="submit" className="w-full btn-primary py-3 text-base font-semibold">
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Create an Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
