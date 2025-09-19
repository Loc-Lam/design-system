import { useState } from 'react';
import {
  ChevronDown,
  Car,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  Heart,
  Share2,
  Phone,
  MessageCircle,
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
    priceText: 'text-green-600',
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
    priceText: 'text-green-600',
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
    priceText: 'text-green-700',
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
    priceText: 'text-green-600',
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
    priceText: 'text-green-600',
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
    priceText: 'text-green-600',
  },
};

interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images: string[];
  description: string;
  features: string[];
  specifications: {
    engine?: string;
    transmission?: string;
    fuelType?: string;
    drivetrain?: string;
    exteriorColor?: string;
    interiorColor?: string;
    doors?: number;
    seats?: number;
    mpgCity?: number;
    mpgHighway?: number;
    vin?: string;
  };
  seller: {
    name?: string;
    phone?: string;
    email?: string;
    location?: string;
    rating?: number;
    dealerType?: 'dealer' | 'private';
  };
  history: {
    accidents?: number;
    owners?: number;
    serviceRecords?: boolean;
    title?: 'clean' | 'salvage' | 'flood' | 'lemon';
  };
}

interface CarDetailProps {
  'data-id'?: string;
  carData?: CarData | null;
  layout?: Layout;
  onContactSeller?: () => void;
  colorTheme?: ColorTheme;
  isLoading?: boolean;
  onSaveCar?: () => void;
  onShareCar?: () => void;
  recommendedCars?: CarData[];
}

const CarDetail = ({
  'data-id': dataId,
  carData,
  layout = 'single',
  onContactSeller,
  colorTheme = 'default',
  onSaveCar,
  onShareCar,
  recommendedCars = [],
}: CarDetailProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (onSaveCar) {
      onSaveCar();
    }
  };

  const handleShare = () => {
    if (onShareCar) {
      onShareCar();
    } else {
      alert('Share functionality would be implemented here');
    }
  };

  const handleContactSeller = () => {
    if (onContactSeller) {
      onContactSeller();
    } else {
      alert('Contact seller functionality would be implemented here');
    }
  };

  const theme = colorThemes[colorTheme];

  const dropdownItems = [
    {
      icon: Car,
      label: 'View Similar Cars',
    },
    {
      icon: Settings,
      label: 'Compare Cars',
    },
    {
      icon: Shield,
      label: 'Vehicle History',
    },
    {
      icon: Bell,
      label: 'Set Price Alert',
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
    },
  ];

  if (!carData) {
    return (
      <div className={`max-w-4xl mx-auto p-6 ${theme.background}`}>
        <p className={theme.text}>No car data available.</p>
      </div>
    );
  }

  return (
    <div
      data-id={dataId}
      className={`max-w-6xl mx-auto p-6 ${theme.background}`}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between pb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className={`text-3xl font-bold ${theme.text}`}>
              {carData.year} {carData.make} {carData.model}
            </h1>
            <span className={`text-sm px-2 py-1 rounded ${theme.skillBg}`}>
              {carData.history.title || 'clean'} title
            </span>
          </div>
          <p className={`text-2xl font-bold ${theme.priceText} mb-2`}>
            ${carData.price.toLocaleString()}
          </p>
          <p className={`${theme.mutedText}`}>
            {carData.mileage.toLocaleString()} miles • {carData.seller.location}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 border ${theme.border} ${theme.secondaryButton} rounded-lg transition-colors cursor-pointer`}
            aria-label={isSaved ? 'Remove from saved cars' : 'Save this car'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2 border ${theme.border} ${theme.secondaryButton} rounded-lg transition-colors cursor-pointer`}
            aria-label="Share this car listing"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                `flex items-center gap-2 px-4 py-2 ${theme.secondaryButton} rounded-lg transition-colors cursor-pointer`
              )}
              aria-label="More options"
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            {dropdownOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-48 ${theme.dropdownBg} border ${theme.dropdownBorder} rounded-lg shadow-lg z-10`}
                role="menu"
                aria-label="Car options menu"
              >
                {dropdownItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left ${theme.dropdownHover} transition-colors first:rounded-t-lg last:rounded-b-lg ${theme.mutedText} cursor-pointer`}
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
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'flex flex-col gap-6 align-top items-start',
          layout === 'double' ? 'lg:flex-row' : ''
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-6 w-full',
            layout === 'double' ? 'lg:flex-2 lg:w-2/3' : ''
          )}
        >
          {/* Image Gallery */}
          <div className={`${theme.cardBg} rounded-2xl border ${theme.border} overflow-hidden`}>
            <div className="aspect-video bg-gray-100 relative">
              <img
                src={carData.images[currentImageIndex]}
                alt={`${carData.year} ${carData.make} ${carData.model} - Main view`}
                className="w-full h-full object-cover"
              />
              {carData.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-2">
                    {carData.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`View image ${index + 1} of ${carData.images.length}`}
                        aria-current={index === currentImageIndex ? 'true' : 'false'}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {carData.images.length > 1 && (
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {carData.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                        index === currentImageIndex ? theme.border : 'border-transparent'
                      }`}
                      aria-label={`View image ${index + 1}: ${carData.make} ${carData.model}`}
                      aria-current={index === currentImageIndex ? 'true' : 'false'}
                    >
                      <img
                        src={image}
                        alt={`${carData.make} ${carData.model} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className={`p-6 border ${theme.border} ${theme.cardBg} rounded-2xl`}>
            <h2 className={`text-xl font-semibold ${theme.text} mb-4`} id="description-heading">
              Description
            </h2>
            <p className={`${theme.mutedText} leading-relaxed`}>
              {carData.description}
            </p>
          </div>

          {/* Features */}
          <div className={`p-6 border ${theme.border} ${theme.cardBg} rounded-2xl`}>
            <h2 className={`text-xl font-semibold ${theme.text} mb-4`} id="features-heading">
              Features & Options
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {carData.features.map((feature, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-lg ${theme.skillBg} text-sm`}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className={`p-6 border ${theme.border} ${theme.cardBg} rounded-2xl`}>
            <h2 className={`text-xl font-semibold ${theme.text} mb-4`}>
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {carData.specifications.engine && (
                <div>
                  <label className={`block text-sm font-medium ${theme.labelText} mb-1`}>
                    Engine
                  </label>
                  <p className={theme.text}>{carData.specifications.engine}</p>
                </div>
              )}
              {carData.specifications.transmission && (
                <div>
                  <label className={`block text-sm font-medium ${theme.labelText} mb-1`}>
                    Transmission
                  </label>
                  <p className={theme.text}>{carData.specifications.transmission}</p>
                </div>
              )}
              {carData.specifications.fuelType && (
                <div>
                  <label className={`block text-sm font-medium ${theme.labelText} mb-1`}>
                    Fuel Type
                  </label>
                  <p className={theme.text}>{carData.specifications.fuelType}</p>
                </div>
              )}
              {carData.specifications.drivetrain && (
                <div>
                  <label className={`block text-sm font-medium ${theme.labelText} mb-1`}>
                    Drivetrain
                  </label>
                  <p className={theme.text}>{carData.specifications.drivetrain}</p>
                </div>
              )}
              {carData.specifications.exteriorColor && (
                <div>
                  <label className={`block text-sm font-medium ${theme.labelText} mb-1`}>
                    Exterior Color
                  </label>
                  <p className={theme.text}>{carData.specifications.exteriorColor}</p>
                </div>
              )}
              {carData.specifications.interiorColor && (
                <div>
                  <label className={`block text-sm font-medium ${theme.labelText} mb-1`}>
                    Interior Color
                  </label>
                  <p className={theme.text}>{carData.specifications.interiorColor}</p>
                </div>
              )}
              {carData.specifications.mpgCity && carData.specifications.mpgHighway && (
                <div>
                  <label className={`block text-sm font-medium ${theme.labelText} mb-1`}>
                    Fuel Economy
                  </label>
                  <p className={theme.text}>
                    {carData.specifications.mpgCity}/{carData.specifications.mpgHighway} MPG (City/Highway)
                  </p>
                </div>
              )}
              {carData.specifications.vin && (
                <div>
                  <label className={`block text-sm font-medium ${theme.labelText} mb-1`}>
                    VIN
                  </label>
                  <p className={theme.text}>{carData.specifications.vin}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={cn(
            'w-full',
            layout === 'double' ? 'lg:w-1/3' : ''
          )}
        >
          {/* Seller Information */}
          <div className={`p-6 border ${theme.border} ${theme.cardBg} rounded-2xl mb-6`}>
            <h2 className={`text-xl font-semibold ${theme.text} mb-4`}>
              Seller Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.labelText} mb-1`}>
                  {carData.seller.dealerType === 'dealer' ? 'Dealer' : 'Seller'}
                </label>
                <p className={`${theme.text} font-medium`}>
                  {carData.seller.name || 'Contact for details'}
                </p>
              </div>
              {carData.seller.rating && (
                <div>
                  <label className={`block text-sm font-medium ${theme.labelText} mb-1`}>
                    Rating
                  </label>
                  <div className="flex items-center gap-1">
                    <span className={`${theme.text} font-medium`}>{carData.seller.rating}/5</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < carData.seller.rating! ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleContactSeller}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${theme.button} rounded-lg transition-colors font-medium cursor-pointer`}
                >
                  <Phone className="w-4 h-4" />
                  Call Seller
                </button>
                <button
                  onClick={handleContactSeller}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 border ${theme.border} ${theme.secondaryButton} rounded-lg transition-colors font-medium cursor-pointer`}
                >
                  <MessageCircle className="w-4 h-4" />
                  Message Seller
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle History */}
          <div className={`p-6 border ${theme.border} ${theme.cardBg} rounded-2xl`}>
            <h2 className={`text-xl font-semibold ${theme.text} mb-4`}>
              Vehicle History
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={theme.labelText}>Previous Owners</span>
                <span className={theme.text}>{carData.history.owners || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.labelText}>Accidents Reported</span>
                <span className={theme.text}>{carData.history.accidents || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.labelText}>Service Records</span>
                <span className={theme.text}>
                  {carData.history.serviceRecords ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.labelText}>Title Status</span>
                <span className={`${theme.text} capitalize`}>
                  {carData.history.title || 'Clean'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Cars Section */}
      {recommendedCars.length > 0 && (
        <div className={`mt-8 p-6 border ${theme.border} ${theme.cardBg} rounded-2xl`}>
          <h2 className={`text-xl font-semibold ${theme.text} mb-6`}>
            Recommended Cars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCars.map((car) => (
              <div
                key={car.id}
                className={`border ${theme.border} rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}
              >
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors cursor-pointer"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-semibold ${theme.text}`}>
                      {car.year} {car.make} {car.model}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded ${theme.skillBg}`}>
                      {car.history.title || 'clean'}
                    </span>
                  </div>
                  <p className={`text-lg font-bold ${theme.priceText} mb-2`}>
                    ${car.price.toLocaleString()}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className={theme.mutedText}>
                      {car.mileage.toLocaleString()} mi
                    </span>
                    <span className={theme.mutedText}>
                      {car.seller.location}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Viewing details for ${car.year} ${car.make} ${car.model}`);
                        }}
                        className={`flex-1 px-3 py-2 text-sm ${theme.button} rounded-lg transition-colors cursor-pointer`}
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onContactSeller) {
                            onContactSeller();
                          }
                        }}
                        className={`flex-1 px-3 py-2 text-sm border ${theme.border} ${theme.secondaryButton} rounded-lg transition-colors cursor-pointer`}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default CarDetail;