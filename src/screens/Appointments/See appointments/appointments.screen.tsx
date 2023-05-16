import {
    Avatar,
    Box,
    Button,
    Center,
    FlatList,
    FormControl,
    Heading,
    HStack,
    Link,
    Modal,
    Pressable,
    Radio,
    ScrollView,
    SectionList,
    Spacer,
    Text,
    VStack,
    WarningOutlineIcon
} from "native-base";
import {ReactElement, useCallback, useEffect, useState} from "react";
import { Rating } from "react-native-ratings";
import {Appointment, Salon, ServicesListData, ServiceWithTime} from "../../../utils/types";
import * as React from 'react';
import {Linking, ListRenderItemInfo, SectionListData, SectionListRenderItemInfo, View} from 'react-native';
import 'react-native-gesture-handler';
import {AppointmentsScreenRouteProp} from "../../../navigation/navigator.types";
import {useRoute} from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';
import {addDoc, collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {useUserDataContext} from "../../../store/user-data.context";
import {firestore} from "../../../utils/firebase";
import {appointmentConverter} from "../appointment.class";

export const Appointments: React.FC = ({navigation}: any): ReactElement => {

    // const [appointmentExamples] = useState<Appointment[]>([
    //     {
    //         id: "1",
    //         clientId: "4",
    //         salonId: "2",
    //         date: "08-04-2022",
    //         time: "12:00",
    //         serviceName: "Hair color",
    //     },
    //     {
    //         id: "2",
    //         clientId: "4",
    //         salonId: "2",
    //         date: "08-04-2022",
    //         time: "13:00",
    //         serviceName: "Hairdressing"
    //     }
    // ])
    // const route = useRoute<AppointmentsScreenRouteProp>()

    // const renderItemAppointment = useCallback(({item}: ListRenderItemInfo<Appointment>) => (
    //     <ScrollView>
    //         <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}}
    //              borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
    //             <HStack space={[4, 5]} justifyContent="space-between">
    //                 <Feather alignSelf={"center"} name="check-circle" size={20} color="black" />
    //                 <VStack alignItems={"flex-start"}>
    //                     <Text italic mb={1} style={{fontSize:15}}>Service: {item.serviceName}</Text>
    //                     <Text mb={1} style={{fontSize:15}}>Date: {item.date}     Time: {item.time}</Text>
    //                 </VStack>
    //                 <Spacer />
    //             </HStack>
    //         </Box>
    //     </ScrollView>
    // ), [])

    const { user } = useUserDataContext()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [error, setError] = useState(null)

    const retrieveUserAppointments = async () => {
        try {
            let appointments: Appointment[] = []

            const collectionRef = collection(firestore, "appointments")
            const appointmentsQuery = query(collectionRef, where("clientId", "==", user.id))
                .withConverter(appointmentConverter)
            const result = await getDocs(appointmentsQuery)

            result.forEach(documentSnapshot => {
                appointments.push({...documentSnapshot.data(), id: documentSnapshot.id})
            })
            return appointments
        }
        catch (e: any) {
            console.log("Error at retrieving appointments: " + e)
            setError(e)
            }
    }

    const retrieveFinaleAppointments = async () => {
        // @ts-ignore
        let appointments: Appointment[] = await retrieveUserAppointments()
       // if (appointments === undefined)
        {
            setAppointments(appointments)
        }
    }

    useEffect(() => {
        //if (appointments === null)
        {
            retrieveFinaleAppointments().catch(e=> console.log(e))
        }
    }, [])

    const renderAppointmentItem = useCallback(({item}: ListRenderItemInfo<Appointment>) =>
            <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}}
                 borderColor="muted.800" pl={["0", "2"]} pr={["0", "2"]} py="2">
                <HStack space={[4, 5]} justifyContent="space-between">
                    <Feather alignSelf={"center"} name="check-circle" size={20} color="black" />
                    <VStack alignItems={"flex-start"}>
                        <Text italic mb={1} style={{fontSize:15, fontWeight: 'bold'}} >Service:  {item.serviceName}</Text>
                        <Text mb={1} style={{fontSize:15}}>Date: {item.date}                 Time: {item.time}</Text>
                    </VStack>
                    <Spacer />
                </HStack>
            </Box>
    , [])


    return(
        <Center w="100%">
            {/*<Heading italic bold alignSelf={"center"} mt={3} mb={4}>My Appointments</Heading>*/}
            {/*<FlatList data={appointmentExamples} renderItem={renderItemAppointment} keyExtractor={item => item.id.toString()} />*/}

            <ScrollView horizontal={true}>
                <FlatList data={appointments} renderItem={renderAppointmentItem} keyExtractor={item => item.id.toString()} />
            </ScrollView>

        </Center>
    )
}