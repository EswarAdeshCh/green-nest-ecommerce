import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>
              <i className="fas fa-leaf"></i> GreenNest
            </h3>
            <p>Your trusted partner in creating beautiful gardens</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>
              <i className="fas fa-envelope"></i> info@greennest.com
            </p>
            <p>
              <i className="fas fa-phone"></i> +91 (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
