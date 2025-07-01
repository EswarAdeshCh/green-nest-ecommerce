"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { useState } from "react"

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" onClick={closeMenu}>
            <h2><i className="fas fa-leaf"></i> GreenNest</h2>
          </Link>
        </div>

        {/* Hamburger Toggle */}
        <div className="nav-toggle" onClick={toggleMenu} aria-label="Toggle navigation" role="button" tabIndex="0">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
          <li>
            <Link to="/cart" onClick={closeMenu}>
              Cart <span id="cart-count">{getCartItemsCount()}</span>
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/orders" onClick={closeMenu}>Orders</Link>
            </li>
          )}
          {!isAuthenticated ? (
            <>
              <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/register" onClick={closeMenu}>Register</Link></li>
            </>
          ) : (
            <li className="user-menu">
              <span>Welcome, {user?.name}</span>
              {user?.role === "admin" && (
                <Link to="/admin" className="admin-link" onClick={closeMenu}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
