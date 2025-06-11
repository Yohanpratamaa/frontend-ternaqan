import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserTie,
  FaUserFriends,
  FaCogs,
  FaHippo,
  FaUsers,
  FaExchangeAlt,
} from "react-icons/fa";
import "./sidebar.css";

function Sidebar() {
  const [userDropdown, setUserDropdown] = useState(false);
  const [peternakDropdown, setPeternakDropdown] = useState(false);
  const location = useLocation();

  return (
    <div className="sidebar">
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
          {peternakDropdown && (
            <ul>
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
          )}
        </li>
        <li>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setUserDropdown((v) => !v)}
          >
            <FaUsers style={{ marginRight: 12 }} />
            Admin {userDropdown ? "▲" : "▼"}
          </span>
          {userDropdown && (
            <ul>
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
          )}
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
  );
}

export default Sidebar;
