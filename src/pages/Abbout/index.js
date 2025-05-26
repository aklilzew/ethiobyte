import React from 'react';
// Ensure this path is correct for your project structure
import aboutImage from '../../image/fabe.png'; // Updated path as per your code

const About = () => {
  return (
    <section className="py-24 bg-slate-50 sm:py-28 lg:py-32"> {/* Increased padding further */}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          {/* Note: text-7xl is large. Beyond this, you might need custom font sizes in tailwind.config.js */}
          <h2 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl lg:text-[5rem] leading-tight"> {/* Increased to text-6xl, lg:text-[5rem] (80px) */}
            About <span className="text-indigo-600">Fabe Trading PLC</span>
          </h2>
          <p className="max-w-5xl mx-auto mt-10 text-3xl text-gray-600 sm:mt-12"> {/* Increased to text-3xl, margin, max-width */}
            Your trusted partner in high-quality ready-mix concrete solutions.
          </p>
        </div>

        {/* Main content: Image and Intro */}
        <div className="mt-24 lg:mt-28 grid grid-cols-1 lg:grid-cols-5 lg:gap-x-20 xl:gap-x-24 items-center"> {/* Increased margin & gap further */}
          {/* Image Column - takes up 2/5ths on large screens */}
          <div className="lg:col-span-2 relative aspect-video sm:aspect-[4/3] lg:aspect-square overflow-hidden rounded-3xl shadow-2xl group order-1">
            <img
              className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
              src={aboutImage}
              alt="Fabe Trading PLC concrete production facility or team"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>

          {/* Text Column - Intro - takes up 3/5ths on large screens */}
          <div className="lg:col-span-3 mt-14 lg:mt-0 order-2"> {/* Increased margin */}
            <div className="text-gray-700 space-y-10 text-2xl leading-relaxed selection:bg-indigo-100 selection:text-indigo-800"> {/* Increased to text-2xl & space-y */}
              <p className="text-justify">
                Fabe Trading PLC is established to engage in the manufacturing of
                ready-mix concrete, supplying construction projects, real estate
                developers, and other customers situated in Addis Ababa and
                surrounding areas.
              </p>
              <p className="text-justify">
                We manufacture a diverse range of concrete classes,
                from <strong className="font-semibold text-indigo-700">C-05 to C-60</strong>, as well as special concretes like <strong className="font-semibold text-indigo-700">Self-Compacting
                Concrete (SCC)</strong>, using defined concrete grades with quality <strong className="font-semibold text-indigo-700">OPC Dangote
                cement</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Company History & Operations Capacity - Styled as distinct cards */}
        <div className="mt-28 lg:mt-32 grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-x-20 lg:gap-x-24"> {/* Increased margin & gap further */}
          {/* Company History Card */}
          <div className="bg-white p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300"> {/* Increased padding & rounding */}
            <h3 className="text-4xl font-bold text-gray-800 mb-8 pb-5 border-b-2 border-indigo-500"> {/* Increased to text-4xl, margin & padding */}
              Our Journey
            </h3>
            <div className="text-gray-600 space-y-6 leading-relaxed selection:bg-indigo-100 selection:text-indigo-800 text-xl"> {/* Increased to text-xl & space-y */}
              <p className="text-justify">
                Fabe Trading PLC is a Private Limited Company established in Ethiopia
                by two shareholders, Mr. Bruck Girma and Mrs. Feven Asmamaw, in the
                year <strong className="font-semibold text-gray-800">2020 GC</strong>.
              </p>
              <p className="text-justify">
                We are proud to be a <strong className="font-semibold text-indigo-700">pioneer in the Ready-Mixed
                Concrete business</strong> in Addis Ababa, taking the initiative to support the
                construction industry across the country.
              </p>
            </div>
          </div>

          {/* Operations & Capacity Card */}
          <div className="bg-white p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300"> {/* Increased padding & rounding */}
            <h3 className="text-4xl font-bold text-gray-800 mb-8 pb-5 border-b-2 border-indigo-500"> {/* Increased to text-4xl, margin & padding */}
              Our Capabilities
            </h3>
            <div className="text-gray-600 space-y-6 leading-relaxed selection:bg-indigo-100 selection:text-indigo-800 text-xl"> {/* Increased to text-xl & space-y */}
              <p className="text-justify">
                The company successfully supplies concrete to a majority of government
                and private sector projects. We operate in various areas of Addis
                Ababa, equipped with a <strong className="font-semibold text-gray-800">large fleet of latest model trucks,
                truck-mounted pumps, and stationary pumps</strong>.
              </p>
              <p className="text-justify">
                Our capacity allows us to
                supply in excess of <strong className="font-semibold text-indigo-700">15,000m³ of concrete per month</strong>, ensuring we can
                meet all customer requirements adequately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;