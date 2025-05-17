import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Image, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { FileImage, Camera, AlertCircle, Barcode, Flashlight, ScanLine } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

import Colors from '@/constants/colors';
import ScanButton from '@/components/ScanButton';
import EmptyState from '@/components/EmptyState';
import { useScanStore } from '@/store/scanStore';
import { recognizeText, prepareImageForOCR } from '@/utils/textRecognition';
import { analyzeImage } from '@/utils/ingredientAnalyzer';
import { fetchProductData } from '@/utils/openFoodFacts';
import LogoHeader from '@/components/LogoHeader';

type ScanMode = 'label' | 'barcode' | 'combined';

export default function ScanScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>('combined');
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  
  const cameraRef = useRef<any>(null);
  const { isScanning, isAnalyzing, setIsScanning, setIsAnalyzing, addToHistory } = useScanStore();
  
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const toggleTorch = () => {
    setTorchOn(current => !current);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const toggleScanMode = () => {
    setScanMode(current => {
      if (current === 'combined') return 'barcode';
      if (current === 'barcode') return 'label';
      return 'combined';
    });
    
    // Reset barcode data when changing modes
    setBarcodeData(null);
    setError(null);
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  const takePicture = async () => {
    if (isScanning || isAnalyzing) return;
    
    try {
      setIsScanning(true);
      setError(null);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      if (!cameraRef.current) return;
      
      const photo = await cameraRef.current.takePictureAsync();
      
      // Resize image to reduce processing time and file size
      const manipResult = await manipulateAsync(
        photo.uri,
        [{ resize: { width: 1000 } }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      
      setCapturedImage(manipResult.uri);
      
      // Process based on scan mode
      if (scanMode === 'barcode') {
        // If we're in barcode-only mode and don't have barcode data yet, show error
        if (!barcodeData) {
          setError('No barcode detected. Please position the barcode within the frame and try again.');
          setIsScanning(false);
          setCapturedImage(null);
          return;
        }
        
        // Process with barcode only
        await processWithBarcodeOnly(barcodeData);
      } else {
        // Process image with OCR (and barcode if available in combined mode)
        await processImage(manipResult.uri, barcodeData);
      }
    } catch (err) {
      console.error('Error taking picture:', err);
      setError('Failed to take picture. Please try again.');
      setIsScanning(false);
      setCapturedImage(null);
    }
  };
  
  const pickImage = async () => {
    if (isScanning || isAnalyzing) return;
    
    try {
      setIsScanning(true);
      setError(null);
      
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Resize image to reduce processing time and file size
        const manipResult = await manipulateAsync(
          selectedImage.uri,
          [{ resize: { width: 1000 } }],
          { compress: 0.8, format: SaveFormat.JPEG }
        );
        
        setCapturedImage(manipResult.uri);
        
        // Always process with OCR for gallery images (no barcode detection)
        await processImage(manipResult.uri, null);
      } else {
        setIsScanning(false);
        setCapturedImage(null);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Failed to pick image. Please try again.');
      setIsScanning(false);
      setCapturedImage(null);
    }
  };
  
  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (isScanning || isAnalyzing) return;
    
    try {
      // Trim any spaces from the barcode data
      const trimmedBarcode = data.trim();
      
      // Only process if we don't already have this barcode
      if (barcodeData !== trimmedBarcode) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        setBarcodeData(trimmedBarcode);
        
        if (scanMode === 'barcode') {
          setError(`Barcode detected: ${trimmedBarcode}. Tap the scan button to look up product information.`);
        } else if (scanMode === 'combined') {
          setError(`Barcode detected: ${trimmedBarcode}. Now capture the ingredients label or tap the scan button.`);
        }
      }
    } catch (err) {
      console.error('Error processing barcode:', err);
      setError('Failed to process barcode. Please try again.');
    }
  };
  
  const processImage = async (imageUri: string, barcode: string | null) => {
    try {
      setIsAnalyzing(true);
      
      // Read the image file
      const imageInfo = await FileSystem.getInfoAsync(imageUri);
      
      if (!imageInfo.exists) {
        throw new Error('Image file does not exist');
      }
      
      // Prepare image for OCR (optimize for text recognition)
      const base64Image = await prepareImageForOCR(imageUri);
      
      // Extract text from image using Tesseract OCR
      const extractedText = await recognizeText(base64Image);
      
      console.log('Extracted text:', extractedText);
      
      // If we have a barcode, fetch product data from Open Food Facts
      let apiIngredientsText = '';
      let productName = '';
      
      if (barcode) {
        try {
          const productData = await fetchProductData(barcode);
          if (productData) {
            apiIngredientsText = productData.ingredients_text || '';
            productName = productData.product_name || '';
          }
        } catch (apiError) {
          console.warn('Failed to fetch product data from API:', apiError);
          // Continue with OCR data only
        }
      }
      
      // Analyze the extracted text and API data
      const result = await analyzeImage(imageUri, extractedText, apiIngredientsText, productName);
      
      // Add result to history
      addToHistory(result);
      
      // Navigate to the scan result screen
      router.push('/scan-result');
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsScanning(false);
      setIsAnalyzing(false);
      setCapturedImage(null);
      setBarcodeData(null);
    }
  };
  
  const processWithBarcodeOnly = async (barcode: string) => {
    try {
      setIsAnalyzing(true);
      
      // Fetch product data from Open Food Facts
      const productData = await fetchProductData(barcode);
      
      if (!productData || !productData.ingredients_text) {
        setError('No ingredient information found for this barcode. Try scanning the label directly.');
        setIsScanning(false);
        setIsAnalyzing(false);
        setCapturedImage(null);
        return;
      }
      
      // Use a placeholder image for barcode-only scans
      const placeholderImage = capturedImage || 'https://images.unsplash.com/photo-1607006344380-b6775a0824ce?q=80&w=1000&auto=format&fit=crop';
      
      // Analyze the API data
      const result = await analyzeImage(
        placeholderImage, 
        '', // No OCR text
        productData.ingredients_text,
        productData.product_name
      );
      
      // Add result to history
      addToHistory(result);
      
      // Navigate to the scan result screen
      router.push('/scan-result');
    } catch (err) {
      console.error('Error processing barcode:', err);
      setError('Failed to retrieve product information. Please try scanning the label directly.');
    } finally {
      setIsScanning(false);
      setIsAnalyzing(false);
      setCapturedImage(null);
      setBarcodeData(null);
    }
  };
  
  const resetCamera = () => {
    setCapturedImage(null);
    setError(null);
    setBarcodeData(null);
  };

  const getScanModeLabel = () => {
    switch (scanMode) {
      case 'combined':
        return 'Combined Mode';
      case 'barcode':
        return 'Barcode Only';
      case 'label':
        return 'Label Only';
    }
  };

  const getScanModeInstructions = () => {
    switch (scanMode) {
      case 'combined':
        return barcodeData 
          ? 'Now capture the ingredients label'
          : 'Position the barcode and/or ingredients label in frame';
      case 'barcode':
        return 'Position the barcode within the frame';
      case 'label':
        return 'Position the ingredients label within the frame';
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState 
          title="Loading Camera"
          message="Please wait while we access your camera..."
        />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ 
          title: "Scan Label",
          headerTitle: () => <LogoHeader />
        }} />
        <EmptyState 
          title="Camera Access Needed"
          message="We need your permission to use the camera to scan nutrition labels."
        />
        <TouchableOpacity 
          style={[styles.permissionButton, { backgroundColor: colors.primary }]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ 
        title: getScanModeLabel(),
        headerTitle: () => <LogoHeader />
      }} />
      
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: capturedImage }} 
            style={styles.previewImage} 
            resizeMode="contain"
          />
          
          <View style={styles.processingOverlay}>
            <Text style={[styles.processingText, { color: colors.text }]}>
              {isAnalyzing ? 'Analyzing ingredients...' : 'Processing image...'}
            </Text>
          </View>
        </View>
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            enableTorch={torchOn}
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
            }}
            onBarcodeScanned={scanMode !== 'label' ? handleBarcodeScanned : undefined}
          >
            <View style={styles.cameraOverlay}>
              <View style={[
                styles.scanFrame, 
                scanMode === 'barcode' ? styles.barcodeFrame : styles.labelFrame
              ]} />
              
              <Text style={styles.instructionText}>
                {getScanModeInstructions()}
              </Text>
            </View>
          </CameraView>
          
          <View style={styles.modeSelector}>
            <TouchableOpacity 
              style={[
                styles.modeSelectorButton, 
                scanMode === 'combined' && { backgroundColor: colors.primary + '30' }
              ]}
              onPress={() => setScanMode('combined')}
            >
              <ScanLine size={16} color={scanMode === 'combined' ? colors.primary : colors.subtext} />
              <Text style={[
                styles.modeSelectorText, 
                { color: scanMode === 'combined' ? colors.primary : colors.subtext }
              ]}>
                Combined
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.modeSelectorButton, 
                scanMode === 'label' && { backgroundColor: colors.primary + '30' }
              ]}
              onPress={() => setScanMode('label')}
            >
              <FileImage size={16} color={scanMode === 'label' ? colors.primary : colors.subtext} />
              <Text style={[
                styles.modeSelectorText, 
                { color: scanMode === 'label' ? colors.primary : colors.subtext }
              ]}>
                Label Only
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.modeSelectorButton, 
                scanMode === 'barcode' && { backgroundColor: colors.primary + '30' }
              ]}
              onPress={() => setScanMode('barcode')}
            >
              <Barcode size={16} color={scanMode === 'barcode' ? colors.primary : colors.subtext} />
              <Text style={[
                styles.modeSelectorText, 
                { color: scanMode === 'barcode' ? colors.primary : colors.subtext }
              ]}>
                Barcode Only
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: colors.card }]}
              onPress={toggleCameraFacing}
            >
              <Camera size={24} color={colors.text} />
            </TouchableOpacity>
            
            <ScanButton 
              onPress={takePicture} 
              isScanning={isScanning} 
              mode={scanMode === 'barcode' ? 'barcode' : 'label'}
            />
            
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: colors.card }]}
              onPress={scanMode !== 'barcode' ? pickImage : toggleScanMode}
            >
              {scanMode !== 'barcode' ? (
                <FileImage size={24} color={colors.text} />
              ) : (
                <ScanLine size={24} color={colors.text} />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.secondaryControlsContainer}>
            <TouchableOpacity 
              style={[
                styles.torchButton, 
                { 
                  backgroundColor: torchOn ? colors.primary : colors.card,
                  borderColor: colors.border
                }
              ]}
              onPress={toggleTorch}
            >
              <Flashlight size={20} color={torchOn ? '#FFFFFF' : colors.text} />
            </TouchableOpacity>
          </View>
          
          {error && (
            <View style={[
              styles.errorContainer, 
              { backgroundColor: barcodeData ? colors.primary + '20' : colors.danger + '20' }
            ]}>
              {barcodeData ? (
                <Barcode size={20} color={colors.primary} />
              ) : (
                <AlertCircle size={20} color={colors.danger} />
              )}
              <Text style={[
                styles.errorText, 
                { color: barcodeData ? colors.primary : colors.danger }
              ]}>
                {error}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
  },
  labelFrame: {
    width: 280,
    height: 400,
  },
  barcodeFrame: {
    width: 280,
    height: 120,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modeSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 4,
  },
  modeSelectorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  secondaryControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  torchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});