// UPDATED src/components/PlantList.js
// Now thumbnails are clickable to view full size

import React from 'react';
import './PlantList.css';

function PlantList({ plants, onEdit, onDelete, onManageImages, onImageClick }) {
  if (plants.length === 0) {
    return (
      <div className="no-plants">
        <p>No plants in inventory yet. Add your first plant!</p>
      </div>
    );
  }

  return (
    <div className="plant-list">
      <h2>Inventory ({plants.length} varieties)</h2>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Variety</th>
              <th>Botanical Name</th>
              <th>Color</th>
              <th>Habit</th>
              <th>Flower Type</th>
              <th>Quantity</th>
              <th>Stage</th>
              <th>Breeder</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.id}>
                <td className="plant-photo">
                  {plant.primary_image ? (
                    <img 
                      src={`http://localhost:3001${plant.primary_image.image_url}`} 
                      alt={plant.variety_name}
                      title="Click to view full size"
                      className="plant-thumbnail clickable"
                      onClick={() => onImageClick(plant.primary_image.image_url, plant.variety_name)}
                    />
                  ) : (
                    <div className="no-photo">📷</div>
                  )}
                </td>
                <td className="variety-name">
                  <strong>{plant.variety_name}</strong>
                  {plant.identification_code && (
                    <small>{plant.identification_code}</small>
                  )}
                </td>
                <td>
                  <em>{plant.botanical_name}</em>
                  {plant.common_name && (
                    <small>({plant.common_name})</small>
                  )}
                </td>
                <td>{plant.flower_color}</td>
                <td>{plant.growing_habit}</td>
                <td>{plant.flower_type}</td>
                <td className="quantity">
                  <span className={plant.current_quantity < plant.minimum_stock_level ? 'low-stock' : ''}>
                    {plant.current_quantity}
                  </span>
                  {plant.minimum_stock_level > 0 && (
                    <small>Min: {plant.minimum_stock_level}</small>
                  )}
                </td>
                <td>{plant.starting_stage}</td>
                <td>{plant.breeder_name}</td>
                <td className="actions">
                  <button 
                    className="btn-photos"
                    onClick={() => onManageImages(plant)}
                    title="Manage photos"
                  >
                    📸 Photos
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(plant)}
                    title="Edit plant"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${plant.variety_name}?`)) {
                        onDelete(plant.id);
                      }
                    }}
                    title="Delete plant"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="summary">
        <div className="stat">
          <strong>Total Varieties:</strong> {plants.length}
        </div>
        <div className="stat">
          <strong>Total Quantity:</strong> {plants.reduce((sum, p) => sum + (p.current_quantity || 0), 0)}
        </div>
        <div className="stat">
          <strong>Low Stock:</strong> {plants.filter(p => p.current_quantity < p.minimum_stock_level).length}
        </div>
        <div className="stat">
          <strong>With Photos:</strong> {plants.filter(p => p.primary_image).length}
        </div>
      </div>
    </div>
  );
}

export default PlantList;
