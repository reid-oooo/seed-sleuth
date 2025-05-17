import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import { createWorker } from 'tesseract.js';

/**
 * Recognizes text from an image using Tesseract.js
 * 
 * NOTE FOR PRODUCTION:
 * For better performance in a production app, you should use native OCR implementations:
 * 
 * 1. iOS: Use Vision framework via native modules
 *    - VNRecognizeTextRequest API provides fast on-device OCR
 *    - Implement through a native module bridge
 * 
 * 2. Android: Use ML Kit Text Recognition or tess-two
 *    - ML Kit provides on-device text recognition with good performance
 *    - tess-two is a native Android wrapper for Tesseract
 * 
 * 3. Both platforms: Consider using Expo's native module system or eject to bare workflow
 *    for implementing these native solutions
 */
export async function recognizeText(imageBase64: string): Promise<string> {
  try {
    console.log('Starting OCR process with Tesseract.js');
    
    // Create a worker with English language
    const worker = await createWorker('eng');
    
    // Log progress for debugging
    console.log('Tesseract worker created');
    
    // Recognize text from the base64 image
    // Format the base64 string properly for Tesseract
    const imageData = `data:image/jpeg;base64,${imageBase64}`;
    
    console.log('Recognizing text...');
    const { data } = await worker.recognize(imageData);
    
    // Terminate the worker to free resources
    await worker.terminate();
    console.log('OCR process completed');
    
    // Return the extracted text
    return data.text;
  } catch (error: any) {
    console.error('Error recognizing text with Tesseract:', error);
    
    // Provide a fallback for error cases
    if (Platform.OS === 'web') {
      alert('Text recognition failed. Please try again or use a clearer image.');
    }
    
    // Rethrow to be handled by the caller
    throw new Error(`OCR failed: ${error.message}`);
  }
}

/**
 * Prepares an image for OCR by optimizing it for text recognition
 * 
 * NOTE FOR PRODUCTION:
 * In a production app, you would use platform-specific image processing:
 * 
 * 1. iOS: Use Core Image filters for preprocessing
 * 2. Android: Use RenderScript or OpenCV for image processing
 * 3. Both: Consider a more sophisticated preprocessing pipeline:
 *    - Grayscale conversion
 *    - Binarization (adaptive thresholding)
 *    - Noise removal
 *    - Perspective correction
 *    - Contrast enhancement
 */
export async function prepareImageForOCR(imageUri: string): Promise<string> {
  try {
    // Resize image for optimal OCR performance
    const maxWidth = 1000;
    const maxHeight = 1000;
    const compressFormat = 'JPEG';
    const quality = 80;
    const rotation = 0;
    const resizedImage = await ImageResizer.createResizedImage(
      imageUri,
      maxWidth,
      maxHeight,
      compressFormat,
      quality,
      rotation
    );
    // Read resized image as base64
    const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');
    return base64Image;
  } catch (error: any) {
    console.error('Error preparing image for OCR:', error);
    throw error;
  }
}

// This function is kept for compatibility but will be deprecated
export async function analyzeIngredientsWithAI(detectedText: string): Promise<string> {
  return "AI analysis has been disabled to reduce costs. The app now uses built-in ingredient detection.";
}