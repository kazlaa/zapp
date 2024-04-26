import React from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";

export const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/products" className="navbar-link">Products</Link>
        </li>
        <li className="navbar-item">
          <Link to="/upload" className="navbar-link">Upload</Link>
        </li>
      </ul>
    </nav>
  );
};