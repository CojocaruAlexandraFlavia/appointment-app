import {
    Box,
    Center, Heading,
    HStack,
    ScrollView,
    Spacer,
    Text,
    VStack
} from "native-base";
import {ReactElement, useCallback, useEffect, useState} from "react";
import {Appointment} from "../../../utils/types";
import * as React from 'react';
import {ListRenderItemInfo} from 'react-native';
import 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {useUserDataContext} from "../../../store/user-data.context";
import {firestore} from "../../../utils/firebase";
import {appointmentConverter} from "../appointment.class";
import {SalonClass, salonConverter} from "../../Salon/salon.class";
import {Loading} from "../../../components/activity-indicator.component";
import {useIsFocused} from "@react-navigation/native";

type SalonsAndAppointments = {
    salons: SalonClass[],
    appointments: Appointment[]
}

export const Appointments: React.FC = (): ReactElement => {

    const { user } = useUserDataContext()
    const isFocused = useIsFocused();

    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [error, setError] = useState(null)
    const [salons, setSalons] = useState<SalonClass[]>([])
    const [loading, setLoading] = useState<boolean|undefined>(undefined)

    const retrieveUserAppointments = async () => {
        try {
            let returnObject: SalonsAndAppointments = {
                salons: [],
                appointments: []
            }
            let appointments: Appointment[] = []

            const collectionRef = collection(firestore, "appointments").withConverter(appointmentConverter)
            const appointmentsQuery = query(collectionRef, where("clientId", "==", user.id))
                .withConverter(appointmentConverter)
            const result = await getDocs(appointmentsQuery)

            const salonList: SalonClass[] = []
            for (const documentSnapshot of result.docs) {
                const appointment = documentSnapshot.data()
                const salonRef = doc(firestore, "salons", appointment.salonId).withConverter(salonConverter)
                const salon = await getDoc(salonRef)
                if (salon.exists()) {
                    salonList.push(salon.data())
                }
                appointments.push({...documentSnapshot.data(), id: documentSnapshot.id})
            }
            returnObject['salons'] = salonList
            returnObject['appointments'] = appointments
            return returnObject
        }
        catch (e: any) {
            console.log("Error at retrieving appointments: " + e)
            setError(e)
        }
    }

    const retrieveFinaleAppointments = async () => {
        setLoading(true)
        // @ts-ignore
        let appointmentsAndSalons: SalonsAndAppointments = await retrieveUserAppointments()
        setAppointments(appointmentsAndSalons.appointments)
        setSalons(appointmentsAndSalons.salons)
        setLoading(false)
    }

    useEffect(() => {
        if (isFocused) {
            retrieveFinaleAppointments().catch(e=> console.log(e))
        }
    }, [isFocused])

    useCallback(({item}: ListRenderItemInfo<Appointment>) =>
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
        </Box>, []);

    return(
        <ScrollView style={{backgroundColor: '#cda9e6'}}>
            <Center w="100%" >
                <Box mb={10} mt={30} p="5" w="90%" backgroundColor={'white'} rounded={15}>
                    {
                        loading == true? <Loading/>: loading == false && appointments.length == 0?
                            <Heading>You don't have any appointment yet...</Heading>: salons.length > 0?
                                appointments.map((item, index) =>
                                    <Box key={item.id} borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "2"]} pr={["0", "2"]} py="2">
                                        <HStack space={[4, 5]} justifyContent="space-between">
                                            <Feather alignSelf={"center"} name="check-circle" size={20} color="black" />
                                            <VStack alignItems={"flex-start"}>
                                                <Text>Salon: {salons[index].name}</Text>
                                                <Text italic mb={1} style={{fontSize:15, fontWeight: 'bold'}}>Service:  {item.serviceName}</Text>
                                                <Text mb={1} style={{fontSize:15}}>Date: {item.date}</Text>
                                                <Text>Time: {item.time}</Text>
                                            </VStack>
                                            <Spacer />
                                        </HStack>
                                    </Box>): null
                    }
                </Box>
            </Center>
        </ScrollView>
    )
}