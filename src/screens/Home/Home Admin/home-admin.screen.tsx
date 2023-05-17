import {collection, doc, getDocs, updateDoc} from "firebase/firestore";
import {firestore} from "../../../utils/firebase";
import {salonConverter} from "../../Salon/salon.class";
import {Salon} from "../../../utils/types";
import React, {useCallback, useEffect, useState} from "react";
import {Avatar, Box, Button, Center, FlatList, Heading, HStack, Modal, Text, VStack} from "native-base";
import {ListRenderItemInfo} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {AlertComponent} from "../../../components/alert.component";

const HomeAdmin = () => {

    const [salons, setSalons] = useState<Salon[]>([])
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
    const [salon, setSalon] = useState<Salon|undefined>(undefined)

    const retrieveAllSalons = async () => {
        const salonCollectionRef = collection(firestore, "salons").withConverter(salonConverter)
        const salonDocs = await getDocs(salonCollectionRef)

        try {
            let salonList: Salon[] = []
            salonDocs.forEach( documentSnapshot =>  {
                const salon = documentSnapshot.data()
                salonList.push({...salon, images: [salon.image], id: documentSnapshot.id, reviews: []})
            })
            setSalons(salonList)
        } catch (e) {
            console.log("error: " + e)
        }
    }

    const handleShowDeleteModal = (salon: Salon) => {
        setSalon(salon)
        setShowDeleteConfirmationModal(true)
    }

    const handleEnable = async (item: Salon) => {
        setSalon(item)
        await changeSalonAvailability(true)
    }

    const renderItem = useCallback(({item}: ListRenderItemInfo<Salon>) => {
        return (
            <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" py="2">
                <HStack space={"sm"} justifyContent={"space-evenly"}>
                    <Avatar alignSelf="center" size="48px" source={{uri: item.images[0]}} mr={1}/>
                    <VStack>
                        <Heading style={{alignSelf: "center", fontSize: 18}}>{item.name}</Heading>
                        <Text>{item.location}</Text>
                        <Text>{item.phoneNumber}</Text>
                    </VStack>
                    {
                        item.enabled? <Button alignSelf="center" colorScheme="red" onPress={() => handleShowDeleteModal(item)}>)
                            <Icon name="trash-bin"/>
                        </Button>: <Button alignSelf="center" colorScheme="green" onPress={() => handleEnable(item)}>)
                            <Icon name="checkmark"/>
                        </Button>
                    }
                </HStack>
            </Box>)
    }, [])

    const handleCloseConfirmationModal = () => {
        setShowDeleteConfirmationModal(false)
    }

    useEffect(() => {
        retrieveAllSalons()
    }, [])

    const changeSalonAvailability = async (status: boolean) => {
        try {
            if (salon !== undefined) {
                const salonRef = doc(firestore, "salons", salon.id).withConverter(salonConverter)
                await updateDoc(salonRef, {
                    ...salon,
                    enabled: status
                })
                await retrieveAllSalons()
                setSalon(undefined)
                setShowDeleteConfirmationModal(false)
            }
        } catch (e: any) {
            console.log(e)
        }
    }

    return(
        <Center w="100%">
            <Box safeArea p="3" py="12" w="100%">
                <FlatList data={salons} renderItem={renderItem} keyExtractor={item => item.id.toString()}/>
                <Modal isOpen={showDeleteConfirmationModal} onClose={handleCloseConfirmationModal}>
                    <Modal.Content>
                        {/*<Modal.CloseButton/>*/}
                        <Modal.Body>
                            <AlertComponent status={"warning"} text={`Are you sure you want to disable this item? \n Name: ${salon?.name} \n Location: ${salon?.location} \n Phone number: ${salon?.phoneNumber}`}
                                            onClose={handleCloseConfirmationModal}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button mr={2} colorScheme={"gray"} onPress={handleCloseConfirmationModal}>Cancel</Button>
                            <Button colorScheme={"green"} onPress={() => changeSalonAvailability(false)}>Confirm</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </Box>
        </Center>

    )

}

export default HomeAdmin