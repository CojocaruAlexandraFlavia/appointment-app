import React, {useCallback, useEffect, useState} from "react";
import {ListRenderItemInfo, View} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Appointment, CalendarProps, Salon, ServiceWithTime} from "../../utils/types";
import {Button, FlatList, FormControl, Modal, Radio, ScrollView, WarningOutlineIcon} from "native-base";
import {format} from 'date-fns'
import moment from "moment";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {firestore} from "../../utils/firebase";
import {salonConverter} from "../Salon/salon.class";
import {appointmentConverter} from "../Appointments/appointment.class";
import {AlertComponent} from "../../components/alert.component";
import * as servicesJson from '../../utils/all-services.json'

const CalendarPicker: React.FC<CalendarProps> = ({salonId, selectedService, show, navigation, setShow, setSelectedService}: CalendarProps) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isHourSelectionModalVisible, setHourSelectionVisibility] = useState(false)
    const [availableTimeSlots, setAvailableTimeSlots] = useState<Date[]>([])
    const [salon, setSalon] = useState<Salon>({
        address: "",
        city: "",
        country: "",
        enabled: false,
        endTime: "",
        id: "",
        images: [],
        name: "",
        phoneNumber: "",
        rating: 0,
        startTime: "",
        reviews: [],
        nrOfReviews: 0
    })
    const [selectedAppointmentTime, setSelectedAppointmentTime] = useState("")
    const [selectedAppointmentDate, setSelectedAppointmentDate] = useState("")
    const [selectTimeValid, setSelectTimeValid] = useState(false)
    const [error, setError] = useState(null)

    const retrieveSalon = useCallback(async () => {
        try {
            const docRef = doc(firestore, "salons", salonId).withConverter(salonConverter);
            const salonDoc = await getDoc(docRef)
            if (salonDoc.exists()) {
                setSalon({...salonDoc.data(), images: [], id: salonDoc.id, reviews: []})
            }
        } catch (e: any) {
            console.log("error " + e)
            setError(e)
        }
    }, [])

    useEffect(() => {
        setDatePickerVisibility(show)

        //get salon by id
        retrieveSalon()

    }, [salonId, show])

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
        setSelectedService("")
    };

    const filterForAvailableHours = (appHour: Date[], workingHour: Date, selectedServiceWithDuration: ServiceWithTime) => {
        const workingHourWithServiceTime = moment(workingHour).add(selectedServiceWithDuration.duration, 'h')
        return ( moment(workingHourWithServiceTime).isAfter(appHour[0]) &&
                moment(workingHourWithServiceTime).isSameOrBefore(moment(appHour[selectedServiceWithDuration.duration])) ) ||
            ( moment(workingHour).isAfter(appHour[0]) &&
                moment(workingHour).isSameOrBefore(moment(appHour[selectedServiceWithDuration.duration])))
    }

    const findSelectedServiceWithTime = () => {
        let selectedServiceWithDuration: ServiceWithTime = {name: "", duration: 0}
        for (const serviceCategory of servicesJson.allServices) {
            for (const service of serviceCategory.services) {
                if (service.name === selectedService) {
                    selectedServiceWithDuration = service
                    break
                }
            }
        }
        return selectedServiceWithDuration
    }

    const retrieveAppointmentsForSelectedServiceAndDate = async (selectedDate: string) => {
        try {
            const collectionRef = collection(firestore, "appointments");
            const compoundQuery = query(collectionRef,
                where("salonId", "==", salonId),
                where("date", "==", selectedDate),
                where("serviceName", "==", selectedService)
            ).withConverter(appointmentConverter)
            const result = await getDocs(compoundQuery)
            let appointments: Appointment[] = []
            result.forEach(documentSnapshot => {
                appointments.push({...documentSnapshot.data(), id: documentSnapshot.id})
            })
            return appointments
        } catch (e: any) {
            console.log("Error at retrieving appointments: " + e)
            setError(e)
        }
    }

    const handleConfirm = async (date: Date) => {
        const formattedSelectedDate = format(date, "dd-MM-yyyy HH:mm")
        const selectedDay = formattedSelectedDate.split(" ")[0]
        setSelectedAppointmentDate(selectedDay)

        // searching selected service in all available services
        const selectedServiceWithDuration = findSelectedServiceWithTime()

        // build array with all hours during a day
        const allDayHours: Date[] = [];
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
        const selectedDaySalonAppointmentsForSelectedService = await retrieveAppointmentsForSelectedServiceAndDate(selectedDay)

        if (selectedDaySalonAppointmentsForSelectedService !== undefined) {
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
            for (const workingHour of salonWorkingHours) {
                const workingHourWithServiceTime = moment(workingHour).add(selectedServiceWithDuration.duration, 'h')
                const insideAppointmentTimeslot = appointmentsHours.filter(appHour =>
                    filterForAvailableHours(appHour, workingHour, selectedServiceWithDuration))
                if (insideAppointmentTimeslot.length === 0 && workingHourWithServiceTime.isSameOrBefore(salonEndTime)) {
                    availableHours.push(workingHour)
                }
            }

            setAvailableTimeSlots(availableHours)
            setShow(false)
            setDatePickerVisibility(false)
            setHourSelectionVisibility(true)
        }
    };

    const confirmSelectedTime = () => {
        if (selectedAppointmentTime === "") {
            setSelectTimeValid(true)
        } else {
            setSelectTimeValid(false)
            navigation.navigate('ConfirmAppointment', {
                date: selectedAppointmentDate,
                time: selectedAppointmentTime,
                service: selectedService,
                idSalon: salonId
            })
            setHourSelectionVisibility(false)
            setSelectedAppointmentTime("")
            setAvailableTimeSlots([])
            setDatePickerVisibility(false)
            setShow(false)
            setSelectedService("")
        }
    }

    const selectTimeRadio = (value: string) => {
        setSelectTimeValid(false)
        setSelectedAppointmentTime(value)
    }

    const renderItemTimeslot = useCallback(({item}: ListRenderItemInfo<Date>) => (
        <Radio value={format(item, "HH:mm")} size={"sm"}>{format(item, "HH:mm")}</Radio>
    ), [])

    const onCloseSelectTimeModal = () => {
        setHourSelectionVisibility(false)
        setSelectedAppointmentTime("")
        setSelectTimeValid(false)
    }

    // @ts-ignore
    return (
        <View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <Modal isOpen={isHourSelectionModalVisible} onClose={onCloseSelectTimeModal}>
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>Choose appointment hour</Modal.Header>
                    <Modal.Body>
                        {
                            error? <AlertComponent status="error" text={error} onClose={() => setError(null)}/>:  <FormControl isInvalid={selectTimeValid}>
                                <Radio.Group name={"Select time"} onChange={value => selectTimeRadio(value)} value={selectedAppointmentTime}>
                                    <ScrollView horizontal={true}>
                                        <FlatList data={availableTimeSlots} renderItem={renderItemTimeslot} keyExtractor={item => item.getTime().toString()} />
                                    </ScrollView>
                                </Radio.Group>
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>Please make a selection!</FormControl.ErrorMessage>
                            </FormControl>
                        }

                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme="green" onPress={confirmSelectedTime}>Confirm</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </View>
    );
};

export default CalendarPicker;