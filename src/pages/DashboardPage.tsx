import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Car,
  CreditCard,
  Activity,
  DollarSign,
  Users,
  Package,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock statistics data
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,250',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      changeColor: 'text-green-600',
    },
    {
      title: 'Active Users',
      value: '2,340',
      change: '+8.2%',
      icon: Users,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      changeColor: 'text-green-600',
    },
    {
      title: 'Pending Requests',
      value: '12',
      change: '-3.1%',
      icon: Clock,
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      changeColor: 'text-red-600',
    },
    {
      title: 'Completed Tasks',
      value: '89',
      change: '+15.3%',
      icon: CheckCircle,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      changeColor: 'text-green-600',
    },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      action: 'New payment request submitted',
      user: 'Sarah Johnson',
      time: '2 hours ago',
      type: 'payment',
    },
    {
      id: 2,
      action: 'Profile updated successfully',
      user: 'You',
      time: '5 hours ago',
      type: 'profile',
    },
    {
      id: 3,
      action: 'Car details viewed',
      user: 'Michael Chen',
      time: '1 day ago',
      type: 'car',
    },
    {
      id: 4,
      action: 'Payment request approved',
      user: 'Jennifer Walsh',
      time: '2 days ago',
      type: 'payment',
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'View Profile',
      description: 'Manage your personal information',
      icon: User,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => navigate('/profile'),
    },
    {
      title: 'Car Details',
      description: 'Browse available vehicles',
      icon: Car,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/car/tesla-model-s-2023'),
    },
    {
      title: 'Payment Requests',
      description: 'Review and approve payments',
      icon: CreditCard,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => navigate('/payments'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || user?.fullName?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-2 ${stat.changeColor}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 ${stat.color} rounded-lg`}>
                    <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'payment' ? 'bg-purple-600' :
                          activity.type === 'profile' ? 'bg-blue-600' :
                          'bg-green-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">
                          by {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-6 text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                  View all activity →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6 space-y-3">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${action.color} rounded-lg text-white`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{action.title}</p>
                          <p className="text-sm text-gray-500">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming</h2>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment Review</p>
                      <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Profile Update</p>
                      <p className="text-sm text-gray-500">Next Week</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                      Scheduled
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Car Inspection</p>
                      <p className="text-sm text-gray-500">In 2 weeks</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;