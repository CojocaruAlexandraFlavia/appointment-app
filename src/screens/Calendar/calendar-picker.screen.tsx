import React, {useEffect, useState} from "react";
import {  View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {CalendarProps, Salon, ServiceWithTime} from "../../utils/Types";
import {Modal} from "native-base";
import {format} from 'date-fns'
import {appointments, allServices, salons} from "../../utils/Constants";
import moment from "moment";

const CalendarPicker: React.FC<CalendarProps> = ({salonId, selectedService, show}: CalendarProps) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isHourSelectionModalVisible, setHourSelectionVisibility] = useState(false)
    const [availableTimeSlots, setAvailableTimeSlots] = useState<Date[]>([])
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

    const filterForAvailableHours = (appHour: Date[], workingHour: Date, selectedServiceWithDuration: ServiceWithTime) => {
        const workingHourWithServiceTime = moment(workingHour).add(selectedServiceWithDuration.duration, 'h')
        return ( moment(workingHourWithServiceTime).isAfter(appHour[0]) &&
                moment(workingHourWithServiceTime).isSameOrBefore(moment(appHour[selectedServiceWithDuration.duration])) ) ||
            ( moment(workingHour).isAfter(appHour[0]) &&
                moment(workingHour).isSameOrBefore(moment(appHour[selectedServiceWithDuration.duration])))
    }

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

        // build array with all hours during a day
        const allDayHours = [];
        for (let dayHour = 0; dayHour < 24; dayHour++) {
            const hour = moment(`${dayHour}:00`, "HH:mm")
            allDayHours.push(hour.toDate())
        }

        // filtering all day hours array based on salon start time and end time for building the salon working hours array

        const salonStartTime = moment(salon.startTime, "HH:mm")
        const salonEndTime = moment(salon.endTime, "HH:mm")
        const salonWorkingHours = allDayHours.filter(dayHour => moment(dayHour).isSameOrAfter(salonStartTime) &&
            moment(dayHour).isSameOrBefore(salonEndTime))

        // searching for salon appointments for the selected day and service
        const selectedDaySalonAppointmentsForSelectedService = appointments.filter(item =>
            item.date === selectedDay &&
            item.salonId === salon.id &&
            item.serviceName === selectedService);
        const appointmentsHours = []
        for (const app of selectedDaySalonAppointmentsForSelectedService) {
            const appointmentStartTime = moment(app.time, "HH:mm")
            const appointmentEndTime = moment(app.time, "HH:mm").add(selectedServiceWithDuration.duration, 'h')
            const currentAppointmentInterval = salonWorkingHours.filter(item => moment(item).isSameOrAfter(appointmentStartTime) &&
                moment(item).isSameOrBefore(appointmentEndTime))
            appointmentsHours.push(currentAppointmentInterval)
        }
        appointmentsHours.sort()

        // build available hours array
        const availableHours = []
        for(const workingHour of salonWorkingHours) {
            const workingHourWithServiceTime = moment(workingHour).add(selectedServiceWithDuration.duration, 'h')
            const insideAppointmentTimeslot = appointmentsHours.filter(appHour =>
                filterForAvailableHours(appHour, workingHour, selectedServiceWithDuration))
            if (insideAppointmentTimeslot.length === 0 && workingHourWithServiceTime.isSameOrBefore(salonEndTime)) {
                availableHours.push(workingHour)
            }
        }

        setAvailableTimeSlots(availableHours)

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