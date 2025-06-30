const express = require("express")
const { body, validationResult } = require("express-validator")
const Order = require("../models/Order")
const Product = require("../models/Product")
const { verifyToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

// Create order
router.post(
  "/",
  verifyToken,
  [
    body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),
    body("items.*.productId").isMongoId().withMessage("Invalid product ID"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("shippingInfo.firstName").trim().isLength({ min: 1 }).withMessage("First name is required"),
    body("shippingInfo.lastName").trim().isLength({ min: 1 }).withMessage("Last name is required"),
    body("shippingInfo.email").isEmail().withMessage("Valid email is required"),
    body("shippingInfo.phone").isMobilePhone().withMessage("Valid phone number is required"),
    body("shippingInfo.address").trim().isLength({ min: 5 }).withMessage("Address is required"),
    body("shippingInfo.city").trim().isLength({ min: 1 }).withMessage("City is required"),
    body("shippingInfo.state").trim().isLength({ min: 1 }).withMessage("State is required"),
    body("shippingInfo.zipCode").isLength({ min: 5, max: 10 }).withMessage("Valid ZIP code is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { items, shippingInfo } = req.body

      console.log("Creating order for user:", req.user._id)
      console.log("Order items:", items)
      console.log("Shipping info:", shippingInfo)

      // Get product details and validate stock
      const productIds = items.map((item) => item.productId)
      const products = await Product.find({ _id: { $in: productIds } })

      if (products.length !== items.length) {
        return res.status(400).json({
          success: false,
          message: "Some products were not found",
        })
      }

      // Validate stock and calculate totals
      const orderItems = []
      let subtotal = 0

      for (const item of items) {
        const product = products.find((p) => p._id.toString() === item.productId)

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          })
        }

        const itemTotal = product.price * item.quantity
        subtotal += itemTotal

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        })

        // Update product stock
        product.stock -= item.quantity
        await product.save()
        console.log(`Updated stock for ${product.name}: ${product.stock}`)
      }

      const shipping = 99.99 // Updated shipping cost for India
      const total = subtotal + shipping

      // Create order
      const order = new Order({
        user: req.user._id,
        items: orderItems,
        shippingInfo,
        subtotal,
        shipping,
        total,
      })

      const savedOrder = await order.save()
      console.log("Order created successfully:", savedOrder._id)

      // Populate product details for response
      await savedOrder.populate("items.product")

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: savedOrder,
      })
    } catch (error) {
      console.error("Create order error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while creating order",
        error: error.message,
      })
    }
  },
)

// Get user orders
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    console.log("Fetching orders for user:", req.user._id)

    const orders = await Order.find({ user: req.user._id }).populate("items.product").sort({ createdAt: -1 })

    console.log(`Found ${orders.length} orders for user ${req.user._id}`)

    res.json({
      success: true,
      orders,
      count: orders.length,
    })
  } catch (error) {
    console.error("Get user orders error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
      error: error.message,
    })
  }
})

// Get all orders (Admin only)
router.get("/admin", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query

    const filter = {}
    if (status) filter.status = status

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit))
      .skip(skip)

    const total = await Order.countDocuments(filter)

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
    })
  } catch (error) {
    console.error("Get admin orders error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    })
  }
})

// Update order status (Admin only)
router.put(
  "/:id/status",
  verifyToken,
  requireAdmin,
  [body("status").isIn(["pending", "processing", "shipped", "delivered", "cancelled"]).withMessage("Invalid status")],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { status } = req.body

      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("items.product")

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        })
      }

      res.json({
        success: true,
        message: "Order status updated successfully",
        order,
      })
    } catch (error) {
      console.error("Update order status error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while updating order status",
      })
    }
  },
)

// Get single order
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product").populate("user", "name email")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    res.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Get order error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching order",
    })
  }
})

module.exports = router
