"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useCart } from "../context/CartContext"


const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart()
  const [cartProducts, setCartProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const loadCartProducts = async () => {
      if (cart.length === 0) {
        setLoading(false)
        return
      }

      try {
        const productIds = cart.map((item) => item.productId)
        const response = await axios.post(`${API_BASE_URL}/products/batch`, {
          productIds,
        })

        if (response.data.success) {
          const productsWithQuantity = response.data.products.map((product) => {
            const cartItem = cart.find((item) => item.productId === product._id)
            return {
              ...product,
              quantity: cartItem.quantity,
            }
          })
          setCartProducts(productsWithQuantity)
        }
      } catch (error) {
        console.error("Error loading cart products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCartProducts()
  }, [cart])

  const calculateSubtotal = () => {
    return cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + 99.99 // Shipping cost
  }

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty")
      return
    }
    navigate("/checkout")
  }

  if (loading) {
    return <div className="loading">Loading cart...</div>
  }

  if (cart.length === 0) {
    return (
      <section className="cart-section">
        <div className="container">
          <div className="empty-cart-message">
            <i className="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>Add some beautiful plants to get started!</p>
            <Link to="/products" className="cta-button">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-section">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cartProducts.map((product) => (
              <div key={product._id} className="cart-item">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x80?text=Product"
                  }}
                />
                <div className="cart-item-info">
                  <h4>{product.name}</h4>
                  <p>₹{product.price.toFixed(2)} each</p>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={() => updateQuantity(product._id, product.quantity - 1)}>
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button className="quantity-btn" onClick={() => updateQuantity(product._id, product.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <div className="item-total">₹{(product.price * product.quantity).toFixed(2)}</div>
                  <button className="remove-btn" onClick={() => removeFromCart(product._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>₹99.99</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={proceedToCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart
