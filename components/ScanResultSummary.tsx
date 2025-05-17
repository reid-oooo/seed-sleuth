import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ScanResult } from '@/types';
import ProcessingLevelBadge from './ProcessingLevelBadge';

interface ScanResultSummaryProps {
  result: ScanResult;
}

export default function ScanResultSummary({ result }: ScanResultSummaryProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const { width } = useWindowDimensions();
  
  const getRatingColor = () => {
    switch (result.overallRating) {
      case 'avoid':
        return colors.danger;
      case 'caution':
        return colors.warning;
      case 'safe':
        return colors.safe;
      default:
        return colors.neutral;
    }
  };
  
  const getRatingIcon = () => {
    switch (result.overallRating) {
      case 'avoid':
        return <XCircle size={24} color={colors.danger} />;
      case 'caution':
        return <AlertTriangle size={24} color={colors.warning} />;
      case 'safe':
        return <CheckCircle size={24} color={colors.safe} />;
      default:
        return null;
    }
  };
  
  const getRatingText = () => {
    switch (result.overallRating) {
      case 'avoid':
        return 'Avoid';
      case 'caution':
        return 'Use with Caution';
      case 'safe':
        return 'Generally Safe';
      default:
        return '';
    }
  };

  const getIngredientCounts = () => {
    const seedOils = result.foundIngredients.filter(i => i.category === 'seed_oil').length;
    const thickeners = result.foundIngredients.filter(i => i.category === 'thickener').length;
    const emulsifiers = result.foundIngredients.filter(i => i.category === 'emulsifier').length;
    const foodColors = result.foundIngredients.filter(i => i.category === 'food_color').length;
    const preservatives = result.foundIngredients.filter(i => i.category === 'preservative').length;
    const naturalFlavors = result.foundIngredients.filter(i => i.category === 'natural_flavor').length;
    const phosphates = result.foundIngredients.filter(i => i.category === 'phosphate').length;
    const artificialSweeteners = result.foundIngredients.filter(i => i.category === 'artificial_sweetener').length;
    
    return { 
      seedOils, 
      thickeners, 
      emulsifiers, 
      foodColors, 
      preservatives, 
      naturalFlavors, 
      phosphates,
      artificialSweeteners
    };
  };

  const counts = getIngredientCounts();

  // Calculate number of columns based on screen width
  const numColumns = width < 380 ? 2 : 3;
  const statItemWidth = `${100 / numColumns}%`;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.card,
        borderColor: colors.border 
      }
    ]}>
      <View style={styles.header}>
        <View style={styles.ratingContainer}>
          {getRatingIcon()}
          <Text style={[
            styles.ratingText, 
            { color: getRatingColor() }
          ]}>
            {getRatingText()}
          </Text>
        </View>
        
        <ProcessingLevelBadge level={result.processingLevel} size="large" />
      </View>
      
      {result.productName && (
        <Text style={[styles.productName, { color: colors.text }]}>
          {result.productName}
        </Text>
      )}
      
      <View style={[styles.statsContainer, { flexWrap: 'wrap' }]}>
        <View style={[styles.statItem, { width: statItemWidth }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {counts.seedOils}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>
            Seed{'\n'}Oils
          </Text>
        </View>
        
        <View style={[styles.statItem, { width: statItemWidth }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {counts.thickeners}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>
            Thick-{'\n'}eners
          </Text>
        </View>
        
        <View style={[styles.statItem, { width: statItemWidth }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {counts.emulsifiers}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>
            Emul-{'\n'}sifiers
          </Text>
        </View>
        
        <View style={[styles.statItem, { width: statItemWidth }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {counts.preservatives}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>
            Preser-{'\n'}vatives
          </Text>
        </View>
        
        <View style={[styles.statItem, { width: statItemWidth }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {counts.foodColors}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>
            Food{'\n'}Colors
          </Text>
        </View>
        
        <View style={[styles.statItem, { width: statItemWidth }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {counts.naturalFlavors}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>
            Natural{'\n'}Flavors
          </Text>
        </View>

        <View style={[styles.statItem, { width: statItemWidth }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {counts.phosphates}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>
            Phos-{'\n'}phates
          </Text>
        </View>
        
        <View style={[styles.statItem, { width: statItemWidth }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {counts.artificialSweeteners}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>
            Artificial{'\n'}Sweeteners
          </Text>
        </View>
      </View>
      
      {result.foundIngredients.length === 0 && (
        <Text style={[styles.noIngredientsText, { color: colors.text }]}>
          No concerning ingredients detected
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '700',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  noIngredientsText: {
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});