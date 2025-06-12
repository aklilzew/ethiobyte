import React, { useState } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import heroBgImage from "../../image/fabe2.png"; // Ensure path is correct
import api from "../../api/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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
        name: "",
        email: "",
        phone: "",
        project: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact form submission error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to send message. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 mt-20">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-16 md:py-32 mt-16"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white transition duration-300 hover:text-orange-600 cursor-pointer">
            Contact Us
          </h1>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="container mx-auto px-4 py-20 md:py-24">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-24">
          <p className="text-orange-600 font-semibold uppercase tracking-wider mb-2 text-base md:text-lg transition duration-300 hover:text-orange-700 cursor-pointer">
            Let's Connect
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 transition duration-300 hover:text-orange-600 cursor-pointer">
            Send Your Message
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition duration-300 hover:text-gray-800 cursor-pointer">
            Have a question or want to work together? Fill out the form below,
            and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-20 md:mb-24">
          {/* Contact Form */}
          <form
            className="space-y-8 bg-white p-8 rounded-lg shadow-lg"
            onSubmit={handleSubmit}
          >
            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-5 py-4 border-2 border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent placeholder-gray-500 text-lg disabled:opacity-50 transition duration-300 hover:border-orange-600"
              />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-5 py-4 border-2 border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent placeholder-gray-500 text-lg disabled:opacity-50 transition duration-300 hover:border-orange-600"
              />
            </div>

            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Subject"
              required
              value={formData.subject}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-5 py-4 border-2 border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent placeholder-gray-500 text-lg disabled:opacity-50 transition duration-300 hover:border-orange-600"
            />

            <textarea
              id="message"
              name="message"
              rows="6"
              placeholder="Message"
              required
              value={formData.message}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-5 py-4 border-2 border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent placeholder-gray-500 text-lg resize-none disabled:opacity-50 transition duration-300 hover:border-orange-600"
            />

            {/* Submission Feedback */}
            <div className="h-8">
              {isSuccess && (
                <p className="text-center text-green-600 font-semibold transition duration-300 hover:text-green-700">
                  Message sent successfully! We'll be in touch soon.
                </p>
              )}
              {error && (
                <p className="text-center text-red-600 font-semibold transition duration-300 hover:text-red-700">
                  Error: {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white font-bold py-4 px-8 rounded-md border-2 border-orange-600 hover:bg-orange-700 hover:border-orange-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Google Map */}
          <div className="w-full h-full min-h-[450px] lg:min-h-full rounded-lg overflow-hidden shadow-lg transition duration-300 hover:shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5088.725706148304!2d38.78188232749391!3d8.989186950239603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85006c001ee7%3A0x68c17c7256a6dbe1!2sFABE%20TRADING%20PLC!5e1!3m2!1sen!2set!4v1746040189520!5m2!1sen!2set"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Location"
              className="rounded-md transition duration-300 hover:opacity-90"
            ></iframe>
          </div>
        </div>

        {/* Contact Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {[
            {
              icon: (
                <FaMapMarkerAlt className="text-orange-600 text-5xl mb-5 transition duration-300 group-hover:text-white" />
              ),
              title: "Address",
              info: "Bole New Bright Tower 6th Floor",
            },
            {
              icon: (
                <FaEnvelope className="text-orange-600 text-5xl mb-5 transition duration-300 group-hover:text-white" />
              ),
              title: "Mail Us",
              info: "www.fabetradimixet.com",
            },
            {
              icon: (
                <FaPhoneAlt className="text-orange-600 text-5xl mb-5 transition duration-300 group-hover:text-white" />
              ),
              title: "Telephone",
              info: "09-53-22-00-00-00",
            },
          ].map(({ icon, title, info }, i) => (
            <div
              key={i}
              className="border-2 border-orange-600 rounded-md p-8 text-center flex flex-col items-center transition duration-300 hover:bg-orange-600 hover:text-white group cursor-pointer"
            >
              {icon}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 transition duration-300 group-hover:text-white">
                {title}
              </h3>
              <p className="text-gray-600 text-xl transition duration-300 group-hover:text-white">
                {info}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
