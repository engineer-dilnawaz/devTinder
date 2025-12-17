import { useUserStore } from "../stores/user.store";
import { Logo } from "./Logo";
import { NavbarAvatar } from "./NavbarAvatar";
import { NavbarList } from "./NavbarList";

export const Navbar = () => {
  const user = useUserStore((state) => state.user);
  console.log(user);
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <Logo />
      <div className="flex gap-2">
        {user && (
          <div className="dropdown dropdown-end mx-4">
            <NavbarAvatar user={user} />
            <NavbarList />
          </div>
        )}
      </div>
    </div>
  );
};
