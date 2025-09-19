import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from '../components/Profile';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [successMessages, setSuccessMessages] = useState<{ [key: string]: string }>({});

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSaveProfile = async (section: string, data: any) => {
    try {
      await updateProfile(section, data);

      const sectionNames = {
        personal: 'Personal information',
        address: 'Address information',
        payment: 'Payment information',
      };

      setSuccessMessages(prev => ({
        ...prev,
        [section]: `${sectionNames[section as keyof typeof sectionNames]} updated successfully`,
      }));

      setTimeout(() => {
        setSuccessMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[section];
          return newMessages;
        });
      }, 3000);

    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {Object.entries(successMessages).map(([section, message]) => (
          <div key={section} className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{message}</p>
          </div>
        ))}

        <Profile
          data-id="user-profile"
          userProfile={user}
          onLogout={handleLogout}
          onSaveProfile={handleSaveProfile}
          colorTheme="default"
          layout="single"
        />
      </div>
    </div>
  );
};

export default ProfilePage;