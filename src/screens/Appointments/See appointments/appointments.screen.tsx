import {
    Box,
    Center, FlatList, Heading,
    ScrollView,
    Text, VStack
} from "native-base";
import {ReactElement, useCallback, useEffect, useState} from "react";
import {Appointment} from "../../../utils/types";
import * as React from 'react';
import {ListRenderItemInfo} from 'react-native';
import 'react-native-gesture-handler';
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {useUserDataContext} from "../../../store/user-data.context";
import {firestore} from "../../../utils/firebase";
import {appointmentConverter} from "../appointment.class";
import {salonConverter} from "../../Salon/salon.class";
import {Loading} from "../../../components/activity-indicator.component";
import {useIsFocused} from "@react-navigation/native";
import {AlertComponent} from "../../../components/alert.component";

type SalonAppointments = {
    [salonName: string]: Appointment[]
}

export const Appointments: React.FC = (): ReactElement => {

    const { user } = useUserDataContext()
    const isFocused = useIsFocused();

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState<boolean|undefined>(undefined)
    const [salonAppointments, setSalonAppointments] = useState<SalonAppointments>({})

    const retrieveUserAppointments = async () => {
        try {
            let salonAppointments: SalonAppointments = {}

            const collectionRef = collection(firestore, "appointments").withConverter(appointmentConverter)
            const appointmentsQuery = query(collectionRef, where("clientId", "==", user.id))
                .withConverter(appointmentConverter)
            const result = await getDocs(appointmentsQuery)

            for (const documentSnapshot of result.docs) {
                const appointment = documentSnapshot.data()
                const salonRef = doc(firestore, "salons", appointment.salonId).withConverter(salonConverter)
                const salon = await getDoc(salonRef)
                if (salon.exists()) {
                    const salonData = salon.data()
                    const newAppointment: Appointment = {...appointment, id: documentSnapshot.id}
                    if (!Object.keys(salonAppointments).includes(salonData?.name)) {
                        salonAppointments[salonData?.name] = []
                    }
                    salonAppointments[salonData?.name].push(newAppointment)
                }
            }

            return salonAppointments
        }
        catch (e: any) {
            console.log("Error at retrieving appointments: " + e)
            setError(e)
        }
    }

    const retrieveFinaleAppointments = async () => {
        setLoading(true)
        // @ts-ignore
        let appointmentsAndSalons: SalonAppointments = await retrieveUserAppointments()
        setSalonAppointments(appointmentsAndSalons)
        setLoading(false)
    }

    useEffect(() => {
        if (isFocused) {
            retrieveFinaleAppointments().catch(e=> console.log(e))
        }
    }, [isFocused])

    const renderItem = useCallback(({item}: ListRenderItemInfo<Appointment>) =>
        (
            <VStack borderWidth={1} borderColor={'lightgrey'} mb={2} p={3} w={"2xs"} rounded={15}>
                <Text italic mb={1} style={{fontSize:15}}>Service:  {item.serviceName}</Text>
                <Text mb={1} style={{fontSize:15}}>Date: {item.date}</Text>
                <Text>Time: {item.time}</Text>
            </VStack>
        ), [])

    return(
        <ScrollView style={{backgroundColor: '#cda9e6'}}>
            <Center w="100%" >
                <Box mb={10} mt={30} p="5" w="90%" backgroundColor={'white'} rounded={15}>
                    {
                        loading == true? <Loading/>: loading == false && Object.keys(salonAppointments).length == 0?
                            <Heading>You don't have any appointment yet...</Heading>: error? <AlertComponent status={"error"} text={"An error occurred. Try to refresh."} onClose={() => setError(null)}/>:
                                Object.keys(salonAppointments).map((item, index) =>
                                    <Box key={index} borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "2"]} pr={["0", "2"]} py="2">
                                        <Text italic style={{fontSize:15, fontWeight: 'bold'}} mb={2}> {"Salon: " + item} </Text>
                                        <ScrollView horizontal={true}>
                                            <FlatList data={salonAppointments[item]} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
                                        </ScrollView>
                                    </Box>)
                    }
                </Box>
            </Center>
        </ScrollView>
    )
}