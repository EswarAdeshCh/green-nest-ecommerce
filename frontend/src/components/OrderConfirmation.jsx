"use client"

import { useState, useEffect } from "react"

const OrderConfirmation = ({ show, onClose, orderDetails }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!show) return null

  return (
    <div className={`order-confirmation-overlay ${isVisible ? "show" : ""}`}>
      <div className={`order-confirmation-modal ${isVisible ? "show" : ""}`}>
        <div className="confirmation-header">
          <i className="fas fa-check-circle success-icon"></i>
          <h2>Order Placed Successfully!</h2>
          <button className="close-btn" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="confirmation-content">
          <p>Thank you for your order! Your order has been placed successfully.</p>

          {orderDetails && (
            <div className="order-details">
              <p>
                <strong>Order ID:</strong> #{orderDetails._id?.slice(-8).toUpperCase()}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{orderDetails.total?.toFixed(2)}
              </p>
              <p>
                <strong>Items:</strong> {orderDetails.items?.length} item(s)
              </p>
            </div>
          )}

          <div className="confirmation-actions">
            <button className="view-orders-btn" onClick={() => (window.location.href = "/orders")}>
              View My Orders
            </button>
            <button className="continue-shopping-btn" onClick={() => (window.location.href = "/products")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
