import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, Database } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ScanResult } from '@/types';
import ProcessingLevelBadge from './ProcessingLevelBadge';

interface HistoryItemProps {
  item: ScanResult;
  onPress: () => void;
}

export default function HistoryItem({ item, onPress }: HistoryItemProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getRatingIcon = () => {
    switch (item.overallRating) {
      case 'avoid':
        return <XCircle size={20} color={colors.danger} />;
      case 'caution':
        return <AlertTriangle size={20} color={colors.warning} />;
      case 'safe':
        return <CheckCircle size={20} color={colors.safe} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border 
        }
      ]}
      onPress={onPress}
    >
      <Image 
        source={{ uri: item.imageUri }} 
        style={styles.thumbnail} 
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
            {item.productName || 'Unnamed Product'}
          </Text>
          
          {item.apiSource && (
            <Database size={14} color={colors.primary} />
          )}
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.ratingContainer}>
            {getRatingIcon()}
            <Text style={[styles.date, { color: colors.subtext }]}>
              {formatDate(item.date)}
            </Text>
          </View>
          
          <ProcessingLevelBadge level={item.processingLevel} />
        </View>
      </View>
      
      <ChevronRight size={20} color={colors.subtext} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    borderWidth: 1,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontSize: 12,
  },
  ingredientCount: {
    fontSize: 12,
  },
});