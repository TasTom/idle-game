// data/gameData.js
export const INITIAL_RESOURCES = {
  gold: 100,
  gold_ingot: 0,
  experience: 0,
  mana: 50,
  max_mana: 50,
  energy: 100,
  max_energy: 100,
  // Minerais
  iron_ore: 0,
  copper_ore: 0,
  gold_ore: 0,
  // Lingots
  iron_ingot: 0,
  copper_ingot: 0,
  gold_ingot: 0,
  // Matériaux magiques
  soul_essence: 0,
  mana_crystal: 0,
  // Matériaux spéciaux
  desert_herb: 0,
  sand_glass: 0,
  venom_sac: 0,
  golem_core: 0,
  bandit_mask: 0
};

export const CHARACTER_STATS = {
  hitpoints: { current: 100, max: 100, level: 1, xp: 0, xp_to_next: 100 },
  attack: { level: 1, xp: 0, xp_to_next: 100 },
  defense: { level: 1, xp: 0, xp_to_next: 100 },
  mining: { level: 1, xp: 0, xp_to_next: 100 },
  smithing: { level: 1, xp: 0, xp_to_next: 100 },
  magic: { level: 1, xp: 0, xp_to_next: 100 },
  woodcutting: { level: 1, xp: 0, xp_to_next: 100 },
  fishing: { level: 1, xp: 0, xp_to_next: 100 }
};

// ===== ACTIONS ORGANISÉES PAR CATÉGORIE =====

export const ACTION_CATEGORIES = {
  mining: {
    name: "⛏️ Mining",
    color: "#8B4513",
    description: "Extract valuable ores from the desert"
  },
  smithing: {
    name: "🔨 Smithing", 
    color: "#FF6347",
    description: "Forge weapons and tools"
  },
  magic: {
    name: "🔮 Magic",
    color: "#9370DB", 
    description: "Study arcane arts and meditate"
  },
  combat: {
    name: "⚔️ Combat",
    color: "#DC143C",
    description: "Fight monsters and train"
  },
  gathering: {
    name: "🌿 Gathering",
    color: "#228B22",
    description: "Collect herbs and materials"
  }
};

// ===== ÉQUIPEMENTS =====
export const EQUIPMENT_TYPES = {
  weapon: { name: "Weapon", emoji: "⚔️", slot: "weapon" },
  armor: { name: "Armor", emoji: "🛡️", slot: "body" },
  helmet: { name: "Helmet", emoji: "⛑️", slot: "helmet" },
  boots: { name: "Boots", emoji: "👢", slot: "boots" },
  gloves: { name: "Gloves", emoji: "🧤", slot: "gloves" },
  accessory: { name: "Accessory", emoji: "💍", slot: "accessory" }
};

export const EQUIPMENT_ITEMS = {
  // === ARMES ===
  rusty_sword: {
    name: "Rusty Sword",
    type: "weapon",
    emoji: "🗡️",
    rarity: "common",
    stats: { attack: 3, defense: 0 },
    sell_price: 25,
    craft_req: { iron_ingot: 1 },
    unlock_req: { smithing: 5 }
  },

  iron_sword: {
    name: "Iron Sword",
    type: "weapon",
    emoji: "⚔️",
    rarity: "uncommon",
    stats: { attack: 8, defense: 1 },
    sell_price: 75,
    craft_req: { iron_ingot: 3, soul_essence: 1 },
    unlock_req: { smithing: 15 }
  },

  desert_blade: {
    name: "Desert Blade",
    type: "weapon",
    emoji: "🌟",
    rarity: "rare",
    stats: { attack: 15, defense: 2, magic: 3 },
    sell_price: 200,
    craft_req: { gold_ingot: 2, soul_essence: 5, desert_herb: 3 },
    unlock_req: { smithing: 30, magic: 20 }
  },

  // === ARMURES ===
  leather_vest: {
    name: "Leather Vest",
    type: "armor",
    emoji: "🦺",
    rarity: "common",
    stats: { defense: 5, attack: 0 },
    sell_price: 40,
    craft_req: { iron_ore: 2, soul_essence: 1 },
    unlock_req: { smithing: 8 }
  },

  iron_armor: {
    name: "Iron Armor",
    type: "armor",
    emoji: "🛡️",
    rarity: "uncommon",
    stats: { defense: 12, attack: 2 },
    sell_price: 120,
    craft_req: { iron_ingot: 5, soul_essence: 3 },
    unlock_req: { smithing: 20 }
  },

  // === CASQUES ===
  iron_helmet: {
    name: "Iron Helmet",
    type: "helmet",
    emoji: "⛑️",
    rarity: "common",
    stats: { defense: 3, magic: 1 },
    sell_price: 50,
    craft_req: { iron_ingot: 2 },
    unlock_req: { smithing: 12 }
  },

  // === ACCESSOIRES ===
  soul_ring: {
    name: "Soul Ring",
    type: "accessory",
    emoji: "💍",
    rarity: "rare",
    stats: { magic: 8, attack: 2, defense: 2 },
    sell_price: 300,
    craft_req: { soul_essence: 10, gold_ingot: 1, mana_crystal: 2 },
    unlock_req: { magic: 25, smithing: 25 }
  }
};

export const EQUIPMENT_RARITIES = {
  common: { name: "Common", color: "#FFFFFF", glow: "#CCCCCC" },
  uncommon: { name: "Uncommon", color: "#00FF00", glow: "#00DD00" },
  rare: { name: "Rare", color: "#0080FF", glow: "#0066DD" },
  epic: { name: "Epic", color: "#8000FF", glow: "#6600DD" },
  legendary: { name: "Legendary", color: "#FF8000", glow: "#DD6600" }
};

export const MINING_ACTIONS = {
  mine_iron: {
    name: 'Mine Iron Ore',
    time: 3000,
    xp: { mining: 15, attack: 2 },
    rewards: { iron_ore: 1 },
    unlock_req: { mining: 1 }
  },
  
  mine_copper: {
    name: 'Mine Copper Ore',
    time: 3500,
    xp: { mining: 20 },
    rewards: { copper_ore: 1 },
    unlock_req: { mining: 5 }
  }
};

export const SMITHING_ACTIONS = {
  smelt_iron: {
    name: 'Smelt Iron',
    time: 4000,
    xp: { smithing: 25 },
    cost: { iron_ore: 1 },
    rewards: { iron_ingot: 1 },
    unlock_req: { smithing: 1 }
  },

  craft_rusty_sword: {
    name: 'Craft Rusty Sword',
    time: 8000,
    xp: { smithing: 50 },
    cost: { iron_ingot: 1 },
    rewards: { rusty_sword: 1 },
    unlock_req: { smithing: 5 }
  },

  craft_iron_sword: {
    name: 'Craft Iron Sword',
    time: 12000,
    xp: { smithing: 80 },
    cost: { iron_ingot: 3, soul_essence: 1 },
    rewards: { iron_sword: 1 },
    unlock_req: { smithing: 15 }
  },

  craft_leather_vest: {
    name: 'Craft Leather Vest',
    time: 10000,
    xp: { smithing: 60 },
    cost: { iron_ore: 2, soul_essence: 1 },
    rewards: { leather_vest: 1 },
    unlock_req: { smithing: 8 }
  }
};

export const MAGIC_ACTIONS = {
  meditate: {
    name: 'Meditate for Mana',
    time: 5000,
    xp: { magic: 30 },
    rewards: { mana: 10 },
    unlock_req: { magic: 1 }
  }
};

export const COMBAT_ACTIONS = {
  train_attack: {
    name: 'Combat Training',
    time: 4000,
    xp: { attack: 25, defense: 10 },
    rewards: {},
    unlock_req: { attack: 1 }
  }
};

export const GATHERING_ACTIONS = {
  gather_desert_herb: {
    name: 'Gather Desert Herbs',
    time: 3500,
    xp: { magic: 10 },
    rewards: { desert_herb: 1 },
    unlock_req: { magic: 3 }
  }
};

// ===== MONSTRES ===== 
export const MONSTERS = {
  sand_crawler: {
    name: 'Sand Crawler',
    emoji: '🦂',
    level: 1,
    hp: 25,
    attack: 3,
    defense: 1,
    xp_reward: 15,
    gold_reward: [3, 8], // min, max
    loot_table: {
      soul_essence: { chance: 0.3, amount: [1, 2] },
      desert_herb: { chance: 0.15, amount: 1 }
    },
    unlock_req: { attack: 1 }
  },

  desert_scorpion: {
    name: 'Desert Scorpion',
    emoji: '🦂',
    level: 5,
    hp: 60,
    attack: 8,
    defense: 3,
    xp_reward: 35,
    gold_reward: [8, 15],
    loot_table: {
      soul_essence: { chance: 0.4, amount: [1, 3] },
      desert_herb: { chance: 0.25, amount: [1, 2] },
      venom_sac: { chance: 0.1, amount: 1 }
    },
    unlock_req: { attack: 5, defense: 3 }
  },

  sand_golem: {
    name: 'Sand Golem',
    emoji: '🗿',
    level: 10,
    hp: 150,
    attack: 12,
    defense: 8,
    xp_reward: 75,
    gold_reward: [15, 30],
    loot_table: {
      iron_ore: { chance: 0.6, amount: [2, 4] },
      soul_essence: { chance: 0.5, amount: [2, 4] },
      golem_core: { chance: 0.05, amount: 1 }
    },
    unlock_req: { attack: 10, defense: 5 }
  },

  desert_bandit: {
    name: 'Desert Bandit',
    emoji: '🏴‍☠️',
    level: 15,
    hp: 200,
    attack: 18,
    defense: 5,
    xp_reward: 120,
    gold_reward: [25, 50],
    loot_table: {
      gold: { chance: 0.8, amount: [10, 25] },
      iron_ingot: { chance: 0.3, amount: [1, 3] },
      bandit_mask: { chance: 0.08, amount: 1 }
    },
    unlock_req: { attack: 15, defense: 8 }
  }
};


// Combiner toutes les actions pour la compatibilité
export const ACTION_CONFIG = {
  ...MINING_ACTIONS,
  ...SMITHING_ACTIONS,
  ...MAGIC_ACTIONS,
  ...COMBAT_ACTIONS,
  ...GATHERING_ACTIONS
};