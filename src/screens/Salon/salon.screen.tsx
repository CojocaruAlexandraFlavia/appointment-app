import {
    Avatar,
    Box,
    Button,
    Center,
    FlatList,
    FormControl,
    Heading,
    HStack,
    Icon,
    Link,
    Modal,
    Radio,
    ScrollView,
    SectionList,
    Spacer,
    Text,
    View,
    VStack,
    WarningOutlineIcon
} from "native-base";
import { useRoute } from '@react-navigation/native';
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { SliderBox } from "react-native-image-slider-box";
import { Review, Salon, ServicesListData, ServiceWithTime } from "../../utils/types";
import { Rating } from "react-native-ratings";
import CalendarPicker from "../Calendar/calendar-picker.screen";
import { Linking, ListRenderItemInfo, SectionListData, SectionListRenderItemInfo } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { salons, allServices } from "../../utils/constants";
import { SalonScreenRouteProp } from "../../navigation/navigator.types";
import {doc, getDoc} from "firebase/firestore";
import {firestore, storage} from "../../utils/firebase";
import {salonConverter} from "./salon.class";
import {getDownloadURL, list, ref} from "firebase/storage";
import {Loading} from "../../components/activity-indicator.component";
import {userConverter} from "../Profile/user.class";
import {ReviewClass} from "./review.class";


export const SalonScreen: React.FC = ({navigation}: any): ReactElement => {

    const [salon, setSalon] = useState<Salon>({
        endTime: "",
        id: "",
        images: [],
        location: "",
        name: "",
        phoneNumber: "",
        rating: 0,
        startTime: "",
        reviews: []
    })

    const [allSalonServices, setAllSalonServices] = useState<ServicesListData[]>([])

    const [showSelectServiceModal, setShowSelectServiceModal] = useState(false)
    const [showCalendarPicker, setShowCalendar] = useState(false)
    const [selectedService, setSelectedService] = useState("")
    const [formValidation, setFormValidation] = useState(true)

    const route = useRoute<SalonScreenRouteProp>()
    const { id } = route.params;

    const retrieveAllServices = useCallback(() =>  {
        let listData: ServicesListData[] = []
        for (const item of allServices) {
            const data: ServicesListData = {
                title: item.name,
                data: item.services
            }
            listData.push(data)
        }
        setAllSalonServices(listData)
    }, [])

    const retrieveSalonImages = async (salonId: string) => {
        let salonImages: string[] = []
        const result = await list(ref(storage, `salons/${salonId}`))
        for(const item of result.items) {
            const url = await getDownloadURL(item)
            salonImages.push(url)
        }
        return salonImages
    }

    const updateReviewsWithUserDetails = async (reviews: ReviewClass[]) => {
        let updatedReviews: Review[] = []
        for (const review of reviews) {
            const client = await getDoc(doc(firestore, review.client.path).withConverter(userConverter))
            if (client.exists()) {
                updatedReviews.push({...review, client: client.data()})
            }
        }
        return updatedReviews
    }

    const retrieveSalon = useCallback(async () => {
        try {
            const docRef = doc(firestore, "salons", id).withConverter(salonConverter);
            const salonDoc = await getDoc(docRef)
            if (salonDoc.exists()) {
                retrieveSalonImages(id).then(async result => {
                    if (salonDoc.exists()) {
                        const salon = salonDoc.data()
                        const updatedReviews = await updateReviewsWithUserDetails(salon.reviews)
                        setSalon({...salon, images: result, id: salonDoc.id, reviews: updatedReviews})
                    }
                })
            }
        } catch (e: any) {
            console.log("error " + e)
        }
    }, [])

    useEffect(() => {
        retrieveSalon().catch(e => console.log(e))
        retrieveAllServices()
    }, [id])

    const handleValidateOption = () => {
        const validOption = selectedService !== ""
        setFormValidation(validOption)
        setShowSelectServiceModal(!validOption)
        setShowCalendar(validOption)
        // onCloseServiceModal()
    }

    const onCloseServiceModal = () => {
        console.log("close service modal")
        setShowSelectServiceModal(false)
        setSelectedService("")
        setFormValidation(true)
    }

    const doCall = () => {
        Linking.openURL(`tel:${salon?.phoneNumber}`)
            .then(() => console.log("opened phone caller"))
            .catch(error => console.log(error))
    }

    const renderItemServiceList = useCallback(({ item }: SectionListRenderItemInfo<ServiceWithTime, ServicesListData>)  =>
        (<Radio size={"sm"} ml={2} mb={1} value={item.name}>{`${item.name}, ${item.duration}h`}</Radio>), [])

    const renderHeaderServiceList = useCallback((info: { section: SectionListData<ServiceWithTime, ServicesListData> }) =>
        (<Heading fontSize="xl" mt="8" pb="4" alignSelf={"center"}> {info.section.title} </Heading>), [])

    const renderItemReview = useCallback(({item}: ListRenderItemInfo<Review>) => (<Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}}
                                                          borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
        <HStack space={[2, 3]} justifyContent="space-between">
            <Avatar alignSelf={"center"} size="48px" source={{uri: item.client.profilePicture}} />
            <VStack alignItems={"flex-start"}>
                <Text mb={1}> {item.client.firstName} {item.client.lastName} </Text>
                <Rating type="custom" startingValue={item.stars} imageSize={15} readonly />
                <Text style={{fontSize:12}}>{item.message}</Text>
            </VStack>
            <Spacer />
        </HStack>
    </Box>), [])

    return(
        <View>
            {
                salon.images.length === 0 ? <View h="100%"> <Loading/> </View>: <Center w="100%">
                    <Box safeArea p="2" py="8" w="100%" maxW="290">
                        <HStack justifyContent={"space-between"} mb={2}>
                            <Heading  size={"lg"} mb={2} alignSelf={"center"}>Salon {salon?.name}</Heading>
                            <Rating style={{marginBottom: "3%"}} type="custom" startingValue={salon?.rating} imageSize={20} readonly />
                        </HStack>

                        <SliderBox alignSelf={"center"} ImageComponentStyle={{borderRadius: 15, width: '75%'}} w="90%"
                                   images={salon?.images} autoplay circleLoop sliderBoxHeight={120}/>
                        <Modal isOpen={showSelectServiceModal} onClose={onCloseServiceModal} size={"lg"}>
                            <Modal.Content flexGrow={1}>
                                <Modal.CloseButton/>
                                <Modal.Header>Choose service</Modal.Header>
                                <Modal.Body >
                                    <FormControl maxW="300" isInvalid={!formValidation}>
                                        <Radio.Group name={"Group"} onChange={(value) => setSelectedService(value)} value={selectedService}>
                                            <ScrollView horizontal={true}>
                                                <SectionList sections={allSalonServices} keyExtractor={(item) => item.name}
                                                             renderItem={ renderItemServiceList } renderSectionHeader={ renderHeaderServiceList } />
                                            </ScrollView>
                                        </Radio.Group>
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>Please make a selection!</FormControl.ErrorMessage>
                                    </FormControl>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button colorScheme={"success"} onPress={handleValidateOption}>Next</Button>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                        <Button mt={4} mb={2} onPress={() => setShowSelectServiceModal(true)}>Ask for appointment</Button>

                        <Icon size="6" as={AntDesign} name="mobile1" color="black"/>
                        <Link
                            _text={{fontSize: "sm", fontWeight: "bold", textDecoration: "none",}} _light={{_text: {color: "primary.900",},}}
                            _dark={{_text: {color: "primary.500",},}}
                            onPress={doCall}>Phone number: {salon?.phoneNumber}
                        </Link>

                        <CalendarPicker salonId={id} selectedService={selectedService}
                                        setShow={setShowCalendar} show={showCalendarPicker} navigation={navigation}/> {"\n"}

                        <Heading italic bold alignSelf={"center"} mb={2}>Reviews</Heading>

                        <FlatList data={salon.reviews} renderItem={renderItemReview} keyExtractor={item => item.id.toString()} />
                    </Box>

                </Center>
            }
        </View>
    )

}