"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <h2>
              <i className="fas fa-leaf"></i> GreenNest
            </h2>
          </Link>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/cart">
              Cart <span id="cart-count">{getCartItemsCount()}</span>
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/orders">Orders</Link>
            </li>
          )}
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <li className="user-menu">
              <span>Welcome, {user?.name}</span>
              {user?.role === "admin" && (
                <Link to="/admin" className="admin-link">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
