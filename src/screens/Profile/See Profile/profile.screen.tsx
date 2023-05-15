import React, {useCallback, useEffect, useState} from 'react';
import {View, SafeAreaView, ListRenderItemInfo} from 'react-native';
import {Title, Caption, Text, TouchableRipple, Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUserDataContext} from "../../../store/user-data.context";
import {Appointment, Salon} from "../../../utils/types";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {firestore} from "../../../utils/firebase";
import {appointmentConverter} from "../../Appointments/appointment.class";
import {salonConverter} from "../../Salon/salon.class";
import {userConverter} from "../user.class";
import {Box, FlatList, Heading, HStack, Pressable} from 'native-base';
import profileStyles from "./profile.styles";
import {Loading} from "../../../components/activity-indicator.component";

type RecordType = Record<string, number>

const Profile = ({navigation}: any) => {

    const { user } = useUserDataContext()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [nrOfReviews, setNrOfReviews] = useState(-1)
    const [showFavorites, setShowFavorites] = useState(false)
    const [favoriteSalons, setFavoriteSalons] = useState<Salon[] | null>(null)
    const [favoritesOccurrencesMapping, setFavoritesOccurrencesMapping] = useState<RecordType>({})

    const retrieveUserAppointments = useCallback(async () => {
        let appointmentList: Appointment[] = []
        const collectionRef = collection(firestore, "appointments")
        const appointmentsQuery = query(collectionRef, where("clientId", "==", user.id))
            .withConverter(appointmentConverter)
        const appointmentsSnapshot = await getDocs(appointmentsQuery)
        appointmentsSnapshot.forEach(documentSnapshot => {
            console.log("appointment")
            console.log(documentSnapshot.data())

            appointmentList.push({...documentSnapshot.data(), id: documentSnapshot.id})
        })

        return appointmentList
    }, [user.id])

    const buildFavoriteSalonOccurrencesMapping = (salonIds: string[]) => {
        let occurrencesMapping: RecordType = {}
        salonIds.forEach(salonId => {
            if (occurrencesMapping.hasOwnProperty(salonId)) {
                occurrencesMapping[salonId] = occurrencesMapping[salonId] + 1
            } else {
                occurrencesMapping[salonId] = 1
            }
        })

        const maxOccurrence = Math.max(...Object.values(occurrencesMapping))
        const salonIdsWithMaxOccurrence = Object.keys(occurrencesMapping)
            .filter(salonId => occurrencesMapping[salonId] === maxOccurrence)

        let favoritesOccurrences: RecordType = {}
        for (const salonId of salonIdsWithMaxOccurrence) {
            favoritesOccurrences[salonId] = occurrencesMapping[salonId]
        }

        return favoritesOccurrences
    }

    const buildFavoriteSalonList = async (favoritesOccurrences: RecordType) => {
        const salonList: Salon[] = []
        const favoriteSalonIds = Object.keys(favoritesOccurrences)

        for (const salonId of favoriteSalonIds) {
            const docRef = doc(firestore, "salons", salonId).withConverter(salonConverter);
            const salonDoc = await getDoc(docRef)
            if (salonDoc.exists()) {
                const firebaseSalonData = salonDoc.data()
                salonList.push({...firebaseSalonData, id: salonDoc.id, images: [firebaseSalonData?.image], reviews: []})
            }
        }
        return salonList
    }

    const retrieveUserAppointmentsAndFavoriteSalons = async () => {
        let appointmentList = await retrieveUserAppointments()
        console.log("profile appointments: " + appointmentList.length)
        setAppointments(appointmentList)

        const salonIds = appointmentList.map(app => app.salonId)

        let favoritesOccurrences = buildFavoriteSalonOccurrencesMapping(salonIds)
        setFavoritesOccurrencesMapping(favoritesOccurrences)

        const salonList = await buildFavoriteSalonList(favoritesOccurrences)
        setFavoriteSalons(salonList)
    }

    const retrieveUserReviews = async () => {
        const collectionRef = collection(firestore, "salons").withConverter(salonConverter)
        const salonsSnapshot = await getDocs(collectionRef)

        let userReviewsNumber = 0
        salonsSnapshot.forEach(documentSnapshot => {
            const salon = documentSnapshot.data()
            let filteredReviews = salon.reviews.filter(async review => {
                const client = await getDoc(doc(firestore, review.client.path).withConverter(userConverter))
                return client.id === user.id
            });
            userReviewsNumber += filteredReviews.length
        })
        setNrOfReviews(userReviewsNumber)
    }

    const retrieveData = () => {
        retrieveUserAppointmentsAndFavoriteSalons()
        retrieveUserReviews()
    }

    useEffect(() => {
        // if (favoriteSalons === null) {
            //retrieveUserAppointmentsAndFavoriteSalons()
        //}
        //if (nrOfReviews === -1) {
            //()
        //}
        retrieveData()
    }, [])

    const renderSalonItem = useCallback(({item}: ListRenderItemInfo<Salon>) => <Pressable
        onPress={() => navigation.navigate('Salon', {id: item.id})}>
        <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "4"]}
             pr={["0", "5"]} py="2">
            <HStack space={"lg"}>
                <Avatar.Image size={60} source={{uri: item.images[0]}} style={{marginRight: 6}}/>
                <Heading alignSelf="center" fontSize={20}>{item.name}</Heading>
                {
                    favoritesOccurrencesMapping[item.id] && <Heading alignSelf="flex-end" fontSize={15}>Appointments: {favoritesOccurrencesMapping[item.id]}</Heading>
                }
            </HStack>
        </Box>
    </Pressable>, [favoritesOccurrencesMapping])

    const styles = profileStyles()

    return (
        <SafeAreaView style={styles.container}>

            {
                nrOfReviews == -1? <Loading/> : <View>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection: 'row', marginTop: 15}}>
                            <Avatar.Image
                                source={ !user.profilePicture? { uri: 'https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg'}:
                                    { uri: user.profilePicture} }
                                size={80}
                            />
                            <View style={{marginLeft: 20}}>
                                <Title style={[styles.title, { marginTop:15, marginBottom: 5, }]} >
                                    {user.firstName} {user.lastName}
                                </Title>
                                <Caption style={styles.caption}>@{user.username}</Caption>
                            </View>
                        </View>
                    </View>

                    <View style={styles.userInfoSection}>
                        <View style={styles.row}>
                            <Icon name="map-marker-radius" color="#777777" size={20}/>
                            <Text style={{color:"#777777", marginLeft: 20}}>{user.city}</Text>
                        </View>
                        <View style={styles.row}>
                            <Icon name="phone" color="#777777" size={20}/>
                            <Text style={{color:"#777777", marginLeft: 20}}>{user.phoneNumber}</Text>
                        </View>
                        <View style={styles.row}>
                            <Icon name="email" color="#777777" size={20}/>
                            <Text style={{color:"#777777", marginLeft: 20}}>{user.email}</Text>
                        </View>
                    </View>

                    <View style={styles.infoBoxWrapper}>
                        <View style={[styles.infoBox, {
                            borderRightColor: '#dddddd',
                            borderRightWidth: 1
                        }]}>
                            <Title>{appointments.length}</Title>
                            <Caption>Appointments</Caption>
                        </View>
                        <View style={styles.infoBox}>
                            <Title>{nrOfReviews === -1? 0 : nrOfReviews}</Title>
                            <Caption>Reviews</Caption>
                        </View>
                    </View>

                    <View style={styles.menuWrapper}>
                        <TouchableRipple onPress={() => setShowFavorites(!showFavorites)}>
                            <View style={styles.menuItem}>
                                <Icon name="heart-outline" color="#FF6347" size={25}/>
                                <Text style={styles.menuItemText}>Your Favorites</Text>
                            </View>
                        </TouchableRipple>
                        {
                            Object.keys(favoritesOccurrencesMapping).length > 0 && showFavorites? <View style={styles.menuItem}>
                                <FlatList data={favoriteSalons} renderItem={renderSalonItem} keyExtractor={item => item.id.toString()}/>
                            </View>: null
                        }
                    </View>
                </View>
            }


        </SafeAreaView>
    );
};

export default Profile;