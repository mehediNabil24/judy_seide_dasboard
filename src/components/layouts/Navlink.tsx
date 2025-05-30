import { CiFolderOn} from 'react-icons/ci';
import { FaUsers } from 'react-icons/fa';
import { FaShop, FaUserGroup } from 'react-icons/fa6';
import { FiBox } from 'react-icons/fi';
import { GiNewspaper } from 'react-icons/gi';
import { GoPlus, GoPlusCircle } from 'react-icons/go';

import { ImScissors } from 'react-icons/im';
import { IoPeopleOutline, IoWalletOutline } from 'react-icons/io5';
import { LuCalendarDays } from 'react-icons/lu';
import {  MdOutlineCategory, MdOutlinePayments } from 'react-icons/md';
import { PiNewspaperThin } from 'react-icons/pi';
import { RiDashboardFill } from 'react-icons/ri';



export const navLink = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: RiDashboardFill,
  },

  {
    name: "Booking List",
    href: "/dashboard/booking-list",
    icon: LuCalendarDays,
  },

  {
    name: "Service",
    href: "#",
    icon: ImScissors,
    subItems: [
      { name: "Add Service", href: "/dashboard/add-service", icon: GoPlus },
      {
        name:"Shop Input",
        href: '/dashboard/shop-input',
        icon:GoPlus

      },
      {
        name: "Services",
        href: "/dashboard/my-service",
        icon: CiFolderOn,
      },
      {
        name: "Booked Services",
        href: "/dashboard/book-service",
        icon: CiFolderOn,
      },
      {
        name: "Canceled Services",
        href: "/dashboard/cancel-service",
        icon: CiFolderOn,
      },
    ],
  },
  {
    name: "Blog",
    href: "#",
    icon: PiNewspaperThin,
    subItems: [
      { name: "Add Blogs", href: "/dashboard/add-blog", icon: GoPlus },
      { name: "All Blogs", href: "/dashboard/business-blog", icon: GiNewspaper },
    ],
  },

  {
    name: "Staff",
    href: "#",
    icon: FaUserGroup ,
    subItems: [
      { name: "Add Staff", href: "/dashboard/add-staff", icon: GoPlus },
      { name: "All Staffs", href: "/dashboard/all-staffs", icon: GiNewspaper },
    ],
  },

  {
    name: "Review",
    href: "/dashboard/reviews",
    icon: FaUsers,
  },


  {
    name: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: FiBox,
  },
  // {
  //   name: "Pricing",
  //   href: "/dashboard/pricing",
  //   icon: IoWalletOutline,
  //   subItems: [
  //     {
  //       name: "Add Price",
  //       href: "/dashboard/add-price",
  //       icon: GoPlus,
  //     },
  //     {
  //       name: "All Price",
  //       href: "/dashboard/all-price",
  //       icon: IoPeopleOutline,
  //     },
     
  //   ],
  // },
  {
    name:"Payment History",
    href: "/dashboard/user-payment",
    icon: MdOutlinePayments
  }
];


export const AdminNavLink = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: RiDashboardFill,
  },
  {
    name: "Category",
    href: "#",
    icon: MdOutlineCategory,
    subItems: [
      {
        name: 'Add Category',
        href: '/admin/add-category',
        icon: GoPlusCircle,
      },
      {
        name: "Category List",
        href: "/admin/category-list",
        icon: MdOutlineCategory,
      }
    ]

  },
  
  {
    name: "Product",
    href: "#",
    icon: FaShop,
    subItems: [

      {
        name: "Add Product",
        href: "/admin/add-product",
        icon: GoPlus,

      },
      {
        
          name: "Product List",
          href: "/admin/product-list",
          icon: FaShop,
      },
      
      {
        name:"Add Material",
        href: '/admin/add-material',
        icon: GoPlus
      },
      {
        name:"Material List",
        href:'/admin/material-list',
        icon: CiFolderOn,
      }

    ]
  },
  // {
  //   name: "Locations",
  //   href: "#",
  //   icon: CiLocationOn,
  //   subItems: [
  //     {
  //       name: "Add Location",
  //       href: "/admin/add-location",
  //       icon: MdOutlineAddLocationAlt,
  //     },
  //     {
  //       name: "All Location",
  //       href: "/admin/all-location",
  //       icon: GrMapLocation,
  //     },
  //   ],
  // },
  {
    name: "Pricing",
    href: "#",
    icon: IoWalletOutline,
    subItems: [
      {
        name: "Add Price",
        href: "/admin/add-price",
        icon: GoPlus,
      },
      {
        name: "All Price",
        href: "/admin/all-price",
        icon: IoPeopleOutline,
      },
    ],
  },
  {
    name: "Blog",
    href: "#",
    icon: PiNewspaperThin,
    subItems: [
      { name: "Add Blogs", href: "/admin/add-blog", icon: GoPlus },
      { name: "All Blogs", href: "/admin/all-blog", icon: GiNewspaper },
    ],
  },
  // {
  //   name: "Review",
  //   href: "/admin/reviews",
  //   icon: FaUsers,
  // },
  {
    name:"Shop Payment",
    href: "/admin/shop-payment",
    icon: MdOutlinePayments
  }
];
