"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
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

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match")
      setLoading(false)
      return
    }

    const result = await register(formData.name, formData.email, formData.password)

    if (result.success) {
      setMessage(result.message)
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } else {
      setMessage(result.message)
    }

    setLoading(false)
  }

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-form">
          <h2>Join GreenNest</h2>
          <p>Create your account to start shopping</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

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
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login">Sign in here</Link>
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

export default Register
