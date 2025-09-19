import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CarDetail from '../components/CarDetail';

// Mock recommended cars data
const mockRecommendedCars = [
  {
    id: '2',
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    price: 54990,
    mileage: 18500,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop',
    ],
    description: 'Excellent condition Tesla Model 3 with premium interior.',
    features: ['Autopilot', 'Premium Interior', 'Supercharging'],
    specifications: {
      engine: 'Single Motor Rear-Wheel Drive',
      transmission: 'Single-Speed Direct Drive',
      fuelType: 'Electric',
      drivetrain: 'Rear-Wheel Drive',
      exteriorColor: 'Midnight Silver Metallic',
      interiorColor: 'Black Premium',
    },
    seller: {
      name: 'Tesla Certified Pre-Owned',
      location: 'San Jose, CA',
      rating: 4.7,
      dealerType: 'dealer' as const,
    },
    history: {
      accidents: 0,
      owners: 1,
      serviceRecords: true,
      title: 'clean' as const,
    },
  },
  {
    id: '3',
    make: 'BMW',
    model: 'i4',
    year: 2023,
    price: 67900,
    mileage: 8200,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    ],
    description: 'Luxury electric BMW i4 with advanced technology.',
    features: ['iDrive 8', 'Premium Package', 'Driving Assistant'],
    specifications: {
      engine: 'Electric Motor',
      transmission: 'Single-Speed Automatic',
      fuelType: 'Electric',
      drivetrain: 'Rear-Wheel Drive',
      exteriorColor: 'Storm Bay Metallic',
      interiorColor: 'Black Sensatec',
    },
    seller: {
      name: 'BMW of Mountain View',
      location: 'Mountain View, CA',
      rating: 4.6,
      dealerType: 'dealer' as const,
    },
    history: {
      accidents: 0,
      owners: 1,
      serviceRecords: true,
      title: 'clean' as const,
    },
  },
  {
    id: '4',
    make: 'Audi',
    model: 'e-tron GT',
    year: 2022,
    price: 94900,
    mileage: 11200,
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    ],
    description: 'Stunning Audi e-tron GT with performance package.',
    features: ['Quattro AWD', 'Virtual Cockpit', 'Bang & Olufsen Audio'],
    specifications: {
      engine: 'Dual Motor Electric',
      transmission: 'Single-Speed Automatic',
      fuelType: 'Electric',
      drivetrain: 'All-Wheel Drive',
      exteriorColor: 'Daytona Gray Pearl',
      interiorColor: 'Black Fine Nappa Leather',
    },
    seller: {
      name: 'Audi Palo Alto',
      location: 'Palo Alto, CA',
      rating: 4.8,
      dealerType: 'dealer' as const,
    },
    history: {
      accidents: 0,
      owners: 1,
      serviceRecords: true,
      title: 'clean' as const,
    },
  },
];

// Mock car data
const mockCarData = {
  id: '1',
  make: 'Tesla',
  model: 'Model S',
  year: 2023,
  price: 89990,
  mileage: 12500,
  images: [
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1563720223420-b0c882d40e43?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
  ],
  description: 'Pristine 2023 Tesla Model S with advanced autopilot features and premium interior. This vehicle has been meticulously maintained and comes with all original documentation. Features include full self-driving capability, premium connectivity, and over-the-air updates. The car has never been in an accident and has a clean title. Perfect for those looking for cutting-edge technology combined with luxury and performance.',
  features: [
    'Autopilot',
    'Full Self-Driving Capability',
    'Premium Interior',
    'Glass Roof',
    '21" Arachnid Wheels',
    'Air Suspension',
    'Premium Audio',
    'Heated Seats',
    'Wireless Phone Charging',
    'Premium Connectivity',
    'Supercharging Included',
    'Mobile Connector',
    'HEPA Air Filtration',
    'Bioweapon Defense Mode',
    'Dog Mode',
    'Sentry Mode',
    'Camp Mode',
    'Over-the-Air Updates',
  ],
  specifications: {
    engine: 'Dual Motor All-Wheel Drive',
    transmission: 'Single-Speed Direct Drive',
    fuelType: 'Electric',
    drivetrain: 'All-Wheel Drive',
    exteriorColor: 'Pearl White Multi-Coat',
    interiorColor: 'Black Premium',
    doors: 4,
    seats: 5,
    mpgCity: 120, // MPGe
    mpgHighway: 115, // MPGe
    vin: '5YJ3E1EA5KF123456',
  },
  seller: {
    name: 'Tesla Certified Pre-Owned',
    phone: '+1 (555) 123-4567',
    email: 'sales@tesla.com',
    location: 'San Francisco, CA',
    rating: 4.8,
    dealerType: 'dealer' as const,
  },
  history: {
    accidents: 0,
    owners: 1,
    serviceRecords: true,
    title: 'clean' as const,
  },
};

const CarDetailPage = () => {
  const navigate = useNavigate();
  const { } = useParams(); // id could be used for dynamic car loading
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleContactSeller = () => {
    setContactModalOpen(true);
    setTimeout(() => {
      setContactModalOpen(false);
      alert(`Contacting ${mockCarData.seller.name} at ${mockCarData.seller.phone}`);
    }, 1000);
  };

  const handleSaveCar = () => {
    alert('Car saved to your favorites!');
  };

  const handleShareCar = () => {
    if (navigator.share) {
      navigator.share({
        title: `${mockCarData.year} ${mockCarData.make} ${mockCarData.model}`,
        text: `Check out this ${mockCarData.year} ${mockCarData.make} ${mockCarData.model} for $${mockCarData.price.toLocaleString()}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        {contactModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-medium">Connecting you with the seller...</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>
        )}

        <CarDetail
          data-id="car-detail"
          carData={mockCarData}
          onContactSeller={handleContactSeller}
          onSaveCar={handleSaveCar}
          onShareCar={handleShareCar}
          colorTheme="default"
          layout="single"
          recommendedCars={mockRecommendedCars}
        />
      </div>
    </div>
  );
};

export default CarDetailPage;