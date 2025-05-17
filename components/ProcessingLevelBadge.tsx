import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { Leaf, Utensils, Factory, Beaker } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ProcessingLevel } from '@/types';

interface ProcessingLevelBadgeProps {
  level: ProcessingLevel;
  size?: 'small' | 'large';
}

export default function ProcessingLevelBadge({ level, size = 'small' }: ProcessingLevelBadgeProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const getLabel = () => {
    switch (level) {
      case 'unprocessed':
        return 'Unprocessed';
      case 'minimally_processed':
        return 'Minimally Processed';
      case 'processed_culinary':
        return 'Processed Culinary';
      case 'processed':
        return 'Processed';
      case 'ultra_processed':
        return 'Ultra-Processed';
      default:
        return 'Unknown';
    }
  };
  
  const getColor = () => {
    switch (level) {
      case 'unprocessed':
      case 'minimally_processed':
        return colors.safe;
      case 'processed_culinary':
        return colors.neutral;
      case 'processed':
        return colors.warning;
      case 'ultra_processed':
        return colors.danger;
      default:
        return colors.subtext;
    }
  };
  
  const getIcon = () => {
    const iconSize = size === 'small' ? 14 : 18;
    const color = getColor();
    
    switch (level) {
      case 'unprocessed':
      case 'minimally_processed':
        return <Leaf size={iconSize} color={color} />;
      case 'processed_culinary':
        return <Utensils size={iconSize} color={color} />;
      case 'processed':
        return <Factory size={iconSize} color={color} />;
      case 'ultra_processed':
        return <Beaker size={iconSize} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View style={[
      styles.container, 
      size === 'large' && styles.containerLarge,
      { backgroundColor: getColor() + '20' }
    ]}>
      {getIcon()}
      <Text style={[
        styles.text, 
        size === 'large' && styles.textLarge,
        { color: getColor() }
      ]}>
        {getLabel()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  containerLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  textLarge: {
    fontSize: 14,
    fontWeight: '600',
  },
});