import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Map, BookOpen, User } from 'lucide-react-native';

import HomePage from '@/pages/home/HomePage';
import LoginPage from '@/pages/login/LoginPage';
import RoadmapPage from '@/pages/roadmap/RoadmapPage';
import PracticePage from '@/pages/practice/PracticePage';
import ProfilePage from '@/pages/profile/ProfilePage';
import { useAuthStore } from '@/services/auth/auth.store';
import { useThemeColor } from '@/hooks/useThemeColor';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabNavigator() {
  const theme = useThemeColor();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomePage} 
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          tabBarLabel: 'Trang chủ',
        }}
      />
      <Tab.Screen 
        name="Roadmap" 
        component={RoadmapPage} 
        options={{
          tabBarIcon: ({ color }) => <Map size={24} color={color} />,
          tabBarLabel: 'Lộ trình',
        }}
      />
      <Tab.Screen 
        name="Practice" 
        component={PracticePage} 
        options={{
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
          tabBarLabel: 'Luyện tập',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfilePage} 
        options={{
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          tabBarLabel: 'Cá nhân',
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="Login" component={LoginPage} />
    </Stack.Navigator>
  );
}
