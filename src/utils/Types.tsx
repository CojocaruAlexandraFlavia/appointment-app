export type Salon = {
    id: number,
    name: string,
    phoneNumber: string,
    rating: number,
    location: string,
    images: string[],
    startTime: string,
    endTime: string
}

// export type SalonScreenNavigationProp = NativeStackNavigationProp<StackNavigatorParamList, 'Salon'>;

export type CalendarProps = {
    salonId: number
    selectedService: string,
    show: boolean
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
    city: string
}

export type Review = {
    id: number,
    stars: number,
    message: string,
    client: User
}

export type Appointment = {
    id: number | null,
    clientId: number,
    salonId: number,
    date: string,
    time: string,
    serviceName: string
}

export type ServicesListData = {
    title: string,
    data: ServiceWithTime[]
}