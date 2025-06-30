"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import OrderConfirmation from "../components/OrderConfirmation"

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const { token } = useAuth()
  const [cartProducts, setCartProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)

  const navigate = useNavigate()
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart")
      return
    }

    const loadCheckoutData = async () => {
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
        console.error("Error loading checkout data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCheckoutData()
  }, [cart, navigate, API_BASE_URL])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const calculateSubtotal = () => {
    return cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + 99.99 // Fixed shipping cost
  }

  // ✅ FIXED: Submit only required fields to match backend validation
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // ✅ Construct the items array with only required fields
    const items = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))

    const orderData = {
      items,
      shippingInfo: formData,
    }

    console.log("🚀 Submitting orderData:", orderData) // Debug

    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        clearCart()
        setOrderDetails(response.data.order)
        setShowConfirmation(true)
      } else {
        alert("Failed to place order: " + response.data.message)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading checkout...</div>
  }

  return (
    <>
      <section className="checkout-section">
        <div className="container">
          <h1>Checkout</h1>

          <div className="checkout-content">
            <div className="checkout-form">
              <h3>Shipping Information</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Street Address</label>
                  <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                  </div>
                </div>

                <button type="submit" className="place-order-button" disabled={submitting}>
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="checkout-items">
                {cartProducts.map((product) => (
                  <div key={product._id} className="checkout-item">
                    <img src={product.image || "/placeholder.svg"} alt={product.name} />
                    <div className="checkout-item-info">
                      <h4>{product.name}</h4>
                      <p>Qty: {product.quantity} × ₹{product.price.toFixed(2)}</p>
                    </div>
                    <div className="checkout-item-total">₹{(product.price * product.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <OrderConfirmation show={showConfirmation} onClose={() => setShowConfirmation(false)} orderDetails={orderDetails} />
    </>
  )
}

export default Checkout
