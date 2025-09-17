export const INITIAL_RESOURCES = {
  // Ressources brutes
  iron_ore: 0,
  copper_ore: 0, 
  coal: 0,
  limestone: 0,
  crude_oil: 0,
  bauxite: 0,
  uranium: 0,
  
  // Lingots de base
  iron_ingot: 0,
  copper_ingot: 0,
  steel_ingot: 0,
  aluminum_ingot: 0,
  
  // Composants de base
  iron_plate: 0,
  iron_rod: 0,
  screws: 0,
  wire: 0,
  cable: 0,
  concrete: 0,
  
  // Composants intermédiaires
  reinforced_iron_plate: 0,
  rotor: 0,
  modular_frame: 0,
  smart_plating: 0,
  circuit_board: 0,
  
  // Composants avancés
  heavy_modular_frame: 0,
  computer: 0,
  supercomputer: 0,
  quantum_processor: 0,
  ai_limiter: 0,
  
  // Liquides/Gaz
  water: 0,
  fuel: 0,
  plastic: 0,
  rubber: 0,
  
  // Énergie
  power: 0,
  max_power: 30,
  
  // Recherche
  research_points: 0
};

export const MACHINES = {
  // Extraction automatique
  miner_mk1: { 
    name: "Miner Mk.1", 
    tier: 1, 
    power: 5, 
    produces: ["iron_ore", "copper_ore", "limestone"], 
    rate: 60 
  },
  miner_mk2: { 
    name: "Miner Mk.2", 
    tier: 2, 
    power: 12, 
    produces: ["iron_ore", "copper_ore", "limestone", "coal"], 
    rate: 120 
  },
  miner_mk3: { 
    name: "Miner Mk.3", 
    tier: 4, 
    power: 30, 
    produces: ["iron_ore", "copper_ore", "limestone", "coal", "bauxite"], 
    rate: 240 
  },
  oil_extractor: { 
    name: "Oil Extractor", 
    tier: 3, 
    power: 40, 
    produces: ["crude_oil"], 
    rate: 120 
  },
  
  // Production automatisée
  smelter: { 
    name: "Smelter", 
    tier: 1, 
    power: 4, 
    auto_recipes: ["iron_ingot", "copper_ingot"] 
  },
  foundry: { 
    name: "Foundry", 
    tier: 2, 
    power: 16, 
    auto_recipes: ["steel_ingot", "aluminum_ingot"] 
  },
  constructor: { 
    name: "Constructor", 
    tier: 1, 
    power: 4, 
    auto_recipes: ["iron_plate", "iron_rod", "screws", "concrete"] 
  },
  assembler: { 
    name: "Assembler", 
    tier: 2, 
    power: 15, 
    auto_recipes: ["reinforced_iron_plate", "rotor", "smart_plating", "circuit_board"] 
  },
  manufacturer: { 
    name: "Manufacturer", 
    tier: 4, 
    power: 55, 
    auto_recipes: ["heavy_modular_frame", "computer", "supercomputer"] 
  },
  refinery: { 
    name: "Refinery", 
    tier: 3, 
    power: 30, 
    auto_recipes: ["plastic", "rubber", "fuel"] 
  },
  
  // Générateurs d'énergie
  biomass_burner: { 
    name: "Biomass Burner", 
    tier: 0, 
    power_gen: 30
  },
  coal_generator: { 
    name: "Coal Generator", 
    tier: 2, 
    power_gen: 75, 
    fuel: "coal" 
  },
  fuel_generator: { 
    name: "Fuel Generator", 
    tier: 3, 
    power_gen: 150, 
    fuel: "fuel" 
  },
  nuclear_plant: { 
    name: "Nuclear Power Plant", 
    tier: 5, 
    power_gen: 2500, 
    fuel: "uranium" 
  },
  
  // Machines spéciales
  research_lab: { 
    name: "Research Lab", 
    tier: 1, 
    power: 8, 
    generates: "research_points", 
    rate: 2 
  },
  quantum_computer: { 
    name: "Quantum Computer", 
    tier: 6, 
    power: 200, 
    generates: "research_points", 
    rate: 50 
  }
};

export const AUTO_RECIPES = {
  // Lingots
  iron_ingot: { 
    inputs: { iron_ore: 1 }, 
    outputs: { iron_ingot: 1 }, 
    time: 2 
  },
  copper_ingot: { 
    inputs: { copper_ore: 1 }, 
    outputs: { copper_ingot: 1 }, 
    time: 2 
  },
  steel_ingot: { 
    inputs: { iron_ore: 3, coal: 3 }, 
    outputs: { steel_ingot: 3 }, 
    time: 4 
  },
  
  // Composants de base
  iron_plate: { 
    inputs: { iron_ingot: 3 }, 
    outputs: { iron_plate: 2 }, 
    time: 6 
  },
  iron_rod: { 
    inputs: { iron_ingot: 1 }, 
    outputs: { iron_rod: 1 }, 
    time: 4 
  },
  screws: { 
    inputs: { iron_rod: 1 }, 
    outputs: { screws: 4 }, 
    time: 6 
  },
  wire: { 
    inputs: { copper_ingot: 1 }, 
    outputs: { wire: 2 }, 
    time: 4 
  },
  cable: { 
    inputs: { wire: 2 }, 
    outputs: { cable: 1 }, 
    time: 2 
  },
  concrete: { 
    inputs: { limestone: 3 }, 
    outputs: { concrete: 1 }, 
    time: 4 
  },
  
  // Composants intermédiaires
  reinforced_iron_plate: { 
    inputs: { iron_plate: 6, screws: 12 }, 
    outputs: { reinforced_iron_plate: 1 }, 
    time: 12 
  },
  rotor: { 
    inputs: { iron_rod: 5, screws: 25 }, 
    outputs: { rotor: 1 }, 
    time: 15 
  },
  modular_frame: { 
    inputs: { reinforced_iron_plate: 3, iron_rod: 12 }, 
    outputs: { modular_frame: 2 }, 
    time: 60 
  },
  smart_plating: { 
    inputs: { reinforced_iron_plate: 1, rotor: 1 }, 
    outputs: { smart_plating: 1 }, 
    time: 30 
  },
  circuit_board: { 
    inputs: { copper_ingot: 2, plastic: 4 }, 
    outputs: { circuit_board: 1 }, 
    time: 8 
  },
  
  // Composants avancés
  heavy_modular_frame: { 
    inputs: { modular_frame: 5, steel_ingot: 15, concrete: 5, screws: 100 }, 
    outputs: { heavy_modular_frame: 1 }, 
    time: 30 
  },
  computer: { 
    inputs: { circuit_board: 10, cable: 9, plastic: 18, screws: 52 }, 
    outputs: { computer: 1 }, 
    time: 24 
  },
  supercomputer: { 
    inputs: { computer: 2, ai_limiter: 2, plastic: 28, cable: 20 }, 
    outputs: { supercomputer: 1 }, 
    time: 32 
  },
  
  // Liquides
  plastic: { 
    inputs: { crude_oil: 3 }, 
    outputs: { plastic: 2 }, 
    time: 6 
  },
  rubber: { 
    inputs: { crude_oil: 3 }, 
    outputs: { rubber: 2 }, 
    time: 6 
  },
  fuel: { 
    inputs: { crude_oil: 6 }, 
    outputs: { fuel: 4 }, 
    time: 6 
  }
};

export const TECH_TREE = {
  basic_production: {
    name: "Basic Production",
    tier: 1,
    cost: { research_points: 50 },
    unlocks: ["miner_mk1", "smelter", "constructor"],
    prerequisites: [],
    description: "Débloquer l'extraction et production de base"
  },
  advanced_production: {
    name: "Advanced Production", 
    tier: 2,
    cost: { smart_plating: 50, research_points: 200 },
    unlocks: ["miner_mk2", "assembler", "coal_generator"],
    prerequisites: ["basic_production"],
    description: "Machines avancées et énergie au charbon"
  },
  oil_processing: {
    name: "Oil Processing",
    tier: 3, 
    cost: { reinforced_iron_plate: 100, rotor: 25, research_points: 500 },
    unlocks: ["oil_extractor", "refinery", "fuel_generator"],
    prerequisites: ["advanced_production"],
    description: "Traitement du pétrole et plastiques"
  },
  industrial_manufacturing: {
    name: "Industrial Manufacturing",
    tier: 4,
    cost: { modular_frame: 50, computer: 25, research_points: 1000 },
    unlocks: ["miner_mk3", "manufacturer", "research_lab"],
    prerequisites: ["oil_processing"],
    description: "Production industrielle et recherche avancée"
  },
  quantum_era: {
    name: "Quantum Era",
    tier: 5,
    cost: { supercomputer: 10, heavy_modular_frame: 50, research_points: 5000 },
    unlocks: ["nuclear_plant", "quantum_computer"],
    prerequisites: ["industrial_manufacturing"],
    description: "Technologie quantique et énergie nucléaire"
  }
};

export const ACTION_CONFIG = {
  // TIER 0 - Disponible dès le début
  mine_iron: { time: 2000, tier: 0 },
  research: { time: 200, tier: 0 },
  
  // TIER 1 - Débloqué automatiquement au début
  smelt_iron: { time: 3000, tier: 1 },
  craft_iron_plate: { time: 4000, tier: 1 },
  craft_iron_rod: { time: 3500, tier: 1 },
  craft_screws: { time: 2000, tier: 1 },
  
  // TIER 2 - Débloqué avec "Basic Production"
  mine_copper: { time: 2500, tier: 2 },
  smelt_copper: { time: 3500, tier: 2 },
  craft_wire: { time: 2500, tier: 2 },
  craft_cable: { time: 3000, tier: 2 },
  mine_limestone: { time: 200, tier: 2 },
  craft_concrete: { time: 4500, tier: 2 },
  
  // TIER 3 - Débloqué avec "Advanced Production"  
  mine_coal: { time: 3000, tier: 3 },
  craft_steel: { time: 4000, tier: 3 },
  craft_reinforced_iron_plate: { time: 6000, tier: 3 },
  craft_rotor: { time: 5000, tier: 3 }
};

export const MACHINE_BUILD_COSTS = {
  miner_mk1: { iron_plate: 5, concrete: 10 },
  miner_mk2: { reinforced_iron_plate: 2, rotor: 2, concrete: 20 },
  miner_mk3: { heavy_modular_frame: 1, computer: 1, concrete: 50 },
  oil_extractor: { steel_ingot: 10, concrete: 40, cable: 20 },
  smelter: { iron_plate: 5, iron_rod: 5 },
  foundry: { steel_ingot: 10, concrete: 20 },
  constructor: { reinforced_iron_plate: 2, cable: 8 },
  assembler: { reinforced_iron_plate: 8, rotor: 4, cable: 10 },
  manufacturer: { heavy_modular_frame: 2, computer: 2, cable: 50 },
  refinery: { steel_ingot: 15, circuit_board: 10, cable: 30 },
  coal_generator: { reinforced_iron_plate: 8, rotor: 8, cable: 15 },
  fuel_generator: { heavy_modular_frame: 1, circuit_board: 5, rubber: 20 },
  nuclear_plant: { supercomputer: 5, heavy_modular_frame: 25, concrete: 500 },
  research_lab: { reinforced_iron_plate: 10, rotor: 10, cable: 50 },
  quantum_computer: { supercomputer: 10, ai_limiter: 20, cable: 200 }
};

// src/data/gameData.js - Ajoute à la fin
export const safeSubtract = (resources, resourceType, amount) => {
  const current = resources[resourceType] || 0;
  return Math.max(0, current - amount);
};

export const hasEnoughResources = (resources, requirements) => {
  return Object.entries(requirements).every(([resource, amount]) => {
    const available = resources[resource] || 0;
    return available >= amount;
  });
};
