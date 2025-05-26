import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import heroBgImage from '../../image/fabe2.png'; // Ensure path is correct
import api from '../../api/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', // Keep phone if needed by API/backend
    project: '', // Keep project if needed by API/backend
    subject: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setIsSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      await api.contact.send(formData);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        project: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      console.error("Contact form submission error:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send message. Please try again later.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* --- Hero Section --- */}
      <div
        className="relative bg-cover bg-center py-24 md:py-32 text-center text-white mt-16"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 container mx-auto px-4">
          {/* Title size kept large */}
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold">Contact Us</h1>
        </div>
      </div>

      {/* --- Contact Form Section --- */}
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">

          {/* --- Section Header --- */}
          <div className="text-center mb-12 md:mb-16">
            {/* Increased text size */}
            <p className="text-[#ff4500] font-semibold uppercase tracking-wider mb-2 text-base md:text-lg">
              Let's Connect
            </p>
            {/* Increased text size */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Send Your Message
            </h2>
            {/* Increased text size and line height */}
            <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              Have a question or want to work together? Fill out the form below, and we'll get back to you as soon as possible.
            </p>
          </div>

          {/* --- Form and Map Grid --- */}
          {/* Increased gap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16 md:mb-24">

            {/* --- Contact Form --- */}
            {/* Increased vertical spacing between form elements */}
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* --- Form Fields --- */}
              {/* Increased gap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="sr-only">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    // Increased text size and padding
                    className="w-full px-5 py-4 border-2 border-[#ff4500] rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent placeholder-gray-500 text-lg disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                     // Increased text size and padding
                    className="w-full px-5 py-4 border-2 border-[#ff4500] rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent placeholder-gray-500 text-lg disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Removed phone and project fields as they weren't displayed, uncomment if needed */}
              {/*
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="sr-only">Your Phone</label>
                  <input type="tel" id="phone" name="phone" placeholder="Your Phone" value={formData.phone} onChange={handleChange} disabled={isLoading} className="w-full px-5 py-4 border-2 border-[#ff4500] rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent placeholder-gray-500 text-lg disabled:opacity-50"/>
                </div>
                <div>
                  <label htmlFor="project" className="sr-only">Project Type</label>
                  <input type="text" id="project" name="project" placeholder="Project Type" value={formData.project} onChange={handleChange} disabled={isLoading} className="w-full px-5 py-4 border-2 border-[#ff4500] rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent placeholder-gray-500 text-lg disabled:opacity-50"/>
                </div>
              </div>
              */}

              <div>
                <label htmlFor="subject" className="sr-only">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isLoading}
                   // Increased text size and padding
                  className="w-full px-5 py-4 border-2 border-red-500 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent placeholder-gray-500 text-lg disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="8" // Increased rows for more space
                  placeholder="Message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isLoading}
                   // Increased text size and padding
                  className="w-full px-5 py-4 border-2 border-red-500 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent placeholder-gray-500 text-lg resize-none disabled:opacity-50"
                ></textarea>
              </div>

              {/* --- Submission Feedback --- */}
               <div className="h-6">
                 {/* Increased text size */}
                 {isSuccess && (
                   <p className="text-base text-center text-green-600 font-semibold">
                     Message sent successfully! We'll be in touch soon.
                   </p>
                 )}
                 {/* Increased text size */}
                 {error && (
                   <p className="text-base text-center text-red-600 font-semibold">
                     Error: {error}
                   </p>
                 )}
               </div>


              {/* --- Submit Button --- */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                   // Increased text size and padding
                  className="w-full bg-blue-900 text-white font-bold py-4 px-8 rounded-sm border-2 border-red-500 hover:bg-blue-800 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>

            {/* --- Google Map --- */}
            {/* Increased min height */}
            <div className="w-full h-full min-h-[450px] lg:min-h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5088.725706148304!2d38.78188232749391!3d8.989186950239603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85006c001ee7%3A0x68c17c7256a6dbe1!2sFABE%20TRADING%20PLC!5e1!3m2!1sen!2set!4v1746040189520!5m2!1sen!2set"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Location"
                className="rounded-sm"
              ></iframe>
            </div>
          </div>

          {/* --- Contact Info Boxes --- */}
          {/* Increased gap and padding */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
             {/* Increased padding and icon size */}
             <div className="border-2 border-[#ff4500] rounded-sm p-8 text-center flex flex-col items-center">
               <FaMapMarkerAlt className="text-[#ff4500] text-5xl mb-5" /> {/* Increased size & margin */}
               <h3 className="text-xl font-semibold text-gray-900 mb-2">Address</h3> {/* Increased size & margin */}
               <p className="text-gray-600 text-xl">Bole New Bright Tower 6th Floor</p> {/* Increased size */}
             </div>
             {/* Increased padding and icon size */}
             <div className="border-2 border-[#ff4500] rounded-sm p-8 text-center flex flex-col items-center">
               <FaEnvelope className="text-[#ff4500] text-5xl mb-5" /> {/* Increased size & margin */}
               <h3 className="text-xl font-semibold text-gray-900 mb-2">Mail Us</h3> {/* Increased size & margin */}
               <p className="text-gray-600 text-xl">www.fabetradimixet.com</p> {/* Increased size */}
             </div>
             {/* Increased padding and icon size */}
             <div className="border-2 border-[#ff4500] rounded-sm p-8 text-center flex flex-col items-center">
               <FaPhoneAlt className="text-[#ff4500] text-5xl mb-5" /> {/* Increased size & margin */}
               <h3 className="text-xl font-semibold text-gray-900 mb-2">Telephone</h3> {/* Increased size & margin */}
               <p className="text-gray-600 text-xl">09-53-22-00-00-00 </p> {/* Increased size */}
             </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;