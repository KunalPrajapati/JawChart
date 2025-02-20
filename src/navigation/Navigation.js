import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import JawChart from '../screens/JawChart';
import AppointmentScreen from '../screens/AppointmentScreen';

const Navigation = () => {

    const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="JawChart">
            <Stack.Screen name="JawChart" component={JawChart} />
            <Stack.Screen name="AppointmentScreen" component={AppointmentScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;