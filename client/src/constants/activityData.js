// client/src/constants/activityData.js

export const ACTIVITY_CATEGORIES = [
  {
    name: "Transport",
    types: ["Car (Gasoline)", "Car (Electric)", "Bus / Train", "Airplane"],
    unit: "Miles",
  },
  {
    name: "Food",
    types: [
      "Meat-Heavy Meal",
      "Standard Meal",
      "Vegetarian Meal",
      "Vegan Meal",
    ],
    unit: "Meals",
  },
  { name: "Home Energy", types: ["Electricity", "Natural Gas"], unit: "kWh" },
  {
    name: "Waste",
    types: ["Garbage Bag (to landfill)", "Recycling (avoided emissions)"],
    unit: "Bags",
  },
];

// Helper function to get the unit based on the selected category name
export const getUnitForCategory = (categoryName) => {
  const category = ACTIVITY_CATEGORIES.find((c) => c.name === categoryName);
  return category ? category.unit : "";
};
