const express = require("express")
const { body, validationResult, query } = require("express-validator")
const Product = require("../models/Product")
const { verifyToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

// Get all products with filtering and pagination
router.get(
  "/",
  [
    query("category").optional().isIn(["indoor-plants", "outdoor-plants", "pots", "tools", "seeds", "care-kits"]),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
    query("limit").optional().isInt({ min: 1, max: 200 }),
    query("page").optional().isInt({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: errors.array(),
        })
      }

      const { category, minPrice, maxPrice, search, limit = 100, page = 1, sort } = req.query

      // Build filter object
      const filter = {}

      if (category) filter.category = category
      if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = Number.parseFloat(minPrice)
        if (maxPrice) filter.price.$lte = Number.parseFloat(maxPrice)
      }
      if (search) {
        filter.$text = { $search: search }
      }

      // Build sort object
      let sortObj = {}
      switch (sort) {
        case "price-asc":
          sortObj = { price: 1 }
          break
        case "price-desc":
          sortObj = { price: -1 }
          break
        case "name":
          sortObj = { name: 1 }
          break
        case "newest":
          sortObj = { createdAt: -1 }
          break
        default:
          sortObj = { featured: -1, createdAt: -1 }
      }

      const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

      const products = await Product.find(filter).sort(sortObj).limit(Number.parseInt(limit)).skip(skip)

      const total = await Product.countDocuments(filter)

      res.json({
        success: true,
        products,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
          pages: Math.ceil(total / Number.parseInt(limit)),
        },
      })
    } catch (error) {
      console.error("Get products error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while fetching products",
      })
    }
  },
)

// Get products by IDs (for cart)
router.post("/batch", [body("productIds").isArray().withMessage("Product IDs must be an array")], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: errors.array(),
      })
    }

    const { productIds } = req.body

    const products = await Product.find({ _id: { $in: productIds } })

    res.json({
      success: true,
      products,
    })
  } catch (error) {
    console.error("Get batch products error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    })
  }
})

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    })
  }
})

// Create product (Admin only)
router.post(
  "/",
  verifyToken,
  requireAdmin,
  [
    body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Product name must be between 2 and 100 characters"),
    body("description")
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage("Description must be between 10 and 500 characters"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("category")
      .isIn(["indoor-plants", "outdoor-plants", "pots", "tools", "seeds", "care-kits"])
      .withMessage("Invalid category"),
    body("image").isURL().withMessage("Image must be a valid URL"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
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

      const product = new Product(req.body)
      await product.save()

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
      })
    } catch (error) {
      console.error("Create product error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while creating product",
      })
    }
  },
)

// Update product (Admin only)
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  [
    body("name").optional().trim().isLength({ min: 2, max: 100 }),
    body("description").optional().trim().isLength({ min: 10, max: 500 }),
    body("price").optional().isFloat({ min: 0 }),
    body("category").optional().isIn(["indoor-plants", "outdoor-plants", "pots", "tools", "seeds", "care-kits"]),
    body("image").optional().isURL(),
    body("stock").optional().isInt({ min: 0 }),
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

      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        })
      }

      res.json({
        success: true,
        message: "Product updated successfully",
        product,
      })
    } catch (error) {
      console.error("Update product error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while updating product",
      })
    }
  },
)

// Delete product (Admin only)
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    })
  }
})

module.exports = router
