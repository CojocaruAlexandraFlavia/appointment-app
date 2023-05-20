import Notifications from "../../../screens/Notifications";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StackNavigatorParamList} from "../../navigator.types";

const NotificationStack =  createNativeStackNavigator<StackNavigatorParamList>();

export const NotificationStackScreen = ({navigation}: any) => (
    <NotificationStack.Navigator
        screenOptions={{
            headerStyle: {
                // backgroundColor: '#FF6347',
                backgroundColor: '#fff',
            },
            headerTintColor: '#000',
            headerTitleStyle: {
                // fontWeight: 'bold',
            },
        }}>
        <NotificationStack.Screen
            name="Notifications"
            component={Notifications}
            options={{
                headerLeft: () => (
                    <Icon.Button
                        name="ios-menu"
                        size={25}
                        // backgroundColor="#FF6347"
                        backgroundColor="#fff"
                        color="#000"
                        onPress={() => navigation.openDrawer()}
                    />
                ),
            }}
        />
    </NotificationStack.Navigator>
);