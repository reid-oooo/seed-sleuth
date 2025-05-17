import React from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, Share, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ArrowLeft, Share2, Database } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { useScanStore } from '@/store/scanStore';
import ScanResultSummary from '@/components/ScanResultSummary';
import IngredientCard from '@/components/IngredientCard';
import AIAnalysisCard from '@/components/AIAnalysisCard';
import EmptyState from '@/components/EmptyState';
import ProcessingLevelBadge from '@/components/ProcessingLevelBadge';
import LogoHeader from '@/components/LogoHeader';

export default function ScanResultScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  
  const { currentScan } = useScanStore();
  
  const handleShare = async () => {
    if (!currentScan) return;
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    try {
      const getProcessingLevelText = () => {
        switch (currentScan.processingLevel) {
          case 'unprocessed':
            return 'Unprocessed';
          case 'minimally_processed':
            return 'Minimally Processed';
          case 'processed_culinary':
            return 'Processed Culinary Ingredient';
          case 'processed':
            return 'Processed';
          case 'ultra_processed':
            return 'Ultra-Processed';
          default:
            return '';
        }
      };
      
      const message = `I scanned this product with the Seed Sleuth app.

${
        currentScan.productName ? `Product: ${currentScan.productName}
` : ''
      }Rating: ${currentScan.overallRating === 'avoid' ? 'Avoid' : 
                currentScan.overallRating === 'caution' ? 'Use with Caution' : 'Generally Safe'
              }

Processing Level: ${getProcessingLevelText()}

Found ingredients: ${
                currentScan.foundIngredients.length > 0 
                  ? currentScan.foundIngredients.map(i => i.name).join(', ')
                  : 'No concerning ingredients detected'
              }`;
      
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Error sharing result:', error);
    }
  };
  
  if (!currentScan) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen 
          options={{ 
            title: "Scan Result",
            headerTitle: () => <LogoHeader />,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }} 
        />
        <EmptyState 
          title="No Scan Selected"
          message="Please scan a nutrition label or select one from your history."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: currentScan.productName || "Scan Result",
          headerTitle: () => <LogoHeader />,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleShare}
              style={styles.headerButton}
            >
              <Share2 size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Image 
          source={{ uri: currentScan.imageUri }} 
          style={styles.image} 
          resizeMode="contain"
        />
        
        <ScanResultSummary result={currentScan} />
        
        {currentScan.apiSource && (
          <View style={[styles.apiSourceContainer, { backgroundColor: colors.primary + '20' }]}>
            <Database size={16} color={colors.primary} />
            <Text style={[styles.apiSourceText, { color: colors.text }]}>
              Additional data from {currentScan.apiSource}
            </Text>
          </View>
        )}
        
        {currentScan.foundIngredients.length > 0 ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Detected Ingredients
            </Text>
            
            {currentScan.foundIngredients.map((ingredient, index) => (
              <IngredientCard key={index} ingredient={ingredient} />
            ))}
          </>
        ) : (
          <View style={[
            styles.noIngredientsContainer, 
            { backgroundColor: colors.safe + '20' }
          ]}>
            <Text style={[styles.noIngredientsText, { color: colors.text }]}>
              No concerning ingredients detected in this product.
            </Text>
          </View>
        )}
        
        <View style={styles.rawTextContainer}>
          <Text style={[styles.rawTextTitle, { color: colors.text }]}>
            Extracted Text
          </Text>
          <Text style={[styles.rawText, { color: colors.subtext }]}>
            {currentScan.detectedText}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  noIngredientsContainer: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  noIngredientsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  apiSourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  apiSourceText: {
    fontSize: 14,
  },
  rawTextContainer: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
  },
  rawTextTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  rawText: {
    fontSize: 12,
    lineHeight: 18,
  },
});