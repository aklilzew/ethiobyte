// --- Start of Testimonial Section Code ---
import Slider from 'react-slick';
import { 
  FaQuoteLeft, 
  FaUser, 
  FaHardHat, 
  FaClipboardList, 
  FaUserTie, 
  FaDraftingCompass 
} from 'react-icons/fa';

const testimonials = [
  { 
    id: 1, 
    quote: "The concrete quality from Fabe Trading has been exceptional in all our construction projects.", 
    name: "Elias Tsegaye", 
    role: "Chief Engineer", 
    rating: 5,
    icon: <FaHardHat className="text-blue-600 text-xl" />
  },
  { 
    id: 2, 
    quote: "Their delivery reliability helped us complete our project two weeks ahead of schedule.", 
    name: "Marta Assefa", 
    role: "Project Manager", 
    rating: 4,
    icon: <FaClipboardList className="text-blue-600 text-xl" />
  },
  { 
    id: 3, 
    quote: "We've partnered with Fabe Trading for three major projects and their consistency is unmatched.", 
    name: "Daniel Kebede", 
    role: "Director", 
    rating: 5,
    icon: <FaUserTie className="text-blue-600 text-xl" />
  },
  { 
    id: 4, 
    quote: "Their innovative mix designs solved our unique architectural challenges perfectly.", 
    name: "Sara Mohammed", 
    role: "Architect", 
    rating: 5,
    icon: <FaDraftingCompass className="text-blue-600 text-xl" />
  }
];

const TestimonialSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">Client Feedback</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">What Our Partners Say</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>

        <Slider {...settings}>
          {testimonials.map(({ id, quote, name, role, rating, icon }) => (
            <div key={id} className="px-4">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500 h-full flex flex-col">
                <div className="mb-6">
                  <FaQuoteLeft className="text-blue-100 text-4xl mb-4" />
                  <p className="text-gray-700 text-lg leading-relaxed">"{quote}"</p>
                </div>
                <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center shadow-inner">
                    {icon}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">{name}</h4>
                    <p className="text-sm text-blue-600 font-medium">{role}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < rating ? 'text-yellow-500' : 'text-gray-200'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialSlider;