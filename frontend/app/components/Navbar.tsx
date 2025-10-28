import { Link, useLocation } from "react-router";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import useDarkMode from "./useDarkMode";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useDarkMode();

  const links = [
    { name: "Home", path: "/" },
    { name: "Predict", path: "/predict" },
    { name: "Dataset", path: "/AllImage" },
    { name: "Upload", path: "/upload_data" },
    { name: "Description", path: "/description" },
  ];
  const iconClass = "size-4 sm:size-6 text-text dark:text-Dark_text"; 
  const PlaceholderIcon = () => (
    <div className="w-4 h-4 sm:w-6 sm:h-6" style={{ visibility: 'hidden' }} />
  );

  return (
    <nav className="bg-bg dark:bg-Dark_bg sticky top-0 z-50">
      <div className="flex items-center justify-between py-4 sm:py-5 px-4 sm:px-8 font-medium max-w-7xl mx-auto relative">
        <div className="md:w-1/4">
          <Link to="/" className="flex md:flex-col lg:flex-row items-center md:gap-3 dark:text-Dark_text">
            <MdOutlineTravelExplore className="size-8 sm:size-10 cursor-pointer" />
            <h1 className="w-24 md:w-36 text-sm xl:text-md sm:text-lg md:text-2xl text-Text text-center whitespace-nowrap">
              TravelLense
            </h1>
          </Link>
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-5 text-md justify-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium flex flex-col items-center px-3 py-2 rounded text-text dark:text-Dark_text ${
                location.pathname === link.path
                  ? "text-white bg-primary dark:bg-Dark_primary shadow-lg"
                  : "hover:text-primary hover:dark:text-Dark_primary border-b-2 border-transparent hover:border-primary hover:dark:border-Dark_primary transition"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </ul>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 md:w-1/4 justify-end md:justify-center">
          <button 
            onClick={toggleTheme} 
            className="w-9 h-9 sm:w-12 sm:h-12 bg-surface dark:bg-Dark_surface rounded-full shadow-lg shadow-Text/20 flex items-center justify-center cursor-pointer transition-all hover:scale-110"
          >
            {!mounted ? (
              <PlaceholderIcon />
            ) : theme === "dark" ? (
              <FaSun className={iconClass} />
            ) : (
              <FaMoon className={iconClass} />
            )}
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-9 h-9 sm:w-12 sm:h-12 bg-surface dark:bg-Dark_surface rounded-full shadow-lg shadow-Text/20 flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <FaTimes className="text-text dark:text-Dark_text w-4 h-4 sm:w-6 sm:h-6" />
            ) : (
              <FaBars className="text-text dark:text-Dark_text w-4 h-4 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {isOpen && (
          <div className="absolute top-full right-4 mt-2 w-48 bg-surface dark:bg-Dark_surface rounded-lg shadow-lg md:hidden z-50">
            <ul className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 font-medium ${
                    location.pathname === link.path
                      ? "bg-primary dark:bg-Dark_primary text-white"
                      : "text-text dark:text-Dark_text"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;