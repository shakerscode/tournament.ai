'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('user');

  // Mock Google login
  const handleGoogleLogin = async (asAdmin: boolean) => {
    setIsLoading(true);

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Set auth tokens in localStorage
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('isAdmin', asAdmin ? 'true' : 'false');
    localStorage.setItem('userRole', asAdmin ? 'admin' : 'user');
    localStorage.setItem('userEmail', `user-${Math.random().toString(36).substr(2, 9)}@gmail.com`);
    localStorage.setItem('userName', asAdmin ? 'Admin User' : 'Regular User');

    // Redirect to home
    router.push('/');
    setIsLoading(false);
  };

  // Clear auth
  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-black via-primary-red/20 to-secondary-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          <div className="text-5xl mb-6">🏸</div>

          <h1 className="text-3xl font-bold text-primary-red mb-2">Badminton Tournament</h1>
          <p className="text-accent-gray-medium mb-8">Sign in to continue</p>

          {/* Role Selection */}
          <div className="mb-8 space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary-black-lighter transition-colors border-2"
              style={{borderColor: selectedRole === 'user' ? 'hsl(0, 100%, 50%)' : 'hsl(0, 0%, 30%)'}}
            >
              <input
                type="radio"
                name="role"
                value="user"
                checked={selectedRole === 'user'}
                onChange={() => setSelectedRole('user')}
                className="w-4 h-4"
              />
              <span className="text-accent-white font-medium">Sign in as User</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary-black-lighter transition-colors border-2"
              style={{borderColor: selectedRole === 'admin' ? 'hsl(0, 100%, 50%)' : 'hsl(0, 0%, 30%)'}}
            >
              <input
                type="radio"
                name="role"
                value="admin"
                checked={selectedRole === 'admin'}
                onChange={() => setSelectedRole('admin')}
                className="w-4 h-4"
              />
              <span className="text-accent-white font-medium">Sign in as Admin</span>
            </label>
          </div>

          {/* Mock Google Login Button */}
          <button
            onClick={() => handleGoogleLogin(selectedRole === 'admin')}
            disabled={isLoading}
            className="w-full btn btn-primary mb-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Demo Info */}
          <div className="mt-8 p-4 bg-secondary-black-light rounded-lg text-left">
            <p className="text-accent-gray-medium text-sm mb-3 font-semibold">
              Demo Credentials (No Real Auth):
            </p>
            <ul className="text-accent-gray-medium text-xs space-y-1">
              <li>✓ User role: Regular player access</li>
              <li>✓ Admin role: Full dashboard access</li>
              <li>✓ No real email verification needed</li>
              <li>✓ Auth stored in localStorage</li>
            </ul>
          </div>

          {/* Logout Option */}
          {typeof window !== 'undefined' && localStorage.getItem('isAuth') === 'true' && (
            <button
              onClick={handleLogout}
              className="w-full btn btn-ghost text-sm mt-6"
            >
              Logout
            </button>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-accent-gray-medium text-sm">
          <p>This is a mock authentication page for demo purposes.</p>
          <p className="mt-2">No real credentials are required.</p>
        </div>
      </div>
    </div>
  );
}
