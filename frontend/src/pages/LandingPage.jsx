import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import BrandLogo from "../components/common/BrandLogo.jsx";
import homeIcon from "../Assests/home.png";
import adminIcon from "../Assests/admin.png";
import resourcesIcon from "../Assests/resources.png";
import bookingsIcon from "../Assests/Bookings.png";
import ticketsIcon from "../Assests/ticket.png";
import notificationsIcon from "../Assests/notification.png";
import profileIcon from "../Assests/profile.svg";
import settingsIcon from "../Assests/Setting.png";
import "./landing.css";
import { notificationService } from "../services/notificationService.js";

export default function LandingPage({ user, onLogout }) {
  const isAuthenticated = Boolean(user);
  const managerRoles = new Set(["ADMIN", "STAFF", "LECTURER"]);
  const canManageResources = managerRoles.has((user?.role || "").toUpperCase());
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;

    const loadUnread = async () => {
      try {
        const count = await notificationService.unreadCount();
        if (isMounted) setUnreadCount(Number(count) || 0);
      } catch (error) {
        if (isMounted) setUnreadCount(0);
      }
    };

    loadUnread();
    const interval = setInterval(loadUnread, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, user?.id]);

  return (
    <div className="landingPage">
      <aside className={isAuthenticated ? "landingSideNav landingSideNavAuth" : "landingSideNav"}>
        <a href="#home" className="landingBrand" aria-label="Smart University home">
          <BrandLogo className="landingBrandLogo" />
        </a>

        {isAuthenticated ? (
          <div className="landingProfile">
            <div className="landingAvatar">
              {user?.pictureUrl ? (
                <img
                  src={user.pictureUrl}
                  alt="profile"
                  className="landingAvatarImg"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="landingAvatarPlaceholder"
                style={{ display: user?.pictureUrl ? "none" : "flex" }}
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>

            <div className="landingProfileText">
              <div className="landingProfileName">{user?.name || "Campus User"}</div>
              <div className="landingProfileEmail">{user?.email || "user@campus.net"}</div>
            </div>
          </div>
        ) : null}

        <nav className="landingNav" aria-label="Landing navigation">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "landingNavLink active" : "landingNavLink"
                }
              >
                <img src={homeIcon} alt="" className="landingNavIcon" />
                <span className="landingNavLabel">Home</span>
              </NavLink>
              {user?.role === "ADMIN" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? "landingNavLink active" : "landingNavLink"
                  }
                >
                  <img src={adminIcon} alt="" className="landingNavIcon" />
                  <span className="landingNavLabel">Admin Dashboard</span>
                </NavLink>
              )}
              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  isActive ? "landingNavLink active" : "landingNavLink"
                }
              >
                <img src={resourcesIcon} alt="" className="landingNavIcon" />
                <span className="landingNavLabel">Resources</span>
              </NavLink>
              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                  isActive ? "landingNavLink active" : "landingNavLink"
                }
              >
                <img src={bookingsIcon} alt="" className="landingNavIcon" />
                <span className="landingNavLabel">Bookings</span>
              </NavLink>
              <NavLink
                to="/tickets"
                className={({ isActive }) =>
                  isActive ? "landingNavLink active" : "landingNavLink"
                }
              >
                <img src={ticketsIcon} alt="" className="landingNavIcon" />
                <span className="landingNavLabel">Tickets</span>
              </NavLink>
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  isActive ? "landingNavLink active" : "landingNavLink"
                }
              >
                <img src={notificationsIcon} alt="" className="landingNavIcon" />
                <span className="landingNavLabel">
                  Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
                </span>
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "landingNavLink active" : "landingNavLink"
                }
              >
                <img src={profileIcon} alt="" className="landingNavIcon" />
                <span className="landingNavLabel">Profile</span>
              </NavLink>
              {user?.role === "ADMIN" && (
                <NavLink
                  to="/manage-users"
                  className={({ isActive }) =>
                    isActive ? "landingNavLink active" : "landingNavLink"
                  }
                >
                  <img src={profileIcon} alt="" className="landingNavIcon" />
                  <span className="landingNavLabel">Manage Users</span>
                </NavLink>
              )}
              {user?.role === "ADMIN" && (
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive ? "landingNavLink active" : "landingNavLink"
                  }
                >
                  <img src={settingsIcon} alt="" className="landingNavIcon" />
                  <span className="landingNavLabel">Settings</span>
                </NavLink>
              )}
            </>
          ) : (
            <>
              <a href="#home" className="landingNavLink active">
                Home
              </a>
              <a href="#about" className="landingNavLink">
                About Us
              </a>
              <a href="#features" className="landingNavLink">
                Features
              </a>
              <a href="#contact" className="landingNavLink">
                Contact
              </a>
            </>
          )}
        </nav>

        <div className="landingAuthActions">
          {isAuthenticated ? (
            <button type="button" onClick={onLogout} className="landingBtn landingBtnPrimary">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="landingBtn landingBtnGhost">
                Login
              </Link>
              <Link to="/signup" className="landingBtn landingBtnPrimary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </aside>

      <main className="landingContent">
        <div className="landingContainer">
          <section id="home" className="landingHeroSection">
            <div className="landingHeroContent">
              <h1>Manage Your Campus Smarter</h1>
              <p>
                One place to handle resources, bookings, tickets, notifications, and more for
                students, lecturers, and administrators.
              </p>
              <div className="landingHeroActions">
                {isAuthenticated ? (
                  <>
                    <Link to="/resources" className="landingBtn landingBtnPrimary">
                      {canManageResources ? "Manage Resources" : "View Resources"}
                    </Link>
                    <Link to="/bookings" className="landingBtn landingBtnGhost">
                      View Bookings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="landingBtn landingBtnPrimary">
                      Get Started
                    </Link>
                    <Link to="/login" className="landingBtn landingBtnGhost">
                      I already have an account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </section>

          <section id="about" className="landingSection">
            <h2>About Us</h2>
            <p>
              Smart University Management is built to simplify university operations and improve
              communication between all campus users.
            </p>
          </section>

          <section id="features" className="landingSection landingSectionMuted">
            <div className="landingFeatureGrid">
              <article className="landingFeatureCard">
                <h3>Resource Tracking</h3>
                <p>Track and manage equipment, rooms, and learning resources in one dashboard.</p>
              </article>
              <article className="landingFeatureCard">
                <h3>Booking Workflows</h3>
                <p>Handle booking requests with clear status updates and better visibility.</p>
              </article>
              <article className="landingFeatureCard">
                <h3>Support Tickets</h3>
                <p>Resolve issues faster with centralized ticket management for campus users.</p>
              </article>
            </div>
          </section>

          <footer id="contact" className="landingFooter">
            <h2>Contact</h2>
            <p>Need help? Reach out to the university IT support team for assistance.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
