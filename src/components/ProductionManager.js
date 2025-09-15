import React, { useState } from 'react';

const ProductionManager = ({ 
  machines, 
  machineData, 
  resources, 
  buildMachine, 
  unlockedTech, 
  calculateBuildCost,
  techTree
}) => {
  const [selectedCategory, setSelectedCategory] = useState('extraction');

  const machineCategories = {
    extraction: {
      name: "🏗️ Extraction",
      machines: ['miner_mk1', 'miner_mk2', 'miner_mk3', 'oil_extractor']
    },
    production: {
      name: "🏭 Production", 
      machines: ['smelter', 'foundry', 'constructor', 'assembler', 'manufacturer', 'refinery']
    },
    power: {
      name: "⚡ Énergie",
      machines: ['biomass_burner', 'coal_generator', 'fuel_generator', 'nuclear_plant']
    },
    research: {
      name: "🔬 Recherche",
      machines: ['research_lab', 'quantum_computer']
    }
  };

    const canBuildMachine = (machineType) => {
    const machineInfo = machineData[machineType];
    if (!machineInfo) return false;
    
    // Vérifier si la technologie est débloquée
    const techUnlocked = machineInfo.tier === 0 || 
        unlockedTech.some(techKey => {
        const tech = techTree[techKey];
        return tech && tech.unlocks.includes(machineType);
        });
    
    if (!techUnlocked) return false;
    
    // Vérifier les ressources
    const cost = calculateBuildCost(machineType);
    return Object.entries(cost).every(
        ([resource, amount]) => resources[resource] >= amount
    );
    };

    const getMachineStatus = (machineType) => {
    const machineInfo = machineData[machineType];
    const count = machines[machineType] || 0;
    
    if (count === 0) return "Non construit";
    
    let status = `${count} actif${count > 1 ? 's' : ''}`;
    
    if (machineInfo.power) {
        status += ` (-${machineInfo.power * count}MW)`;
    }
    if (machineInfo.power_gen) {
        status += ` (+${machineInfo.power_gen * count}MW)`;
    }
    if (machineInfo.rate) {
        // ✅ Afficher par minute au lieu de par seconde
        status += ` (${Math.floor(machineInfo.rate * count)}/min)`;  // Enlever le "/ 60"
    }
    
    return status;
    };


    const getMachineProduction = (machineType) => {
    const machineInfo = machineData[machineType];
    const count = machines[machineType] || 0;
    
    if (count === 0) return null;
    
    let production = [];
    
    if (machineInfo.produces) {
        machineInfo.produces.forEach(resource => {
        // ✅ Calcul par minute 
        const ratePerMin = Math.floor(machineInfo.rate * count / machineInfo.produces.length);
        production.push(`${resource}: +${ratePerMin}/min`);  // /min au lieu de /s
        });
    }
    
    if (machineInfo.auto_recipes) {
        production.push(`Auto: ${machineInfo.auto_recipes.join(', ')}`);
    }
    
    if (machineInfo.generates) {
        const ratePerMin = machineInfo.rate * count * 60; // Multiplier par 60 pour les research points
        production.push(`${machineInfo.generates}: +${ratePerMin}/min`);
    }
    
    return production;
    };


  return (
    <div className="production-manager">
      <div className="category-tabs">
        {Object.entries(machineCategories).map(([key, category]) => (
          <button
            key={key}
            className={`category-tab ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(key)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="machines-grid">
        {machineCategories[selectedCategory].machines.map(machineType => {
          const machineInfo = machineData[machineType];
          const cost = calculateBuildCost(machineType);
          const canBuild = canBuildMachine(machineType);
          const count = machines[machineType] || 0;
          const production = getMachineProduction(machineType);

          return (
            <div key={machineType} className={`machine-card ${!canBuild ? 'locked' : ''}`}>
              <div className="machine-header">
                <h4>{machineInfo.name}</h4>
                <span className="machine-tier">Tier {machineInfo.tier}</span>
              </div>
              
              <div className="machine-info">
                <p className="machine-status">
                  {getMachineStatus(machineType)}
                </p>
                
                {machineInfo.power && (
                  <p className="power-consumption">⚡ -{machineInfo.power}MW</p>
                )}
                
                {machineInfo.power_gen && (
                  <p className="power-generation">⚡ +{machineInfo.power_gen}MW</p>
                )}
                
                {production && production.length > 0 && (
                  <div className="production-info">
                    <strong>Production:</strong>
                    {production.map((prod, index) => (
                      <p key={index} className="production-line">{prod}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="machine-cost">
                <strong>Coût:</strong>
                <div className="cost-grid">
                  {Object.entries(cost).map(([resource, amount]) => (
                    <div 
                      key={resource} 
                      className={`cost-item ${resources[resource] >= amount ? 'affordable' : 'expensive'}`}
                    >
                      <span>{resource}: {amount}</span>
                      <span>({resources[resource] || 0})</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => buildMachine(machineType)}
                disabled={!canBuild}
                className={`build-button ${canBuild ? 'can-build' : 'cannot-build'}`}
              >
                {canBuild ? `Construire (${count})` : 'Non disponible'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductionManager;
