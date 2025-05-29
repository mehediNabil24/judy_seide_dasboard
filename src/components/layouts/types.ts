import type { IconType } from "react-icons";

export type NavLink = {
  name: string;
  href: string;
  icon?: IconType; // Using IconType from react-icons
  subItems?: NavLink[]; // Optional array of sub-items
};
export type User = {
  name?: string;
  email: string;
  image: string | null;
  role: string;
  iat: number;
  exp: number;
};
