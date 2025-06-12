import heroBgImage from "../../image/fabe2.png";
import historyImage from "../../image/fabe.png";
import teamMember1 from "../../image/team-1.jpg";
import teamMember2 from "../../image/team-2.jpg";
import teamMember3 from "../../image/team-3.jpg";
import teamMember4 from "../../image/team-4.jpg";

const teamMembers = [
  {
    id: 1,
    imageUrl: teamMember1,
    name: "Bruck Girma",
    role: "Co-Founder & CEO",
  },
  {
    id: 2,
    imageUrl: teamMember2,
    name: "Feven Asmamaw",
    role: "Co-Founder & COO",
  },
  {
    id: 3,
    imageUrl: teamMember3,
    name: "Masud Maria",
    role: "Operations Manager",
  },
  {
    id: 4,
    imageUrl: teamMember4,
    name: "John Doe",
    role: "Quality Control",
  },
];

const coreValuesData = [
  {
    title: "Quality",
    description:
      "We earn our customers' trust by consistently delivering top-quality products that meet or exceed expectations.",
  },
  {
    title: "Customer Service",
    description:
      "We exceed expectations by delivering outstanding service and keeping our commitments.",
  },
  {
    title: "Continuous Improvement",
    description:
      "We are committed to ongoing enhancement to maximize stakeholder satisfaction.",
  },
  {
    title: "Team Work",
    description:
      "We highly value our people and recognize the power of collaborative success.",
  },
  {
    title: "Self-Discipline",
    description:
      "We encourage everyone to take responsibility and act ethically, even when no one is watching.",
  },
  {
    title: "Sales Focus",
    description:
      "We put sales at the core of our strategy to ensure growth and sustainability.",
  },
];

const differentiatorsData = [
  "Brand-new, high-performance machinery in excellent technical condition",
  "Reliable, timely delivery and exceptional product quality",
  "Competitive pricing with flexible payment options",
  "Skilled, professional, and cooperative team",
  "Long-term client relationship focus",
  "Rapid response to customer needs with high adaptability",
  "Strong financial foundation and dependable operations",
  "Empowered employees with a strong sense of ownership",
  "Commitment to building a skilled, capable workforce",
];

const About = () => {
  return (
    <div className="pb-16 bg-slate-50 text-gray-800">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-no-repeat bg-center py-28 md:py-24 text-center text-white mt-16"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About Us</h1>
          <p className="text-2xl max-w-3xl mx-auto">
            Leading manufacturer and supplier of ready-mix concrete in Ethiopia
          </p>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center transition duration-300 hover:text-orange-600">
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed text-xl mb-8 text-justify">
              Fabe Trading PLC is established to engage in manufacturing of
              ready mix concrete to supply to construction projects, real estate
              developers and other customers situated in Addis Ababa and
              surrounding areas. We manufacture different class of concrete From
              C-05 to C-60 and special concretes like SCC by their defined
              concrete grades with OPC dangote cement.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 transition duration-300 hover:text-orange-600">
                Company History
              </h2>
              <p className="text-gray-700 leading-relaxed text-xl mb-6 text-justify">
                Fabe Trading PLC is a Private Limited company established in
                Ethiopia by two shareholders named Mr. Bruck Girma and Mrs.
                Feven Asmamaw in the year 2020 GC. We are proud to be the
                pioneer in Ready Mixed Concrete business in Addis Ababa, by
                taking an initiative in supporting the construction industry
                across the country.
              </p>
              <p className="text-gray-700 leading-relaxed text-xl text-justify">
                The company is successfully supplying to most of the government
                and private sector projects. We are operating in different areas
                of Addis Ababa with a large fleet of latest models, truck
                mounted pumps, and stationary pumps. We have capacity to supply
                in excess 15,000m³ of concrete per month, ensuring adequate
                supply for all customer requirements.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src={historyImage}
                alt="Company History - Concrete Plant"
                className="rounded-lg shadow-md max-w-full h-auto lg:max-w-md object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="bg-orange-500/10 p-8 rounded-lg cursor-pointer transition duration-300 hover:bg-orange-600 hover:text-white">
              <h3 className="text-3xl font-bold text-orange-600 mb-4 transition duration-300 hover:text-white">
                Our Vision
              </h3>
              <p className="text-gray-700 text-xl leading-relaxed text-justify transition-colors duration-300 hover:text-white">
                To be the leading producer and supplier of ready-Mix Concrete in
                the country by 2030 G.C.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-blue-50 p-8 rounded-lg cursor-pointer transition duration-300 hover:bg-blue-800 hover:text-white">
              <h3 className="text-3xl font-bold text-blue-800 mb-4 transition duration-300 hover:text-white">
                Our Mission
              </h3>
              <p className="text-gray-700 text-xl leading-relaxed text-justify transition-colors duration-300 hover:text-white">
                To be the leading supplier of concrete by delivering to our
                customers the highest quality products at competitive prices
                with professional service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 transition duration-300 hover:text-orange-600 cursor-pointer">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {coreValuesData.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer transition duration-300 hover:bg-orange-600 hover:text-white"
              >
                <h3 className="text-2xl font-semibold text-orange-600 mb-3 transition duration-300 hover:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed text-justify transition-colors duration-300 hover:text-white">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 transition duration-300 hover:text-orange-600 cursor-pointer">
              What Makes Us Different
            </h2>
            <p className="text-gray-700 text-xl leading-relaxed text-justify">
              We stand apart by delivering not just concrete—but trust,
              reliability, and long-term value to every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {differentiatorsData.map((item, index) => (
              <div
                key={index}
                className="flex items-start bg-gray-50 p-4 rounded-lg hover:shadow-xl transition duration-300 hover:bg-orange-600 hover:text-white group cursor-pointer"
              >
                <div className="bg-orange-600 rounded-full p-1.5 mr-4 mt-1 transition-colors duration-300 group-hover:bg-white">
                  <svg
                    className="w-5 h-5 text-white group-hover:text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed text-left group-hover:text-white transition-colors duration-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 transition duration-300 hover:text-orange-600 cursor-pointer">
              Our Leadership Team
            </h2>
            <p className="text-gray-600 mt-2 text-lg text-justify">
              Meet the people behind our success
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center group cursor-pointer">
                <div className="mb-4 overflow-hidden rounded-md shadow-sm">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-64 md:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="bg-orange-500/10 py-3 px-2 rounded-sm">
                  <h3 className="font-semibold text-xl text-gray-900 mb-1 group-hover:text-orange-600 transition duration-300">
                    {member.name}
                  </h3>
                  <p className="text-base text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
