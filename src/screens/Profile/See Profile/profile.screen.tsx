import React, {useCallback, useEffect, useState} from 'react';
import {View, SafeAreaView, StyleSheet, Alert, Share, ListRenderItemInfo} from 'react-native';
import {Title, Caption, Text, TouchableRipple, Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUserDataContext} from "../../../store/UserData.context";
import {Appointment, Salon} from "../../../utils/types";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {firestore} from "../../../utils/firebase";
import {appointmentConverter} from "../../Appointments/appointment.class";
import {salonConverter} from "../../Salon/salon.class";
import {userConverter} from "../user.class";
import {Box, FlatList, Heading, HStack, Pressable, VStack} from 'native-base';
import {Rating} from "react-native-ratings";

type RecordType = Record<string, number>

const Profile = ({navigation}: any) => {

    const { user } = useUserDataContext()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [nrOfReviews, setNrOfReviews] = useState(-1)
    const [showFavorites, setShowFavorites] = useState(false)
    const [favoriteSalons, setFavoriteSalons] = useState<Salon[] | null>(null)
    const [favoritesOccurrencesMapping, setFavoritesOccurrencesMapping] = useState<RecordType>({})

    const retrieveUserAppointments = async () => {
        let appointmentList: Appointment[] = []
        const collectionRef = collection(firestore, "appointments")
        const appointmentsQuery = query(collectionRef, where("clientId", "==", user.id))
            .withConverter(appointmentConverter)
        const appointmentsSnapshot = await getDocs(appointmentsQuery)
        appointmentsSnapshot.forEach(documentSnapshot => {
            appointmentList.push({...documentSnapshot.data(), id: documentSnapshot.id})
        })
        setAppointments(appointmentList)

        const salonIds = appointmentList.map(app => app.salonId)

        console.log('SalonIds: ', salonIds)

        let occurrencesMapping: Record<string, number> = {}
        salonIds.forEach(salonId => {
            if (occurrencesMapping.hasOwnProperty(salonId)) {
                occurrencesMapping[salonId] = occurrencesMapping[salonId] + 1
            } else {
                occurrencesMapping[salonId] = 1
            }
        })

        console.log('occurrences: ', occurrencesMapping)

        const maxOccurrence = Math.max(...Object.values(occurrencesMapping))
        const salonIdsWithMaxOccurrence = Object.keys(occurrencesMapping)
            .filter(salonId => occurrencesMapping[salonId] === maxOccurrence)

        let favoritesOccurrences: RecordType = {}
        salonIdsWithMaxOccurrence.forEach(salonId => favoritesOccurrences[salonId] = occurrencesMapping[salonId])
        setFavoritesOccurrencesMapping(favoritesOccurrences)

        const salonList: Salon[] = []
        const favoriteSalonIds = Object.keys(favoritesOccurrences)

        for (const salonId of favoriteSalonIds) {
            const docRef = doc(firestore, "salons", salonId).withConverter(salonConverter);
            const salonDoc = await getDoc(docRef)
            if (salonDoc.exists()) {
                const firebaseSalonData = salonDoc.data()
                console.log(firebaseSalonData)
                salonList.push({...firebaseSalonData, id: salonDoc.id, images: [firebaseSalonData?.image], reviews: []})
            }
        }
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

    useEffect(() => {
        if (nrOfReviews === -1) {
            retrieveUserReviews()
        }
        if (favoriteSalons === null) {
            retrieveUserAppointments()
        }

    }, [])

    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'Appointment your next visit to a salon easy and quick! I\'ve already made more than 10 appointments on it.',
            }, {
                dialogTitle:"Android Title"
            });
            if (result.action === Share.sharedAction) {
                console.log("action=== sharedAction")
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    console.log("result activity type")
                } else {
                    // shared
                    console.log("else ")
                }
            } else if (result.action === Share.dismissedAction) {
                console.log("action === dismissed")
                // dismissed
            }
        } catch (error: any) {
            console.log(error)
            Alert.alert(error.message);
        }
    };

    const renderSalonItem = useCallback(({item}: ListRenderItemInfo<Salon>) => <Pressable
        onPress={() => navigation.navigate('Salon', {id: item.id})}>
        <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "4"]}
             pr={["0", "5"]} py="2">
            <HStack space={"lg"}>
                <Avatar.Image size={60} source={{uri: item.images[0]}} style={{marginRight: 6}}/>
                <Heading alignSelf="center" fontSize={20}>{item.name}</Heading>
                <Heading alignSelf="flex-end" fontSize={15}>Appointments: {favoritesOccurrencesMapping[item.id]}</Heading>
            </HStack>
        </Box>
    </Pressable>, [])

    return (
        <SafeAreaView style={styles.container}>

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
                    <Title>{appointments? appointments.length: 0}</Title>
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
                    showFavorites? <View style={styles.menuItem}>
                        <FlatList data={favoriteSalons} renderItem={renderSalonItem} keyExtractor={item => item.id.toString()}/>
                    </View>: null
                }
                <TouchableRipple onPress={onShare}>
                    <View style={styles.menuItem}>
                        <Icon name="share-outline" color="#FF6347" size={25}/>
                        <Text style={styles.menuItemText}>Tell Your Friends</Text>
                    </View>
                </TouchableRipple>

            </View>
        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 25,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoBoxWrapper: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 100,
    },
    infoBox: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuWrapper: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    menuItemText: {
        color: '#777777',
        marginLeft: 20,
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 26,
    },
});