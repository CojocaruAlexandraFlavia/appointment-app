import {
    Box,
    Center,
    FlatList, Heading,
    HStack,
    ScrollView,
    Spacer,
    Text,
    VStack
} from "native-base";
import {ReactElement, useCallback, useEffect, useState} from "react";
import {Appointment} from "../../../utils/types";
import * as React from 'react';
import {ImageBackground, ListRenderItemInfo, SafeAreaView, StyleSheet} from 'react-native';
import 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import {collection, getDocs, query, where} from "firebase/firestore";
import {useUserDataContext} from "../../../store/user-data.context";
import {firestore} from "../../../utils/firebase";
import {appointmentConverter} from "../appointment.class";

export const Appointments: React.FC = (): ReactElement => {

    const { user } = useUserDataContext()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [error, setError] = useState(null)

    const retrieveUserAppointments = async () => {
        try {
            let appointments: Appointment[] = []

            const collectionRef = collection(firestore, "appointments").withConverter(appointmentConverter)
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


    const styles = StyleSheet.create({
        backgroundImage: {
            flex: 1,
            width: 400,
            // height: null,
            resizeMode: 'cover', // or 'stretch'
            justifyContent: 'center',
            alignItems: 'center',
        }
    });

    return(
        <Center w="100%">
            <SafeAreaView >
                <ImageBackground  style={styles.backgroundImage} source={require('../../../../assets/background-semi.png')} >

                {/*<Heading italic bold alignSelf={"center"} mt={3} mb={4}>My Appointments</Heading>*/}

            <ScrollView horizontal={true}>
                <FlatList data={appointments} renderItem={renderAppointmentItem} keyExtractor={item => item.id.toString()} />
            </ScrollView>

                </ImageBackground>
            </SafeAreaView>
        </Center>
    )
}