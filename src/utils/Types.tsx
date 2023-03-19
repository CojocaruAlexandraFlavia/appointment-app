import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type Salon = {
    id: number,
    name: string,
    phoneNumber: string,
    rating: number,
    location: string,
    images: string[]
}

export type StackNavigatorParamList = {
    Salon: {
      id: number;
    };
    Login: undefined;
    HomeClient: undefined;
    Calendar: undefined
};

// export type SalonScreenNavigationProp = NativeStackNavigationProp<StackNavigatorParamList, 'Salon'>;

export type SalonScreenRouteProp = RouteProp<StackNavigatorParamList,'Salon'>;