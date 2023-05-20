import {useTheme} from "react-native-paper";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StackNavigatorParamList} from "../../navigator.types";
import AddSalon from "../../../screens/Salon/add-salon.screen";

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
        }}>
            <AddSalonStack.Screen name={"AddSalon"} component={AddSalon} options={{title: ''}}/>
        </AddSalonStack.Navigator>
    )
}