import { useState } from 'react';
import {
  ChevronDown,
  User,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ColorTheme = 'default' | 'blue' | 'green' | 'purple' | 'red' | 'orange';
type Layout = 'single' | 'double';

const colorThemes = {
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    mutedText: 'text-gray-700',
    labelText: 'text-gray-700',
    border: 'border-gray-200',
    cardBg: 'bg-white',
    button: 'bg-gray-800 hover:bg-gray-700 text-white',
    secondaryButton: 'bg-gray-50 hover:bg-gray-100 text-black',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-gray-50',
    dropdownBorder: 'border-gray-200',
    skillBg: 'bg-gray-100 text-gray-800',
    dangerText: 'text-red-600',
  },
  blue: {
    background: 'bg-blue-50',
    text: 'text-blue-900',
    mutedText: 'text-blue-700',
    labelText: 'text-blue-600',
    border: 'border-blue-200',
    cardBg: 'bg-white',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondaryButton: 'bg-blue-100 hover:bg-blue-200 text-blue-900',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-blue-50',
    dropdownBorder: 'border-blue-200',
    skillBg: 'bg-blue-100 text-blue-800',
    dangerText: 'text-red-600',
  },
  green: {
    background: 'bg-green-50',
    text: 'text-green-900',
    mutedText: 'text-green-700',
    labelText: 'text-green-600',
    border: 'border-green-200',
    cardBg: 'bg-white',
    button: 'bg-green-600 hover:bg-green-700 text-white',
    secondaryButton: 'bg-green-100 hover:bg-green-200 text-green-900',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-green-50',
    dropdownBorder: 'border-green-200',
    skillBg: 'bg-green-100 text-green-800',
    dangerText: 'text-red-600',
  },
  purple: {
    background: 'bg-purple-50',
    text: 'text-purple-900',
    mutedText: 'text-purple-700',
    labelText: 'text-purple-600',
    border: 'border-purple-200',
    cardBg: 'bg-white',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondaryButton: 'bg-purple-100 hover:bg-purple-200 text-purple-900',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-purple-50',
    dropdownBorder: 'border-purple-200',
    skillBg: 'bg-purple-100 text-purple-800',
    dangerText: 'text-red-600',
  },
  red: {
    background: 'bg-red-50',
    text: 'text-red-900',
    mutedText: 'text-red-700',
    labelText: 'text-red-600',
    border: 'border-red-200',
    cardBg: 'bg-white',
    button: 'bg-red-600 hover:bg-red-700 text-white',
    secondaryButton: 'bg-red-100 hover:bg-red-200 text-red-900',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-red-50',
    dropdownBorder: 'border-red-200',
    skillBg: 'bg-red-100 text-red-800',
    dangerText: 'text-red-700',
  },
  orange: {
    background: 'bg-orange-50',
    text: 'text-orange-900',
    mutedText: 'text-orange-700',
    labelText: 'text-orange-600',
    border: 'border-orange-200',
    cardBg: 'bg-white',
    button: 'bg-orange-600 hover:bg-orange-700 text-white',
    secondaryButton: 'bg-orange-100 hover:bg-orange-200 text-orange-900',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-orange-50',
    dropdownBorder: 'border-orange-200',
    skillBg: 'bg-orange-100 text-orange-800',
    dangerText: 'text-red-600',
  },
};

interface UserProfile {
  email: string;
  fullName: string;
  avatar: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  about?: string;
  skills?: string[];
  address?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    addressType?: string;
  };
  payment?: {
    cardNumber?: string;
    cardholderName?: string;
    expirationDate?: string;
    cvv?: string;
    billingAddressSame?: boolean;
    isDefault?: boolean;
    cardType?: string;
  };
}

interface ProfileProps {
  'data-id'?: string;
  userProfile?: UserProfile | null;
  layout?: Layout;
  onLogout?: () => void;
  colorTheme?: ColorTheme;
  isLoading?: boolean;
  onEditProfile?: () => void;
  onSaveProfile?: (section: string, data: any) => Promise<void>;
}
const Profile = ({
  'data-id': dataId,
  userProfile,
  layout = 'single',
  onLogout,
  colorTheme = 'default',
  isLoading = false,
  onSaveProfile,
}: ProfileProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editModes, setEditModes] = useState<{
    personal: boolean;
    address: boolean;
    payment: boolean;
  }>({
    personal: false,
    address: false,
    payment: false,
  });
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState<{
    personal: boolean;
    address: boolean;
    payment: boolean;
  }>({
    personal: false,
    address: false,
    payment: false,
  });
  const [errors, setErrors] = useState<{
    personal?: any;
    address?: any;
    payment?: any;
  }>({});

  const handleEditToggle = (section: 'personal' | 'address' | 'payment') => {
    setEditModes((prev: any) => ({
      ...prev,
      [section]: !prev[section],
    }));

    if (!editModes[section]) {
      // Initialize edit data when entering edit mode
      if (section === 'personal') {
        setEditData((prev: any) => ({
          ...prev,
          personal: {
            firstName:
              userProfile?.firstName ||
              userProfile?.fullName?.split(' ')[0] ||
              '',
            lastName:
              userProfile?.lastName ||
              userProfile?.fullName?.split(' ').slice(1).join(' ') ||
              '',
            email: userProfile?.email || '',
            phone: userProfile?.phone || '',
            birthday: userProfile?.birthday || '',
            gender: userProfile?.gender || '',
            about: userProfile?.about || '',
          },
        }));
      } else if (section === 'address') {
        setEditData((prev: any) => ({
          ...prev,
          address: {
            street1: userProfile?.address?.street1 || '',
            street2: userProfile?.address?.street2 || '',
            city: userProfile?.address?.city || '',
            state: userProfile?.address?.state || '',
            zipCode: userProfile?.address?.zipCode || '',
            country: userProfile?.address?.country || 'United States',
            addressType: userProfile?.address?.addressType || 'Home',
          },
        }));
      } else if (section === 'payment') {
        setEditData((prev: any) => ({
          ...prev,
          payment: {
            cardNumber: userProfile?.payment?.cardNumber || '',
            cardholderName: userProfile?.payment?.cardholderName || '',
            expirationDate: userProfile?.payment?.expirationDate || '',
            cvv: userProfile?.payment?.cvv || '',
            billingAddressSame:
              userProfile?.payment?.billingAddressSame || false,
            isDefault: userProfile?.payment?.isDefault || false,
            cardType: userProfile?.payment?.cardType || '',
          },
        }));
      }
    }

    // Clear errors when toggling edit mode
    setErrors((prev) => ({
      ...prev,
      [section]: {},
    }));
  };

  const handleSave = async (section: 'personal' | 'address' | 'payment') => {
    if (!onSaveProfile) return;

    setSaving((prev) => ({ ...prev, [section]: true }));

    try {
      await onSaveProfile(section, editData[section]);
      setEditModes((prev) => ({ ...prev, [section]: false }));
      setErrors((prev) => ({ ...prev, [section]: {} }));
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        [section]: error.fieldErrors || { general: error.message },
      }));
    } finally {
      setSaving((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleCancel = (section: 'personal' | 'address' | 'payment') => {
    setEditModes((prev) => ({ ...prev, [section]: false }));
    setErrors((prev) => ({ ...prev, [section]: {} }));
  };

  const handleFieldChange = (section: string, field: string, value: any) => {
    setEditData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };


  const theme = colorThemes[colorTheme];

  const dropdownItems = [
    {
      icon: User,
      label: 'Account',
    },
    {
      icon: Settings,
      label: 'Settings',
    },
    {
      icon: Shield,
      label: 'Privacy',
    },
    {
      icon: Bell,
      label: 'Notifications',
    },
    {
      icon: HelpCircle,
      label: 'Help center',
    },
    {
      icon: LogOut,
      label: 'Sign out',
      danger: true,
      action: onLogout,
    },
  ];

  if (!userProfile) {
    return (
      <div className={`max-w-4xl mx-auto p-6 ${theme.background}`}>
        <p className={theme.text}>No user data available. Please log in.</p>
      </div>
    );
  }

  return (
    <div
      data-id={dataId}
      className={`max-w-4xl mx-auto p-6 ${theme.background}`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-4">
          <img
            src={userProfile.avatar}
            alt={`Profile picture of ${userProfile.fullName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
          <h1 className={`text-2xl font-semibold ${theme.text}`}>
            {userProfile.fullName}
          </h1>
        </div>
        <div className="relative flex gap-4 ">
          {/* <button
            onClick={handleEditProfile}
            className={`flex items-center gap-2 px-4 py-2 ${theme.button} rounded-lg transition-colors cursor-pointer`}
          >
            <Edit className="w-4 h-4" />
            Edit profile
          </button> */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={cn(
              `flex items-center gap-2 px-4 py-2 ${theme.secondaryButton} rounded-lg transition-colors cursor-pointer`
            )}
            aria-label="Open profile menu"
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          {dropdownOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-48 ${theme.dropdownBg} border ${theme.dropdownBorder} rounded-lg shadow-lg z-10`}
              role="menu"
              aria-label="Profile menu"
            >
              {dropdownItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (item.action) item.action();
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left ${theme.dropdownHover} transition-colors first:rounded-t-lg last:rounded-b-lg ${item.danger ? theme.dangerText : theme.mutedText}`}
                  role="menuitem"
                  aria-label={item.label}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Personal Information Section */}
      <div
        className={cn(
          'flex flex-col gap-6 align-top items-start',
          layout === 'double' ? 'md:flex-row' : ''
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-6 w-full flex-1',
            layout === 'double' ? 'flex-2' : ''
          )}
        >
          {/* Personal Information Section */}
          <div
            className={`p-4 border ${theme.border} ${theme.cardBg} rounded-2xl`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${theme.text}`} id="personal-info-heading">
                Personal Information
              </h2>
              <div className="flex gap-2">
                {editModes.personal ? (
                  <>
                    <button
                      onClick={() => handleCancel('personal')}
                      className={`px-3 py-1 text-sm border ${theme.border} ${theme.secondaryButton} rounded-lg transition-colors cursor-pointer`}
                      disabled={saving.personal}
                      aria-label="Cancel personal information editing"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('personal')}
                      className={`px-3 py-1 text-sm ${theme.button} rounded-lg transition-colors disabled:opacity-50 cursor-pointer`}
                      disabled={saving.personal}
                      aria-label="Save personal information changes"
                    >
                      {saving.personal ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditToggle('personal')}
                    className={`px-3 py-1 text-sm ${theme.button} rounded-lg transition-colors cursor-pointer`}
                    disabled={isLoading}
                    aria-label="Edit personal information"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {errors.personal?.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="polite">
                <p className="text-sm text-red-600">
                  {errors.personal.general}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                {editModes.personal ? (
                  <div>
                    <input
                      type="text"
                      value={editData.personal?.firstName || ''}
                      onChange={(e) =>
                        handleFieldChange(
                          'personal',
                          'firstName',
                          e.target.value
                        )
                      }
                      className={`w-full px-3 py-2 border ${errors.personal?.firstName ? 'border-red-500' : theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                      aria-describedby={errors.personal?.firstName ? 'firstName-error' : undefined}
                      aria-invalid={errors.personal?.firstName ? 'true' : 'false'}
                    />
                    {errors.personal?.firstName && (
                      <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
                        {errors.personal.firstName}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className={theme.text}>
                    {userProfile.firstName ||
                      userProfile.fullName?.split(' ')[0] ||
                      'Not provided'}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                {editModes.personal ? (
                  <div>
                    <input
                      type="text"
                      value={editData.personal?.lastName || ''}
                      onChange={(e) =>
                        handleFieldChange(
                          'personal',
                          'lastName',
                          e.target.value
                        )
                      }
                      className={`w-full px-3 py-2 border ${errors.personal?.lastName ? 'border-red-500' : theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    {errors.personal?.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.personal.lastName}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className={theme.text}>
                    {userProfile.lastName ||
                      userProfile.fullName?.split(' ').slice(1).join(' ') ||
                      'Not provided'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                {editModes.personal ? (
                  <div>
                    <input
                      type="email"
                      value={editData.personal?.email || ''}
                      onChange={(e) =>
                        handleFieldChange('personal', 'email', e.target.value)
                      }
                      className={`w-full px-3 py-2 border ${errors.personal?.email ? 'border-red-500' : theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    {errors.personal?.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.personal.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className={theme.text}>{userProfile.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  Phone Number
                </label>
                {editModes.personal ? (
                  <input
                    type="tel"
                    value={editData.personal?.phone || ''}
                    onChange={(e) =>
                      handleFieldChange('personal', 'phone', e.target.value)
                    }
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="+1-555-123-4567"
                  />
                ) : (
                  <p className={theme.text}>
                    {userProfile.phone || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Birthday */}
              <div>
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  Date of Birth
                </label>
                {editModes.personal ? (
                  <input
                    type="date"
                    value={editData.personal?.birthday || ''}
                    onChange={(e) =>
                      handleFieldChange('personal', 'birthday', e.target.value)
                    }
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                ) : (
                  <p className={theme.text}>
                    {userProfile.birthday || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  Gender
                </label>
                {editModes.personal ? (
                  <select
                    value={editData.personal?.gender || ''}
                    onChange={(e) =>
                      handleFieldChange('personal', 'gender', e.target.value)
                    }
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className={theme.text}>
                    {userProfile.gender || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            {/* Bio/Description */}
            <div className="mt-6">
              <label
                className={`block text-sm font-medium ${theme.labelText} mb-1`}
              >
                Bio/Description
              </label>
              {editModes.personal ? (
                <textarea
                  value={editData.personal?.about || ''}
                  onChange={(e) =>
                    handleFieldChange('personal', 'about', e.target.value)
                  }
                  className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className={`${theme.mutedText} leading-relaxed`}>
                  {userProfile.about || 'No description provided'}
                </p>
              )}
            </div>
          </div>

          {/* Address Information Section */}
          <div
            className={`p-4 border ${theme.border} ${theme.cardBg} rounded-2xl`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${theme.text}`} id="address-info-heading">
                Address Information
              </h2>
              <div className="flex gap-2">
                {editModes.address ? (
                  <>
                    <button
                      onClick={() => handleCancel('address')}
                      className={`px-3 py-1 text-sm border ${theme.border} ${theme.secondaryButton} rounded-lg transition-colors cursor-pointer`}
                      disabled={saving.address}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('address')}
                      className={`px-3 py-1 text-sm ${theme.button} rounded-lg transition-colors disabled:opacity-50 cursor-pointer`}
                      disabled={saving.address}
                    >
                      {saving.address ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditToggle('address')}
                    className={`px-3 py-1 text-sm ${theme.button} rounded-lg transition-colors cursor-pointer`}
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {errors.address?.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.address.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Street Address 1 */}
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  Street Address 1 <span className="text-red-500">*</span>
                </label>
                {editModes.address ? (
                  <div>
                    <input
                      type="text"
                      value={editData.address?.street1 || ''}
                      onChange={(e) =>
                        handleFieldChange('address', 'street1', e.target.value)
                      }
                      className={`w-full px-3 py-2 border ${errors.address?.street1 ? 'border-red-500' : theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    {errors.address?.street1 && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address.street1}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className={theme.text}>
                    {userProfile.address?.street1 || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Street Address 2 */}
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  Street Address 2
                </label>
                {editModes.address ? (
                  <input
                    type="text"
                    value={editData.address?.street2 || ''}
                    onChange={(e) =>
                      handleFieldChange('address', 'street2', e.target.value)
                    }
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                ) : (
                  <p className={theme.text}>
                    {userProfile.address?.street2 || 'Not provided'}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  City <span className="text-red-500">*</span>
                </label>
                {editModes.address ? (
                  <div>
                    <input
                      type="text"
                      value={editData.address?.city || ''}
                      onChange={(e) =>
                        handleFieldChange('address', 'city', e.target.value)
                      }
                      className={`w-full px-3 py-2 border ${errors.address?.city ? 'border-red-500' : theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    {errors.address?.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address.city}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className={theme.text}>
                    {userProfile.address?.city || 'Not provided'}
                  </p>
                )}
              </div>

              {/* State/Province */}
              <div>
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  State/Province <span className="text-red-500">*</span>
                </label>
                {editModes.address ? (
                  <div>
                    <select
                      value={editData.address?.state || ''}
                      onChange={(e) =>
                        handleFieldChange('address', 'state', e.target.value)
                      }
                      className={`w-full px-3 py-2 border ${errors.address?.state ? 'border-red-500' : theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                      <option value="WA">Washington</option>
                      {/* Add more states as needed */}
                    </select>
                    {errors.address?.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address.state}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className={theme.text}>
                    {userProfile.address?.state || 'Not provided'}
                  </p>
                )}
              </div>

              {/* ZIP/Postal Code */}
              <div>
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  ZIP/Postal Code <span className="text-red-500">*</span>
                </label>
                {editModes.address ? (
                  <div>
                    <input
                      type="text"
                      value={editData.address?.zipCode || ''}
                      onChange={(e) =>
                        handleFieldChange('address', 'zipCode', e.target.value)
                      }
                      className={`w-full px-3 py-2 border ${errors.address?.zipCode ? 'border-red-500' : theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    {errors.address?.zipCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address.zipCode}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className={theme.text}>
                    {userProfile.address?.zipCode || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  Country <span className="text-red-500">*</span>
                </label>
                {editModes.address ? (
                  <select
                    value={editData.address?.country || ''}
                    onChange={(e) =>
                      handleFieldChange('address', 'country', e.target.value)
                    }
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                ) : (
                  <p className={theme.text}>
                    {userProfile.address?.country || 'United States'}
                  </p>
                )}
              </div>

              {/* Address Type */}
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium ${theme.labelText} mb-1`}
                >
                  Address Type
                </label>
                {editModes.address ? (
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="addressType"
                        value="Home"
                        checked={editData.address?.addressType === 'Home'}
                        onChange={(e) =>
                          handleFieldChange(
                            'address',
                            'addressType',
                            e.target.value
                          )
                        }
                        className="mr-2"
                      />
                      Home
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="addressType"
                        value="Work"
                        checked={editData.address?.addressType === 'Work'}
                        onChange={(e) =>
                          handleFieldChange(
                            'address',
                            'addressType',
                            e.target.value
                          )
                        }
                        className="mr-2"
                      />
                      Work
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="addressType"
                        value="Other"
                        checked={editData.address?.addressType === 'Other'}
                        onChange={(e) =>
                          handleFieldChange(
                            'address',
                            'addressType',
                            e.target.value
                          )
                        }
                        className="mr-2"
                      />
                      Other
                    </label>
                  </div>
                ) : (
                  <p className={theme.text}>
                    {userProfile.address?.addressType || 'Home'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information Section */}
        <div
          className={`p-4 border ${theme.border} ${theme.cardBg} rounded-2xl flex-1 w-full`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${theme.text}`} id="payment-info-heading">
              Payment Information
            </h2>
            <div className="flex gap-2">
              {editModes.payment ? (
                <>
                  <button
                    onClick={() => handleCancel('payment')}
                    className={`px-3 py-1 text-sm border ${theme.border} ${theme.secondaryButton} rounded-lg transition-colors`}
                    disabled={saving.payment}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('payment')}
                    className={`px-3 py-1 text-sm ${theme.button} rounded-lg transition-colors disabled:opacity-50`}
                    disabled={saving.payment}
                  >
                    {saving.payment ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEditToggle('payment')}
                  className={`px-3 py-1 text-sm ${theme.button} rounded-lg transition-colors`}
                  disabled={isLoading}
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {errors.payment?.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.payment.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {/* Card Number */}
            <div>
              <label
                className={`block text-sm font-medium ${theme.labelText} mb-1`}
              >
                Card Number <span className="text-red-500">*</span>
              </label>
              {editModes.payment ? (
                <div>
                  <input
                    type="text"
                    value={editData.payment?.cardNumber || ''}
                    onChange={(e) =>
                      handleFieldChange('payment', 'cardNumber', e.target.value)
                    }
                    className={`w-full px-3 py-2 border ${errors.payment?.cardNumber ? 'border-red-500' : theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                  {errors.payment?.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.payment.cardNumber}
                    </p>
                  )}
                </div>
              ) : (
                <p className={theme.text}>
                  {userProfile.payment?.cardNumber
                    ? `****-****-****-${userProfile.payment.cardNumber.slice(-4)}`
                    : 'Not provided'}
                </p>
              )}
            </div>

            {/* Cardholder Name */}
            <div>
              <label
                className={`block text-sm font-medium ${theme.labelText} mb-1`}
              >
                Cardholder Name <span className="text-red-500">*</span>
              </label>
              {editModes.payment ? (
                <div>
                  <input
                    type="text"
                    value={editData.payment?.cardholderName || ''}
                    onChange={(e) =>
                      handleFieldChange(
                        'payment',
                        'cardholderName',
                        e.target.value
                      )
                    }
                    className={`w-full px-3 py-2 border ${errors.payment?.cardholderName ? 'border-red-500' : theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                  {errors.payment?.cardholderName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.payment.cardholderName}
                    </p>
                  )}
                </div>
              ) : (
                <p className={theme.text}>
                  {userProfile.payment?.cardholderName || 'Not provided'}
                </p>
              )}
            </div>

            {/* Expiration Date */}
            <div>
              <label
                className={`block text-sm font-medium ${theme.labelText} mb-1`}
              >
                Expiration Date <span className="text-red-500">*</span>
              </label>
              {editModes.payment ? (
                <div>
                  <input
                    type="text"
                    value={editData.payment?.expirationDate || ''}
                    onChange={(e) =>
                      handleFieldChange(
                        'payment',
                        'expirationDate',
                        e.target.value
                      )
                    }
                    className={`w-full px-3 py-2 border ${errors.payment?.expirationDate ? 'border-red-500' : theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="MM/YYYY"
                    maxLength={7}
                    required
                  />
                  {errors.payment?.expirationDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.payment.expirationDate}
                    </p>
                  )}
                </div>
              ) : (
                <p className={theme.text}>
                  {userProfile.payment?.expirationDate || 'Not provided'}
                </p>
              )}
            </div>

            {/* CVV */}
            <div>
              <label
                className={`block text-sm font-medium ${theme.labelText} mb-1`}
              >
                CVV <span className="text-red-500">*</span>
              </label>
              {editModes.payment ? (
                <div>
                  <input
                    type="password"
                    value={editData.payment?.cvv || ''}
                    onChange={(e) =>
                      handleFieldChange('payment', 'cvv', e.target.value)
                    }
                    className={`w-full px-3 py-2 border ${errors.payment?.cvv ? 'border-red-500' : theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                  {errors.payment?.cvv && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.payment.cvv}
                    </p>
                  )}
                </div>
              ) : (
                <p className={theme.text}>***</p>
              )}
            </div>

            {/* Card Type */}
            <div>
              <label
                className={`block text-sm font-medium ${theme.labelText} mb-1`}
              >
                Card Type
              </label>
              <p className={theme.text}>
                {userProfile.payment?.cardType || 'Visa'}
              </p>
            </div>

            {/* Billing Address Same */}
            <div>
              <label className="flex items-center">
                {editModes.payment ? (
                  <input
                    type="checkbox"
                    checked={editData.payment?.billingAddressSame || false}
                    onChange={(e) =>
                      handleFieldChange(
                        'payment',
                        'billingAddressSame',
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={userProfile.payment?.billingAddressSame || false}
                    disabled
                    className="mr-2"
                  />
                )}
                <span className={`text-sm ${theme.text}`}>
                  Same as home address
                </span>
              </label>
            </div>

            {/* Default Payment */}
            <div>
              <label className="flex items-center">
                {editModes.payment ? (
                  <input
                    type="radio"
                    name="defaultPayment"
                    checked={editData.payment?.isDefault || false}
                    onChange={(e) =>
                      handleFieldChange(
                        'payment',
                        'isDefault',
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                ) : (
                  <input
                    type="radio"
                    checked={userProfile.payment?.isDefault || false}
                    disabled
                    className="mr-2"
                  />
                )}
                <span className={`text-sm ${theme.text}`}>
                  Primary payment method
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setDropdownOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Profile;
