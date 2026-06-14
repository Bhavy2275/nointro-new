import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PortfolioScreen from './PortfolioScreen';
import ProjectDetailScreen from './ProjectDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Portfolio"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Custom sleek horizontal transition
      }}
    >
      <Stack.Screen 
        name="Portfolio" 
        component={PortfolioScreen} 
      />
      <Stack.Screen 
        name="ProjectDetail" 
        component={ProjectDetailScreen} 
      />
    </Stack.Navigator>
  );
}
