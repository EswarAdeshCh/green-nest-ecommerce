const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require('dotenv').config({ path: '../.env' });


const User = require("../models/User");
const Product = require("../models/Product");

const sampleProducts = [
  {
    name: "Monstera Deliciosa",
    description:
      "Beautiful large-leafed indoor plant perfect for bright, indirect light. Easy to care for and grows quickly.",
    price: 2499.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    stock: 25,
    featured: true,
  },
  {
    name: "Snake Plant (Sansevieria)",
    description:
      "Low-maintenance indoor plant that thrives in low light conditions. Perfect for beginners.",
    price: 1659.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=400&fit=crop",
    stock: 30,
    featured: true,
  },
  {
    name: "Peace Lily",
    description:
      "Elegant white flowers and glossy green leaves. Great air purifier for indoor spaces.",
    price: 1899.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=400&h=400&fit=crop",
    stock: 20,
    featured: true,
  },
  {
    name: "ZZ Plant",
    description:
      "Extremely low maintenance plant that tolerates neglect and low light conditions.",
    price: 1799.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=400&h=400&fit=crop",
    stock: 22,
  },
  {
    name: "Pothos Golden",
    description:
      "Trailing vine with heart-shaped leaves. Perfect for hanging baskets or shelves.",
    price: 1299.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop",
    stock: 35,
  },
  {
    name: "Spider Plant",
    description:
      "Easy-to-grow plant that produces baby plants. Great for beginners.",
    price: 999.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&h=400&fit=crop",
    stock: 40,
  },
  {
    name: "Philodendron Heartleaf",
    description:
      "Heart-shaped leaves on trailing vines. Perfect for hanging or climbing.",
    price: 1399.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    stock: 28,
  },
  {
    name: "Boston Fern",
    description: "Lush, feathery fronds that add tropical feel to any room.",
    price: 1599.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=400&fit=crop",
    stock: 20,
  },
  {
    name: "Aloe Vera",
    description:
      "Medicinal succulent with healing properties. Very low maintenance.",
    price: 899.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1636687987347-06b9b7f60d68?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    stock: 45,
  },
  {
    name: "Jade Plant",
    description:
      "Lucky succulent with thick, glossy leaves. Symbol of prosperity.",
    price: 1199.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=400&fit=crop",
    stock: 35,
  },
  {
    name: "Chinese Money Plant",
    description:
      "Round, coin-shaped leaves on delicate stems. Modern and trendy.",
    price: 1499.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=400&h=400&fit=crop",
    stock: 25,
  },
  {
    name: "Dracaena Marginata",
    description: "Spiky leaves with red edges. Adds architectural interest.",
    price: 2299.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=400&h=400&fit=crop",
    stock: 15,
  },
  {
    name: "Bird of Paradise",
    description: "Large tropical leaves that split naturally. Statement plant.",
    price: 3499.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=400&h=400&fit=crop",
    stock: 10,
  },
  {
    name: "Anthurium Red",
    description: "Glossy red heart-shaped flowers. Long-lasting blooms.",
    price: 2199.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    stock: 18,
  },
  {
    name: "Bamboo Palm",
    description: "Elegant palm with bamboo-like stems. Great air purifier.",
    price: 2899.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&h=400&fit=crop",
    stock: 14,
  },
  {
    name: "Parlor Palm",
    description: "Compact palm perfect for low light conditions.",
    price: 1899.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=400&h=400&fit=crop",
    stock: 22,
  },
  {
    name: "English Ivy",
    description: "Classic trailing vine with variegated leaves.",
    price: 1099.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop",
    stock: 30,
  },
  {
    name: "Croton Petra",
    description:
      "Colorful leaves in yellow, red, and green. Bright light lover.",
    price: 1799.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    stock: 16,
  },
  {
    name: "Schefflera Umbrella Tree",
    description: "Glossy umbrella-shaped leaves. Fast-growing and forgiving.",
    price: 2399.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&h=400&fit=crop",
    stock: 20,
  },
  {
    name: "Dieffenbachia Dumb Cane",
    description: "Large variegated leaves with cream and green patterns.",
    price: 1699.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=400&h=400&fit=crop",
    stock: 24,
  },
  {
    name: "Haworthia Zebra Plant",
    description: "Small succulent with white stripes. Perfect for desks.",
    price: 799.0,
    category: "indoor-plants",
    image:
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=400&fit=crop",
    stock: 50,
  },


  {
    name: "Lavender Plant",
    description:
      "Fragrant purple flowers that attract butterflies. Great for borders and herb gardens.",
    price: 1410.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&h=400&fit=crop",
    stock: 35,
  },
  {
    name: "Jasmine Plant",
    description:
      "Fragrant white flowers with sweet scent. Perfect for garden borders.",
    price: 1599.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    stock: 25,
  },
  {
    name: "Bougainvillea",
    description:
      "Vibrant colored bracts in pink, purple, or red. Excellent for walls and fences.",
    price: 1899.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    stock: 15,
  },
  {
    name: "Hibiscus Plant",
    description:
      "Large, showy flowers in various colors. Blooms continuously in warm weather.",
    price: 1699.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=400&fit=crop",
    stock: 20,
  },
  {
    name: "Petunia Mix",
    description:
      "Colorful trumpet-shaped flowers in various colors. Great for borders.",
    price: 699.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    stock: 45,
  },

  {
    name: "Camellia Pink",
    description: "Elegant pink flowers with glossy evergreen leaves.",
    price: 2499.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    stock: 12,
  },
  {
    name: "Azalea Bush",
    description: "Spring-blooming shrub with masses of colorful flowers.",
    price: 1999.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    stock: 18,
  },
  {
    name: "Hydrangea Blue",
    description:
      "Large blue flower clusters that change color based on soil pH.",
    price: 2299.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=400&fit=crop",
    stock: 15,
  },
  {
    name: "Clematis Vine",
    description:
      "Climbing vine with large purple flowers. Perfect for trellises.",
    price: 1799.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    stock: 20,
  },
  {
    name: "Mint Plant",
    description: "Aromatic herb perfect for teas and cooking. Spreads quickly.",
    price: 599.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&h=400&fit=crop",
    stock: 60,
  },
  {
    name: "Rosemary Bush",
    description: "Evergreen herb with needle-like leaves. Great for cooking.",
    price: 899.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&h=400&fit=crop",
    stock: 40,
  },
  {
    name: "Thyme Creeping",
    description:
      "Low-growing herb that spreads as ground cover. Fragrant leaves.",
    price: 799.0,
    category: "outdoor-plants",
    image:
      "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&h=400&fit=crop",
    stock: 35,
  },
  {
    name: "Ceramic Planter White Large",
    description:
      "Modern white ceramic planter with drainage hole. Perfect for large plants.",
    price: 2905.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    stock: 18,
  },
  {
    name: "Terracotta Pot Set Small",
    description:
      "Set of 3 small terracotta pots. Classic design with excellent drainage.",
    price: 1908.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 25,
    featured: true,
  },
  {
    name: "Hanging Macrame Planter Natural",
    description: "Handwoven natural macrame plant hanger. Adds bohemian style.",
    price: 1577.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=400&fit=crop",
    stock: 12,
  },
  {
    name: "Modern Black Ceramic Planter",
    description: "Sleek black ceramic planter with minimalist design.",
    price: 3299.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    stock: 15,
  },
  {
    name: "Wooden Planter Box Rectangle",
    description:
      "Rustic wooden planter box perfect for herbs. Weather-resistant.",
    price: 2499.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 20,
  },
  {
    name: "Metal Planter Vintage Bronze",
    description: "Ornate bronze metal planter with vintage design.",
    price: 3599.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    stock: 10,
  },
  {
    name: "Concrete Planter Modern Grey",
    description: "Industrial-style concrete planter. Very durable.",
    price: 2799.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 14,
  },
  {
    name: "Fiberglass Planter White Round",
    description: "Lightweight fiberglass planter. Weather resistant.",
    price: 1999.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    stock: 22,
  },
  {
    name: "Bamboo Planter Eco-Friendly",
    description: "Sustainable bamboo planter with natural finish.",
    price: 1699.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 18,
  },
  {
    name: "Glass Terrarium Globe",
    description: "Clear glass terrarium perfect for succulents.",
    price: 1299.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=400&fit=crop",
    stock: 25,
  },
  {
    name: "Ceramic Planter Blue Glazed",
    description: "Beautiful blue glazed ceramic pot with drainage.",
    price: 2199.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    stock: 16,
  },
  {
    name: "Wicker Basket Planter",
    description: "Natural wicker basket with plastic liner.",
    price: 1399.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 20,
  },
  {
    name: "Self-Watering Planter White",
    description: "Smart planter with built-in water reservoir.",
    price: 3999.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    stock: 8,
  },
  {
    name: "Hanging Ceramic Planter Set",
    description: "Set of 3 hanging ceramic planters in different sizes.",
    price: 2899.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=400&fit=crop",
    stock: 12,
  },
  {
    name: "Copper Planter Vintage Style",
    description: "Aged copper planter with patina finish.",
    price: 4299.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    stock: 6,
  },
  {
    name: "Plastic Planter Lightweight Black",
    description: "Durable plastic planter that looks like ceramic.",
    price: 899.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 30,
  },
  {
    name: "Stone Planter Natural Grey",
    description: "Heavy stone planter for outdoor use.",
    price: 5999.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    stock: 5,
  },
  {
    name: "Ceramic Planter Textured White",
    description: "White ceramic planter with textured surface.",
    price: 2599.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 15,
  },
  {
    name: "Window Box Planter Long",
    description: "Long rectangular planter perfect for windows.",
    price: 1899.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    stock: 18,
  },
  {
    name: "Mosaic Planter Colorful",
    description: "Hand-crafted mosaic planter with colorful tiles.",
    price: 3499.0,
    category: "pots",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 8,
  },

  {
    name: "Garden Trowel Set Professional",
    description: "Professional 3-piece trowel set with ergonomic handles.",
    price: 1328.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 50,
  },
  {
    name: "Watering Can Copper 2L",
    description: "Beautiful copper watering can with long spout.",
    price: 2078.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop",
    stock: 30,
    featured: true,
  },
  {
    name: "Pruning Shears Professional",
    description: "Sharp, durable pruning shears with safety lock.",
    price: 2074.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400&h=400&fit=crop",
    stock: 22,
  },
  {
    name: "Garden Gloves Leather",
    description: "Premium leather gardening gloves for protection.",
    price: 1299.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 45,
  },
  {
    name: "Garden Hose 25m Heavy Duty",
    description: "Heavy-duty garden hose with spray nozzle attachment.",
    price: 3599.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop",
    stock: 18,
  },
  {
    name: "Soil pH Meter Digital",
    description: "Digital soil pH meter with LCD display.",
    price: 1799.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400&h=400&fit=crop",
    stock: 25,
  },
  {
    name: "Garden Fork Steel",
    description: "Heavy-duty steel garden fork for soil preparation.",
    price: 1899.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 20,
  },
  {
    name: "Hand Cultivator 3-Prong",
    description: "3-prong hand cultivator for weeding and soil breaking.",
    price: 899.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400&h=400&fit=crop",
    stock: 35,
  },
  {
    name: "Garden Rake Steel",
    description: "Steel garden rake for leveling and debris removal.",
    price: 1599.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 25,
  },
  {
    name: "Plant Mister Spray Bottle",
    description: "Fine mist spray bottle for plant care.",
    price: 599.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop",
    stock: 40,
  },
  {
    name: "Garden Kneeler Pad",
    description: "Comfortable kneeling pad for garden work.",
    price: 799.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 30,
  },
  {
    name: "Wheelbarrow Small Garden",
    description: "Compact wheelbarrow perfect for small gardens.",
    price: 4999.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400&h=400&fit=crop",
    stock: 8,
  },
  {
    name: "Garden Scissors Precision",
    description: "Precision scissors for delicate pruning work.",
    price: 1199.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 28,
  },
  {
    name: "Soil Thermometer Long",
    description: "Long soil thermometer for monitoring soil temperature.",
    price: 899.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400&h=400&fit=crop",
    stock: 20,
  },
  {
    name: "Garden Tool Storage Bag",
    description: "Canvas storage bag for organizing garden tools.",
    price: 1499.0,
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop",
    stock: 15,
  },

  {
    name: "Herb Garden Seed Collection",
    description: "Complete collection with 8 herb varieties and growing guide.",
    price: 1245.0,
    category: "seeds",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 45,
    featured: true,
  },
  {
    name: "Wildflower Meadow Mix",
    description:
      "Native wildflower mix for creating pollinator-friendly gardens.",
    price: 747.0,
    category: "seeds",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    stock: 60,
  },

 
  {
    name: "Mint Seeds Organic",
    description: "Organic mint seeds for fresh herbs. Easy to grow.",
    price: 599.0,
    category: "seeds",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 80,
  },
  {
    name: "Butterfly Garden Seed Mix",
    description: "Special mix of flowers that attract butterflies.",
    price: 999.0,
    category: "seeds",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    stock: 50,
  },
  
  {
    name: "Complete Plant Care Starter Kit",
    description:
      "Everything needed for plant care: fertilizer, tools, and guide.",
    price: 1659.0,
    category: "care-kits",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 35,
  },
  {
    name: "Succulent Care Specialist Kit",
    description: "Specialized care kit with succulent soil and fertilizer.",
    price: 1410.0,
    category: "care-kits",
    image:
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=400&fit=crop",
    stock: 28,
  },
  {
    name: "Orchid Care Premium Kit",
    description:
      "Premium orchid care with bark mix and specialized fertilizer.",
    price: 2074.0,
    category: "care-kits",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    stock: 20,
  },
  {
    name: "Indoor Plant Care Complete",
    description: "Complete indoor plant care with fertilizer and accessories.",
    price: 1899.0,
    category: "care-kits",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 30,
  },
  {
    name: "Organic Fertilizer Premium Set",
    description: "Premium organic fertilizers for all plant types.",
    price: 2299.0,
    category: "care-kits",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    stock: 25,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    await Product.deleteMany({});
    console.log("Cleared existing data");
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < sampleProducts.length; i++) {
      try {
        const product = new Product(sampleProducts[i]);
        await product.save();
        successCount++;
        console.log(`✓ Product ${i + 1}: ${sampleProducts[i].name}`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Product ${i + 1} failed: ${sampleProducts[i].name}`);
        console.error(`  Error: ${error.message}`);
      }
    }

    console.log(`\n=== Database Seeding Complete ===`);
    console.log(`✓ Successfully inserted: ${successCount} products`);
    console.log(`✗ Failed to insert: ${errorCount} products`);
    console.log(`Total products in database: ${await Product.countDocuments()}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();