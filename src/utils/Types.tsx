import { RouteProp } from "@react-navigation/native";

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
    Register: undefined;
    CalendarPicker: undefined
};

// export type SalonScreenNavigationProp = NativeStackNavigationProp<StackNavigatorParamList, 'Salon'>;

export type SalonScreenRouteProp = RouteProp<StackNavigatorParamList,'Salon'>;

export type CalendarProps = {
    show: boolean,
    setShow: Function
}

export type ServiceWithTime = {
    name: string,
    duration: number
}

export type ServiceList = {
    name: string,
    services: ServiceWithTime[]
}

export type User = {
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
    role: string,
    password: string,
    profilePicture: string
}

export type Review = {
    id: number,
    stars: number,
    message: string,
    client: User
}