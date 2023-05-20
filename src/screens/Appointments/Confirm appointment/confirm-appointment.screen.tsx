import { Box, Button, Center, Heading, HStack, Text, View } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { ConfirmAppointmentRouteProp } from "../../../navigation/navigator.types";
import { useUserDataContext } from "../../../store/user-data.context";
import { Loading } from "../../../components/activity-indicator.component";
import confirmAppointmentStyle from "./confirm-appointment.style";
import {addDoc, collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import { firestore } from "../../../utils/firebase";
import { Salon } from "../../../utils/types";
import {salonConverter} from "../../Salon/salon.class";

export const ConfirmAppointment = ({navigation}: any) => {

    const route = useRoute<ConfirmAppointmentRouteProp>()
    const { service, time, date, idSalon } = route.params;
    const styles = confirmAppointmentStyle()

    const { user } = useUserDataContext()

    const [salon, setSalon] = useState<Salon | null>(null)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [firebaseError, setFirebaseError] = useState("")

    const retrieveSalon = useCallback(async () => {
        try {
            const docRef = doc(firestore, "salons", idSalon).withConverter(salonConverter);
            const salonDoc = await getDoc(docRef)
            if (salonDoc.exists()) {
                setSalon({...salonDoc.data(), images: [], id: salonDoc.id, reviews: []})
            }
        } catch (e) {
            console.log("error " + e)
        }
    }, [])

    useEffect(() => {
        retrieveSalon().then(() => console.log("retrieve salon id: " + salon?.id)).catch(e => console.log(e))
    }, [])

    const confirmAppointment = async () => {
        try {
            const collectionRef = collection(firestore, "appointments");
            await addDoc(collectionRef, {
                salonId: salon?.id,
                date: date,
                time: time,
                clientId: user.id,
                serviceName: service
            });
            setShowConfirmationModal(true)
            setTimeout(() => {
                setShowConfirmationModal(false)
                navigation.navigate("Salon", {id: salon?.id})
            }, 3000)
        } catch (e) {
            const errorCode = (e as { code: string }).code
            // let errorMessage = errorCode.split('/')[1].replaceAll('-', ' ')
            // errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
            console.log(e)
            setFirebaseError(errorCode)
        }

    }

    return(
        <View style={styles.centered}>
            <Center w="100%">
                <Box safeArea p="2" py="8" w="100%" maxW="290" justifyContent='center'>
                    <Heading mb={8}>Do you confirm the following appointment?</Heading>
                    <HStack>
                        <Text fontSize="xl" bold>Salon: </Text>
                        <Text fontSize="xl">{salon?.name}</Text>
                    </HStack>
                    <HStack>
                        <Text fontSize="xl" bold>Date: </Text>
                        <Text fontSize="xl">{date} {time}</Text>
                    </HStack>
                    <HStack>
                        <Text fontSize="xl" bold>Service: </Text>
                        <Text fontSize="xl">{service}</Text>
                    </HStack>
                    <Button mt={5} colorScheme='green' variant='subtle' onPress={confirmAppointment}>Confirm</Button>
                </Box>
                {
                    showConfirmationModal && <Loading/>
                }
                {
                    firebaseError && <Text color='red.500'>{firebaseError}</Text>
                }
            </Center>
        </View>
    )
}