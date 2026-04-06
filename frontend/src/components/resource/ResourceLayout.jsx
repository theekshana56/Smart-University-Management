import "./resource.css";

<<<<<<< Updated upstream
=======
import homeIcon from "../../Assests/home.png";
import adminIcon from "../../Assests/admin.png";
import resourcesIcon from "../../Assests/resources.png";
import bookingsIcon from "../../Assests/Bookings.png";
import ticketsIcon from "../../Assests/ticket.png";
import notificationsIcon from "../../Assests/notification.png";
import profileIcon from "../../Assests/profile.svg";
import usersIcon from "../../Assests/profile.svg";
import settingsIcon from "../../Assests/Setting.png";
import BrandLogo from "../common/BrandLogo.jsx";
>>>>>>> Stashed changes


export default function ResourceLayout({ children, onLogout, user, onNavigate, currentPage }) {


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

          <div
            className={`navItem ${currentPage === 'Home' ? 'active' : ''}`}
            onClick={() => onNavigate('Home')}
            style={{ cursor: 'pointer' }}
          >
            Home
          </div>

          <div
            className={`navItem ${currentPage === 'Resources' ? 'active' : ''}`}
            onClick={() => onNavigate('Resources')}
            style={{ cursor: 'pointer' }}
          >
            Resources
          </div>

          {user?.role === 'ADMIN' && (
            <div
              className={`navItem ${currentPage === 'Admin' ? 'active' : ''}`}
              onClick={() => onNavigate('Admin')}
              style={{ cursor: 'pointer', color: '#14b8a6', fontWeight: '700' }}
            >
              Admin Panel
            </div>
          )}

          <div className="navItem">Bookings</div>
          <div className="navItem">Tickets</div>
          <div className="navItem">Notifications</div>

          <div
            className={`navItem ${currentPage === 'Settings' ? 'active' : ''}`}
            onClick={() => onNavigate('Settings')}
            style={{ cursor: 'pointer' }}
          >
<<<<<<< Updated upstream
            Settings
          </div>

=======
            <img src={resourcesIcon} alt="" className="sideNavIcon" />
            <span className="sideNavLabel">Resources</span>
          </NavLink>
          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              isActive ? "sideNavItem active" : "sideNavItem"
            }
          >
            <img src={bookingsIcon} alt="" className="sideNavIcon" />
            <span className="sideNavLabel">Bookings</span>
          </NavLink>
          <NavLink
            to="/tickets"
            className={({ isActive }) =>
              isActive ? "sideNavItem active" : "sideNavItem"
            }
          >
            <img src={ticketsIcon} alt="" className="sideNavIcon" />
            <span className="sideNavLabel">Tickets</span>
          </NavLink>
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              isActive ? "sideNavItem active" : "sideNavItem"
            }
          >
            <img src={notificationsIcon} alt="" className="sideNavIcon" />
            <span className="sideNavLabel">Notifications</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "sideNavItem active" : "sideNavItem"
            }
          >
            <img src={profileIcon} alt="" className="sideNavIcon" />
            <span className="sideNavLabel">Profile</span>
          </NavLink>
          {user?.role === "ADMIN" && (
            <NavLink
              to="/manage-users"
              className={({ isActive }) =>
                isActive ? "sideNavItem active" : "sideNavItem"
              }
            >
              <img src={usersIcon} alt="" className="sideNavIcon" />
              <span className="sideNavLabel">Manage Users</span>
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? "sideNavItem active" : "sideNavItem"
              }
            >
              <img src={settingsIcon} alt="" className="sideNavIcon" />
              <span className="sideNavLabel">Settings</span>
            </NavLink>
          )}
>>>>>>> Stashed changes
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