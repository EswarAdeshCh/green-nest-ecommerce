"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import ProductCard from "../components/ProductCard"


const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products?limit=100`)

        if (response.data.success) {
          // Filter for featured products or show first 6
          const featured = response.data.products.filter((product) => product.featured).slice(0, 6)
          if (featured.length === 0) {
            setFeaturedProducts(response.data.products.slice(0, 6))
          } else {
            setFeaturedProducts(featured)
          }
        }
      } catch (error) {
        console.error("Error loading featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  const filterByCategory = (category) => {
    window.location.href = `/products?category=${category}`
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Your Garden Paradise</h1>
          <p>Discover the finest collection of plants, tools, and everything you need to create your perfect garden</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            <div className="category-card" onClick={() => filterByCategory("indoor-plants")}>
              <i className="fas fa-seedling"></i>
              <h3>Indoor Plants</h3>
              <p>Beautiful houseplants for your home</p>
            </div>
            <div className="category-card" onClick={() => filterByCategory("outdoor-plants")}>
              <i className="fas fa-tree"></i>
              <h3>Outdoor Plants</h3>
              <p>Hardy plants for your garden</p>
            </div>
            <div className="category-card" onClick={() => filterByCategory("pots")}>
              <i className="fas fa-vase"></i>
              <h3>Decorative Pots</h3>
              <p>Stylish containers for your plants</p>
            </div>
            <div className="category-card" onClick={() => filterByCategory("tools")}>
              <i className="fas fa-tools"></i>
              <h3>Gardening Tools</h3>
              <p>Essential tools for gardening</p>
            </div>
            <div className="category-card" onClick={() => filterByCategory("seeds")}>
              <i className="fas fa-leaf"></i>
              <h3>Seeds</h3>
              <p>Start your garden from scratch</p>
            </div>
            <div className="category-card" onClick={() => filterByCategory("care-kits")}>
              <i className="fas fa-box"></i>
              <h3>Plant Care Kits</h3>
              <p>Everything for plant maintenance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
