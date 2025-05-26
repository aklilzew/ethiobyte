import React from 'react';
import project1 from '../../image/project1.jpg';
import project2 from '../../image/project2.jpg';
import project3 from '../../image/project3.jpg';
import project4 from '../../image/project4.jpg';
import project5 from '../../image/project5.jpg';
import project6 from '../../image/project6.jpg';


const ongoingProjects = [
  {
    id: 'ong-1',
    imageUrl: project1, // Replace with actual, good quality images
    category: 'Architecture',
    title: 'Smart Building Automation',
    description: 'An AI-integrated building automation system designed for real-time monitoring and energy efficiency.',
    link: '#',
  },
  {
    id: 'ong-2',
    imageUrl: project2, // Replace
    category: 'Sustainable Construction',
    title: 'Eco-Friendly Housing Initiative',
    description: 'Developing sustainable homes utilizing low-cost, durable materials and green building practices.',
    link: '#',
  },
  {
    id: 'ong-3',
    imageUrl: project3, // Replace
    category: 'Commercial Interior Design',
    title: 'Modern Office Workspace Design',
    description: 'Revitalizing corporate workspaces to significantly enhance employee productivity and overall aesthetics.',
    link: '#',
  },
  {
    id: 'ong-4',
    imageUrl: project4, // Replace
    category: 'Heritage Renovation',
    title: 'Historic Building Revitalization',
    description: 'A delicate blend of preserving tradition and integrating modern innovation in building restoration.',
    link: '#',
  },
  {
    id: 'ong-5',
    imageUrl: project5, // Replace
    category: 'Civil Engineering Works',
    title: 'Urban Bridge Construction',
    description: 'Key infrastructure development project aimed at creating safer and more efficient transportation networks.',
    link: '#',
  },
  {
    id: 'ong-6',
    imageUrl: project6, // Replace
    category: 'Urban Landscape Design',
    title: 'Community Green Park Development',
    description: 'Transforming public spaces by integrating natural elements with modern recreation facilities for community use.',
    link: '#',
  },
];

const Projects = () => {
  return (
    <section className="mt-16 py-20 md:py-28 bg-slate-50"> {/* Added section tag, padding, and base bg */}
      <div className="container mx-auto px-6"> {/* Consistent container */}
        <div className="text-center mb-16 md:mb-20"> {/* Increased margin */}
          <p className="text-orange-600 font-semibold uppercase tracking-wider mb-3 text-lg md:text-xl"> {/* Increased size & margin */}
            Ongoing Projects
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"> {/* Increased size */}
            Currently Featured Projects
          </h2>
          <div className="w-24 h-1.5 bg-orange-600 mx-auto mt-6 rounded-full"></div> {/* Added accent underline */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12"> {/* Increased gap */}
          {ongoingProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 flex flex-col"
            >
              <div className="relative w-full h-64 md:h-72 overflow-hidden"> {/* Increased height */}
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" // Added hover zoom effect
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {project.category}
                </span>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow"> {/* Increased padding, added flex for footer */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors duration-300"> {/* Increased size, hover color */}
                  {project.title}
                </h3>
                <p className="text-gray-700 text-md md:text-lg leading-relaxed mb-6 text-justify flex-grow"> {/* Increased size, added justify */}
                  {project.description}
                </p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;