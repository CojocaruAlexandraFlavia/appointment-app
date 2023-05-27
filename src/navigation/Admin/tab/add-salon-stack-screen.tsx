import {useTheme} from "react-native-paper";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StackNavigatorParamList} from "../../navigator.types";
import AddSalon from "../../../screens/Salon/add-salon.screen";
import {HStack} from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";

const AddSalonStack = createNativeStackNavigator<StackNavigatorParamList>();

export const AddSalonStackScreen = () => {

    const {colors} = useTheme();

    return (
        <AddSalonStack.Navigator screenOptions={{
            headerStyle: {backgroundColor: colors.background},
            headerTintColor: "#000",
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            contentStyle: {backgroundColor: '#cda9e6'}
        }}>
            <AddSalonStack.Screen
                name={"AddSalon"}
                component={AddSalon}
                options={{title: '',
                    headerLeft: () => (
                        <HStack style={{marginLeft: 10}}>
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
        </AddSalonStack.Navigator>
    )
}