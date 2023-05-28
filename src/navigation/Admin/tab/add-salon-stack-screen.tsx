import {useTheme} from "react-native-paper";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StackNavigatorParamList} from "../../navigator.types";
import AddSalon from "../../../screens/Salon/add-salon.screen";
import {HStack} from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import {useUserDataContext} from "../../../store/user-data.context";
import {getAuth, signOut} from "firebase/auth";
import app from "../../../utils/firebase";

const AddSalonStack = createNativeStackNavigator<StackNavigatorParamList>();

export const AddSalonStackScreen = (props: any) => {

    const {colors} = useTheme();

    const { setUser } = useUserDataContext()

    const logout = () => {
        setUser({})
        signOut(getAuth(app)).then(() => props.navigation.navigate('Login'))
    }

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
                                onPress={logout}
                            />
                        </HStack>
                    )
            }}
            />
        </AddSalonStack.Navigator>
    )
}