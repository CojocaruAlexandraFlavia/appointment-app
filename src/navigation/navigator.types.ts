import {ParamListBase, RouteProp} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {ConfirmAppointmentProp} from "../utils/Types";

export type StackNavigatorParamList = {
    Salon: {
        id: number;
    };
    Login: undefined;
    HomeClient: undefined;
    Register: undefined;
    CalendarPicker: undefined;
    MainTab: undefined;
    Notifications: undefined;
    Profile: undefined;
    EditProfile:undefined;
    ConfirmAppointment: ConfirmAppointmentProp
};
export type SalonScreenRouteProp = RouteProp<StackNavigatorParamList, 'Salon'>;
export type ConfirmAppointmentRouteProp = RouteProp<StackNavigatorParamList, 'ConfirmAppointment'>;

export type LoginScreenNavigationProps = NativeStackScreenProps<ParamListBase, 'LoginScreen'>;