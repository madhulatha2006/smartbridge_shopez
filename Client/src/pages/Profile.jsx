import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Phone, MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfileLocal } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [password, setPassword] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitting(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      // Since there is no explicit profile API specified, we can create/simulate a profile updating mechanism.
      // We will perform a custom request to a simulated endpoint or add it. Let's do it right:
      // We will call a PUT profile API. We will add a PUT route to the server auth controller to support this live.
      const response = await axios.put(
        '/api/auth/profile',
        { name, phone, address, password },
        config
      );

      // Save locally to context and localStorage
      updateProfileLocal({
        name: response.data.name,
        phone: response.data.phone,
        address: response.data.address,
      });

      setSuccessMsg('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="space-y-6">
        {/* Title Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account information and contact configurations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Avatar Panel */}
          <div className="md:col-span-4 rounded-3xl border border-slate-100 p-6 bg-white shadow-sm flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 text-white flex items-center justify-center font-black text-3xl shadow-xl shadow-primary-500/10 mb-4">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">{user?.name}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wider">{user?.role} ACCOUNT</p>
            <hr className="w-full border-slate-100 my-4" />
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          {/* Form details panel */}
          <form onSubmit={handleUpdateProfile} className="md:col-span-8 rounded-3xl border border-slate-100 p-6 sm:p-8 bg-white shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-base border-b border-slate-50 pb-3">Personal Configurations</h3>

            {/* Notification messages */}
            {successMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-xs text-emerald-600">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 p-4 text-xs text-rose-600">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-premium pl-10 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Email (Disabled) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email}
                  className="input-premium py-2.5 text-sm bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">Email address changes are restricted.</p>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="tel"
                    placeholder="e.g. +1 555-0144"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-premium pl-10 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Shipping Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 pt-3 pointer-events-none text-slate-400">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <textarea
                    rows="3"
                    placeholder="Enter default address for faster checkout"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-premium pl-10 py-2.5 text-sm"
                  ></textarea>
                </div>
              </div>

              {/* Password for Validation */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Enter Password (to save changes)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary py-2.5 text-sm font-semibold"
              >
                <Save className="h-4.5 w-4.5" />
                <span>{submitting ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Profile;
