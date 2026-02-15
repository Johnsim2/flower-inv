// UPDATED server.js with Image Upload Support
// This replaces your existing server.js file

// ============================================
// 1. IMPORT REQUIRED PACKAGES
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ============================================
// 2. CREATE EXPRESS APP
// ============================================

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// 3. CREATE UPLOADS DIRECTORY
// ============================================

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// ============================================
// 4. CONFIGURE MULTER FOR FILE UPLOADS
// ============================================

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp-originalname
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// File filter - only accept images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ============================================
// 5. MIDDLEWARE
// ============================================

app.use(express.json());
app.use(cors());

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// ============================================
// 6. DATABASE CONNECTION
// ============================================

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully at', res.rows[0].now);
  }
});

// ============================================
// 7. API ROUTES
// ============================================

// ROOT ROUTE
app.get('/', (req, res) => {
  res.json({ 
    message: 'Flower Inventory API is running!',
    version: '1.1.0 (with image upload support)'
  });
});

// ------------------------------
// PLANT NAMES ROUTES
// ------------------------------

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
// PLANTS ROUTES
// ------------------------------

// GET all plants (now includes primary image)
app.get('/api/plants', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        pn.botanical_name,
        pn.common_name,
        b.name as breeder_name,
        (
          SELECT json_build_object(
            'id', pi.id,
            'image_url', pi.image_url,
            'caption', pi.caption
          )
          FROM plant_images pi
          WHERE pi.plant_id = p.id AND pi.is_primary = true
          LIMIT 1
        ) as primary_image
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

// GET single plant by ID (includes all images)
app.get('/api/plants/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const plantResult = await pool.query(`
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
    
    if (plantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    
    // Get all images for this plant
    const imagesResult = await pool.query(
      'SELECT * FROM plant_images WHERE plant_id = $1 ORDER BY is_primary DESC, uploaded_at DESC',
      [id]
    );
    
    const plant = plantResult.rows[0];
    plant.images = imagesResult.rows;
    
    res.json(plant);
  } catch (err) {
    console.error('Error fetching plant:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new plant
app.post('/api/plants', async (req, res) => {
  const {
    plant_name_id, variety_name, identification_code, breeder_id,
    year_introduced, flower_color, flowering_time, growing_habit,
    growth_intensity, flower_type, flower_size, starting_stage,
    current_quantity, minimum_stock_level, notes
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
    plant_name_id, variety_name, identification_code, breeder_id,
    year_introduced, flower_color, flowering_time, growing_habit,
    growth_intensity, flower_type, flower_size, starting_stage,
    current_quantity, minimum_stock_level, notes
  } = req.body;
  
  try {
    const result = await pool.query(`
      UPDATE plants SET
        plant_name_id = $1, variety_name = $2, identification_code = $3,
        breeder_id = $4, year_introduced = $5, flower_color = $6,
        flowering_time = $7, growing_habit = $8, growth_intensity = $9,
        flower_type = $10, flower_size = $11, starting_stage = $12,
        current_quantity = $13, minimum_stock_level = $14, notes = $15,
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

// DELETE plant
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
// IMAGE ROUTES (NEW!)
// ------------------------------

// GET all images for a plant
app.get('/api/plants/:id/images', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM plant_images WHERE plant_id = $1 ORDER BY is_primary DESC, uploaded_at DESC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST upload image for a plant
app.post('/api/plants/:id/images', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { caption, is_primary } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  
  try {
    // If this is set as primary, unset other primary images for this plant
    if (is_primary === 'true' || is_primary === true) {
      await pool.query(
        'UPDATE plant_images SET is_primary = false WHERE plant_id = $1',
        [id]
      );
    }
    
    // Insert the new image record
    const imageUrl = `/uploads/${req.file.filename}`;
    const result = await pool.query(
      `INSERT INTO plant_images (plant_id, image_filename, image_url, is_primary, caption)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, req.file.filename, imageUrl, is_primary === 'true' || is_primary === true, caption || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // If database insert fails, delete the uploaded file
    fs.unlinkSync(req.file.path);
    console.error('Error saving image:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT set image as primary
app.put('/api/images/:imageId/set-primary', async (req, res) => {
  const { imageId } = req.params;
  
  try {
    // Get the plant_id for this image
    const imageResult = await pool.query(
      'SELECT plant_id FROM plant_images WHERE id = $1',
      [imageId]
    );
    
    if (imageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const plantId = imageResult.rows[0].plant_id;
    
    // Unset all primary images for this plant
    await pool.query(
      'UPDATE plant_images SET is_primary = false WHERE plant_id = $1',
      [plantId]
    );
    
    // Set this image as primary
    const result = await pool.query(
      'UPDATE plant_images SET is_primary = true WHERE id = $1 RETURNING *',
      [imageId]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error setting primary image:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE image
app.delete('/api/images/:imageId', async (req, res) => {
  const { imageId } = req.params;
  
  try {
    // Get image info to delete the file
    const imageResult = await pool.query(
      'SELECT image_filename FROM plant_images WHERE id = $1',
      [imageId]
    );
    
    if (imageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const filename = imageResult.rows[0].image_filename;
    const filePath = path.join(uploadsDir, filename);
    
    // Delete from database
    await pool.query('DELETE FROM plant_images WHERE id = $1', [imageId]);
    
    // Delete file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ------------------------------
// STOCK MOVEMENTS ROUTES
// ------------------------------

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

app.post('/api/stock-movements', async (req, res) => {
  const { plant_id, movement_type, quantity, movement_date, reason, notes } = req.body;
  
  try {
    await pool.query('BEGIN');
    
    const movementResult = await pool.query(
      `INSERT INTO stock_movements (plant_id, movement_type, quantity, movement_date, reason, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [plant_id, movement_type, quantity, movement_date, reason, notes]
    );
    
    const multiplier = movement_type === 'in' ? 1 : -1;
    await pool.query(
      'UPDATE plants SET current_quantity = current_quantity + $1 WHERE id = $2',
      [quantity * multiplier, plant_id]
    );
    
    await pool.query('COMMIT');
    
    res.status(201).json(movementResult.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error creating stock movement:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// 8. START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/...`);
  console.log(`📸 Image uploads enabled - stored in ${uploadsDir}`);
});

// ============================================
// 9. GRACEFUL SHUTDOWN
// ============================================

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  pool.end();
  process.exit(0);
});
