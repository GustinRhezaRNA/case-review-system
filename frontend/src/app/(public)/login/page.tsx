import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

const users = [
  { id: "11111111-1111-4111-8111-111111111111", name: "John", role: "ADMIN" },
  { id: "22222222-2222-4222-8222-222222222222", name: "Bob", role: "SUPERVISOR" },
  { id: "33333333-3333-4333-8333-333333333333", name: "Sam", role: "AGENT" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    const user = users.find(u => u.id === selectedUserId);

    if (user) {
      login(user);

      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-slate-100">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900">Case Management</h1>
            <p className="text-slate-600 mt-2">Welcome! Please login to continue</p>
          </div>

          {/* Login Form */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Login</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="user" className="text-sm font-medium text-slate-900 block">
                    Select User
                  </label>
                  <select
                    id="user"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                Demo login - select any user to access the dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block relative bg-gradient-to-br from-blue-600 to-blue-800">
        <img src="/assets/login-image.jpg" alt="Login illustration" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}