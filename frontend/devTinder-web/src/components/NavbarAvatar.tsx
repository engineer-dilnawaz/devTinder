import type { User } from "../services/auth";

type NavbarAvatarProps = {
  user: User;
};

export const NavbarAvatar = ({ user }: NavbarAvatarProps) => {
  return (
    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
        <img
          alt={`${user.firstName} ${user.lastName}`}
          src={user.profilePhoto}
        />
      </div>
    </div>
  );
};
