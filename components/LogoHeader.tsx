import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { Search } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface LogoHeaderProps {
  showIcon?: boolean;
}

export default function LogoHeader({ showIcon = true }: LogoHeaderProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={styles.container}>
      {showIcon && (
        <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
          <Search size={18} color={colors.primary} />
        </View>
      )}
      <Text style={[styles.logoText, { color: colors.accent }]}>
        Seed <Text style={{ color: colors.highlight }}>Sleuth</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#004D40',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});