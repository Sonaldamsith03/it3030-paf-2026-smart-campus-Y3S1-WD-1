import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F4] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="text-red-600" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-[#141414] mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          You don't have the required permissions to access this section. Please contact your administrator if you believe this is an error.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#141414] text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
