import { useNavigate } from "react-router";
import { useLogout } from "../hooks/auth/useLogout";

const navbarListItems = [
  {
    title: "Profile",
    badge: "New",
  },
  {
    title: "Settings",
  },

  {
    title: "Logout",
  },
];

export const NavbarList = () => {
  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const navigate = useNavigate();

  const handleItemClick = (title: string) => {
    switch (title) {
      case "Logout": {
        logout();
        break;
      }
      case "Profile": {
        navigate("/profile");
        break;
      }
      case "Settings": {
        navigate("/settings");
        break;
      }
      default:
        break;
    }
  };

  return (
    <ul
      tabIndex={-1}
      className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
    >
      {navbarListItems.map((item) => (
        <NavbarListItem
          key={item.title}
          title={item.title}
          badge={item?.badge || undefined}
          onClick={() => handleItemClick(item.title)}
          isLoading={isLogoutPending}
        />
      ))}
    </ul>
  );
};

type NavbarListItemProps = {
  title: string;
  badge?: string;
  onClick?: () => void;
  isLoading?: boolean;
};

const NavbarListItem = ({
  title,
  badge,
  onClick,
  isLoading,
}: NavbarListItemProps) => {
  return (
    <li>
      <button
        className="justify-between"
        disabled={isLoading}
        onClick={onClick}
      >
        {title}
        {badge && <span className="badge badge-sm">{badge}</span>}
      </button>
    </li>
  );
};
