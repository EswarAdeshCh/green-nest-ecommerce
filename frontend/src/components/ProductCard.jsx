"use client"

import { useState } from "react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState("")

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    const result = addToCart(product._id)
    setMessage(result.message)

    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <div className="product-card">
      <img
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        className="product-image"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x200?text=Product+Image"
        }}
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-price">₹{product.price.toFixed(2)}</div>
        <div className="product-stock">Stock: {product.stock}</div>
        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
        {message && <div className="cart-message">{message}</div>}
      </div>
    </div>
  )
}

export default ProductCard
