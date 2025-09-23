import React from 'react';
import type { User } from '../types';
import { useApp } from '../context/AppContext';
import { UserCircle } from 'lucide-react';

interface UserSelectionProps {
  onUserSelect: () => void;
}

export const UserSelection: React.FC<UserSelectionProps> = ({ onUserSelect }) => {
  const { users, setCurrentUser } = useApp();

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
    onUserSelect();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Taskify</h1>
          <p className="text-gray-600">Select your profile to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserCircle className="w-12 h-12 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Product Manager'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};