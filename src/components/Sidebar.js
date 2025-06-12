import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserTie,
  FaUserFriends,
  FaCogs,
  FaHippo,
  FaUsers,
  FaExchangeAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./sidebar.css";

function Sidebar() {
  const [userDropdown, setUserDropdown] = useState(false);
  const [peternakDropdown, setPeternakDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 900);
      if (window.innerWidth > 900) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isMobile]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          className={`hamburger-btn ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${isMobile ? "mobile" : ""} ${
          isMobileMenuOpen ? "open" : ""
        }`}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <button className="mobile-close-btn" onClick={closeMobileMenu}>
            <FaTimes />
          </button>
        )}

        <h1>TernaQan</h1>

        <ul>
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              <FaTachometerAlt style={{ marginRight: 12 }} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/sapi"
              className={location.pathname.startsWith("/sapi") ? "active" : ""}
            >
              <FaHippo style={{ marginRight: 12 }} />
              Sapi
            </Link>
          </li>
          <li>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setPeternakDropdown((v) => !v)}
            >
              <FaUserFriends style={{ marginRight: 12 }} />
              Peternak {peternakDropdown ? "▲" : "▼"}
            </span>
            <ul className={`dropdown ${peternakDropdown ? "open" : ""}`}>
              <li>
                <Link
                  to="/product"
                  className={
                    location.pathname.startsWith("/product") ? "active" : ""
                  }
                >
                  <FaCogs style={{ marginRight: 10 }} />
                  Kelola Sapi
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setUserDropdown((v) => !v)}
            >
              <FaUsers style={{ marginRight: 12 }} />
              Admin {userDropdown ? "▲" : "▼"}
            </span>
            <ul className={`dropdown ${userDropdown ? "open" : ""}`}>
              <li>
                <Link
                  to="/user/list"
                  className={
                    location.pathname.startsWith("/user") ? "active" : ""
                  }
                >
                  <FaUserTie style={{ marginRight: 10 }} />
                  Kelola Admin
                </Link>
              </li>
              <li>
                <Link
                  to="/peternak"
                  className={
                    location.pathname.startsWith("/peternak") ? "active" : ""
                  }
                >
                  <FaUserFriends style={{ marginRight: 10 }} />
                  Kelola Peternak
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link
              to="/transactions"
              className={
                location.pathname.startsWith("/transactions") ? "active" : ""
              }
            >
              <FaExchangeAlt style={{ marginRight: 12 }} />
              Transactions
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
