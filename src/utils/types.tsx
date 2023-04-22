export type Salon = {
    id: string,
    name: string,
    phoneNumber: string,
    rating: number,
    location: string,
    images: string[],
    startTime: string,
    endTime: string
}

export type CalendarProps = {
    salonId: string
    selectedService: string,
    show: boolean,
    navigation: any,
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
    id: number,
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
    salonId: string,
    date: string,
    time: string,
    serviceName: string
}

export type ServicesListData = {
    title: string,
    data: ServiceWithTime[]
}

export type ConfirmAppointmentProp = {
    date: string,
    time: string,
    service: string,
    idSalon: string
}

export type RegisterData = {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    city: string,
}
export type LoginData = {
    email: string,
    password: string
}