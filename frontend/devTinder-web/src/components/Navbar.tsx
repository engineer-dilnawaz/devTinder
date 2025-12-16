import { Logo } from "./Logo";
import { NavbarAvatar } from "./NavbarAvatar";
import { NavbarList } from "./NavbarList";

export const Navbar = () => {
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <Logo />
      <div className="flex gap-2">
        <div className="dropdown dropdown-end mx-4">
          <NavbarAvatar />
          <NavbarList />
        </div>
      </div>
    </div>
  );
};
