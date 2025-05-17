import { ingredients } from '@/constants/ingredients';
import { FoundIngredient, ScanResult, ProcessingLevel } from '@/types';
import { ultraProcessedIndicators, processedIndicators, processedCulinaryIndicators } from '@/constants/processing';

export function analyzeIngredients(text: string): FoundIngredient[] {
  const foundIngredients: FoundIngredient[] = [];
  const lowerText = text.toLowerCase();
  
  // Add word boundary checks to prevent partial matches
  const addWordBoundary = (term: string) => {
    // Only add word boundaries if the term is a single word
    if (!term.includes(' ')) {
      return `\\b${term}\\b`;
    }
    return term;
  };

  // Process the text to find ingredients
  ingredients.forEach(ingredient => {
    // Check for the main name with word boundary for single words
    const mainNamePattern = new RegExp(addWordBoundary(ingredient.name.toLowerCase()), 'i');
    if (mainNamePattern.test(lowerText)) {
      // Special case for "butter" to exclude "cocoa butter", "shea butter", etc.
      if (ingredient.name.toLowerCase() === "butter") {
        // Check if it's not part of "cocoa butter", "shea butter", etc.
        const excludePatterns = [
          /cocoa\s+butter/i,
          /shea\s+butter/i,
          /almond\s+butter/i,
          /peanut\s+butter/i,
          /cashew\s+butter/i,
          /mango\s+butter/i,
          /seed\s+butter/i,
          /nut\s+butter/i,
          /natural\s+butter\s+and\s+cheese\s+flavor/i,
          /natural\s+butter\s+flavor/i,
          /butter\s+flavor/i,
          /flavored\s+with\s+butter/i
        ];
        
        // Check if any exclusion pattern matches
        const isExcluded = excludePatterns.some(pattern => pattern.test(lowerText));
        
        if (!isExcluded) {
          foundIngredients.push({
            name: ingredient.name,
            category: ingredient.category,
            severity: ingredient.severity,
            description: ingredient.description,
            aliases: ingredient.aliases
          });
        }
      } else {
        foundIngredients.push({
          name: ingredient.name,
          category: ingredient.category,
          severity: ingredient.severity,
          description: ingredient.description,
          aliases: ingredient.aliases
        });
      }
      return;
    }

    // Check for aliases with word boundary for single words
    for (const alias of ingredient.aliases) {
      const aliasPattern = new RegExp(addWordBoundary(alias.toLowerCase()), 'i');
      if (aliasPattern.test(lowerText)) {
        // Special case for butter aliases
        if (ingredient.name.toLowerCase() === "butter") {
          // Check if it's not part of "cocoa butter", "shea butter", etc.
          const excludePatterns = [
            /cocoa\s+butter/i,
            /shea\s+butter/i,
            /almond\s+butter/i,
            /peanut\s+butter/i,
            /cashew\s+butter/i,
            /mango\s+butter/i,
            /seed\s+butter/i,
            /nut\s+butter/i,
            /natural\s+butter\s+and\s+cheese\s+flavor/i,
            /natural\s+butter\s+flavor/i,
            /butter\s+flavor/i,
            /flavored\s+with\s+butter/i
          ];
          
          // Check if any exclusion pattern matches
          const isExcluded = excludePatterns.some(pattern => pattern.test(lowerText));
          
          if (!isExcluded) {
            foundIngredients.push({
              name: ingredient.name,
              category: ingredient.category,
              severity: ingredient.severity,
              description: ingredient.description,
              aliases: ingredient.aliases
            });
          }
        } else {
          foundIngredients.push({
            name: ingredient.name,
            category: ingredient.category,
            severity: ingredient.severity,
            description: ingredient.description,
            aliases: ingredient.aliases
          });
        }
        return;
      }
    }
  });

  return foundIngredients;
}

export function calculateOverallRating(foundIngredients: FoundIngredient[]): 'safe' | 'caution' | 'avoid' {
  if (foundIngredients.length === 0) return 'safe';

  const hasHighSeverity = foundIngredients.some(i => i.severity === 'high');
  if (hasHighSeverity) return 'avoid';

  const hasMediumSeverity = foundIngredients.some(i => i.severity === 'medium');
  if (hasMediumSeverity) return 'caution';

  return 'safe';
}

export function determineProcessingLevel(text: string): ProcessingLevel {
  const lowerText = text.toLowerCase();
  
  // Check for ultra-processed indicators
  for (const indicator of ultraProcessedIndicators) {
    if (lowerText.includes(indicator.toLowerCase())) {
      return 'ultra_processed';
    }
  }
  
  // Check for processed indicators
  for (const indicator of processedIndicators) {
    if (lowerText.includes(indicator.toLowerCase())) {
      return 'processed';
    }
  }
  
  // Check for processed culinary ingredients
  for (const indicator of processedCulinaryIndicators) {
    if (lowerText.includes(indicator.toLowerCase())) {
      return 'processed_culinary';
    }
  }
  
  // If the text is very short or has very few ingredients, it's likely minimally processed
  const words = lowerText.split(/\s+/);
  if (words.length < 10) {
    return 'minimally_processed';
  }
  
  // If there are multiple ingredients but no clear ultra-processed indicators,
  // it's likely processed
  const commaCount = (lowerText.match(/,/g) || []).length;
  if (commaCount > 3) {
    return 'processed';
  }
  
  // Default to minimally processed if we can't determine
  return 'minimally_processed';
}

export function extractProductName(text: string): string | undefined {
  // This is a simple implementation - in a real app, you might use more sophisticated NLP
  const lines = text.split('\n');
  
  // Often the product name is in the first few lines
  // We'll take the first non-empty line that's not "ingredients" or "nutrition facts"
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (
      line && 
      !line.toLowerCase().includes('ingredients') && 
      !line.toLowerCase().includes('nutrition facts')
    ) {
      return line;
    }
  }
  
  return undefined;
}

// Merge ingredients from OCR and API
export function mergeIngredientsData(ocrText: string, apiText: string): string {
  if (!apiText) return ocrText;
  if (!ocrText) return apiText;
  
  // Simple approach: concatenate both texts with a separator
  // In a production app, you might want to implement a more sophisticated merging algorithm
  return `${ocrText}

Additional ingredients from database:
${apiText}`;
}

export async function analyzeImage(
  imageUri: string, 
  detectedText: string, 
  apiIngredientsText: string = '',
  apiProductName: string = ''
): Promise<ScanResult> {
  // Merge OCR text with API ingredients text
  const mergedText = mergeIngredientsData(detectedText, apiIngredientsText);
  
  // Analyze the merged text
  const foundIngredients = analyzeIngredients(mergedText);
  const overallRating = calculateOverallRating(foundIngredients);
  const processingLevel = determineProcessingLevel(mergedText);
  
  // Use API product name if available, otherwise extract from OCR text
  const productName = apiProductName || extractProductName(detectedText);
  
  return {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    imageUri,
    detectedText: mergedText,
    foundIngredients,
    overallRating,
    processingLevel,
    productName,
    apiSource: apiIngredientsText ? 'Open Food Facts' : undefined
  };
}