import {Appointment, Salon, ServiceList} from "./Types";

export const allServices: ServiceList[] = [
    {
        name: "Hair",
        services: [
            {
                name: "Haircut",
                duration: 1
            },
            {
                name: "Hairdressing",
                duration: 1
            },
            {
                name: "Hair treatment",
                duration: 1
            },
            {
                name: "Hair coloring",
                duration: 2
            },
            {
                name: "Highlights",
                duration: 3
            },
            {
                name: "Balayage",
                duration: 4
            }
        ]
    },
    {
        name: "Nails",
        services: [
            {
                name: "Classic manicure",
                duration: 1
            },
            {
                name: "Semi-permanent manicure",
                duration: 1
            },
            {
                name: "Gel manicure",
                duration: 2
            },
            {
                name: "Classic pedicure",
                duration: 1
            },
            {
                name: "Semi-permanent pedicure",
                duration: 1
            },
            {
                name: "Gel pedicure",
                duration: 2
            },
        ]
    },
    {
        name: "Make-up",
        services: [
            {
                name: "Day make-up",
                duration: 1
            },
            {
                name: "Evening make-up",
                duration: 2
            },
            {
                name: "Ceremony make-up",
                duration: 2
            },
            {
                name: "Eyebrow shaping",
                duration: 1
            },
            {
                name: "Eyelash extension",
                duration: 2
            }
        ]
    }
]

export const appointments: Appointment[] = [
    {
        id: 1,
        date: '24-03-2023',
        time: '15:00',
        clientId: 1,
        serviceName: "Eyelash extension",
        salonId: 1
    },
    {
        id: 2,
        date: '24-03-2023',
        time: '13:00',
        clientId: 1,
        serviceName: "Gel manicure",
        salonId: 2
    },

]

export const salons: Salon[] = [
    {
        id: 1,
        name: "Salon1",
        phoneNumber: "089878987",
        rating: 4.5,
        location: "Str. 1, Nr.1",
        images: ["https://cdn1.treatwell.net/images/view/v2.i5059481.w720.h480.x57F4036F/",
            "https://www.rd.com/wp-content/uploads/2020/06/GettyImages-1139132195.jpg"],
        startTime: "8:00",
        endTime: "20.00"
    },
    {
        id: 2,
        name: "Salon2",
        phoneNumber: "089878987",
        rating: 3.5,
        location: "Str. 2, Nr.2",
        images: ["https://cdn1.treatwell.net/images/view/v2.i5059481.w720.h480.x57F4036F/",
            "https://www.rd.com/wp-content/uploads/2020/06/GettyImages-1139132195.jpg"],
        startTime: "9:00",
        endTime: "21.00"
    }
]