import { FoundIngredient } from '@/types';

export const ingredients: FoundIngredient[] = [
  // Seed Oils (High Linoleic Acid)
  {
    name: "Safflower Oil",
    category: "seed_oil",
    severity: "high",
    description: "Contains approximately 70% linoleic acid. Highly processed seed oil that may contribute to inflammation when consumed in excess.",
    aliases: ["high-linoleic safflower oil", "Safflower Seed Oil", "Expeller Pressed Safflower Seed Oil", "Organic Expeller Pressed Safflower Seed Oil"]
  },
  {
    name: "Grape Seed Oil",
    category: "seed_oil",
    severity: "high",
    description: "Contains approximately 70% linoleic acid. Extracted using chemical solvents, may contain harmful residues.",
    aliases: ["grapeseed oil"]
  },
  {
    name: "Sunflower Oil",
    category: "seed_oil",
    severity: "high",
    description: "Contains approximately 68% linoleic acid. Highly refined and processed, may contribute to inflammation.",
    aliases: ["high-linoleic sunflower oil", "Sunflower Seed Oil", "Expeller Pressed Sunflower Seed Oil", "Organic Expeller Pressed Sunflower Seed Oil"]
  },
  {
    name: "Corn Oil",
    category: "seed_oil",
    severity: "high",
    description: "Contains approximately 54% linoleic acid. Highly processed and often GMO. May contain pesticide residues.",
    aliases: ["maize oil", "refined corn oil"]
  },
  {
    name: "Cottonseed Oil",
    category: "seed_oil",
    severity: "high",
    description: "Contains approximately 52% linoleic acid. Heavily processed and may contain pesticide residues.",
    aliases: ["refined cottonseed oil"]
  },
  {
    name: "Soybean Oil",
    category: "seed_oil",
    severity: "high",
    description: "Contains approximately 51% linoleic acid. Highly processed and often GMO. Most common seed oil in processed foods.",
    aliases: ["vegetable oil", "refined soybean oil"]
  },
  {
    name: "Rice Bran Oil",
    category: "seed_oil",
    severity: "medium",
    description: "Contains approximately 33% linoleic acid. Less processed than some other seed oils but still high in omega-6 fatty acids.",
    aliases: ["refined rice bran oil"]
  },
  {
    name: "Peanut Oil",
    category: "seed_oil",
    severity: "medium",
    description: "Contains approximately 32% linoleic acid. Common in restaurants and processed foods.",
    aliases: ["groundnut oil", "refined peanut oil"]
  },
  {
    name: "Canola Oil",
    category: "seed_oil",
    severity: "medium",
    description: "Contains approximately 19% linoleic acid. Highly processed rapeseed oil, often GMO.",
    aliases: ["rapeseed oil", "refined canola oil"]
  },
  {
    name: "Palm Oil",
    category: "seed_oil",
    severity: "medium",
    description: "Contains approximately 10% linoleic acid. Highly processed and often used in processed foods. Environmental concerns exist.",
    aliases: ["refined palm oil"]
  },
  {
    name: "Palm Kernel Oil",
    category: "seed_oil",
    severity: "medium",
    description: "Contains approximately 10% linoleic acid. Similar to palm oil, highly processed and used in many processed foods.",
    aliases: ["refined palm kernel oil"]
  },
  
  // Fruit/Animal Based Oils (Low Linoleic Acid)
 
  {
    name: "Butter",
    category: "animal_fat",
    severity: "low",
    description: "Rich in saturated fat with minimal linoleic acid (~2%). Naturally sourced and nutrient-dense, especially when grass-fed.",
    aliases: ["grass-fed butter", "cultured butter"]
  },
  {
    name: "Lard",
    category: "animal_fat",
    severity: "low",
    description: "Rendered pig fat. Linoleic acid content varies (5–20%) depending on the pig's diet. Best when sourced from pasture-raised pigs.",
    aliases: ["pork fat", "rendered lard"]
  },
  {
    name: "Tallow",
    category: "animal_fat",
    severity: "low",
    description: "Beef or mutton fat with very low linoleic acid (~2%). Very stable at high heat. Ideal for cooking when from grass-fed sources.",
    aliases: ["beef fat", "suet", "rendered tallow"]
  },
  {
    name: "Olive Oil",
    category: "fruit_based_oil",
    severity: "low",
    description: "Contains approximately 10% linoleic acid. Minimally processed when extra virgin. Rich in beneficial compounds.",
    aliases: ["extra virgin olive oil", "EVOO"]
  },
  {
    name: "Coconut Oil",
    category: "fruit_based_oil",
    severity: "low",
    description: "Contains approximately 2% linoleic acid. Rich in MCTs. Very stable for cooking.",
    aliases: ["virgin coconut oil", "refined coconut oil"]
  },
  {
    name: "Avocado Oil",
    category: "fruit_based_oil",
    severity: "low",
    description: "Contains approximately 12% linoleic acid. High in monounsaturated fats. Good for high-heat cooking.",
    aliases: ["virgin avocado oil", "refined avocado oil"]
  },

  // Thickeners
  {
    name: "Carrageenan",
    category: "thickener",
    severity: "high",
    description: "Seaweed-derived thickener linked to inflammation and digestive issues. May promote intestinal permeability.",
    aliases: ["irish moss", "E407"]
  },
  {
    name: "Xanthan Gum",
    category: "thickener",
    severity: "medium",
    description: "Fermented sugar-based thickener. May cause digestive issues in sensitive individuals.",
    aliases: ["E415", "corn sugar gum"]
  },
  {
    name: "Guar Gum",
    category: "thickener",
    severity: "medium",
    description: "Plant-based thickener that may cause digestive issues when consumed in large amounts.",
    aliases: ["E412", "guaran"]
  },
  {
    name: "Carboxymethylcellulose",
    category: "thickener",
    severity: "medium",
    description: "Synthetic cellulose derivative that may alter gut bacteria and promote inflammation.",
    aliases: ["cellulose gum", "CMC", "E466"]
  },

  // Emulsifiers
  {
    name: "Polysorbate 80",
    category: "emulsifier",
    severity: "high",
    description: "Synthetic emulsifier that may disrupt gut bacteria and increase intestinal inflammation.",
    aliases: ["E433", "polyoxyethylene (20) sorbitan monooleate"]
  },
  {
    name: "Carrageenan",
    category: "emulsifier",
    severity: "high",
    description: "Can cause inflammation and digestive issues. Often used as both thickener and emulsifier.",
    aliases: ["E407"]
  },
  {
    name: "Mono and Diglycerides",
    category: "emulsifier",
    severity: "medium",
    description: "Synthetic fat-based emulsifiers that may contain trans fats. Often used in processed foods.",
    aliases: ["E471", "mono-diglycerides", "mono and di-glycerides"]
  },
  {
    name: "Soy Lecithin",
    category: "emulsifier",
    severity: "medium",
    description: "Soy-derived emulsifier, often GMO. May contain residual solvents from processing.",
    aliases: ["E322", "lecithin"]
  },

  // Food Colors
  {
    name: "Red 40",
    category: "food_color",
    severity: "high",
    description: "Petroleum-derived red dye linked to hyperactivity in children and allergic reactions.",
    aliases: ["Allura Red AC", "E129", "FD&C Red 40"]
  },
  {
    name: "Yellow 5",
    category: "food_color",
    severity: "high",
    description: "Synthetic yellow dye associated with behavioral problems and allergic reactions.",
    aliases: ["Tartrazine", "E102", "FD&C Yellow 5"]
  },
  {
    name: "Yellow 6",
    category: "food_color",
    severity: "high",
    description: "Artificial orange-yellow dye linked to hyperactivity and allergic reactions.",
    aliases: ["Sunset Yellow FCF", "E110", "FD&C Yellow 6"]
  },
  {
    name: "Blue 1",
    category: "food_color",
    severity: "high",
    description: "Synthetic blue dye that may cause allergic reactions and hyperactivity.",
    aliases: ["Brilliant Blue FCF", "E133", "FD&C Blue 1"]
  },

  // Preservatives
  {
    name: "BHA",
    category: "preservative",
    severity: "high",
    description: "Synthetic antioxidant linked to cancer in animal studies. Known endocrine disruptor.",
    aliases: ["Butylated hydroxyanisole", "E320"]
  },
  {
    name: "BHT",
    category: "preservative",
    severity: "high",
    description: "Synthetic preservative with potential carcinogenic effects. May affect hormone function.",
    aliases: ["Butylated hydroxytoluene", "E321"]
  },
  {
    name: "Sodium Nitrite",
    category: "preservative",
    severity: "high",
    description: "Used in cured meats. Can form carcinogenic nitrosamines when heated.",
    aliases: ["E250", "nitrite"]
  },
  {
    name: "Sodium Benzoate",
    category: "preservative",
    severity: "medium",
    description: "When combined with vitamin C, can form benzene, a carcinogen.",
    aliases: ["E211", "benzoate"]
  },

  // Natural Flavors
  {
    name: "Natural Flavors",
    category: "natural_flavor",
    severity: "medium",
    description: "Can contain up to 100 ingredients, including synthetic preservatives and solvents.",
    aliases: ["natural flavoring", "natural flavourings", "natural flavor", "natural butter and cheese flavor"]
  },
  {
    name: "Natural Flavor with Other Natural Flavors",
    category: "natural_flavor",
    severity: "medium",
    description: "Complex mixture of flavoring substances, often highly processed.",
    aliases: ["WONF", "with other natural flavors"]
  },

  // Phosphates
  {
    name: "Sodium Phosphate",
    category: "phosphate",
    severity: "medium",
    description: "Common phosphate additive that may contribute to kidney problems and mineral imbalances.",
    aliases: ["E339", "disodium phosphate", "trisodium phosphate", "sodium phosphate monobasic", "sodium phosphate dibasic", "sodium phosphate tribasic"]
  },
  {
    name: "Phosphoric Acid",
    category: "phosphate",
    severity: "medium",
    description: "Often used in sodas. May contribute to bone loss and kidney problems.",
    aliases: ["E338", "orthophosphoric acid"]
  },
  {
    name: "Sodium Acid Pyrophosphate",
    category: "phosphate",
    severity: "medium",
    description: "Used in baking powders and processed foods. May affect calcium absorption.",
    aliases: ["E450", "SAPP", "sodium pyrophosphate"]
  },
  {
    name: "Calcium Phosphate",
    category: "phosphate",
    severity: "medium",
    description: "Used as a leavening agent and calcium supplement. May contribute to mineral imbalances when consumed in excess.",
    aliases: ["E341", "calcium phosphate monobasic", "calcium phosphate dibasic", "calcium phosphate tribasic", "tricalcium phosphate"]
  },
  {
    name: "Potassium Phosphate",
    category: "phosphate",
    severity: "medium",
    description: "Used as a buffer and mineral supplement. May affect kidney function when consumed regularly.",
    aliases: ["E340", "potassium phosphate monobasic", "potassium phosphate dibasic", "potassium phosphate tribasic"]
  },
  {
    name: "Sodium Hexametaphosphate",
    category: "phosphate",
    severity: "medium",
    description: "Used as a sequestrant and texturizer. May interfere with mineral absorption.",
    aliases: ["E452", "SHMP", "sodium polyphosphate", "Graham's salt"]
  },
  {
    name: "Sodium Tripolyphosphate",
    category: "phosphate",
    severity: "medium",
    description: "Used as a preservative and to retain moisture. May contribute to cardiovascular issues.",
    aliases: ["E451", "STPP", "pentasodium tripolyphosphate"]
  },
  
  // Artificial Sweeteners
  {
    name: "Aspartame",
    category: "artificial_sweetener",
    severity: "high",
    description: "Synthetic sweetener linked to headaches, dizziness, and potential neurological effects. Contains phenylalanine which is harmful for people with PKU.",
    aliases: ["E951", "NutraSweet", "Equal", "AminoSweet"]
  },
  {
    name: "Sucralose",
    category: "artificial_sweetener",
    severity: "high",
    description: "Chlorinated sugar substitute that may negatively impact gut bacteria and insulin sensitivity. Studies suggest it may generate harmful compounds when heated.",
    aliases: ["E955", "Splenda"]
  },
  {
    name: "Acesulfame Potassium",
    category: "artificial_sweetener",
    severity: "high",
    description: "Synthetic sweetener that may affect metabolic function and gut bacteria. Often used in combination with other artificial sweeteners.",
    aliases: ["Acesulfame K", "Ace-K", "E950", "Sunett", "Sweet One"]
  },
  {
    name: "Saccharin",
    category: "artificial_sweetener",
    severity: "high",
    description: "Oldest artificial sweetener with potential links to cancer in some studies. May disrupt gut bacteria and glucose tolerance.",
    aliases: ["E954", "Sweet'N Low", "Sweet Twin", "Necta Sweet"]
  },
  {
    name: "Neotame",
    category: "artificial_sweetener",
    severity: "high",
    description: "Chemical derivative of aspartame that is much sweeter. Limited long-term human studies on safety.",
    aliases: ["E961", "Newtame"]
  },
  {
    name: "Advantame",
    category: "artificial_sweetener",
    severity: "medium",
    description: "Newest FDA-approved sweetener derived from aspartame. Limited research on long-term effects.",
    aliases: ["E969"]
  },
  {
    name: "Cyclamate",
    category: "artificial_sweetener",
    severity: "high",
    description: "Banned in the US since 1970 but still used in some countries. Potential carcinogenic effects in combination with saccharin.",
    aliases: ["E952", "sodium cyclamate", "calcium cyclamate"]
  },
  {
    name: "Alitame",
    category: "artificial_sweetener",
    severity: "medium",
    description: "Approved in some countries but not in the US. Limited data on long-term safety.",
    aliases: ["Aclame"]
  }
];