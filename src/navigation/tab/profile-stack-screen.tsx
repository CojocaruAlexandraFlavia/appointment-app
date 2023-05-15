import {useTheme} from "react-native-paper";
import Profile from "../../screens/Profile/See Profile";
import {View} from "react-native-animatable";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EditProfile from "../../screens/Profile/Edit Profile/edit-profile.screen";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StackNavigatorParamList} from "../navigator.types";

const ProfileStack = createNativeStackNavigator<StackNavigatorParamList>();

export const ProfileStackScreen = ({navigation}: any) => {
    const {colors} = useTheme();

    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: "#000",
            }}>
            <ProfileStack.Screen
                name="Profile"
                component={Profile}
                options={{
                    title: 'Profile',
                    headerLeft: () => (
                        <View style={{marginLeft: 10}}>
                            <Icon.Button
                                name="ios-menu"
                                size={25}
                                backgroundColor={colors.background}
                                color="#000"
                                onPress={() => {
                                    console.log(navigation)
                                    navigation?.openDrawer()
                                }}
                            />
                        </View>
                    ),
                    headerRight: () => (
                        <View style={{marginRight: 10}}>
                            <MaterialCommunityIcons.Button
                                name="account-edit"
                                size={27}
                                backgroundColor={colors.background}
                                color="black"
                                onPress={() => navigation.navigate('EditProfile')}
                            />
                        </View>
                    ),
                }}
            />
            <ProfileStack.Screen
                name="EditProfile"
                options={{
                    title: 'Edit Profile',
                }}
                component={EditProfile}
            />
        </ProfileStack.Navigator>
    );
};