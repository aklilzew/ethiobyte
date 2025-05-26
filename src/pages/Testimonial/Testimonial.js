import React from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteRight, FaStar } from 'react-icons/fa';
import img from '../../image/carousel-2.jpg'
import clientImg1 from '../../image/carousel-2.jpg'
import clientImg2 from '../../image/carousel-2.jpg'
const heroBannerImg = 'https://via.placeholder.com/1500x400/cccccc/808080?text=Construction+Background'; // Replace with your banner image


const TestimonialCard = ({ quote, imageSrc, name, profession, rating }) => {
    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar key={i} className={i <= rating ? 'text-orange-400' : 'text-gray-300'} />
            );
        }
        return stars;
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm relative border border-gray-100 "> 
            <p className="text-gray-600 mb-5 italic text-sm leading-relaxed"> 
                {quote}
            </p>
            <hr className="border-red-400 my-4 w-1/4" />
            <div className="flex items-center mt-4">
                <img
                    src={imageSrc}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-white shadow-md" 
                />
                <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{name}</p>
                    <p className="text-sm text-gray-500">{profession}</p>
                    <div className="flex items-center mt-1 text-xs"> 
                        {renderStars()}
                    </div>
                </div>
                <FaQuoteRight className="text-blue-900 text-4xl opacity-20 ml-4 flex-shrink-0" /> 
            </div>
        </div>
    );
};


const Testimonial = () => {

    const testimonialsData = [
        {
            id: 1,
            quote: "Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s.",
            imageSrc: clientImg1,
            name: "Client Name",
            profession: "Profession",
            rating: 3, 
        },
        {
            id: 2,
            quote: "Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s.",
            imageSrc: clientImg2,
            name: "Client Name",
            profession: "Profession",
            rating: 4, 
        },
    ];

    return (
        <div>
            <div
                className="relative bg-cover bg-center py-20 md:py-28 mt-16" 
                style={{ backgroundImage: `url(${img})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>

                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Our Testimonial
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 md:py-24">

                <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <p className="text-orange-600 font-semibold mb-2 text-sm uppercase tracking-wide"> {/* Styling for small heading */}
                            Testimonials
                        </p>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                            Our clients reviews.
                        </h2>
                    </div>

                    <div className="flex-shrink-0 flex">
                        <button
                            aria-label="Previous Testimonial"
                            className="border border-red-500 text-red-500 p-2 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-150 ease-in-out mx-1"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            aria-label="Next Testimonial"
                            className="border border-red-500 text-red-500 p-2 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-150 ease-in-out mx-1"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {testimonialsData.slice(0, 2).map((testimonial) => (
                         <TestimonialCard
                            key={testimonial.id}
                            quote={testimonial.quote}
                            imageSrc={testimonial.imageSrc}
                            name={testimonial.name}
                            profession={testimonial.profession}
                            rating={testimonial.rating}
                        />
                    ))}
                </div>

                <div className="text-center mt-10 md:mt-12">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full mx-1.5 cursor-pointer"></span>
                    <span className="inline-block w-3 h-3 bg-blue-900 rounded-full mx-1.5 cursor-pointer hover:bg-blue-700 transition"></span>
                    <span className="inline-block w-3 h-3 bg-blue-900 rounded-full mx-1.5 cursor-pointer hover:bg-blue-700 transition"></span>
                </div>

            </div>
        </div>
    );
};

export default Testimonial;