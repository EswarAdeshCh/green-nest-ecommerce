const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["indoor-plants", "outdoor-plants", "pots", "tools", "seeds", "care-kits"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
      match: [/^https?:\/\/.+/, "Please enter a valid image URL"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    tags: [String],
    specifications: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  },
)

// Index for search functionality
productSchema.index({ name: "text", description: "text" })
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })
productSchema.index({ featured: 1 })

module.exports = mongoose.model("Product", productSchema)
