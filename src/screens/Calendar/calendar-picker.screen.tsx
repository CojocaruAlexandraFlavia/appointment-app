import React, {useEffect, useState} from "react";
import {  View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {CalendarProps, Salon, ServiceWithTime} from "../../utils/Types";
import {Modal} from "native-base";
import {format} from 'date-fns'
import {appointments, allServices, salons} from "../../utils/Constants";

const CalendarPicker: React.FC<CalendarProps> = ({salonId, selectedService, show}: CalendarProps) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isHourSelectionModalVisible, setHourSelectionVisibility] = useState(false)
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
    const [salon, setSalon] = useState<Salon>({
        endTime: "",
        id: 0,
        images: [],
        location: "",
        name: "",
        phoneNumber: "",
        rating: 0,
        startTime: ""
    })

    useEffect(() => {
        setDatePickerVisibility(show)

        //get salon by id
        const foundSalon = salons.filter(item => item.id === salonId)[0]
        setSalon(foundSalon)
    }, [salonId, show])

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        const formattedSelectedDate = format(date, "dd-MM-yyyy HH:mm")
        const selectedDay = formattedSelectedDate.split(" ")[0]

        // searching selected service in all available services
        let selectedServiceWithDuration: ServiceWithTime = {name: "", duration: 0}
        for (const serviceCategory of allServices) {
            for (const service of serviceCategory.services) {
                if (service.name === selectedService) {
                    selectedServiceWithDuration = service
                    break
                }
            }
        }

        // build array with all hours during a day, 0.5h step
        const allDayHours = [];
        for (let dayHour = 0; dayHour < 24; dayHour++) {
            const hour = new Date()
            hour.setHours(dayHour, 0, 0)
            allDayHours.push(hour)
            hour.setHours(dayHour, 30, 0)
            allDayHours.push(hour)
        }

        // filtering all day hours array based on salon start time and end time for building the salon working hours array
        const salonStartTimeSplitString = salon.startTime.split(":")
        const salonEndTimeSplitString = salon.endTime.split(":")

        const salonStartTime = new Date()
        salonStartTime.setHours(Number(salonStartTimeSplitString[0]), Number(salonStartTimeSplitString[1]))
        const salonEndTime = new Date()
        salonEndTime.setHours(Number(salonEndTimeSplitString[0]), Number(salonEndTimeSplitString[1]))

        const salonWorkingHours = allDayHours.filter(dayHour => dayHour > salonStartTime && dayHour < salonEndTime)


        console.log(`Selected service before filter: ${selectedServiceWithDuration.name}`)
        // searching for salon appointments for the selected day
        const selectedDaySalonAppointmentsForSelectedService = appointments.filter(item =>
            item.date === selectedDay &&
            item.salonId === salon.id &&
            item.serviceName === selectedService);
        const appointmentsHours: Date[] = []
        for (const app of selectedDaySalonAppointmentsForSelectedService) {
            const appointmentStartTime = new Date()
            const appointmentTimeSplitString = app.time.split(":")
            appointmentStartTime.setHours(Number(appointmentTimeSplitString[0]), Number(appointmentTimeSplitString[1]))
            console.log(`Appointment start time: ${appointmentStartTime}`)
            const appointmentEndTime = new Date()
            appointmentEndTime.setTime(appointmentStartTime.getTime() + selectedServiceWithDuration.duration * 60 * 60 * 1000)
            console.log(`Appointment end time: ${appointmentEndTime}`)
            const currentAppointmentInterval = salonWorkingHours.filter(item => item > appointmentStartTime && item < appointmentEndTime)
            console.log(`Current app interval: ${currentAppointmentInterval}`)
            appointmentsHours.push(...currentAppointmentInterval)
            console.log(`App hours after push: ${appointmentsHours}`)
        }
        console.log(appointmentsHours)

        // setDatePickerVisibility(false)
        // setHourSelectionVisibility(true)
    };

    return (
        <View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <Modal isOpen={isHourSelectionModalVisible} onClose={() => setHourSelectionVisibility(false)}>
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>Choose appointment hour</Modal.Header>
                    <Modal.Body>

                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </View>
    );
};

export default CalendarPicker;