import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface AIAnalysisCardProps {
  detectedText: string;
}

// Replace AI Analysis Card with a simple info card about Tesseract OCR
export default function AIAnalysisCard({ detectedText }: AIAnalysisCardProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.card,
        borderColor: colors.border 
      }
    ]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <AlertCircle size={20} color={colors.primary} />
        </View>
        <Text style={[styles.analysisText, { color: colors.text }]}>
          This app uses Tesseract OCR to recognize text from images and on-device ingredient analysis to identify potentially concerning ingredients in your food products.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  }
});