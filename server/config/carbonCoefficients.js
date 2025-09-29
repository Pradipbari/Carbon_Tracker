// server/config/carbonCoefficients.js

// This object maps a specific activity type to its emissions factor (kg CO2e per unit)
// NOTE: These are simplified, example values for development purposes.

const carbonCoefficients = {
  // --- TRANSPORT (Unit: Miles) ---
  "Car (Gasoline)": { factor: 0.404, unit: "Miles" },
  "Car (Electric)": { factor: 0.05, unit: "Miles" }, // Assuming a clean grid mix
  "Bus / Train": { factor: 0.08, unit: "Miles" },
  Airplane: { factor: 0.2, unit: "Miles" },

  // --- FOOD (Unit: Meals) ---
  "Meat-Heavy Meal": { factor: 3.5, unit: "Meals" },
  "Standard Meal": { factor: 1.5, unit: "Meals" },
  "Vegetarian Meal": { factor: 0.8, unit: "Meals" },
  "Vegan Meal": { factor: 0.5, unit: "Meals" },

  // --- HOME ENERGY (Unit: kWh) ---
  Electricity: { factor: 0.518, unit: "kWh" }, // Varies greatly by region
  "Natural Gas": { factor: 0.18, unit: "kWh" },

  // --- WASTE (Unit: Bags) ---
  "Garbage Bag (to landfill)": { factor: 2.0, unit: "Bags" },
  "Recycling (avoided emissions)": { factor: -0.5, unit: "Bags" },
};

module.exports = carbonCoefficients;
