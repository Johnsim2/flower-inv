// src/components/PlantForm.js
// This component handles adding new plants and editing existing ones

import React, { useState, useEffect } from 'react';
import './PlantForm.css';

function PlantForm({ plantNames, breeders, onSubmit, onCancel, editingPlant }) {
  // Form state - stores all the input values
  const [formData, setFormData] = useState({
    plant_name_id: '',
    variety_name: '',
    identification_code: '',
    breeder_id: '',
    year_introduced: '',
    flower_color: '',
    flowering_time: '',
    growing_habit: '',
    growth_intensity: '',
    flower_type: '',
    flower_size: '',
    starting_stage: '',
    current_quantity: 0,
    minimum_stock_level: 0,
    notes: ''
  });

  // When editing, populate the form with existing data
  useEffect(() => {
    if (editingPlant) {
      setFormData({
        plant_name_id: editingPlant.plant_name_id || '',
        variety_name: editingPlant.variety_name || '',
        identification_code: editingPlant.identification_code || '',
        breeder_id: editingPlant.breeder_id || '',
        year_introduced: editingPlant.year_introduced || '',
        flower_color: editingPlant.flower_color || '',
        flowering_time: editingPlant.flowering_time || '',
        growing_habit: editingPlant.growing_habit || '',
        growth_intensity: editingPlant.growth_intensity || '',
        flower_type: editingPlant.flower_type || '',
        flower_size: editingPlant.flower_size || '',
        starting_stage: editingPlant.starting_stage || '',
        current_quantity: editingPlant.current_quantity || 0,
        minimum_stock_level: editingPlant.minimum_stock_level || 0,
        notes: editingPlant.notes || ''
      });
    }
  }, [editingPlant]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string numbers to integers
    const submitData = {
      ...formData,
      plant_name_id: parseInt(formData.plant_name_id),
      breeder_id: formData.breeder_id ? parseInt(formData.breeder_id) : null,
      year_introduced: formData.year_introduced ? parseInt(formData.year_introduced) : null,
      current_quantity: parseInt(formData.current_quantity) || 0,
      minimum_stock_level: parseInt(formData.minimum_stock_level) || 0,
    };

    onSubmit(submitData);
  };

  // Dropdown options (you can customize these)
  const floweringTimeOptions = ['Very Early', 'Early', 'Medium', 'Late', 'Very Late'];
  const growingHabitOptions = ['Trailing', 'Erect', 'Semi-Trailing', 'Upright', 'Compact'];
  const growthIntensityOptions = ['Compact', 'Medium', 'Vigorous'];
  const flowerTypeOptions = ['Single', 'Semi-Double', 'Double'];
  const flowerSizeOptions = ['Small', 'Medium', 'Large', 'Extra Large'];
  const startingStageOptions = ['Seed', 'Unrooted Cutting', 'Rooted Cutting', 'Young Plant', 'Finished Plant'];

  return (
    <div className="plant-form-container">
      <div className="form-header">
        <h2>{editingPlant ? 'Edit Plant' : 'Add New Plant'}</h2>
        <button className="btn-close" onClick={onCancel}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="plant-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="plant_name_id">Botanical Name *</label>
              <select
                id="plant_name_id"
                name="plant_name_id"
                value={formData.plant_name_id}
                onChange={handleChange}
                required
              >
                <option value="">Select botanical name...</option>
                {plantNames.map(pn => (
                  <option key={pn.id} value={pn.id}>
                    {pn.botanical_name} {pn.common_name && `(${pn.common_name})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="variety_name">Variety Name *</label>
              <input
                type="text"
                id="variety_name"
                name="variety_name"
                value={formData.variety_name}
                onChange={handleChange}
                placeholder="e.g., Calliope Dark Red"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="identification_code">ID Code</label>
              <input
                type="text"
                id="identification_code"
                name="identification_code"
                value={formData.identification_code}
                onChange={handleChange}
                placeholder="e.g., PP-CAL-DR-001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="breeder_id">Breeder</label>
              <select
                id="breeder_id"
                name="breeder_id"
                value={formData.breeder_id}
                onChange={handleChange}
              >
                <option value="">Select breeder...</option>
                {breeders.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year_introduced">Year Introduced</label>
              <input
                type="number"
                id="year_introduced"
                name="year_introduced"
                value={formData.year_introduced}
                onChange={handleChange}
                placeholder="2024"
                min="1900"
                max="2100"
              />
            </div>
          </div>
        </div>

        {/* Physical Characteristics */}
        <div className="form-section">
          <h3>Physical Characteristics</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="flower_color">Flower Color</label>
              <input
                type="text"
                id="flower_color"
                name="flower_color"
                value={formData.flower_color}
                onChange={handleChange}
                placeholder="e.g., Dark Red, Pink-White"
              />
            </div>

            <div className="form-group">
              <label htmlFor="flowering_time">Flowering Time</label>
              <select
                id="flowering_time"
                name="flowering_time"
                value={formData.flowering_time}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                {floweringTimeOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="growing_habit">Growing Habit</label>
              <select
                id="growing_habit"
                name="growing_habit"
                value={formData.growing_habit}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                {growingHabitOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="growth_intensity">Growth Intensity</label>
              <select
                id="growth_intensity"
                name="growth_intensity"
                value={formData.growth_intensity}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                {growthIntensityOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="flower_type">Flower Type</label>
              <select
                id="flower_type"
                name="flower_type"
                value={formData.flower_type}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                {flowerTypeOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="flower_size">Flower Size</label>
              <select
                id="flower_size"
                name="flower_size"
                value={formData.flower_size}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                {flowerSizeOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Information */}
        <div className="form-section">
          <h3>Inventory Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="starting_stage">Starting Stage</label>
              <select
                id="starting_stage"
                name="starting_stage"
                value={formData.starting_stage}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                {startingStageOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="current_quantity">Current Quantity</label>
              <input
                type="number"
                id="current_quantity"
                name="current_quantity"
                value={formData.current_quantity}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="minimum_stock_level">Minimum Stock Level</label>
              <input
                type="number"
                id="minimum_stock_level"
                name="minimum_stock_level"
                value={formData.minimum_stock_level}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional notes, observations, etc."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            {editingPlant ? 'Update Plant' : 'Add Plant'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlantForm;
