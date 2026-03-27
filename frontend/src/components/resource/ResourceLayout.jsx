import { NavLink } from "react-router-dom";
import "./resource.css";

export default function ResourceLayout({ children, onLogout, user }) {

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="profile">
          <div className="avatar">
            {user?.pictureUrl ? (
              <img
                src={user.pictureUrl}
                alt="profile"
                className="avatarImg"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="avatarPlaceholder" style={{ display: user?.pictureUrl ? 'none' : 'flex' }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="name">{user?.name || "Campus User"}</div>
            <div className="email">{user?.email || "user@campus.net"}</div>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" className={({isActive}) => isActive ? "navItem active" : "navItem"} end>Home</NavLink>
          <NavLink to="/resources" className={({isActive}) => isActive ? "navItem active" : "navItem"}>Resources</NavLink>
          <NavLink to="/bookings" className={({isActive}) => isActive ? "navItem active" : "navItem"}>Bookings</NavLink>
          <NavLink to="/tickets" className={({isActive}) => isActive ? "navItem active" : "navItem"}>Tickets</NavLink>
          <NavLink to="/notifications" className={({isActive}) => isActive ? "navItem active" : "navItem"}>Notifications</NavLink>
          <NavLink to="/settings" className={({isActive}) => isActive ? "navItem active" : "navItem"}>Settings</NavLink>
        </nav>

        <div className="logout">
          <button onClick={onLogout}>
            Logout</button></div>
      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
}