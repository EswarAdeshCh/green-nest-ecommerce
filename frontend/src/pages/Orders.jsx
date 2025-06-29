"use client"

import { useState, useEffect } from "react"
import axios from "axios"

import { useAuth } from "../context/AuthContext"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { token } = useAuth()
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.success) {
          setOrders(response.data.orders)
        } else {
          setError("Failed to load orders")
        }
      } catch (error) {
        console.error("Error loading orders:", error)
        setError("Failed to load orders. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [token])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffc107"
      case "processing":
        return "#17a2b8"
      case "shipped":
        return "#6f42c1"
      case "delivered":
        return "#28a745"
      case "cancelled":
        return "#dc3545"
      default:
        return "#6c757d"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return <div className="loading">Loading your orders...</div>
  }

  if (error) {
    return (
      <section className="orders-section">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="orders-section">
      <div className="container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <i className="fas fa-shopping-bag"></i>
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet.</p>
            <a href="/products" className="cta-button">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status-container">
                    <span className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items Ordered:</h4>
                  <div className="items-grid">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="item-image"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/60x60?text=Product"
                          }}
                        />
                        <div className="item-details">
                          <h5>{item.product.name}</h5>
                          <p>
                            Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                          </p>
                          <p className="item-total">₹{(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-summary">
                  <div className="shipping-info">
                    <h4>Shipping Address:</h4>
                    <p>
                      {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                    </p>
                    <p>{order.shippingInfo.address}</p>
                    <p>
                      {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                    </p>
                    <p>Phone: {order.shippingInfo.phone}</p>
                  </div>

                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Shipping:</span>
                      <span>₹{order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="total-row final-total">
                      <span>Total:</span>
                      <span>₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="tracking-info">
                    <p>
                      <strong>Tracking Number:</strong> {order.trackingNumber}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Orders
