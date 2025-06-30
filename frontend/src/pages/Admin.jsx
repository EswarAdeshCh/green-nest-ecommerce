"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"


const Admin = () => {
  const [currentTab, setCurrentTab] = useState("products")
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "",
  })

  const { token } = useAuth()
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (currentTab === "products") {
      loadProducts()
    } else if (currentTab === "orders") {
      loadOrders()
    }
  }, [currentTab])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        setProducts(response.data.products)
      }
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        setOrders(response.data.orders)
      }
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
      }

      const response = await axios.post(`${API_BASE_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        alert("Product added successfully!")
        setFormData({
          name: "",
          price: "",
          category: "",
          stock: "",
          image: "",
          description: "",
        })
        loadProducts()
      } else {
        alert("Failed to add product: " + response.data.message)
      }
    } catch (error) {
      console.error("Add product error:", error)
      alert("Failed to add product. Please try again.")
    }
  }

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        alert("Product deleted successfully!")
        loadProducts()
      } else {
        alert("Failed to delete product: " + response.data.message)
      }
    } catch (error) {
      console.error("Delete product error:", error)
      alert("Failed to delete product. Please try again.")
    }
  }

  return (
    <section className="admin-section">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="admin-tabs">
          <button
            className={`tab-button ${currentTab === "products" ? "active" : ""}`}
            onClick={() => setCurrentTab("products")}
          >
            Products
          </button>
          <button
            className={`tab-button ${currentTab === "orders" ? "active" : ""}`}
            onClick={() => setCurrentTab("orders")}
          >
            Orders
          </button>
          <button
            className={`tab-button ${currentTab === "add-product" ? "active" : ""}`}
            onClick={() => setCurrentTab("add-product")}
          >
            Add Product
          </button>
        </div>

        {/* Products Tab */}
        {currentTab === "products" && (
          <div className="tab-content">
            <h3>Manage Products</h3>
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : (
              <div className="admin-products-grid">
                {products.map((product) => (
                  <div key={product._id} className="admin-product-card">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150x150?text=Product"
                      }}
                    />
                    <h4>{product.name}</h4>
                    <p>Price: ₹{product.price.toFixed(2)}</p>
                    <p>Category: {product.category}</p>
                    <p>Stock: {product.stock}</p>
                    <div className="admin-product-actions">
                      <button
                        className="edit-btn"
                        onClick={() => alert("Edit functionality would be implemented here")}
                      >
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => deleteProduct(product._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {currentTab === "orders" && (
          <div className="tab-content">
            <h3>Customer Orders</h3>
            {loading ? (
              <div className="loading">Loading orders...</div>
            ) : (
              <div className="admin-orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="order-header">
                      <h4>Order #{order._id.slice(-8)}</h4>
                      <span className={`order-status ${order.status}`}>{order.status}</span>
                    </div>
                    <p>
                      <strong>Customer:</strong> {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.shippingInfo.email}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{order.total.toFixed(2)}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <div className="order-items">
                      <strong>Items:</strong>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.product.name} × {item.quantity} - ₹{(item.product.price * item.quantity).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Product Tab */}
        {currentTab === "add-product" && (
          <div className="tab-content">
            <h3>Add New Product</h3>
            <form onSubmit={handleAddProduct} className="admin-form">
              <div className="form-group">
                <label htmlFor="productName">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productPrice">Price (₹)</label>
                <input
                  type="number"
                  id="productPrice"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productCategory">Category</label>
                <select
                  id="productCategory"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="indoor-plants">Indoor Plants</option>
                  <option value="outdoor-plants">Outdoor Plants</option>
                  <option value="pots">Decorative Pots</option>
                  <option value="tools">Gardening Tools</option>
                  <option value="seeds">Seeds</option>
                  <option value="care-kits">Plant Care Kits</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="productStock">Stock Quantity</label>
                <input
                  type="number"
                  id="productStock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productImage">Image URL</label>
                <input
                  type="url"
                  id="productImage"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productDescription">Description</label>
                <textarea
                  id="productDescription"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <button type="submit" className="admin-button">
                Add Product
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}

export default Admin
