// src/components/Product.js
import React from 'react';
import { FaCheck, FaCubes, FaTruck, FaChartLine } from 'react-icons/fa';
// Ensure this path is correct relative to the location of Product.js
import heroBannerImg2 from '../../image/fabe2.png';

// --- Data (remains the same) ---
const concreteTypes = [
  'Concrete Grades: C-05 to C-60',
  'Special Concretes: Self-Consolidating Concrete (SCC)',
  'Colored Concrete (for specialized projects)',
  'High-Strength Concrete',
  'Performance Concrete',
];

const advantages = [
  'Documentation of the mix design',
  'Reduction in wastage of material',
  'Faster construction speed',
  'Labor associated with production of concrete is eliminated',
  'Durability of ready mixed concrete',
  'The addition admixture is easier',
];
// --- End Data ---

const Product = () => {
  return (
    <div className="bg-gray-100 mt-20">
      {/* Hero Banner */}
      {/* Hero Banner Section */}
<div
  className="relative bg-cover bg-center py-16 md:py-32 mt-16"  // Reduced from py-24 md:py-32
  style={{ backgroundImage: `url(${heroBannerImg2})` }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black opacity-30"></div>
  <div className="relative container mx-auto px-4 text-center">
    <h1 className="text-4xl md:text-5xl font-bold text-white ">  {/* Reduced text size */}
      Our Products
    </h1>
  </div>
</div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 md:py-24"> {/* Increased padding */}

        {/* Intro Section */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-24"> {/* Increased margin */}
          {/* Increased Intro Heading Size */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Ready-Mix Concrete Solutions</h2>
          {/* Increased Intro Paragraph Size */}
          <div className="text-xl text-gray-600 space-y-4"> {/* Changed from text-lg */}
            <p>Precision-engineered concrete delivered to your construction site in optimal condition for superior results.</p>
            <p>Our range from <span className="font-semibold text-gray-900">C-05 to C-60</span> meets the most demanding specifications across all construction applications.</p>
          </div>
        </div>

        {/* Product Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 md:mb-24"> {/* Increased margin */}
          {/* Feature Card 1 */}
          <div className="bg-white p-8 border-l-4 border-orange-500 shadow-lg rounded-md"> {/* Added rounded-md and increased shadow */}
            <FaCubes className="text-orange-500 text-4xl mb-4" /> {/* Increased icon size */}
            {/* Increased Feature Heading Size */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Comprehensive Grades</h3>
             {/* Increased Feature Paragraph Size */}
            <p className="text-xl text-gray-600">From standard to high-performance mixes for every application</p> {/* Changed from base */}
          </div>
          {/* Feature Card 2 */}
          <div className="bg-white p-8 border-l-4 border-orange-500 shadow-lg rounded-md"> {/* Added rounded-md and increased shadow */}
            <FaTruck className="text-orange-500 text-4xl mb-4" /> {/* Increased icon size */}
             {/* Increased Feature Heading Size */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Timely Delivery</h3>
             {/* Increased Feature Paragraph Size */}
            <p className="text-xl text-gray-600">Fresh concrete delivered when and where you need it</p> {/* Changed from base */}
          </div>
          {/* Feature Card 3 */}
          <div className="bg-white p-8 border-l-4 border-orange-500 shadow-lg rounded-md"> {/* Added rounded-md and increased shadow */}
            <FaChartLine className="text-orange-500 text-4xl mb-4" /> {/* Increased icon size */}
             {/* Increased Feature Heading Size */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Quality Assurance</h3>
             {/* Increased Feature Paragraph Size */}
            <p className="text-xl text-gray-600">Consistent quality with documented mix designs</p> {/* Changed from base */}
          </div>
        </div>

        {/* Detailed Sections in White Card */}
        <div className="bg-white shadow-xl rounded-lg p-8 md:p-12"> {/* Grouped sections in one card, increased shadow/rounding */}

          {/* Concrete Specifications Section */}
          <div className="mb-12 md:mb-16"> {/* Added margin bottom */}
            {/* Increased Detailed Heading Size */}
            <h3 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">Concrete Specifications</h3>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4"> {/* Adjusted gap */}
              {concreteTypes.map((type, index) => (
                <li key={index} className="flex items-start">
                  <FaCheck className="text-orange-500 mr-4 mt-1 flex-shrink-0" size={18} /> {/* Slightly larger icon, ensure shrink */}
                  {/* Increased List Item Text Size */}
                  <span className="text-xl text-gray-700">{type}</span> {/* Changed from base */}
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Advantages Section */}
          <div>
            {/* Increased Detailed Heading Size */}
            {/* Adjusted border color to match the other one */}
            <h3 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">Operational Advantages</h3>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4"> {/* Adjusted gap */}
              {advantages.map((advantage, index) => (
                <li key={index} className="flex items-start">
                   <FaCheck className="text-orange-500 mr-4 mt-1 flex-shrink-0" size={18} /> {/* Slightly larger icon, ensure shrink */}
                  {/* Increased List Item Text Size */}
                  <span className="text-xl text-gray-700">{advantage}</span> {/* Changed from base, changed color to gray-700 for consistency */}
                </li>
              ))}
            </ul>
          </div>
        </div> {/* End White Card for Detailed Sections */}

      </div> {/* End Main Content Container */}
    </div> // End Component Wrapper Div
  );
};

export default Product;