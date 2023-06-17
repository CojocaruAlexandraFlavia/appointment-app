import { Box, Button, Center, Heading, HStack, Text, View } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { ConfirmAppointmentRouteProp } from "../../../navigation/navigator.types";
import { useUserDataContext } from "../../../store/user-data.context";
import { Loading } from "../../../components/activity-indicator.component";
import confirmAppointmentStyle from "./confirm-appointment.style";
import {addDoc, collection, doc, getDoc} from "firebase/firestore";
import { firestore } from "../../../utils/firebase";
import { Salon } from "../../../utils/types";
import {salonConverter} from "../../Salon/salon.class";
import {AlertComponent} from "../../../components/alert.component";
import {useExpoPushTokenContext} from "../../../store/expo-push-token.context";

export const ConfirmAppointment = ({navigation}: any) => {

    const styles = confirmAppointmentStyle()

    const {token} = useExpoPushTokenContext()
    const route = useRoute<ConfirmAppointmentRouteProp>()
    const { service, time, date, idSalon } = route.params;

    const { user } = useUserDataContext()

    const [salon, setSalon] = useState<Salon | null>(null)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [firebaseError, setFirebaseError] = useState("")
    const [notificationError, setNotificationError] = useState("")

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
        retrieveSalon().catch(e => console.log(e))
    }, [])

    const sendNotificationAfterConfirm = async () => {
        try {
            const message = {
                to: token,
                sound: "default",
                title: "New appointment sent!",
                body: `Your appointment at ${salon?.name}, for ${date}, ${time}, was sent successfully!`,
                data: { url: "Appointments" },
            };

            await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Accept-encoding": "gzip, deflate",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            })
        } catch (e: any) {
            setNotificationError(e.message)
        }
    }

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
                sendNotificationAfterConfirm()
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
                <Box shadow={"6"} p={3} w="90%" justifyContent='center' backgroundColor={'white'} rounded={5}>
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
                    <Button mt={5} mb={3} colorScheme='green' onPress={confirmAppointment}>Confirm</Button>
                    <Button colorScheme="gray" variant="subtle" onPress={() => navigation.navigate("Salon", {id: idSalon})}>Cancel</Button>
                </Box>
                {
                    showConfirmationModal && <Loading/>
                }
                {
                    firebaseError && <AlertComponent status={"error"} onClose={() => setFirebaseError("")} text={firebaseError}/>
                }
                {
                    notificationError && <AlertComponent status={"error"} text={notificationError} onClose={() => setNotificationError("")}/>
                }
            </Center>
        </View>
    )
}