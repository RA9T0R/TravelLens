import { Link, useLocation } from "react-router";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Predict", path: "/predict" },
    { name: "All Images", path: "/AllImage" },
    { name: "Upload", path: "/upload_data" },
  ];

  return (
    <div className="">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">TravelLens</div>
        <div className="flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium ${
                location.pathname === link.path
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
