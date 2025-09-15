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
        
        // 1. Générer l'énergie
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
        
        newResources.power = powerGenerated;
        
        // 2. Extraction automatique de ressources
        Object.entries(machines).forEach(([machineType, count]) => {
          const machineData = MACHINES[machineType];
          if (machineData?.produces && count > 0) {
            const powerCost = machineData.power * count;
            if (powerGenerated >= powerCost) {
              machineData.produces.forEach(resource => {
                const productionRate = 1;
                newResources[resource] += productionRate * count;
              });
            }
          }
        });

        // 3. Production automatique intelligente
        Object.entries(machines).forEach(([machineType, count]) => {
          const machineData = MACHINES[machineType];
          if (machineData?.auto_recipes && count > 0) {
            const powerCost = machineData.power * count;
            if (powerUsed + powerCost <= powerGenerated) {
              powerUsed += powerCost;
              
              machineData.auto_recipes.forEach(recipeKey => {
                const recipe = AUTO_RECIPES[recipeKey];
                if (recipe) {
                  const canProduce = Object.entries(recipe.inputs).every(
                    ([resource, amount]) => newResources[resource] >= amount * count
                  );
                  
                  if (canProduce) {
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
        });
        
        // 4. Génération de points de recherche
        Object.entries(machines).forEach(([machineType, count]) => {
          const machineData = MACHINES[machineType];
          if (machineData?.generates === 'research_points' && count > 0) {
            const powerCost = machineData.power * count;
            if (powerUsed + powerCost <= powerGenerated) {
              powerUsed += powerCost;
              newResources.research_points += machineData.rate * count;
            }
          }
        });
        
        return newResources;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, machines, setResources]);
};
