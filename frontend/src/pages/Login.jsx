"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const result = await login(formData.email, formData.password)

    if (result.success) {
      setMessage("Login successful! Redirecting...")
      setTimeout(() => {
        if (result.user.role === "admin") {
          navigate("/admin")
        } else {
          navigate("/")
        }
      }, 1500)
    } else {
      setMessage(result.message)
    }

    setLoading(false)
  }

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-form">
          <h2>Welcome Back</h2>
          <p>Sign in to your GreenNest account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Sign up here</Link>
            </p>
          </div>

          {message && (
            <div className={`message ${message.includes("successful") ? "success" : "error"}`}>{message}</div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Login
