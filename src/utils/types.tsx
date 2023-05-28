export type Salon = {
    id: string,
    name: string,
    phoneNumber: string,
    rating: number,
    // location: string,
    images: string[],
    startTime: string,
    endTime: string,
    reviews: Review[],
    nrOfReviews: number,
    enabled: boolean,
    city: string,
    country: string,
    address: string,
    nrOfStars: number
}

export type CalendarProps = {
    salonId: string
    selectedService: string,
    show: boolean,
    navigation: any,
    setShow: Function,
    setSelectedService: Function
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
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
    role: string,
    profilePicture: string,
    city: string,
    username: string
}

export type Review = {
    id: string,
    stars: number,
    message: string,
    client: User
}

export type Appointment = {
    id: string,
    clientId: string,
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
    role: string
}

export type LoginData = {
    email: string,
    password: string
}

export type City = {
    geo_id: number,
    state_or_region: string,
    name: string,
    latitude: number,
    longitude: number,
    country: {
        code: string,
        name: string
    },
    division: {
        code: string,
        geonameid: number
    }
}
