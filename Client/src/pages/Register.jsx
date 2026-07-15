import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Home, Phone, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [validationError, setValidationError] = useState('');

  const { registerUser, user, error, setError } = useAuth();
  const navigate = useNavigate();

  // Clear errors when entering register screen
  useEffect(() => {
    setError(null);
    setValidationError('');
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await registerUser(name, email, password, address, phone);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-primary-50/20 via-white to-slate-50">
      <div className="max-w-md w-full space-y-8 p-8 rounded-3xl glass-card shadow-xl border border-slate-100 animate-fade-in">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500">Join ShopEZ and discover premium shopping</p>
        </div>

        {/* Error Notification */}
        {(validationError || error) && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-600 animate-slide-down">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
            <span>{validationError || error}</span>
          </div>
        )}

        {/* Register Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-premium pl-10 py-2 text-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-10 py-2 text-sm"
                />
              </div>
            </div>

            {/* Grid for Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pass" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    id="pass"
                    type="password"
                    required
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-premium pl-10 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPass" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    id="confirmPass"
                    type="password"
                    required
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-premium pl-10 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Delivery Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Home className="h-4.5 w-4.5" />
                </div>
                <input
                  id="address"
                  type="text"
                  placeholder="Street name, City, Zipcode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-premium pl-10 py-2 text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="e.g. +1 555 0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-premium pl-10 py-2 text-sm"
                />
              </div>
            </div>

          </div>

          <div className="pt-2">
            <button type="submit" className="w-full btn-primary py-2.5 text-sm font-semibold">
              <UserPlus className="h-4.5 w-4.5" />
              <span>Create Account</span>
            </button>
          </div>
        </form>

        <div className="text-center mt-5">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
