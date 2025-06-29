"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import ProductCard from "../components/ProductCard"


const Products = () => {
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortFilter, setSortFilter] = useState("")

  const location = useLocation()
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products?limit=100`)

        if (response.data.success) {
          setAllProducts(response.data.products)
          setFilteredProducts(response.data.products)

          // Log category breakdown for debugging
          const categoryCount = {}
          response.data.products.forEach((product) => {
            categoryCount[product.category] = (categoryCount[product.category] || 0) + 1
          })
          console.log("Products by category:", categoryCount)
          console.log("Total products loaded:", response.data.products.length)
        }
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    // Check for category filter from URL
    const params = new URLSearchParams(location.search)
    const categoryParam = params.get("category")
    if (categoryParam) {
      setCategoryFilter(categoryParam)
    }
  }, [location])

  useEffect(() => {
    // Filter and sort products whenever filters change
    const filtered = allProducts.filter((product) => {
      const matchesCategory = !categoryFilter || product.category === categoryFilter
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesCategory && matchesSearch
    })

    // Sort products
    switch (sortFilter) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [allProducts, categoryFilter, searchTerm, sortFilter])

  const handleSearch = () => {
    // Search is handled by useEffect
  }

  if (loading) {
    return <div className="loading">Loading products...</div>
  }

  return (
    <section className="products-section">
      <div className="container">
        <h1>Our Products</h1>

        {/* Search and Filters */}
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="filter-options">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              <option value="indoor-plants">Indoor Plants</option>
              <option value="outdoor-plants">Outdoor Plants</option>
              <option value="pots">Decorative Pots</option>
              <option value="tools">Gardening Tools</option>
              <option value="seeds">Seeds</option>
              <option value="care-kits">Plant Care Kits</option>
            </select>
            <select value={sortFilter} onChange={(e) => setSortFilter(e.target.value)}>
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">No products found matching your criteria.</div>
          ) : (
            filteredProducts.map((product) => <ProductCard key={product._id} product={product} />)
          )}
        </div>
      </div>
    </section>
  )
}

export default Products
