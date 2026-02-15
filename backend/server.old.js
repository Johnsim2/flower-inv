// server.js
// This is your main server file - it handles all API requests

// ============================================
// 1. IMPORT REQUIRED PACKAGES
// ============================================

// Load environment variables from .env file
require('dotenv').config();

// Express: web server framework
const express = require('express');

// CORS: allows your React app (different port) to connect to this API
const cors = require('cors');

// PostgreSQL client
const { Pool } = require('pg');

// ============================================
// 2. CREATE EXPRESS APP
// ============================================

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// 3. MIDDLEWARE (processes requests before they reach your routes)
// ============================================

// Parse JSON bodies (when React sends data to your API)
app.use(express.json());

// Enable CORS (allows React to make requests)
app.use(cors());

// ============================================
// 4. DATABASE CONNECTION
// ============================================

// Create a connection pool to PostgreSQL
// A pool manages multiple database connections efficiently
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully at', res.rows[0].now);
  }
});

// ============================================
// 5. API ROUTES (your endpoints)
// ============================================

// ------------------------------
// ROOT ROUTE (test that server is running)
// ------------------------------
app.get('/', (req, res) => {
  res.json({ 
    message: 'Flower Inventory API is running!',
    version: '1.0.0'
  });
});

// ------------------------------
// PLANT NAMES ROUTES
// ------------------------------

// GET all botanical names
app.get('/api/plant-names', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM plant_names ORDER BY botanical_name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching plant names:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new botanical name
app.post('/api/plant-names', async (req, res) => {
  const { botanical_name, common_name } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO plant_names (botanical_name, common_name) VALUES ($1, $2) RETURNING *',
      [botanical_name, common_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating plant name:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ------------------------------
// BREEDERS ROUTES
// ------------------------------

// GET all breeders
app.get('/api/breeders', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM breeders ORDER BY name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching breeders:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new breeder
app.post('/api/breeders', async (req, res) => {
  const { name, country, website } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO breeders (name, country, website) VALUES ($1, $2, $3) RETURNING *',
      [name, country, website]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating breeder:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ------------------------------
// PLANTS ROUTES (main inventory)
// ------------------------------

// GET all plants (with JOIN to show botanical names and breeders)
app.get('/api/plants', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        pn.botanical_name,
        pn.common_name,
        b.name as breeder_name
      FROM plants p
      LEFT JOIN plant_names pn ON p.plant_name_id = pn.id
      LEFT JOIN breeders b ON p.breeder_id = b.id
      WHERE p.is_active = true
      ORDER BY p.variety_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching plants:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET single plant by ID
app.get('/api/plants/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        pn.botanical_name,
        pn.common_name,
        b.name as breeder_name
      FROM plants p
      LEFT JOIN plant_names pn ON p.plant_name_id = pn.id
      LEFT JOIN breeders b ON p.breeder_id = b.id
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching plant:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new plant
app.post('/api/plants', async (req, res) => {
  const {
    plant_name_id,
    variety_name,
    identification_code,
    breeder_id,
    year_introduced,
    flower_color,
    flowering_time,
    growing_habit,
    growth_intensity,
    flower_type,
    flower_size,
    starting_stage,
    current_quantity,
    minimum_stock_level,
    notes
  } = req.body;
  
  try {
    const result = await pool.query(`
      INSERT INTO plants (
        plant_name_id, variety_name, identification_code, breeder_id,
        year_introduced, flower_color, flowering_time, growing_habit,
        growth_intensity, flower_type, flower_size, starting_stage,
        current_quantity, minimum_stock_level, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      plant_name_id, variety_name, identification_code, breeder_id,
      year_introduced, flower_color, flowering_time, growing_habit,
      growth_intensity, flower_type, flower_size, starting_stage,
      current_quantity, minimum_stock_level, notes
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating plant:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update plant
app.put('/api/plants/:id', async (req, res) => {
  const { id } = req.params;
  const {
    plant_name_id,
    variety_name,
    identification_code,
    breeder_id,
    year_introduced,
    flower_color,
    flowering_time,
    growing_habit,
    growth_intensity,
    flower_type,
    flower_size,
    starting_stage,
    current_quantity,
    minimum_stock_level,
    notes
  } = req.body;
  
  try {
    const result = await pool.query(`
      UPDATE plants SET
        plant_name_id = $1,
        variety_name = $2,
        identification_code = $3,
        breeder_id = $4,
        year_introduced = $5,
        flower_color = $6,
        flowering_time = $7,
        growing_habit = $8,
        growth_intensity = $9,
        flower_type = $10,
        flower_size = $11,
        starting_stage = $12,
        current_quantity = $13,
        minimum_stock_level = $14,
        notes = $15,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING *
    `, [
      plant_name_id, variety_name, identification_code, breeder_id,
      year_introduced, flower_color, flowering_time, growing_habit,
      growth_intensity, flower_type, flower_size, starting_stage,
      current_quantity, minimum_stock_level, notes, id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating plant:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE plant (soft delete - sets is_active to false)
app.delete('/api/plants/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'UPDATE plants SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    
    res.json({ message: 'Plant deleted successfully' });
  } catch (err) {
    console.error('Error deleting plant:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ------------------------------
// STOCK MOVEMENTS ROUTES (for future use)
// ------------------------------

// GET stock movements for a plant
app.get('/api/plants/:id/movements', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM stock_movements WHERE plant_id = $1 ORDER BY movement_date DESC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stock movements:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new stock movement
app.post('/api/stock-movements', async (req, res) => {
  const { plant_id, movement_type, quantity, movement_date, reason, notes } = req.body;
  
  try {
    // Start a transaction (ensures both operations succeed or fail together)
    await pool.query('BEGIN');
    
    // Insert the movement record
    const movementResult = await pool.query(
      `INSERT INTO stock_movements (plant_id, movement_type, quantity, movement_date, reason, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [plant_id, movement_type, quantity, movement_date, reason, notes]
    );
    
    // Update the plant's current quantity
    const multiplier = movement_type === 'in' ? 1 : -1;
    await pool.query(
      'UPDATE plants SET current_quantity = current_quantity + $1 WHERE id = $2',
      [quantity * multiplier, plant_id]
    );
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    res.status(201).json(movementResult.rows[0]);
  } catch (err) {
    // Rollback on error
    await pool.query('ROLLBACK');
    console.error('Error creating stock movement:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// 6. START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/...`);
});

// ============================================
// 7. GRACEFUL SHUTDOWN
// ============================================

// Handle shutdown gracefully (close database connections)
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  pool.end();
  process.exit(0);
});
