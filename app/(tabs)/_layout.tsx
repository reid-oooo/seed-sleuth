import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Camera, History, BookOpen } from 'lucide-react-native';
import Colors from '@/constants/colors';
import LogoHeader from '@/components/LogoHeader';

export default function TabLayout() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? colors.background : colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? colors.background : colors.background,
        },
        headerTintColor: colors.text,
        headerTitle: () => <LogoHeader />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => <Camera size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}