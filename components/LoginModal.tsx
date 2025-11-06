import React, { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.438 36.338 48 30.686 48 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"></path>
    </svg>
);

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100] backdrop-blur-sm animate-fade-in px-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-brand-dark w-full max-w-md rounded-lg shadow-2xl overflow-hidden p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-8 w-8 bg-gray-800/80 rounded-full flex items-center justify-center text-white text-2xl z-10 hover:bg-gray-700"
          aria-label="Close login form"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>
        
        <div className="space-y-4">
             <button
                onClick={onLogin}
                className="w-full flex items-center justify-center bg-white text-gray-800 font-semibold py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
             >
                <GoogleIcon />
                Sign in with Google
            </button>
             <button
                onClick={onLogin}
                className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
             >
                <FacebookIcon />
                Sign in with Facebook
            </button>
        </div>

        <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-600" />
            <span className="mx-4 text-gray-400">or</span>
            <hr className="flex-grow border-gray-600" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-purple transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-purple transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-purple text-white font-bold py-3 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-500"
            disabled={!email || !password}
          >
            Sign In with Email
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-6 text-center">
            This is a simulated login. Any method will work.
        </p>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;