import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {Avatar, Title, Caption, Text, TouchableRipple,} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';
import Login from './Login';
import EditProfile from './EditProfile';
// import files from '../../assets/filesBase64';
// import logo from '../../assets/logo'

const Profile = () => {

    // const myCustomShare = async() => {
    //     const shareOptions = {
    //         message: 'Appointment your next visit to a salon easy and quick! I\'ve already made more than 10 appointments on it.',
    //         url: files.appLogo,
    //     }
    //
    //     try {
    //         const ShareResponse = await Share.open(shareOptions);
    //         console.log(JSON.stringify(ShareResponse));
    //     } catch(error) {
    //         console.log('Error => ', error);
    //     }
    // };

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.userInfoSection}>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                    <Avatar.Image
                        source={{ uri: 'https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg', }}
                        size={80}
                    />
                    <View style={{marginLeft: 20}}>
                        <Title style={[styles.title, { marginTop:15, marginBottom: 5, }]} >
                            Jo Doe
                        </Title>
                        <Caption style={styles.caption}>@j_doe</Caption>
                    </View>
                </View>
            </View>

            <View style={styles.userInfoSection}>
                <View style={styles.row}>
                    <Icon name="map-marker-radius" color="#777777" size={20}/>
                    <Text style={{color:"#777777", marginLeft: 20}}>Bucharest, Romania</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="phone" color="#777777" size={20}/>
                    <Text style={{color:"#777777", marginLeft: 20}}>0123456789</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="email" color="#777777" size={20}/>
                    <Text style={{color:"#777777", marginLeft: 20}}>jo_doe@email.com</Text>
                </View>
            </View>

            <View style={styles.infoBoxWrapper}>
                <View style={[styles.infoBox, {
                    borderRightColor: '#dddddd',
                    borderRightWidth: 1
                }]}>
                    <Title>12</Title>
                    <Caption>Appointments</Caption>
                </View>
                <View style={styles.infoBox}>
                    <Title>6</Title>
                    <Caption>Reviews</Caption>
                </View>
            </View>

            <View style={styles.menuWrapper}>
                <TouchableRipple onPress={() => {}}>
                    <View style={styles.menuItem}>
                        <Icon name="heart-outline" color="#FF6347" size={25}/>
                        <Text style={styles.menuItemText}>Your Favorites</Text>
                    </View>
                </TouchableRipple>

                {/*<TouchableRipple onPress={myCustomShare}>*/}
                {/*    <View style={styles.menuItem}>*/}
                {/*        <Icon name="share-outline" color="#FF6347" size={25}/>*/}
                {/*        <Text style={styles.menuItemText}>Tell Your Friends</Text>*/}
                {/*    </View>*/}
                {/*</TouchableRipple>*/}

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