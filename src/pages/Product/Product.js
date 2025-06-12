// src/components/Product.js
import React from "react";
import { FaCheck, FaCubes, FaTruck, FaChartLine } from "react-icons/fa";
import heroBannerImg2 from "../../image/fabe2.png";

const concreteTypes = [
  "Concrete Grades: C-05 to C-60",
  "Special Concretes: Self-Consolidating Concrete (SCC)",
  "Colored Concrete (for specialized projects)",
  "High-Strength Concrete",
  "Performance Concrete",
];

const advantages = [
  "Documentation of the mix design",
  "Reduction in wastage of material",
  "Faster construction speed",
  "Labor associated with production of concrete is eliminated",
  "Durability of ready mixed concrete",
  "The addition admixture is easier",
];

const Product = () => {
  return (
    <div className="bg-gray-100 mt-20">
      {/* Hero Banner */}
      <div
        className="relative bg-cover bg-center py-16 md:py-32 mt-16 rounded-2xl shadow-xl cursor-pointer transition duration-300 ease-in-out hover:text-orange-600"
        style={{ backgroundImage: `url(${heroBannerImg2})` }}
        aria-label="Our Products Hero Banner"
      >
        <div className="absolute inset-0 bg-black opacity-40 rounded-2xl"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg transition duration-300 ease-in-out hover:text-orange-400 text-center">
            Our Products
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 md:py-24">
        {/* Intro Section */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 transition duration-300 hover:text-orange-600 cursor-pointer text-center transform hover:scale-105">
            Ready-Mix Concrete Solutions
          </h2>
          <div className="text-xl text-gray-600 space-y-4">
            <p>
              Precision-engineered concrete delivered to your construction site
              in optimal condition for superior results.
            </p>
            <p>
              Our range from{" "}
              <span className="font-semibold text-gray-900 transition-transform duration-300 hover:text-orange-600 hover:scale-105 cursor-pointer text-center inline-block">
                C-05 to C-60
              </span>{" "}
              meets the most demanding specifications across all construction
              applications.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 md:mb-24">
          {[
            {
              icon: <FaCubes className="text-orange-500 text-4xl mb-4" />,
              title: "Comprehensive Grades",
              text: "From standard to high-performance mixes for every application",
            },
            {
              icon: <FaTruck className="text-orange-500 text-4xl mb-4" />,
              title: "Timely Delivery",
              text: "Fresh concrete delivered when and where you need it",
            },
            {
              icon: <FaChartLine className="text-orange-500 text-4xl mb-4" />,
              title: "Quality Assurance",
              text: "Consistent quality with documented mix designs",
            },
          ].map((feature, index) => (
            <div
              key={index}
              tabIndex={0}
              aria-label={`Feature: ${feature.title}`}
              className="bg-white p-8 border-l-4 border-orange-500 shadow-lg rounded-2xl
                         transform transition duration-300 ease-in-out cursor-pointer
                         hover:scale-105 hover:shadow-xl hover:bg-orange-600 hover:text-white"
            >
              {React.cloneElement(feature.icon, {
                className:
                  "text-white text-4xl mb-4 transition-colors duration-300",
              })}
              <h3 className="text-2xl font-bold mb-3 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-xl transition-colors duration-300">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        {/* Details Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 space-y-16">
          {/* Concrete Specifications */}
          <div>
            <h3
              className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b border-gray-200
                         transition transform hover:text-orange-600 hover:scale-105 hover:cursor-pointer text-center"
            >
              Concrete Specifications
            </h3>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-5">
              {concreteTypes.map((type, index) => (
                <li key={index} className="flex items-start">
                  <FaCheck
                    className="text-orange-500 mr-4 mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span className="text-lg text-gray-700">{type}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Advantages */}
          <div>
            <h3
              className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b border-gray-200
                         transition transform hover:text-orange-600 hover:scale-105 hover:cursor-pointer text-center"
            >
              Operational Advantages
            </h3>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-5">
              {advantages.map((advantage, index) => (
                <li key={index} className="flex items-start">
                  <FaCheck
                    className="text-orange-500 mr-4 mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span className="text-lg text-gray-700">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
