import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StackNavigatorParamList} from "../../navigator.types";
import {useTheme} from "react-native-paper";
import HomeAdmin from "../../../screens/Home/Home Admin/home-admin.screen";

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
            <HomeStack.Screen name={"HomeAdmin"} component={HomeAdmin} options={{title: ''}}/>
        </HomeStack.Navigator>
    )
}