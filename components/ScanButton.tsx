import React from 'react';
import { TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Camera, Barcode, ScanLine } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useColorScheme } from 'react-native';

interface ScanButtonProps {
  onPress: () => void;
  isScanning: boolean;
  mode?: 'label' | 'barcode' | 'combined';
}

export default function ScanButton({ onPress, isScanning, mode = 'label' }: ScanButtonProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const getButtonText = () => {
    switch (mode) {
      case 'barcode':
        return 'Scan Barcode';
      case 'combined':
        return 'Scan Both';
      default:
        return 'Scan Label';
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'barcode':
        return <Barcode size={24} color="#FFFFFF" />;
      case 'combined':
        return <ScanLine size={24} color="#FFFFFF" />;
      default:
        return <Camera size={24} color="#FFFFFF" />;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: colors.primary }
      ]} 
      onPress={onPress}
      disabled={isScanning}
    >
      {isScanning ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <>
          {getIcon()}
          <Text style={styles.buttonText}>
            {getButtonText()}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});