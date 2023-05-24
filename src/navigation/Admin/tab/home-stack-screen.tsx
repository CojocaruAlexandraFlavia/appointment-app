import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StackNavigatorParamList} from "../../navigator.types";
import {useTheme} from "react-native-paper";
import HomeAdmin from "../../../screens/Home/Home Admin/home-admin.screen";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import {Button, HStack} from "native-base";

const HomeStack = createNativeStackNavigator<StackNavigatorParamList>();

export const HomeStackScreen = () => {

    const {colors} = useTheme();

    return (
        <HomeStack.Navigator screenOptions={{
            headerStyle: {backgroundColor: colors.background},
            headerTintColor: "#000",
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}>
            <HomeStack.Screen
                name={"HomeAdmin"}
                component={HomeAdmin}
                options={{title: '',
                    headerLeft: () => (
                        <HStack style={{marginLeft: 10}}>

                            {/*<Button variant="outlined" */}
                            {/*        startIcon={ <Icon name="exit-outline" color={"#000"} size={25} /> }>*/}
                            {/*    Logout*/}
                            {/*</Button>*/}

                            <Icon.Button
                                name="exit-outline"
                                size={25}
                                color="#000"
                                backgroundColor={colors.background}
                                // onPress={() => }
                            />
                        </HStack>
                    )
            }}
            />
        </HomeStack.Navigator>
    )
}