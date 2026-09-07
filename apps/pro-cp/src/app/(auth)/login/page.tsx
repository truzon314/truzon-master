'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setUser, DEFAULT_PRO_USER, DEFAULT_CP_USER } from '@/store/slices/authSlice';
import { ShieldCheck, Target, Award, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRole, setSelectedRole] = useState<'PRO' | 'CP'>('PRO');
  const [email, setEmail] = useState('agent@truzon.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleRoleSelect = (role: 'PRO' | 'CP') => {
    setSelectedRole(role);
    if (role === 'PRO') {
      setEmail('agent@truzon.in');
    } else {
      setEmail('partner@squareyards.com');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'PRO') {
      dispatch(setUser(DEFAULT_PRO_USER));
      router.push('/pro/dashboard');
    } else {
      dispatch(setUser(DEFAULT_CP_USER));
      router.push('/cp/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-8 shadow-xl space-y-6">
        {/* Header with Truzon Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#0f1c3a] text-white rounded-xl flex items-center justify-center mx-auto shadow-md font-serif text-xl font-bold">
            T
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f1c3a] font-serif">TRUZON PORTAL</h1>
          <p className="text-xs text-slate-500">
            Enterprise Sales CRM & Channel Partner Broker Desk
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => handleRoleSelect('PRO')}
            className={`flex flex-col items-center p-3 rounded-lg transition-all cursor-pointer ${
              selectedRole === 'PRO'
                ? 'bg-white text-[#0f1c3a] shadow-sm font-semibold border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-4 h-4 mb-1 text-[#0f1c3a]" />
            <span className="text-xs font-bold">Pro Sales Team</span>
            <span className="text-[10px] text-slate-400">Internal CRM</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('CP')}
            className={`flex flex-col items-center p-3 rounded-lg transition-all cursor-pointer ${
              selectedRole === 'CP'
                ? 'bg-white text-[#c2941f] shadow-sm font-semibold border border-amber-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4 mb-1 text-[#c2941f]" />
            <span className="text-xs font-bold">Channel Partner</span>
            <span className="text-[10px] text-slate-400">Broker Desk</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Authorized Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0f1c3a]/20 focus:border-[#0f1c3a] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Security Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0f1c3a]/20 focus:border-[#0f1c3a] transition-all font-mono"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant={selectedRole === 'PRO' ? 'primary' : 'gold'}
              className="w-full py-2.5"
            >
              <span>Sign In to {selectedRole === 'PRO' ? 'Pro Portal' : 'CP Partner Desk'}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" /> Strict Role-Based Isolation & 60-Day Lead Protection Active
          </p>
        </div>
      </div>
    </div>
  );
}