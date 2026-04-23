// ============================================
// FARM AI BUILDER — Express Backend Server
// Nearby Markets & Live Prices API
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MARKETPLACES } = require('./marketplaces-data');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// ── In-Memory Cache ──
const cache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  return null;
}

function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

// ── Haversine Distance (km) ──
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// ── Simulated Live Prices ──
const BASE_PRICES = {
  "Rice": 2183, "Wheat": 2275, "Maize": 2090, "Bajra": 2500, "Jowar": 3180,
  "Ragi": 3846, "Gram": 5440, "Mustard": 5650, "Soybean": 4600, "Cotton": 6620,
  "Sugarcane": 315, "Groundnut": 6377, "Onion": 1800, "Potato": 1200,
  "Tomato": 2500, "Banana": 2200, "Mango": 4500, "Apple": 12000,
  "Coconut": 2800, "Tea": 22000, "Coffee": 28000, "Turmeric": 15000,
  "Ginger": 18000, "Chilli": 12500, "Cumin": 32000, "Cardamom": 125000,
  "Pepper": 65000, "Rubber": 17500, "Jute": 5050, "Tobacco": 6500,
  "Castor": 6540, "Sunflower": 6760, "Barley": 1735, "Lentil": 6425,
  "Vegetables": 2800, "Fruits": 5500, "Flowers": 8500, "Spices": 15000,
  "Grains": 2400, "Pulses": 6200, "Oilseeds": 5800, "Fish": 22000,
  "Fennel": 14000, "Ajwain": 18000, "Isabgol": 12000, "Cashew": 85000,
  "Guava": 3500, "Litchi": 8000, "Pineapple": 3200, "Grapes": 8500,
  "Orange": 4000, "Basmati Rice": 3800, "Basmati": 3800, "Guar": 5500,
  "Moth": 7200, "Coriander": 8500, "Garlic": 6800, "Raisins": 18000,
  "Tapioca": 2800, "Jaggery": 4200, "Opium": 95000, "Organic Produce": 6500,
  "Stone Fruits": 9000, "Pomegranate": 11000, "Sapota": 4200, "Jackfruit": 3000,
  "Red Gram": 7000, "Black Gram": 6950, "Moong": 8558, "Safflower": 5700,
  "Arecanut": 55000, "Date Palm": 8500, "Oil Palm": 12000
};

function generateLivePrices(crops) {
  const now = new Date();
  return crops.map(crop => {
    const basePrice = BASE_PRICES[crop] || 3000;
    // Add small random variance ±8%
    const variance = basePrice * (Math.random() * 0.16 - 0.08);
    const price = Math.round(basePrice + variance);
    const change = ((price - basePrice) / basePrice * 100).toFixed(1);
    const trend = change > 1 ? 'up' : change < -1 ? 'down' : 'stable';

    // Random "last updated" within last 2 hours
    const updatedAt = new Date(now.getTime() - Math.random() * 7200000);

    return {
      crop,
      price,
      unit: '₹/quintal',
      trend,
      change: (change >= 0 ? '+' : '') + change + '%',
      lastUpdated: updatedAt.toISOString()
    };
  });
}

// ══════════════════════════════════════════
//  API ROUTES
// ══════════════════════════════════════════

// GET /api/nearby-markets
app.get('/api/nearby-markets', (req, res) => {
  const { lat, lng, radius = 100 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      status: 'error',
      message: 'lat and lng query parameters are required'
    });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const maxRadius = parseFloat(radius);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid lat/lng values'
    });
  }

  // Check cache
  const cacheKey = `markets_${userLat.toFixed(2)}_${userLng.toFixed(2)}_${maxRadius}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  // Calculate distances and filter
  const marketsWithDistance = MARKETPLACES
    .map(market => {
      const distance = haversineDistance(userLat, userLng, market.lat, market.lng);
      return { ...market, distance: Math.round(distance * 10) / 10 };
    })
    .filter(m => m.distance <= maxRadius)
    .sort((a, b) => a.distance - b.distance);

  const result = {
    status: 'ok',
    userLocation: { lat: userLat, lng: userLng },
    radius: maxRadius,
    total: marketsWithDistance.length,
    markets: marketsWithDistance,
    timestamp: new Date().toISOString()
  };

  setCache(cacheKey, result);
  res.json(result);
});

// GET /api/live-prices
app.get('/api/live-prices', (req, res) => {
  const { market } = req.query;

  if (!market) {
    return res.status(400).json({
      status: 'error',
      message: 'market query parameter is required'
    });
  }

  // Check cache
  const cacheKey = `prices_${market}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  // Find the marketplace
  const marketplace = MARKETPLACES.find(m =>
    m.id === market || m.name.toLowerCase() === market.toLowerCase()
  );

  if (!marketplace) {
    return res.status(404).json({
      status: 'error',
      message: 'Marketplace not found'
    });
  }

  const prices = generateLivePrices(marketplace.crops);

  const result = {
    status: 'ok',
    market: {
      id: marketplace.id,
      name: marketplace.name,
      address: marketplace.address
    },
    prices,
    total: prices.length,
    timestamp: new Date().toISOString()
  };

  setCache(cacheKey, result);
  res.json(result);
});

// GET /api/maps-key (return API key for frontend)
app.get('/api/maps-key', (req, res) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || key === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return res.json({ status: 'no_key', key: null });
  }
  res.json({ status: 'ok', key });
});

// GET /api/all-markets (return all markets, no location needed)
app.get('/api/all-markets', (req, res) => {
  res.json({
    status: 'ok',
    total: MARKETPLACES.length,
    markets: MARKETPLACES,
    timestamp: new Date().toISOString()
  });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`\n🌾 Farm AI Builder Server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET /api/nearby-markets?lat=28.61&lng=77.20&radius=100`);
  console.log(`   GET /api/live-prices?market=azadpur`);
  console.log(`   GET /api/maps-key`);
  console.log(`   GET /api/all-markets\n`);
});
