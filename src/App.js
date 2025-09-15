import React, { useState, useEffect } from 'react';
import TechTree from './components/TechTree';
import ProductionManager from './components/ProductionManager';
import ResourceOverview from './components/ResourceOverview';
import MusicPlayer from './components/MusicPlayer';
import ManualActionsTab from './components/ManualActionsTab';

// Imports des données
import { INITIAL_RESOURCES, TECH_TREE, MACHINE_BUILD_COSTS,  MACHINES   } from './data/gameData';

// Imports des hooks
import { useManualActions } from './hooks/useManualActions';
import { useProduction } from './hooks/useProduction';

// Imports des styles
import './styles/index.css';
import './styles/layout.css';
import './styles/components/ResourceOverview.css';
import './styles/components/ProductionManager.css';
import './styles/components/TechTree.css';
import './styles/components/ManualActions.css';
import './styles/components/MusicPlayer.css';
import './styles/responsive.css';



function App() {
  // États principaux
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [machines, setMachines] = useState({ biomass_burner: 1 });
  const [unlockedTech, setUnlockedTech] = useState([]);
  const [activeTab, setActiveTab] = useState('manual');
  const [isRunning, setIsRunning] = useState(false);
  
  // Actions débloquées
  const [unlockedActions, setUnlockedActions] = useState([
    'mine_iron', 'research',
    'smelt_iron', 'craft_iron_plate', 'craft_iron_rod', 'craft_screws'
  ]);

  // Hook pour les actions manuelles (avec la logique de boucle)
  const {
    actionProgress,
    activeLoopAction,
    performManualAction,
    toggleActionLoop,
    stopActionLoop,
    canPerformAction
  } = useManualActions(resources, setResources, unlockedActions, setUnlockedActions);

  // Hook pour la production automatique
  useProduction(isRunning, machines, setResources);

  // Fonctions pour les machines
  const buildMachine = (machineType) => {
    const cost = calculateBuildCost(machineType);
    
    const canBuild = Object.entries(cost).every(
      ([resource, amount]) => resources[resource] >= amount
    );
    
    if (canBuild) {
      setResources(prev => {
        const newResources = { ...prev };
        Object.entries(cost).forEach(([resource, amount]) => {
          newResources[resource] -= amount;
        });
        return newResources;
      });
      
      setMachines(prev => ({
        ...prev,
        [machineType]: (prev[machineType] || 0) + 1
      }));
    }
  };

  const calculateBuildCost = (machineType) => {
    return MACHINE_BUILD_COSTS[machineType] || {};
  };

  // Logique de déblocage des technologies
  const unlockTechnology = (techKey) => {
    const tech = TECH_TREE[techKey];
    const canUnlock = Object.entries(tech.cost).every(
      ([resource, amount]) => resources[resource] >= amount
    ) && tech.prerequisites.every(prereq => unlockedTech.includes(prereq));
    
    if (canUnlock) {
      setResources(prev => {
        const newResources = { ...prev };
        Object.entries(tech.cost).forEach(([resource, amount]) => {
          newResources[resource] -= amount;
        });
        return newResources;
      });
      
      setUnlockedTech(prev => [...prev, techKey]);
      unlockTierActions(techKey);
    }
  };

  const unlockTierActions = (techKey) => {
    const tierActions = {
      basic_production: [
        'mine_copper', 'smelt_copper', 'craft_wire', 'craft_cable',
        'mine_limestone', 'craft_concrete'
      ],
      advanced_production: [
        'mine_coal', 'craft_steel', 'craft_reinforced_iron_plate', 'craft_rotor'
      ],
      oil_processing: [
        'extract_oil', 'craft_plastic', 'craft_rubber', 'craft_fuel'
      ]
    };
    
    const actionsToUnlock = tierActions[techKey];
    if (actionsToUnlock) {
      setUnlockedActions(prev => {
        const newActions = [...prev];
        actionsToUnlock.forEach(action => {
          if (!newActions.includes(action)) {
            newActions.push(action);
          }
        });
        return newActions;
      });
      
      console.log(`🎉 ${techKey} recherché! Nouvelles actions débloquées:`, actionsToUnlock);
    }
  };

  return (
    <div className="App desert-genesis">
      <header className="game-header">
        <h1>🏭 Desert Genesis Industries</h1>
        <div className="status-bars">
          <div className="power-bar">
            ⚡ Power: {resources.power}MW | 🔬 Research: {Math.floor(resources.research_points)}
          </div>
        </div>
        <div className="header-controls">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`main-button ${isRunning ? 'running' : 'paused'}`}
          >
            {isRunning ? '⏸️ Pause Factory' : '▶️ Start Production'}
          </button>
          
          <MusicPlayer />
        </div>
      </header>

      <nav className="tab-navigation">
        <button 
          className={activeTab === 'manual' ? 'active' : ''}
          onClick={() => setActiveTab('manual')}
        >
          ⛏️ Actions Manuelles
        </button>
        <button 
          className={activeTab === 'production' ? 'active' : ''}
          onClick={() => setActiveTab('production')}
        >
          🏭 Production ({Object.keys(machines).length} machines)
        </button>
        <button 
          className={activeTab === 'research' ? 'active' : ''}
          onClick={() => setActiveTab('research')}
        >
          🔬 Research (Tier {unlockedTech.length + 1})
        </button>
      </nav>

      <div className="game-layout">
        <div className="sidebar">
          <ResourceOverview resources={resources} />
        </div>

        <div className="main-content">
          {activeTab === 'manual' && (
            <ManualActionsTab 
              resources={resources}
              unlockedActions={unlockedActions}
              actionProgress={actionProgress}
              activeLoopAction={activeLoopAction}
              toggleActionLoop={toggleActionLoop}
            />
          )}

          {activeTab === 'production' && (
            <ProductionManager 
              machines={machines}
              machineData={MACHINES}
              resources={resources}
              buildMachine={buildMachine}
              unlockedTech={unlockedTech}
              calculateBuildCost={calculateBuildCost}
              techTree={TECH_TREE}
            />
          )}
          
          {activeTab === 'research' && (
            <TechTree 
              techTree={TECH_TREE}
              unlockedTech={unlockedTech}
              resources={resources}
              unlockTechnology={unlockTechnology}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
