import { useEffect } from 'react';
import { MACHINES, AUTO_RECIPES } from '../data/gameData';

export const useProduction = (isRunning, machines, setResources) => {
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setResources(prev => {
        const newResources = { ...prev };
        let powerUsed = 0;
        let powerGenerated = 0;
        
        // 1. ✅ CALCULER L'ÉNERGIE PRODUITE
        Object.entries(machines).forEach(([machineType, count]) => {
          const machineData = MACHINES[machineType];
          if (machineData?.power_gen && count > 0) {
            const fuelNeeded = machineData.fuel;
            if (!fuelNeeded || newResources[fuelNeeded] >= count) {
              powerGenerated += machineData.power_gen * count;
              if (fuelNeeded && fuelNeeded !== 'biomass') {
                newResources[fuelNeeded] = Math.max(0, newResources[fuelNeeded] - count);
              }
            }
          }
        });
        
        // 2. ✅ CALCULER LA CONSOMMATION D'ÉNERGIE DES MACHINES DE PRODUCTION
        Object.entries(machines).forEach(([machineType, count]) => {
          const machineData = MACHINES[machineType];
          
          // Machines d'extraction
          if (machineData?.produces && count > 0) {
            const powerCost = machineData.power * count;
            if (powerUsed + powerCost <= powerGenerated) {
              powerUsed += powerCost;
              
              machineData.produces.forEach(resource => {
                const productionRate = 1;
                newResources[resource] += productionRate * count;
              });
            }
          }
          
          // Machines de production automatique
          if (machineData?.auto_recipes && count > 0) {
            const powerCost = machineData.power * count;
            if (powerUsed + powerCost <= powerGenerated) {
              // ✅ On peut utiliser cette énergie
              const canUseEnergy = true;
              
              machineData.auto_recipes.forEach(recipeKey => {
                const recipe = AUTO_RECIPES[recipeKey];
                if (recipe) {
                  const canProduce = Object.entries(recipe.inputs).every(
                    ([resource, amount]) => newResources[resource] >= amount * count
                  );
                  
                  if (canProduce && canUseEnergy) {
                    // ✅ SEULEMENT maintenant on compte la consommation d'énergie
                    powerUsed += powerCost;
                    
                    Object.entries(recipe.inputs).forEach(([resource, amount]) => {
                      newResources[resource] -= amount * count;
                    });
                    
                    Object.entries(recipe.outputs).forEach(([resource, amount]) => {
                      newResources[resource] += amount * count;
                    });
                  }
                }
              });
            }
          }
          
          // Machines de recherche
          if (machineData?.generates === 'research_points' && count > 0) {
            const powerCost = machineData.power * count;
            if (powerUsed + powerCost <= powerGenerated) {
              powerUsed += powerCost;
              newResources.research_points += machineData.rate * count;
            }
          }
        });
        
        // 3. ✅ METTRE À JOUR LES VALEURS D'ÉNERGIE
        newResources.power = powerUsed;        // Énergie consommée
        newResources.max_power = powerGenerated; // Énergie produite
        
        return newResources;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, machines, setResources]);
};
