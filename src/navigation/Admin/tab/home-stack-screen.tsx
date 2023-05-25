import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StackNavigatorParamList} from "../../navigator.types";
import {useTheme} from "react-native-paper";
import HomeAdmin from "../../../screens/Home/Home Admin/home-admin.screen";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import {Button, HStack} from "native-base";
import {useUserDataContext} from "../../../store/user-data.context";
import {getAuth, signOut} from "firebase/auth";
import app from "../../../utils/firebase";

const HomeStack = createNativeStackNavigator<StackNavigatorParamList>();

export const HomeStackScreen = (props: any) => {

    const {colors} = useTheme();

    const { setUser } = useUserDataContext()

    const logout = () => {
        setUser({})
        signOut(getAuth(app)).then(() => props.navigation.navigate('Login'))
    }

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
        </HomeStack.Navigator>
    )
}