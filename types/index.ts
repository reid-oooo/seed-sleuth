export interface ScanResult {
  id: string;
  date: string;
  imageUri: string;
  detectedText: string;
  foundIngredients: FoundIngredient[];
  overallRating: 'safe' | 'caution' | 'avoid';
  processingLevel: ProcessingLevel;
  productName?: string;
  apiSource?: string;
}

export interface FoundIngredient {
  name: string;
  aliases: string[];
  category: 'seed_oil' | 'fruit_based_oil' | 'animal_fat' | 'thickener' | 'emulsifier' | 'food_color' | 'preservative' | 'natural_flavor' | 'phosphate' | 'artificial_sweetener' | 'other';
  severity: 'high' | 'medium' | 'low' | 'neutral';
  description: string;
}

export type ProcessingLevel = 'unprocessed' | 'minimally_processed' | 'processed_culinary' | 'processed' | 'ultra_processed';