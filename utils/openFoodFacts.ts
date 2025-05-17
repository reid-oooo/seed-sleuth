interface OpenFoodFactsProduct {
  product_name?: string;
  ingredients_text?: string;
  ingredients_text_en?: string;
  product?: {
    product_name?: string;
    ingredients_text?: string;
    ingredients_text_en?: string;
  };
  status?: number;
  status_verbose?: string;
}

export async function fetchProductData(barcode: string): Promise<{
  product_name: string;
  ingredients_text: string;
} | null> {
  try {
    // Ensure barcode is trimmed of any whitespace
    const trimmedBarcode = barcode.trim();
    
    // Make API request with trimmed barcode
    const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${trimmedBarcode}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: OpenFoodFactsProduct = await response.json();
    
    // Check if the product was found
    if (data.status !== 1 && data.status_verbose !== 'product found') {
      console.log('Product not found in Open Food Facts database');
      return null;
    }
    
    // Extract product information
    let productName = '';
    let ingredientsText = '';
    
    // Handle different API response structures
    if (data.product) {
      productName = data.product.product_name || '';
      ingredientsText = data.product.ingredients_text || data.product.ingredients_text_en || '';
    } else {
      productName = data.product_name || '';
      ingredientsText = data.ingredients_text || data.ingredients_text_en || '';
    }
    
    return {
      product_name: productName,
      ingredients_text: ingredientsText
    };
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}