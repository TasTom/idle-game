import React, { useState, useEffect } from 'react';
import TechTree from './components/TechTree';
import ProductionManager from './components/ProductionManager';
import ResourceOverview from './components/ResourceOverview';
import MusicPlayer from './components/MusicPlayer';
import ManualActionsTab from './components/ManualActionsTab';
import SkillsPanel from './components/SkillsPanel'; // ✅ NOUVEAU

// Imports des données et hooks
import { INITIAL_RESOURCES, TECH_TREE, MACHINE_BUILD_COSTS, MACHINES } from './data/gameData';
import { useManualActions } from './hooks/useManualActions';
import { useProduction } from './hooks/useProduction';

// Styles
import './styles/index.css';
import './styles/melvor-interface.css'; // ✅ AJOUTER
import './styles/layout.css';
import './styles/components/ResourceOverview.css';
import './styles/components/ProductionManager.css';
import './styles/components/TechTree.css';
import './styles/components/ManualActions.css';
import './styles/components/MusicPlayer.css';
import './styles/responsive.css';

function App() {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [machines, setMachines] = useState({ biomass_burner: 1 });
  const [unlockedTech, setUnlockedTech] = useState([]);
  const [activeSkill, setActiveSkill] = useState('mining'); // ✅ NOUVEAU
  const [isRunning, setIsRunning] = useState(false);
  
  const [unlockedActions, setUnlockedActions] = useState([
    'mine_iron', 'research',
    'smelt_iron', 'craft_iron_plate', 'craft_iron_rod', 'craft_screws'
  ]);

  const {
    actionProgress,
    activeLoopAction,
    performManualAction,
    toggleActionLoop,
    stopActionLoop,
    canPerformAction,
    cancelCurrentAction
  } = useManualActions(resources, setResources, unlockedActions, setUnlockedActions);

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
    <div className="melvor-app">
      {/* ✅ HEADER STYLE MELVOR */}
      <header className="melvor-header">
        <div className="header-left">
          <h1>🏭 Desert Genesis</h1>
          <div className="game-controls">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`control-btn ${isRunning ? 'running' : 'paused'}`}
            >
              {isRunning ? '⏸️ Pause' : '▶️ Play'}
            </button>
          </div>
        </div>
              {/* ✅ NOUVELLE SECTION CENTRALE AVEC STATS + MUSIQUE */}
        <div className="header-center">
          <div className="status-bars">
            <div className="power-bar">
              ⚡ Power: {resources.power}/{resources.max_power}MW
            </div>
            <div className="research-bar">
              🔬 Research: {Math.floor(resources.research_points)}
            </div>
            {/* ✅ LECTEUR DE MUSIQUE INTÉGRÉ */}
            <div className="music-bar">
              <MusicPlayer />
            </div>
          </div>
        </div>
        <div className="header-right">
       
        </div>
      </header>

      {/* ✅ LAYOUT PRINCIPAL STYLE MELVOR */}
      <div className="melvor-main">
        {/* Sidebar gauche - Skills */}
        <aside className="skills-sidebar">
          <SkillsPanel 
            activeSkill={activeSkill}
            setActiveSkill={setActiveSkill}
            resources={resources}
            unlockedActions={unlockedActions}
            actionProgress={actionProgress}
            activeLoopAction={activeLoopAction}
            toggleActionLoop={toggleActionLoop}
          />
        </aside>

        {/* Contenu principal */}
        <main className="main-content">
          {activeSkill === 'mining' && (
            <div className="skill-content">
              <h2>⛏️ Mining</h2>
              <div className="actions-grid">
                {/* Actions de mining */}
                <ManualActionsTab 
                  resources={resources}
                  unlockedActions={unlockedActions}
                  actionProgress={actionProgress}
                  activeLoopAction={activeLoopAction}
                  toggleActionLoop={toggleActionLoop}
                  canPerformAction={canPerformAction}
                  skillType="mining"
                />
              </div>
            </div>
          )}

          {activeSkill === 'smithing' && (
            <div className="skill-content">
              <h2>🔥 Smithing</h2>
              <div className="actions-grid">
                {/* Actions de smithing */}
              </div>
            </div>
          )}

          {activeSkill === 'production' && (
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

          {activeSkill === 'research' && (
            <TechTree 
              techTree={TECH_TREE}
              unlockedTech={unlockedTech}
              resources={resources}
              unlockTechnology={unlockTechnology}
            />
          )}
        </main>

        {/* Sidebar droite - Resources */}
        <aside className="resources-sidebar">
          <ResourceOverview resources={resources} />
        </aside>
      </div>
    </div>
  );
}

export default App;