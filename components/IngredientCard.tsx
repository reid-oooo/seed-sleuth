import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/colors';
import { FoundIngredient } from '@/types';

interface IngredientCardProps {
  ingredient: FoundIngredient;
}

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const getSeverityColor = () => {
    switch (ingredient.severity) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.safe;
      default:
        return colors.neutral;
    }
  };

  const getCategoryLabel = () => {
    switch (ingredient.category) {
      case 'seed_oil':
        return 'Seed Oil';
      case 'fruit_based_oil':
        return 'Fruit Based Oil';
      case 'animal_fat':
        return 'Animal Fat';  
      case 'thickener':
        return 'Thickener';
      case 'emulsifier':
        return 'Emulsifier';
      case 'phosphate':
        return 'Phosphate';
      case 'food_color':
        return 'Food Color';
      case 'preservative':
        return 'Preservative';
      case 'natural_flavor':
        return 'Natural Flavor';
      case 'artificial_sweetener':
        return 'Artificial Sweetener';
      default:
        return 'Other';
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }
    ]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]}>
          {ingredient.name}
        </Text>
        <View style={[
          styles.severityBadge,
          { backgroundColor: getSeverityColor() + '20' }
        ]}>
          <Text style={[styles.severityText, { color: getSeverityColor() }]}>
            {ingredient.severity.charAt(0).toUpperCase() + ingredient.severity.slice(1)} Risk
          </Text>
        </View>
      </View>

      <View style={[
        styles.categoryBadge,
        { backgroundColor: colors.primary + '20' }
      ]}>
        <Text style={[styles.categoryText, { color: colors.primary }]}>
          {getCategoryLabel()}
        </Text>
      </View>

      <Text style={[styles.description, { color: colors.subtext }]}>
        {ingredient.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});