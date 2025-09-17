import React from 'react';

const ResourceOverview = ({ resources }) => {
  const resourceCategories = {
    "🪨 Ressources Brutes": [
      { key: 'iron_ore', name: 'Iron Ore', icon: '🪨' },
      { key: 'copper_ore', name: 'Copper Ore', icon: '🟫' },
      { key: 'coal', name: 'Coal', icon: '⚫' },
      { key: 'limestone', name: 'Limestone', icon: '⚪' },
      { key: 'crude_oil', name: 'Crude Oil', icon: '🛢️' },
      { key: 'bauxite', name: 'Bauxite', icon: '🔴' },
      { key: 'uranium', name: 'Uranium', icon: '☢️' }
    ],
    "🔩 Lingots": [
      { key: 'iron_ingot', name: 'Iron Ingot', icon: '🔩' },
      { key: 'copper_ingot', name: 'Copper Ingot', icon: '🟤' },
      { key: 'steel_ingot', name: 'Steel Ingot', icon: '⚙️' },
      { key: 'aluminum_ingot', name: 'Aluminum Ingot', icon: '✨' }
    ],
    "🔧 Composants Base": [
      { key: 'iron_plate', name: 'Iron Plate', icon: '🔳' },
      { key: 'iron_rod', name: 'Iron Rod', icon: '📏' },
      { key: 'screws', name: 'Screws', icon: '🔩' },
      { key: 'wire', name: 'Wire', icon: '🔌' },
      { key: 'cable', name: 'Cable', icon: '🔗' },
      { key: 'concrete', name: 'Concrete', icon: '🧱' }
    ],
    "⚙️ Composants Avancés": [
      { key: 'reinforced_iron_plate', name: 'Reinforced Iron Plate', icon: '🛡️' },
      { key: 'rotor', name: 'Rotor', icon: '🌀' },
      { key: 'modular_frame', name: 'Modular Frame', icon: '🔲' },
      { key: 'smart_plating', name: 'Smart Plating', icon: '🤖' },
      { key: 'circuit_board', name: 'Circuit Board', icon: '💾' }
    ],
    "🖥️ Composants Élite": [
      { key: 'heavy_modular_frame', name: 'Heavy Modular Frame', icon: '🏗️' },
      { key: 'computer', name: 'Computer', icon: '💻' },
      { key: 'supercomputer', name: 'Supercomputer', icon: '🖥️' },
      { key: 'quantum_processor', name: 'Quantum Processor', icon: '⚛️' }
    ],
    "🧪 Liquides": [
      { key: 'water', name: 'Water', icon: '💧' },
      { key: 'fuel', name: 'Fuel', icon: '⛽' },
      { key: 'plastic', name: 'Plastic', icon: '🟡' },
      { key: 'rubber', name: 'Rubber', icon: '⚫' }
    ]
  };

  return (
    <div className="resource-overview">
      <div className="power-status">
        <h3>⚡ Énergie</h3>
        <div className="power-meter">
          <span className="power-value">{resources.power}MW/{resources.max_power}MW</span>
        </div>
        <div className="research-points">
          <span>🔬 {Math.floor(resources.research_points)} RP</span>
        </div>
      </div>

      {Object.entries(resourceCategories).map(([category, items]) => (
        <div key={category} className="resource-category">
          <h4>{category}</h4>
          <div className="resource-grid">
            {items.map(({ key, name, icon }) => (
              <div key={key} className="resource-item">
                <span className="resource-icon">{icon}</span>
                <div className="resource-info">
                  <span className="resource-name">{name}</span>
                  <span className="resource-amount">
                    {Math.floor(resources[key] || 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceOverview;
