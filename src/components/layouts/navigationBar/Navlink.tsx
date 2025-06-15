import { useState } from "react"; // Import useState for managing dropdown state
import { IoLogOut } from "react-icons/io5";
import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Use react-router-dom instead of react-router
import type { NavLink } from "../types";
import { logout } from "../../../redux/features/user/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import logo from "../../../assets/logo2.png";

interface MainNavLinkProps {
  navLink: NavLink[];
  additionalRoutes: NavLink[] | null;
  setIsShort: React.Dispatch<React.SetStateAction<boolean>>;
  isShort: boolean;
  dark?: boolean;
}

export default function MainNavLink({
  navLink,
  additionalRoutes,
  setIsShort,
  isShort,
  dark = false,
}: MainNavLinkProps) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // Track which dropdown is open

  // Check if a link is active

  const isActive = (href: string) => {
    const cleanHref = href.split("?")[0];
    const cleanPathname = location.pathname.split("?")[0];

    // Exact match for dashboard routes
    if (cleanHref === "/dashboard") {
      return cleanPathname === "/dashboard";
    }
    if (cleanHref === "/admin") {
      return cleanPathname === "/admin";
    }

    // Partial match for other routes
    return cleanPathname.startsWith(cleanHref);
  };

 // Removed unused 'user' variable
 const dispatch = useDispatch();

 const navigate = useNavigate();
//  const user = useSelector((state: any) => state.user.user);

 // Handle logout
 const handleLogout = async () => {
   dispatch(logout());
   toast.success("Logout Successful");
   navigate("/");
  };
  


  // Toggle dropdown
  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Render navigation links with dropdown support
  const renderNavLink = (
    link: NavLink,
    isShort: boolean,
    setIsShort: React.Dispatch<React.SetStateAction<boolean>>,
    dark?: boolean
  ) => {
    const hasSubItems = link.subItems && link.subItems.length > 0;

    return (
      <div key={link.name}>
        {/* Dropdown Trigger */}
        <div
          className={`flex items-center justify-between gap-3 px-3 py-3 rounded-md cursor-pointer ${
            isActive(link.href)
              ? dark
                ? "bg-primary text-black"
                : "bg-primary text-black"
              : dark
              ? "text-black hover:bg-primary/40"
              : "hover:bg-primary/10 hover:text-primary"
          }`}
          onClick={() => hasSubItems && toggleDropdown(link.name)}
          onMouseEnter={() => setIsShort(true)}
        >
          {hasSubItems ? (
            <button className="flex items-center gap-3 flex-1 overflow-hidden">
              <div className="rounded">
                {link.icon && <link.icon className="min-w-6 min-h-6" />}
              </div>
              {isShort && <span className="text-nowrap">{link.name}</span>}
            </button>
          ) : (
            <Link
              to={link.href}
              className="flex items-center gap-3 flex-1 overflow-hidden"
            >
              <div className="rounded">
                {link.icon && <link.icon className="min-w-6 min-h-6" />}
              </div>
              {isShort && <span className="text-nowrap">{link.name}</span>}
            </Link>
          )}

          {hasSubItems && isShort && (
            <span className="text-sm">
              {/* Fixed arrow direction */}
              {openDropdown === link.name ? (
                <MdOutlineKeyboardArrowUp />
              ) : (
                <MdOutlineKeyboardArrowDown />
              )}
            </span>
          )}
        </div>

        {/* Dropdown Content */}
        {hasSubItems && link.subItems && isShort && (
          <div
            className={`pl-6 transition-all duration-300 ease-in-out overflow-hidden ${
              openDropdown === link.name ? "max-h-96" : "max-h-0"
            }`}
          >
            {link.subItems.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md overflow-hidden ${
                  isActive(subItem.href)
                    ? dark
                      ? "bg-primary text-black"
                      : "bg-primary text-black"
                    : dark
                    ? "text-black hover:bg-primary/40"
                    : "hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {subItem.icon && (
                  <div className="rounded">
                    <subItem.icon className="min-w-6 min-h-6" />
                  </div>
                )}
                {isShort && (
                  <span className="text-nowrap"> {subItem.name}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col min-h-screen  relative ${
        dark ? "bg-white" : "bg-white"
      }`}
    >
      <div className="lg:block absolute top-16 right-0 hidden z-50">
        <button
          className={`rounded-md  transition-colors w-fit shadow-md px-3 z-50 ${
            dark ? "bg-primary" : "bg-white hover:bg-gray-100"
          }`}
          onClick={() => setIsShort(!isShort)}
          aria-label="Toggle menu"
        >
          {isShort ? (
            <LuChevronsRight
              className={`h-6 w-6  z-50 ${
                dark ? "hover:text-white" : "hover:text-primary"
              }`}
            />
          ) : (
            <LuChevronsLeft
              className={`h-6 w-6  z-50 ${
                dark ? "hover:text-white" : "hover:text-primary"
              }`}
            />
          )}
        </button>
      </div>

      {/* Logo Section */}
     
<Link to="/" className="p-4 min-h-20">
  {isShort && (
    <div className="flex items-center gap-2">
      <img
        src={logo}
        alt="Connex"
        className="h-12 w-auto" // Adjust height/width as needed
      />
    </div>
  )}
</Link>
            {/* <Image
                        src={"https://cdn-icons-png.freepik.com/256/7653/7653476.png?semt=ais_hybrid"}
                        alt="Booksy.buzz"
                        width={60}
                        height={60}
                        className="rounded max-w-[100px] max-h-[100px]"
                    /> */}
      

      {/* Navigation Links */}
      <nav className="flex-1 p-4 mt-2">
        <div className="space-y-1">
          {navLink.map((link) =>
            renderNavLink(link, isShort, setIsShort, dark)
          )}
        </div>
      </nav>

      {/* Additional Routes and User Section */}
      <div className="mt-auto p-4 space-y-1">
        {additionalRoutes?.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-md ${
              isActive(link.href)
                ? dark
                  ? ""
                  : "bg-primary text-white"
                : dark
                ? ""
                : "bg-primary text-white"
            }`}
          >
            <div className="rounded">
              {link.icon && <link.icon className="min-w-6 min-h-6" />}
            </div>
            {link.name}
          </Link>
        ))}

        {/* Logout Button */}
        {/* Logout Button */}
        <div
          className={`flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer mt-auto ${
            dark
              ? "text-black hover:bg-primary/40"
              : "hover:bg-primary/10 hover:text-primary"
          }`}
          onClick={handleLogout}
        >
          <IoLogOut className="min-w-6 min-h-6" />
          {isShort && <span className="text-nowrap">Logout</span>}
        </div>
      </div>
    </div>
  );
}
