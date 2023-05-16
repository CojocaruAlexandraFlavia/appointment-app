import {
    Avatar,
    Box,
    Button,
    Center,
    FormControl,
    Heading,
    HStack,
    Link,
    Modal,
    Radio,
    ScrollView,
    SectionList,
    Spacer,
    View,
    VStack,
    WarningOutlineIcon,
    Icon
} from "native-base";
import {BackHandler, Text, TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';
import React, {ReactElement, useCallback, useEffect, useRef, useState} from "react";
import { SliderBox } from "react-native-image-slider-box";
import { Review, Salon, ServicesListData, ServiceWithTime } from "../../utils/types";
import { Rating } from "react-native-ratings";
import CalendarPicker from "../Calendar/calendar-picker.screen";
import {Alert, Linking, SectionListData, SectionListRenderItemInfo, Share} from "react-native";
import {Entypo, Feather} from "@expo/vector-icons";
import { SalonScreenRouteProp } from "../../navigation/navigator.types";
import {doc, getDoc} from "firebase/firestore";
import {firestore, storage} from "../../utils/firebase";
import {salonConverter} from "./salon.class";
import {getDownloadURL, list, ref} from "firebase/storage";
import {Loading} from "../../components/activity-indicator.component";
import {userConverter} from "../Profile/user.class";
import {ReviewClass} from "./review.class";
import {TouchableRipple} from "react-native-paper";
import salonStyles from "./salon.styles"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AddReviewModal from "./add-review.modal";
import * as servicesJson from '../../utils/all-services.json'
// import Animated, {
//     useAnimatedStyle,
//     withRepeat,
//     withSequence,
//     withTiming,
// } from 'react-native-reanimated';
import { StyleSheet, Animated, TouchableWithoutFeedback, Image, Easing } from 'react-native';
import {yellow200} from "react-native-paper/lib/typescript/src/styles/themes/v2/colors";

const emptyState: Salon = {
    nrOfReviews: 0,
    endTime: "",
    id: "",
    images: [],
    location: "",
    name: "",
    phoneNumber: "",
    rating: 0,
    startTime: "",
    reviews: []
}

export const Salons: React.FC = ({navigation}: any): ReactElement => {

    const [salon, setSalon] = useState<Salon>(emptyState)

    const [allSalonServices, setAllSalonServices] = useState<ServicesListData[]>([])

    const [showSelectServiceModal, setShowSelectServiceModal] = useState(false)
    const [showCalendarPicker, setShowCalendar] = useState(false)
    const [selectedService, setSelectedService] = useState("")
    const [formValidation, setFormValidation] = useState(true)

    const route = useRoute<SalonScreenRouteProp>()
    let { id } = route.params;

    const retrieveAllServices = useCallback(() =>  {
        let listData: ServicesListData[] = []
        for (const item of servicesJson.allServices) {
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
                    const salon = salonDoc.data()
                    const updatedReviews = await updateReviewsWithUserDetails(salon.reviews)
                    setSalon({...salon, images: result, id: salonDoc.id, reviews: updatedReviews})
                })
            }
        } catch (e: any) {
            console.log("error " + e)
        }
    }, [id])


    useEffect(() => {
        retrieveSalon().catch(e => console.log(e))
        retrieveAllServices()
    }, [id])

    useEffect(() => {
        const backAction = () => {
            setShowSelectServiceModal(false)
            setShowCalendar(false)
            setSelectedService("")
            setFormValidation(true)
            navigation.navigate("HomeClient")
            setSalon(emptyState)
            setCountClaps(1)
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

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

    const onShare = async () => {
        try {
            const shareMessage = `Name: ${salon.name},\nLocation: ${salon.location}\nPhone number: ${salon.phoneNumber}\nRating: ${salon.rating}/5.00`
            const result = await Share.share({
                message: shareMessage
            }, {
                dialogTitle: `Salon ${salon.name}`
            });
        } catch (error: any) {
            console.log(error)
            Alert.alert(error.message);
        }
    };

    const styles = salonStyles()

    //animation for clapping button
    const [countClaps, setCountClaps]=useState(1);
    const [claps, setClaps]=useState([]);
    const clapHand=()=>{
        setCountClaps(
            countClaps+1
        )
        // @ts-ignore
        claps.push(countClaps);
    }
    const clapIcon = countClaps > 1 ? <Image source={require("../../../assets/clapping.png")} style={styles.img} />
        : <Image source={require("../../../assets/clap.png")} style={styles.img} />
    const RenderBubble=()=>{
        return(
            claps.map(newCount=><BubbleHand animationCompleted={animationCompleted} newCount={newCount}  key={newCount}/>)
        )
    }
    const animationCompleted=(newCount: any)=>{
        // @ts-ignore
        claps.splice(claps.indexOf(newCount), 1)
        setClaps([])
    }

    const BubbleHand=(props:any)=>{
        const [bubbleAnimaiton, setBubbAnimation] = useState(new Animated.Value(0));
        const [bubbleAnimaitonOpacity, setBubbleAnimationOpacity] = useState(new Animated.Value(0));
        useEffect(()=>{
            Animated.parallel([
                Animated.timing(bubbleAnimaiton,{
                    toValue:-550,
                    duration:2000,
                    useNativeDriver:true,
                }),
                Animated.timing(bubbleAnimaitonOpacity, {
                    toValue:1,
                    duration:2000,
                    useNativeDriver:true,
                })
            ]).start(()=>{
                setTimeout(()=>{
                    props.animationCompleted(props.newCount)
                }, 500)

            });
        })
        const bubble ={
            transform:[
                {translateY:bubbleAnimaiton}
            ],
            opacity:bubbleAnimaitonOpacity,
        }
        return(
            <Animated.View style={[styles.bubble, bubble]}>
                <Text style={styles.text}>
                    +{props.newCount}
                </Text>
            </Animated.View>
        )
    }

    return(
        <ScrollView>
            {
                salon.images.length === 0? <View h="100%"><Loading/></View>: <><Center w="100%">
                    <Box safeArea p="2" py="8" w="100%" maxW="290" marginTop={-19.5}>
                        <HStack justifyContent={"space-between"} mb={3}>

                            {/*<TouchableWithoutFeedback onPress={handleAnimation}>*/}
                            {/*    <Animated.View style={{...styles.box, ...animatedStyle}} />*/}
                            {/*</TouchableWithoutFeedback>*/}

                            <Heading size={"lg"} mb={2} alignSelf={"center"}>Salon {salon?.name}</Heading>
                            <Rating style={{marginBottom: "3%"}} type="custom" startingValue={salon?.rating}
                                    imageSize={20} readonly/>
                        </HStack>

                        <SliderBox alignSelf={"center"} ImageComponentStyle={{borderRadius: 15, width: '75%'}} w="90%"
                                   images={salon?.images} autoplay circleLoop sliderBoxHeight={120}/>
                        <Modal isOpen={showSelectServiceModal} onClose={onCloseServiceModal} size={"lg"}>
                            <Modal.Content flexGrow={1}>
                                <Modal.CloseButton/>
                                <Modal.Header>Choose service</Modal.Header>
                                <Modal.Body>
                                    <FormControl maxW="300" isInvalid={!formValidation}>
                                        <Radio.Group name={"Group"} onChange={(value) => setSelectedService(value)}
                                                     value={selectedService}>
                                            <ScrollView horizontal={true}>
                                                <SectionList sections={allSalonServices}
                                                             keyExtractor={(item) => item.name}
                                                             renderItem={renderItemServiceList}
                                                             renderSectionHeader={renderHeaderServiceList}/>
                                            </ScrollView>
                                        </Radio.Group>
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>Please make
                                            a selection!</FormControl.ErrorMessage>
                                    </FormControl>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button colorScheme={"success"} onPress={handleValidateOption}>Next</Button>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>

                        <Button mt={5} mb={5} borderWidth={1} borderBottomWidth={2} borderColor={"#f1c40f"}
                                onPress={() => setShowSelectServiceModal(true)}>Ask for appointment</Button>

                        <HStack marginBottom={1}>
                            <VStack>
                                <HStack mb={2}>
                                    <Icon as={<Feather name="phone"/>} size={25} name="phone" color="black"/>
                                    <Link _text={{fontSize: "sm", fontWeight: "bold", textDecoration: "none",}}
                                          _light={{_text: {color: "primary.900",},}}
                                          _dark={{_text: {color: "primary.500",},}}
                                          onPress={doCall}> {salon?.phoneNumber}
                                    </Link>
                                </HStack>
                                <HStack>
                                    <Icon as={<Entypo name="location"/>} size={25} name="location" color="black"/>
                                    <Text style={styles.salonProfileItemText}>{salon.location}</Text>
                                </HStack>
                                <HStack>
                                    <TouchableRipple onPress={onShare}>
                                        <View flexDirection={"row"} marginTop={3}>
                                            <Icon as={<MaterialCommunityIcons name="share-outline"/>} color={"black"} size={28}/>
                                            <Text style={styles.salonProfileItemText}>Share details</Text>
                                        </View>
                                    </TouchableRipple>
                                </HStack>
                            </VStack>
                        </HStack>

                        <CalendarPicker salonId={id} selectedService={selectedService}
                                        setSelectedService={setSelectedService}
                                        setShow={setShowCalendar} show={showCalendarPicker} navigation={navigation}/>

                        <Heading mt={3} italic bold marginBottom={2} mb={2}>Reviews</Heading>
                        {salon.reviews.length > 0 ?
                            <View>
                                {salon.reviews.map((item) => <Box key={item.id} borderBottomWidth="1" marginBottom={2}
                                                                  _dark={{borderColor: "muted.50"}}
                                                                  borderColor="muted.800" pl={["0", "4"]}
                                                                  pr={["0", "5"]} py="2">
                                    <HStack space={[2, 3]} justifyContent="space-between">
                                        <Avatar alignSelf={"center"} size="48px"
                                                source={{uri: item.client.profilePicture}}/>
                                        <VStack alignItems={"flex-start"}>
                                            {/*@ts-ignore*/}
                                            <Text mb={1}> {item.client.firstName} {item.client.lastName} </Text>
                                            <Rating type="custom" startingValue={item.stars} imageSize={15} readonly/>
                                            <Text style={{fontSize: 12}}>{item.message}</Text>
                                        </VStack>
                                        <Spacer/>
                                    </HStack>
                                </Box>)}
                            </View> : <Text style={{alignSelf: "center"}}>Salon does not have reviews yet..</Text>}
                        <AddReviewModal salonId={salon.id} retrieveSalon={retrieveSalon}/>

                        <View style={styles.container}>
                            {RenderBubble()}
                            <TouchableOpacity
                                style={styles.clapButton}
                                activeOpacity={0.8}
                                onPress={clapHand}
                            >
                                {clapIcon}
                            </TouchableOpacity>
                        </View>

                    </Box>
                </Center>
                </>
            }
        </ScrollView>
    )
}