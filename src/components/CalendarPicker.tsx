import React, {useEffect, useState} from "react";
import {  View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Appointment, CalendarProps, Salon, ServiceWithTime} from "../utils/Types";
import {Modal} from "native-base";
import {eachHourOfInterval, format} from 'date-fns'
import {appointments, allServices, salons} from "../utils/Constants";

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
        console.log(`Salon id: ${salonId}`)
        console.log(`Selected service: ${selectedService}`)
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

        // searching for salon appointments for the selected day
        const selectedDaySalonAppointments: Appointment[] = appointments.filter(item => item.date === selectedDay && item.salonId === salon.id);
        const workingHours = eachHourOfInterval({start: new Date(salon.startTime), end: new Date(salon.endTime)}, {step: 1.5})

        console.log(workingHours)

        setDatePickerVisibility(false)
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