import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import Colors from '@/constants/colors';
import { useScanStore } from '@/store/scanStore';
import HistoryItem from '@/components/HistoryItem';
import EmptyState from '@/components/EmptyState';
import LogoHeader from '@/components/LogoHeader';

export default function HistoryScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  
  const { history, setCurrentScan, clearHistory } = useScanStore();
  
  const handleItemPress = (id: string) => {
    const scan = history.find(item => item.id === id);
    if (scan) {
      setCurrentScan(scan);
      router.push('/scan-result');
    }
  };
  
  const handleClearHistory = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    clearHistory();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: "Scan History",
          headerTitle: () => <LogoHeader />,
          headerRight: () => (
            history.length > 0 ? (
              <TouchableOpacity 
                onPress={handleClearHistory}
                style={styles.clearButton}
              >
                <Trash2 size={20} color={colors.danger} />
              </TouchableOpacity>
            ) : null
          )
        }} 
      />
      
      {history.length === 0 ? (
        <EmptyState 
          title="No Scan History"
          message="Your scanned nutrition labels will appear here. Start by scanning a product label."
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryItem 
              item={item} 
              onPress={() => handleItemPress(item.id)} 
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
  },
});