// src/components/Footer/Footer.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInstagram,
  FaFacebookF, FaTwitter, FaLinkedinIn, FaChevronRight
} from 'react-icons/fa';
import { navigateAndScrollWithState } from '../../utils/navigationUtills'; // Import the helper

const Footer = ({ id }) => { // Accepts 'id' for its own scroll target (e.g., from Home page subscribe button)
  const navigate = useNavigate();
  const location = useLocation();

  const handleInPageLinkClick = (sectionIdOnHomePage) => {
    navigateAndScrollWithState('/', sectionIdOnHomePage, navigate, location);
  };

  return (
    <footer id={id} className="bg-blue-900 text-white py-12 px-6 sm:px-10 lg:px-16 relative z-20 w-full">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Newsletter Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-300 text-lg mb-4 leading-relaxed">
            Get the latest on our construction supplies, offers, and industry news straight to your inbox.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex mt-6 bg-white rounded-md overflow-hidden shadow-sm p-1">
            <input type="email" placeholder="Your email" aria-label="Enter your email for newsletter"
              className="flex-grow border-none outline-none text-gray-900 placeholder-gray-500 text-sm px-3 py-2" />
            <button type="submit"
              className="bg-[#ff4500] text-white px-4 py-2.5 hover:bg-orange-600 transition duration-300 font-semibold text-sm rounded-r-md">
              Subscribe
            </button>
          </form>
        </div>

        {/* Explore Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-orange-400 transition duration-300 flex items-center text-lg">
                <span className="text-[#ff4500] mr-2"><FaChevronRight size="0.8em" /></span>Home</Link></li>
            <li><Link to="/about" className="hover:text-orange-400 transition duration-300 flex items-center text-lg">
                <span className="text-[#ff4500] mr-2"><FaChevronRight size="0.8em" /></span>About Us</Link></li>
            <li>
              <button onClick={() => handleInPageLinkClick('projects-section')}
                className="hover:text-orange-400 transition duration-300 flex items-center text-lg text-left w-full">
                <span className="text-[#ff4500] mr-2"><FaChevronRight size="0.8em" /></span>Latest Projects
              </button>
            </li>
            <li>{/* Empty li, consider removing or adding content */}</li>
            <li><Link to="/contacts" className="hover:text-orange-400 transition duration-300 flex items-center text-lg">
                <span className="text-[#ff4500] mr-2"><FaChevronRight size="0.8em" /></span>Contact Us</Link></li>
          </ul>
        </div>

        {/* Our Services Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Our Services</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <button onClick={() => handleInPageLinkClick('gallery-section')}
                className="hover:text-orange-400 transition duration-300 flex items-center text-lg text-left w-full">
                <span className="text-[#ff4500] mr-2"><FaChevronRight size="0.8em" /></span>Gallery
              </button>
            </li>
            {/* Other links like Projects can also be made to scroll if it's the same as Latest Projects target */}
            {/* Or if "Projects" link under "Our Services" should also point to 'projects-section' on Home */}
             <li>
              <button onClick={() => handleInPageLinkClick('projects-section')}
                className="hover:text-orange-400 transition duration-300 flex items-center text-lg text-left w-full">
                <span className="text-[#ff4500] mr-2"><FaChevronRight size="0.8em" /></span>Projects
              </button>
            </li>
            <li><Link to="/jobs" className="hover:text-orange-400 transition duration-300 flex items-center text-lg">
                <span className="text-[#ff4500] mr-2"><FaChevronRight size="0.8em" /></span>Job Post</Link></li>
            <li><Link to="/blog" className="hover:text-orange-400 transition duration-300 flex items-center text-lg">
                <span className="text-[#ff4500] mr-2"><FaChevronRight size="0.8em" /></span>Blog Post</Link></li>
            <li><Link to="/testimonials" className="hover:text-orange-400 transition duration-300 flex items-center text-lg">
                <span className="text-[#ff4500] mr-2"><FaChevronRight size="0.8em" /></span>Testimonial</Link></li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start text-lg">
              <FaMapMarkerAlt className="text-[#ff4500] mr-3 mt-1 flex-shrink-0" size={16} />
              <span>Bole New Bright Tower 6th Floor, Addis Ababa, Ethiopia</span></li>
            <li className="flex items-center text-lg">
              <FaPhoneAlt className="text-[#ff4500] mr-3 flex-shrink-0" size={16} />
              <a href="tel:+251953220000" className="hover:text-orange-400 transition duration-300">+251 953 220 000</a></li>
            <li className="flex items-center text-lg">
              <FaEnvelope className="text-[#ff4500] mr-3 flex-shrink-0" size={16} />
              <a href="mailto:info@fabetradimixet.com" className="hover:text-orange-400 transition duration-300 break-all">info@fabetradimixet.com</a></li>
          </ul>
          <div className="flex space-x-3 mt-6">
            {[
              { Icon: FaInstagram, label: 'Instagram', href: '#' }, { Icon: FaFacebookF, label: 'Facebook', href: '#' },
              { Icon: FaTwitter, label: 'Twitter', href: '#' }, { Icon: FaLinkedinIn, label: 'LinkedIn', href: '#' }
            ].map(({ Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="border-white border-2 hover:border-gray-300 transition duration-300 rounded-md">
                <div className="bg-[#ff4500] text-white w-10 h-10 flex items-center justify-center hover:bg-orange-600 transition duration-300 rounded-[3px]">
                  <Icon size={22} /></div></a>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 pt-10 mt-10 border-t border-gray-700 text-sm">
        <p>© {new Date().getFullYear()} Fabe Trading PLC. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;