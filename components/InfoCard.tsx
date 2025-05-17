import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/colors';

interface InfoCardProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

export default function InfoCard({ title, content, icon }: InfoCardProps) {
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
      <View style={styles.header}>
        {icon}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.content, { color: colors.subtext }]}>{content}</Text>
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
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
});