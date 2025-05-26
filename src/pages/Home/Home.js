// src/components/Home/Home.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom'; // Import useLocation

// Image imports (ensure these paths are correct)
import bg1 from '../../image/fabe.png';
import bg2 from '../../image/fabe2.png';
import bg3 from '../../image/fabe3.png';
// Testimonial images are no longer needed
// import testimonial1 from '../../image/testimonial-1.jpg';
// import testimonial2 from '../../image/testimonial-2.jpg';
// import testimonial3 from '../../image/testimonial-3.jpg';
// import testimonial4 from '../../image/testimonial-4.jpg';

// Component imports (ensure these paths are correct)
import Slider from 'react-slick';
import { FaQuoteLeft, FaUserCircle } from 'react-icons/fa'; // Added FaUserCircle
import Projects from '../Project.js/Project';
import Gallery from '../Gallery/Gallery';

const testimonialsData = [
  { id: 1, quote: "The concrete quality from Fabe Trading has been exceptional...", name: "Elias Tsegaye", role: "Chief Engineer", rating: 5 },
  { id: 2, quote: "Their delivery reliability helped us complete our project...", name: "Marta Assefa", role: "Project Manager", rating: 4 },
  { id: 3, quote: "We've partnered with Fabe Trading for three major projects...", name: "Daniel Kebede", role: "Director", rating: 5 },
  { id: 4, quote: "Their innovative mix designs solved our unique architectural challenges...", name: "Sara Mohammed", role: "Architect", rating: 5 }
];

const TestimonialSlider = () => {
  const settings = {
    dots: true, infinite: true, speed: 500, autoplay: true, autoplaySpeed: 3000,
    slidesToShow: 2, slidesToScroll: 1,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
  };
  return (
    // Added id="testimonials-section" for potential scrolling target
    <section id="testimonials-section" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold uppercase tracking-wider text-2xl">Testimonials</span>
          <h2 className="text-4xl font-bold text-gray-800 mt-2">What Our Clients Say</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-2xl">Discover how our services have helped clients complete their projects on time and with outstanding quality.</p>
        </div>
        <Slider {...settings}>
          {testimonialsData.map(({ id, quote, name, role, rating }) => ( // Removed 'image' from destructuring
            <div key={id} className="px-4">
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 h-full flex flex-col justify-between">
                <div>
                  <FaQuoteLeft className="text-blue-500 text-4xl mb-2" />
                  <p className="text-gray-600 italic mb-4 text-xl">"{quote}"</p>
                </div>
                <div className="flex items-center mt-6">
                  {/* Replaced img tag with FaUserCircle icon */}
                  <FaUserCircle className="w-14 h-14 text-blue-500" /> 
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-gray-800">{name}</h4>
                    <p className="text-lg text-gray-500">{role}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
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

const backgrounds = [bg1, bg2, bg3];
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.5 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };
const buttonEnterVariant = { hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } } };
const textShadowStyle = { textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' };

const Home = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced useEffect for scrolling to element based on location.state
  useEffect(() => {
    if (location.state?.scrollToId) {
      const elementIdToScroll = location.state.scrollToId;
      let attempts = 0;
      const maxAttempts = 5; // Try up to 5 times
      const intervalDelay = 100; // Wait 100ms between attempts

      const tryScroll = () => {
        const element = document.getElementById(elementIdToScroll);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Clear the scrollToId from location.state to prevent re-scrolling
          // This replaces the current history entry state with one lacking scrollToId
          const { scrollToId, ...restState } = location.state;
          window.history.replaceState(Object.keys(restState).length > 0 ? restState : null, '');
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(tryScroll, intervalDelay);
          } else {
            console.warn(`[Home Page] Element with ID "${elementIdToScroll}" not found after ${maxAttempts} attempts.`);
             // Optionally clear state even if not found to prevent repeated attempts on revisit
            const { scrollToId, ...restState } = location.state;
            window.history.replaceState(Object.keys(restState).length > 0 ? restState : null, '');
          }
        }
      };
      
      // Initial delay to allow page elements to render, then start trying to scroll
      const initialDelay = 150; // Original delay
      setTimeout(tryScroll, initialDelay);
    }
  }, [location.state]); // Re-run effect when location.state changes

  // Handler for buttons directly on the Home page that scroll
  const handleScrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`[Home Page] Element with ID "${elementId}" not found (direct click).`);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home-hero" className="relative z-0 min-h-screen overflow-hidden flex items-center justify-center text-white">
        <motion.div className="absolute inset-0 bg-gray-100 z-20" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.8, delay: 0.5 }} />
        {backgrounds.map((bg, index) => (
          <motion.div key={index} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: currentBg === index ? 1 : 0, scale: currentBg === index ? 1.1 : 1 }}
            transition={{ opacity: { duration: 1.5, ease: 'easeOut' }, scale: { duration: 8.0, ease: 'easeOut' } }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
        <motion.div className="relative z-30 container mx-auto px-4 text-center flex flex-col items-center max-w-4xl" variants={containerVariants} initial="hidden" animate="visible">
          <motion.span className="text-sm md:text-base font-semibold text-[#ff4500] uppercase tracking-widest mb-3" style={textShadowStyle} variants={itemVariants}>
            Construction Business
          </motion.span>
          <motion.h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-5" style={textShadowStyle} variants={itemVariants}>
            We Build Ready Mix <br /> Concrete
          </motion.h1>
          <motion.p className="text-base md:text-lg lg:text-xl max-w-3xl mb-10 text-gray-100" style={textShadowStyle} variants={itemVariants}>
            Fabe Trading PLC manufactures top-quality ready mix concrete for construction projects, real estate developers, and various clients throughout Addis Ababa and its surrounding areas.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6" variants={itemVariants}>
            <motion.button onClick={() => handleScrollToElement('page-footer')} // Assuming 'page-footer' ID exists in your Footer component
              className="bg-[#06367C] hover:bg-[#ff4500] text-white font-bold text-xl px-8 py-4 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#ff7e5f] focus:ring-opacity-50"
              variants={buttonEnterVariant} whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 400, damping: 15 } }}>
              Subscribe
            </motion.button>
            <Link to="/userdashboard/rfqs">
              {/* Removed onClick for scrolling as Link handles navigation to a different page */}
              <motion.button
                className="bg-[#FF4502] hover:bg-[#06367C] text-white font-bold text-xl px-8 py-4 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
                variants={buttonEnterVariant} whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 400, damping: 15 } }}>
                Get Quote
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Projects Section - ID is projects-section */}
      <section id="projects-section" className="py-16 md:py-20">
        <Projects />
      </section>

      {/* Testimonial Section */}
      <TestimonialSlider /> {/* Now has id="testimonials-section" */}

      {/* Gallery Section - ID is gallery-section */}
      <section id="gallery-section" className="py-16 md:py-20">
        <Gallery />
      </section>
    </>
  );
};

export default Home;