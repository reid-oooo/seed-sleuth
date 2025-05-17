import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { ScanLine } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface EmptyStateProps {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer, 
        { backgroundColor: colors.secondary + '30' }
      ]}>
        <ScanLine size={40} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.subtext }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 22,
  },
});