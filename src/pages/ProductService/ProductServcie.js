import React from 'react';
import { 
  FaCheck, 
  FaHandshake, 
  FaUserTie, 
  FaClipboardCheck,
  FaHeadset,
  FaCalendarCheck,
  FaUserCog,
  FaClipboardList,
  FaTruck,
  FaChartLine
} from 'react-icons/fa';
import { GiProgression } from 'react-icons/gi';
import { MdEngineering, MdOutlinePrecisionManufacturing } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import heroBannerImg from '../../image/fabe2.png';
import rmcPouringImg from '../../image/fabe2.png';

const ProductService = () => {
  const navigate = useNavigate(); // Get the navigate function
  const handleContactClick = () => {
    // You could do other things here first, e.g., save data
    console.log("Navigating to contact page...");
    navigate('/contacts'); // Navigate to the desired path
  };
  return (
    <div className="bg-gray-50 mt-16">
      {/* Hero Banner Section */}
      <div
        className="relative bg-cover bg-center py-20 md:py-28"
        style={{ backgroundImage: `url(${heroBannerImg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Products & Services
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Comprehensive concrete solutions with exceptional service
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Premium Ready-Mix Concrete
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Delivered fresh to your construction site in optimal condition for superior results across all applications including residential, commercial, and infrastructure projects.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                "Documented mix designs",
                "Reduced material waste",
                "Faster construction",
                "Eliminated production labor",
                "Enhanced durability",
                "Easy admixture addition"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <FaCheck className="text-[#ff4500] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={rmcPouringImg}
              alt="Concrete pouring"
              className="rounded-xl shadow-lg w-full max-w-md object-cover h-96"
            />
          </div>
        </div>

        {/* Service Section */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Service Excellence
            </h2>
            <div className="w-24 h-1 bg-[#ff4500] mx-auto"></div>
          </div>
          
          {/* Service Philosophy */}
          <div className="bg-white p-8 md:p-12 rounded-xl shadow-md mb-16">
            <div className="flex items-center mb-8">
              <div className="bg-[#ff4500] p-3 rounded-full mr-6">
                <FaHandshake className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Service Philosophy</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  We adhere to integrity and innovation, treating client success as our goal. Our knowledgeable team at Kality provides:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <GiProgression className="text-[#ff4500] mr-3 mt-1 text-xl" />
                    <span className="text-lg text-gray-700">Competitive pricing with premium quality</span>
                  </li>
                  <li className="flex items-start">
                    <FaHeadset className="text-[#ff4500] mr-3 mt-1 text-xl" />
                    <span className="text-lg text-gray-700">Comprehensive pre and post-sales support</span>
                  </li>
                  <li className="flex items-start">
                    <FaChartLine className="text-[#ff4500] mr-3 mt-1 text-xl" />
                    <span className="text-lg text-gray-700">Advanced dispatch software with GPS tracking</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="bg-[#ff4500] p-2 rounded-full mr-4">
                    <MdEngineering className="text-white" />
                  </div>
                  <h4 className="font-semibold text-lg">Strategic Location</h4>
                </div>
                <p className="text-gray-700">
                  Our Kality facility is strategically positioned for efficient nationwide distribution, ensuring timely deliveries across Ethiopia.
                </p>
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Pre-Sales Service */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="bg-[#ff4500] p-3 rounded-full mr-6">
                  <FaUserTie className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Pre-Sales Service</h3>
              </div>
              
              <ul className="space-y-5">
                {[
                  { 
                    icon: <FaClipboardList className="text-[#ff4500] text-xl" />,
                    text: "Company profile and product introduction"
                  },
                  { 
                    icon: <FaClipboardCheck className="text-[#ff4500] text-xl" />,
                    text: "Budget-appropriate equipment guidance"
                  },
                  { 
                    icon: <MdOutlinePrecisionManufacturing className="text-[#ff4500] text-xl" />,
                    text: "Technical support for product selection"
                  }
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-4 mt-1">{item.icon}</span>
                    <span className="text-lg text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After-Sales Service */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="bg-[#ff4500] p-3 rounded-full mr-6">
                  <FaUserCog className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">After-Sales Service</h3>
              </div>
              
              <ul className="space-y-5">
                {[
                  { 
                    icon: <FaCalendarCheck className="text-[#ff4500] text-xl" />,
                    text: "Worry-free reliable service"
                  },
                  { 
                    icon: <FaClipboardCheck className="text-[#ff4500] text-xl" />,
                    text: "Custom production order fulfillment"
                  },
                  { 
                    icon: <FaTruck className="text-[#ff4500] text-xl" />,
                    text: "On-site lab technicians during casting"
                  },
                  { 
                    icon: <FaChartLine className="text-[#ff4500] text-xl" />,
                    text: "Real-time production monitoring"
                  }
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-4 mt-1">{item.icon}</span>
                    <span className="text-lg text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Ready to Start Your Project?
            </h3>
            <button
      onClick={handleContactClick} // Call the handler on click
      className="bg-[#ff4500] hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg text-lg"
    >
      Contact Us
    </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductService;