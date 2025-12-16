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
        />
      ))}
    </ul>
  );
};

type NavbarListItemProps = {
  title: string;
  badge?: string;
};

const NavbarListItem = ({ title, badge }: NavbarListItemProps) => {
  return (
    <li>
      <a className="justify-between">
        {title}
        {badge && <span className="badge badge-sm">{badge}</span>}
      </a>
    </li>
  );
};
