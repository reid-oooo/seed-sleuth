# Implementing Tesseract.js in React Native

This guide explains how to implement Tesseract.js for Optical Character Recognition (OCR) in a bare React Native application, without Expo.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Basic Usage](#basic-usage)
5. [Image Preprocessing](#image-preprocessing)
6. [Performance Optimization](#performance-optimization)
7. [Platform-Specific Considerations](#platform-specific-considerations)
8. [Limitations](#limitations)
9. [Native Alternatives](#native-alternatives)
10. [Ejecting from Expo](#ejecting-from-expo)
11. [Troubleshooting](#troubleshooting)

## Introduction

Tesseract.js is a pure JavaScript port of the Tesseract OCR engine, allowing you to recognize text from images in your React Native applications. It works across all platforms (iOS, Android, and web) without requiring native modules.

### How Tesseract.js Works

Tesseract.js uses WebAssembly (WASM) to run the Tesseract OCR engine in JavaScript. It downloads language data files on demand and processes images to extract text. The process involves:

1. Loading the OCR engine
2. Preprocessing the image
3. Recognizing text
4. Returning the extracted text

## Installation

```bash
# Install Tesseract.js
npm install tesseract.js

# For bare React Native projects, install file and image handling dependencies
npm install react-native-fs react-native-image-resizer
```

## Configuration

### Metro Configuration

For bare React Native projects, configure Metro to handle WASM and CJS files used by Tesseract.js. Create or update your `metro.config.js`:

```javascript
/**
 * Metro configuration for React Native
 * https://github.com/facebook/metro
 */
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: [...assetExts, 'wasm'],
      sourceExts: [...sourceExts, 'cjs'],
    },
  };
})();
```

### Babel Configuration

Update or create your `babel.config.js` to support React Native:

```javascript
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
```

## Basic Usage

Here's a basic implementation of Tesseract.js in a bare React Native application:

```typescript
// utils/textRecognition.ts
import { createWorker } from 'tesseract.js';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

export async function recognizeText(imageBase64: string): Promise<string> {
  try {
    console.log('Starting OCR process with Tesseract.js');
    const worker = await createWorker('eng');
    const imageData = `data:image/jpeg;base64,${imageBase64}`;
    const { data } = await worker.recognize(imageData);
    await worker.terminate();
    return data.text;
  } catch (error) {
    console.error('Error recognizing text:', error);
    throw error;
  }
}

export async function prepareImageForOCR(imageUri: string): Promise<string> {
  try {
    const maxWidth = 1000;
    const maxHeight = 1000;
    const quality = 80;
    const resizedImage = await ImageResizer.createResizedImage(
      imageUri,
      maxWidth,
      maxHeight,
      'JPEG',
      quality
    );
    const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');
    return base64Image;
  } catch (error) {
    console.error('Error preparing image for OCR:', error);
    throw error;
  }
}
```

## Image Preprocessing

Proper image preprocessing is crucial for accurate OCR results. Here are some techniques:

### Resizing

- Replace Expo-based resizing with react-native-image-resizer usage:

```typescript
import ImageResizer from 'react-native-image-resizer';

const maxWidth = 1000;
const maxHeight = 1000;
const quality = 80;
const rotation = 0;

const resizedImage = await ImageResizer.createResizedImage(
  imageUri,
  maxWidth,
  maxHeight,
  'JPEG',
  quality,
  rotation
);

// resizedImage.uri contains the path to the resized image
// Optionally, read it as base64:
import RNFS from 'react-native-fs';
const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');
```

### Advanced Preprocessing (Web Only)

For web platforms, you can use the Canvas API for more advanced preprocessing:

```typescript
async function preprocessImageForWeb(imageUri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Convert to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
      
      // Increase contrast
      const factor = 259 * (100 + 50) / (255 * (259 - 50));
      for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;
      }
      
      // Put processed image back on canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to base64
      const processedImageBase64 = canvas.toDataURL('image/jpeg', 0.8);
      resolve(processedImageBase64.split(',')[1]);
    };
    
    img.onerror = reject;
    img.src = imageUri;
  });
}
```

## Performance Optimization

### Worker Management

For better performance, consider reusing the Tesseract worker:

```typescript
let worker: Tesseract.Worker | null = null;

export async function initializeOCR(): Promise<void> {
  if (!worker) {
    worker = await createWorker('eng');
  }
}

export async function recognizeText(imageUri: string): Promise<string> {
  if (!worker) {
    await initializeOCR();
  }
  
  // Use the existing worker
  const { data } = await worker.recognize(`data:image/jpeg;base64,${base64Image}`);
  return data.text;
}

export async function cleanupOCR(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}
```

### Language Data Management

Tesseract.js downloads language data files on demand. For offline use, you can include these files in your app:

```typescript
import { createWorker } from 'tesseract.js';
import RNFS from 'react-native-fs';

// Specify the path to local language data (using react-native-fs)
const tessDataPath = RNFS.DocumentDirectoryPath + '/tessdata';
const worker = await createWorker({
  langPath: tessDataPath,
  cachePath: tessDataPath,
});
```

You'll need to download and include the language data files in your app bundle (e.g., copy them into the `tessdata` directory at runtime using RNFS).

## Platform-Specific Considerations

### Web

On web platforms, Tesseract.js works well out of the box. You can use the full range of features.

### iOS and Android

On mobile platforms, consider these optimizations:

1. **Memory Management**: Terminate workers when not in use
2. **UI Feedback**: Show loading indicators during OCR processing
3. **Error Handling**: Provide fallbacks for OCR failures

```typescript
import { Platform } from 'react-native';

export async function recognizeText(imageUri: string): Promise<string> {
  try {
    // Show loading indicator
    
    // Platform-specific optimizations
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Use smaller image size for mobile
      imageUri = await resizeForMobile(imageUri);
    }
    
    // Rest of OCR code...
    
    return result;
  } catch (error) {
    // Handle errors
    console.error('OCR failed:', error);
    return 'Text recognition failed. Please try again with a clearer image.';
  } finally {
    // Hide loading indicator
  }
}
```

## Limitations

Tesseract.js has some limitations in React Native:

1. **Performance**: JavaScript OCR is slower than native implementations
2. **Memory Usage**: Can be memory-intensive, especially on older devices
3. **Language Support**: Requires downloading language data files
4. **Image Quality**: Highly dependent on image quality and preprocessing

## Native Alternatives

For production apps, consider these native OCR solutions:

### iOS

Use the Vision framework via native modules:

```swift
// iOS Native Module
import Vision

@objc(RNTextRecognition)
class RNTextRecognition: NSObject {
  @objc
  func recognizeText(_ imageUrl: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let url = URL(string: imageUrl),
          let data = try? Data(contentsOf: url),
          let image = UIImage(data: data) else {
      reject("ERROR", "Failed to load image", nil)
      return
    }
    
    guard let cgImage = image.cgImage else {
      reject("ERROR", "Failed to get CGImage", nil)
      return
    }
    
    let request = VNRecognizeTextRequest { (request, error) in
      if let error = error {
        reject("ERROR", "Text recognition failed", error)
        return
      }
      
      guard let observations = request.results as? [VNRecognizedTextObservation] else {
        resolve("")
        return
      }
      
      let recognizedText = observations.compactMap { observation in
        observation.topCandidates(1).first?.string
      }.joined(separator: "\n")
      
      resolve(recognizedText)
    }
    
    request.recognitionLevel = .accurate
    
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    try? handler.perform([request])
  }
}
```

### Android

Use ML Kit Text Recognition:

```java
// Android Native Module
public class TextRecognitionModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  
  public TextRecognitionModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }
  
  @Override
  public String getName() {
    return "TextRecognition";
  }
  
  @ReactMethod
  public void recognizeText(String imageUri, Promise promise) {
    try {
      // Convert URI to Bitmap
      Uri uri = Uri.parse(imageUri);
      Bitmap bitmap = MediaStore.Images.Media.getBitmap(reactContext.getContentResolver(), uri);
      
      // Prepare input image
      InputImage image = InputImage.fromBitmap(bitmap, 0);
      
      // Get text recognizer
      TextRecognizer recognizer = TextRecognition.getClient();
      
      // Process image
      recognizer.process(image)
        .addOnSuccessListener(new OnSuccessListener<Text>() {
          @Override
          public void onSuccess(Text result) {
            promise.resolve(result.getText());
          }
        })
        .addOnFailureListener(new OnFailureListener() {
          @Override
          public void onFailure(@NonNull Exception e) {
            promise.reject("ERROR", "Text recognition failed", e);
          }
        });
    } catch (Exception e) {
      promise.reject("ERROR", "Failed to process image", e);
    }
  }
}
```

## Ejecting from Expo

If you need better performance or more control over the OCR implementation, you might want to eject from Expo. There are two main approaches:

### Option 1: Using Expo Prebuild (Recommended)

This approach generates native iOS and Android projects while still allowing you to use most Expo features:

```bash
# Install EAS CLI if you haven't already
npm install -g eas-cli

# Log in to your Expo account
eas login

# Configure EAS Build
eas build:configure

# Create a development build
eas build --profile development --platform all

# Or for a specific platform
eas build --profile development --platform ios
eas build --profile development --platform android
```

After creating the development build, you can use `expo run:ios` or `expo run:android` to run your app locally.

### Option 2: Full Ejection (Legacy)

This approach completely detaches from Expo, giving you a bare React Native project:

```bash
# Eject from Expo
expo eject
```

After ejection, you'll need to manage native dependencies manually.

### Post-Ejection Setup for Tesseract.js

After ejecting (using either method), you'll need to configure your project for Tesseract.js:

1. **Update Metro Config**:

```javascript
// metro.config.js
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: [...assetExts, 'wasm'],
      sourceExts: [...sourceExts, 'cjs'],
    },
  };
})();
```

2. **Configure iOS Podfile** (if needed):

```ruby
# ios/Podfile
# Add this at the top of your Podfile
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '13.0'  # Set minimum iOS version

target 'YourAppName' do
  config = use_native_modules!
  use_react_native!(
    :path => config[:reactNativePath],
    # to enable hermes on iOS, change `false` to `true` and then install pods
    :hermes_enabled => true
  )
  
  # Add any additional pods here
  
  post_install do |installer|
    react_native_post_install(installer)
    __apply_Xcode_12_5_M1_post_install_workaround(installer)
    
    # Add this to allow WASM files
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['OTHER_CFLAGS'] = '$(inherited) -fmodule-map-file="${PODS_ROOT}/Headers/Public/React/React-Core.modulemap"'
      end
    end
  end
end
```

3. **Configure Android settings** (if needed):

```gradle
// android/app/build.gradle
android {
    // Other settings...
    
    packagingOptions {
        pickFirst '**/*.so'
        exclude '**/libc++_shared.so'
        exclude '**/libfbjni.so'
    }
    
    // Add this for WASM support
    aaptOptions {
        noCompress "wasm"
    }
}
```

### Using Native Tesseract Libraries (Optional)

After ejection, you can also use native Tesseract libraries for better performance:

#### For Android:

1. Add Tesseract dependencies to your `build.gradle`:

```gradle
// android/app/build.gradle
dependencies {
    // Other dependencies...
    implementation 'com.rmtheis:tess-two:9.1.0'
}
```

2. Create a native module for Tesseract:

```java
// android/app/src/main/java/com/yourapp/TesseractModule.java
package com.yourapp;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.googlecode.tesseract.android.TessBaseAPI;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class TesseractModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private TessBaseAPI tessBaseAPI;
    private String dataPath;

    public TesseractModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.dataPath = reactContext.getFilesDir() + "/tesseract/";
        
        // Initialize Tesseract
        initTesseract();
    }

    private void initTesseract() {
        try {
            File dir = new File(dataPath + "tessdata/");
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            // Copy tessdata files from assets
            copyAssets();
            
            // Initialize Tesseract API
            tessBaseAPI = new TessBaseAPI();
            tessBaseAPI.init(dataPath, "eng");
        } catch (Exception e) {
            Log.e("TesseractModule", "Error initializing Tesseract", e);
        }
    }

    private void copyAssets() {
        try {
            // Copy your trained data file from assets to the data path
            File file = new File(dataPath + "tessdata/eng.traineddata");
            if (!file.exists()) {
                InputStream in = reactContext.getAssets().open("tessdata/eng.traineddata");
                OutputStream out = new FileOutputStream(file);
                byte[] buffer = new byte[1024];
                int read;
                while ((read = in.read(buffer)) != -1) {
                    out.write(buffer, 0, read);
                }
                in.close();
                out.flush();
                out.close();
            }
        } catch (IOException e) {
            Log.e("TesseractModule", "Error copying assets", e);
        }
    }

    @Override
    public String getName() {
        return "TesseractOCR";
    }

    @ReactMethod
    public void recognizeText(String imageUri, Promise promise) {
        try {
            // Convert URI to Bitmap
            Uri uri = Uri.parse(imageUri);
            Bitmap bitmap = BitmapFactory.decodeStream(
                reactContext.getContentResolver().openInputStream(uri)
            );
            
            // Set image and recognize text
            tessBaseAPI.setImage(bitmap);
            String recognizedText = tessBaseAPI.getUTF8Text();
            
            // Return the result
            promise.resolve(recognizedText);
        } catch (Exception e) {
            promise.reject("OCR_ERROR", "Failed to recognize text", e);
        }
    }

    @Override
    public void onCatalystInstanceDestroy() {
        if (tessBaseAPI != null) {
            tessBaseAPI.end();
        }
        super.onCatalystInstanceDestroy();
    }
}
```

#### For iOS:

For iOS, you can use the Vision framework (iOS 11+) or integrate Tesseract via CocoaPods:

```ruby
# ios/Podfile
pod 'TesseractOCRiOS', '5.0.1'
```

Then create a native module to bridge it to React Native.

## Troubleshooting

### Common Issues

1. **WASM Loading Errors**:
   - Ensure Metro is configured to handle WASM files
   - Check network connectivity for downloading WASM files

2. **Memory Issues**:
   - Reduce image size before processing
   - Terminate workers when not in use
   - Use lower quality settings for image compression

3. **Poor Recognition Results**:
   - Improve image preprocessing
   - Ensure good lighting and contrast in images
   - Try different Tesseract recognition settings

### Debugging

Add detailed logging to track OCR progress:

```typescript
export async function recognizeText(imageUri: string): Promise<string> {
  console.log('Starting OCR process');
  
  try {
    console.log('Creating Tesseract worker');
    const worker = await createWorker('eng', {
      logger: progress => {
        console.log('OCR Progress:', progress);
      }
    });
    
    console.log('Processing image');
    // Process image...
    
    console.log('Recognizing text');
    const result = await worker.recognize(imageData);
    
    console.log('OCR completed successfully');
    await worker.terminate();
    
    return result.data.text;
  } catch (error) {
    console.error('OCR failed with error:', error);
    throw error;
  }
}
```

### Post-Ejection Troubleshooting

If you've ejected from Expo and are experiencing issues:

1. **Missing Native Dependencies**:
   ```bash
   # For iOS
   cd ios && pod install
   
   # For Android
   cd android && ./gradlew clean
   ```

2. **Build Errors**:
   - Check that your native code is properly linked
   - Ensure all required permissions are in your AndroidManifest.xml or Info.plist
   - Verify that you've updated all configuration files (metro.config.js, etc.)

3. **Runtime Errors**:
   - Check that you're properly importing and using native modules
   - Verify that all assets (like Tesseract language data) are properly bundled

## Conclusion

Tesseract.js provides a cross-platform OCR solution for React Native applications. While it has performance limitations compared to native implementations, it offers a good balance of functionality and ease of integration, especially for Expo projects where native modules aren't an option.

For production applications with heavy OCR requirements, consider ejecting from Expo and implementing native OCR solutions or using a backend service for text recognition.