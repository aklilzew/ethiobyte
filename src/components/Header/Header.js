import { useState, useRef, useEffect } from 'react'; 
import { Link, useLocation } from 'react-router-dom';
import img from '../../image/logo.png';
import { FaSearch, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    const desktopDropdownRef = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target)) {
                setIsDesktopDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [desktopDropdownRef]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isMobileMenuOpen) {
            setIsMobileDropdownOpen(false);
        }
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsMobileDropdownOpen(false);
    };

    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        if (isHomePage) {
            window.addEventListener('scroll', onScroll);
            if (window.scrollY <= 50) {
                setScrolled(false);
            }
        } else {
            setScrolled(true);
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (!isHomePage || location.pathname !== "/") {
                setScrolled(true);
            }
        }
    }, [isHomePage, location.pathname]);

    const navLinkColorClass = isHomePage && !scrolled && !isMobileMenuOpen ? 'text-white' : 'text-black';

    return (
        <header className={`fixed top-0 left-0 w-full transition-all duration-300 z-30 ${
            isMobileMenuOpen 
                ? 'bg-white shadow-md' 
                : isHomePage 
                    ? (scrolled ? 'bg-white shadow-md' : 'bg-transparent') 
                    : 'bg-white shadow-md'
        }`}>
            <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
                {/* Logo and Brand Name */}
                <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
                    <img src={img} alt="Fabe Trading PLC Logo" className="h-10 w-auto sm:h-12" />
                    <span className="text-lg sm:text-2xl font-semibold text-[#ff4500] whitespace-nowrap">
                        Fabe Trading PLC
                    </span>
                </Link>

                {/* Desktop Navigation - hidden below 1155px */}
                <nav className="hidden lg-custom:flex items-center space-x-5 lg:space-x-6 mx-4">
                    <Link to="/" className={`${navLinkColorClass} hover:text-[#ff4500] font-medium text-base lg:text-xl transition-colors duration-300`}>Home</Link>
                    <Link to="/about" className={`${navLinkColorClass} hover:text-[#ff4500] font-medium text-base lg:text-xl transition-colors duration-300`}>About</Link>
                    <Link to="/service" className={`${navLinkColorClass} hover:text-[#ff4500] font-medium text-base lg:text-xl transition-colors duration-300`}>Service</Link>
                    <Link to="/product" className={`${navLinkColorClass} hover:text-[#ff4500] font-medium text-base lg:text-xl transition-colors duration-300`}>Product</Link>
                    <Link to="/contacts" className={`${navLinkColorClass} hover:text-[#ff4500] font-medium text-base lg:text-xl transition-colors duration-300`}>Contacts</Link>
                    <Link to="/jobs" className={`${navLinkColorClass} hover:text-[#ff4500] font-medium text-base lg:text-xl transition-colors duration-300`}>Job</Link>
                    <Link to="/blog" className={`${navLinkColorClass} hover:text-[#ff4500] font-medium text-base lg:text-xl transition-colors duration-300`}>Blog</Link>
                </nav>

                {/* Desktop Search, Quote, Login, Register - hidden below 1155px */}
                <div className="hidden lg-custom:flex items-center space-x-3 lg:space-x-4 ml-auto flex-shrink-0">
                    {!isLoggedIn && (
                        <>
                            <Link
                                to="/login"
                                className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold px-6 py-4 text-lg lg:text-xl transition duration-150 ease-in-out"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-green-700 text-white font-medium px-6 py-4 text-lg lg:text-xl transition duration-150 ease-in-out"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button - shown below 1155px */}
                <div className="lg-custom:hidden ml-auto">
                    <button
                        onClick={toggleMobileMenu}
                        className={`p-2 rounded focus:outline-none w-10 h-10 flex items-center justify-center transition-colors duration-300 ${
                            isHomePage && !scrolled && !isMobileMenuOpen ? 'text-white bg-black/30 hover:bg-black/50' : 'text-white bg-[#003366] hover:bg-[#002244]'
                        }`}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <FaTimes className="w-5 h-5" />
                        ) : (
                            <FaBars className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Content - shown below 1155px */}
            <div className={`lg-custom:hidden w-full bg-white px-4 overflow-hidden transition-all duration-500 ease-in-out ${
                isMobileMenuOpen ? 'max-h-[80vh] pb-5 pt-2 shadow-md' : 'max-h-0 opacity-0'
            }`}>
                <nav className="flex flex-col space-y-1 mb-4">
                    <Link to="/" onClick={closeMobileMenu} className="text-black hover:text-[#ff4500] font-medium text-xl py-2">Home</Link>
                    <Link to="/about" onClick={closeMobileMenu} className="text-black hover:text-[#ff4500] font-medium text-xl py-2">About</Link>
                    <Link to="/service" onClick={closeMobileMenu} className="text-black hover:text-[#ff4500] font-medium text-xl py-2">Service</Link>
                    <Link to="/product" onClick={closeMobileMenu} className="text-black hover:text-[#ff4500] font-medium text-xl py-2">Product</Link>
                    <Link to="/contacts" onClick={closeMobileMenu} className="text-black hover:text-[#ff4500] font-medium text-xl py-2">Contacts</Link>
                    <Link to="/jobs" onClick={closeMobileMenu} className="text-black hover:text-[#ff4500] font-medium text-xl py-2">Job</Link>
                    <Link to="/blog" onClick={closeMobileMenu} className="text-black hover:text-[#ff4500] font-medium text-xl py-2">Blog</Link>
                </nav>

                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4">
                    {!isLoggedIn && (
                        <>
                           <Link
                               to="/login"
                               onClick={closeMobileMenu}
                               className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium text-sm px-4 py-2 rounded transition duration-150 ease-in-out inline-block flex-1 text-center"
                           >
                               Login
                           </Link>
                           <Link
                               to="/register"
                               onClick={closeMobileMenu}
                               className="bg-green-700 text-white hover:bg-green-800 font-medium text-sm px-4 py-2 rounded transition duration-150 ease-in-out inline-block flex-1 text-center"
                           >
                               Register
                           </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;