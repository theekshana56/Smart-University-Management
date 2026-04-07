import { NavLink } from "react-router-dom";
import "./resource.css";

import homeIcon from "../../Assests/home.png";
import adminIcon from "../../Assests/admin.png";
import resourcesIcon from "../../Assests/resources.png";
import bookingsIcon from "../../Assests/Bookings.png";
import ticketsIcon from "../../Assests/ticket.png";
import notificationsIcon from "../../Assests/notification.png";
import profileIcon from "../../Assests/profile.svg";
import settingsIcon from "../../Assests/Setting.png";
import BrandLogo from "../common/BrandLogo.jsx";

export default function ResourceLayout({ children, onLogout, user }) {
  return (
    <div className="appShell">
      <aside className="sideNav">
        <BrandLogo className="sideNavBrand" />

        <div className="profile sideProfile">
          <div className="avatar">
            {user?.pictureUrl ? (
              <img
                src={user.pictureUrl}
                alt="profile"
                className="avatarImg"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="avatarPlaceholder"
              style={{ display: user?.pictureUrl ? "none" : "flex" }}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div className="sideProfileText" style={{ minWidth: 0 }}>
            <div className="name">{user?.name || "Campus User"}</div>
            <div className="email">{user?.email || "user@campus.net"}</div>
          </div>
        </div>

        <nav className="sideNavMenu">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "sideNavItem active" : "sideNavItem"
            }
          >
            <img src={homeIcon} alt="" className="sideNavIcon" />
            <span className="sideNavLabel">Home</span>
          </NavLink>
          {user?.role === "ADMIN" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "sideNavItem active" : "sideNavItem"
              }
            >
              <img src={adminIcon} alt="" className="sideNavIcon" />
              <span className="sideNavLabel">Admin Dashboard</span>
            </NavLink>
          )}
          <NavLink
            to="/resources"
            className={({ isActive }) =>
              isActive ? "sideNavItem active" : "sideNavItem"
            }
          >
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
              <img src={profileIcon} alt="" className="sideNavIcon" />
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
        </nav>

        <div className="logout sideLogoutWrap">
          <button onClick={onLogout} className="sideLogout">
            <span className="sideLogoutIcon">⏏</span>
            <span className="sideNavLabel">Logout</span>
          </button>
        </div>
      </aside>

      <main className="content">
        <div className="contentInner">{children}</div>
      </main>
    </div>
  );
}