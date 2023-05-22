import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ImageBackground, TextInput, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Animated from 'react-native-reanimated';
import {useUserDataContext} from "../../../store/user-data.context";
import {userConverter} from "../user.class";
import {User} from "../../../utils/types";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {firestore, storage} from "../../../utils/firebase";
import editProfileStyles from "./edit-profile.styles";
import * as ImagePicker from "expo-image-picker";
import {getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const emptyState: User = {
    city: "",
    email: "",
    firstName: "",
    id: "",
    lastName: "",
    phoneNumber: "",
    profilePicture: "",
    role: "",
    username: ""
}

const EditProfile = () => {

    const bs = React.createRef();
    const fall = new Animated.Value(1);

    const {user, setUser} = useUserDataContext()

    const [editedUser, setEditedUser] = useState<User>({...user})
    const [errors, setErrors] = useState<User>(emptyState)
    const [newPicture, setNewPicture] = useState("")

    const findFormErrors = () : User => {
        const errors = {...emptyState}
        if(editedUser.email === "") errors.email = "Required field"

        if(editedUser.firstName === "") errors.firstName = "Required field"
        else if(editedUser.firstName.length < 3) errors.firstName = "First Name is too short"

        if(editedUser.lastName === "") errors.lastName = "Required field"
        else if(editedUser.lastName.length < 3) errors.lastName = "Last Name is too short"

        if(editedUser.city === "") errors.city = "Required field"
        else if(editedUser.city.length < 2) errors.city = "Enter a valid city"

        return errors
    }

    const uploadImageAsync = async(uri: string) => {
        const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
        const fileRef = ref(storage, `users/${user.id}.jpg`);
        await uploadBytes(fileRef, blob);

        return await getDownloadURL(fileRef);
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            const newImageUri = result.assets[0].uri
            setNewPicture(newImageUri)
        }
    };

    const submitEdit = async() => {
        const formErrors = findFormErrors()
        if (Object.values(formErrors).some(item => item !== "")) {
            setErrors(formErrors)
        } else {
            setErrors(emptyState)
            const userRef = doc(firestore, "users", user.id).withConverter(userConverter)
            if (newPicture !== "") {
                const pictureDownloadUrl = await uploadImageAsync(newPicture)
                updateDoc(userRef, {
                    ...editedUser,
                    profilePicture: pictureDownloadUrl
                }).then(async() => {
                    const firestoreUpdatedUser = await getDoc(userRef)
                    setUser({...firestoreUpdatedUser.data(), id: firestoreUpdatedUser.id})
                })
            } else {
                updateDoc(userRef, {
                    ...editedUser
                }).then(async() => {
                    const firestoreUpdatedUser = await getDoc(userRef)
                    setUser({...firestoreUpdatedUser.data(), id: firestoreUpdatedUser.id})
                })
            }

        }
    }

    const styles = editProfileStyles()

    const onChangeTextUserDetails = (text: string, key: string) => {
        if (errors[key as keyof User] !== "") {
            setErrors({...errors, [key]: ""})
        }
        setEditedUser({...editedUser, [key]: text})
    }


    let renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle}/>
            </View>
        </View>
    );

    // let renderInner = () => (
    //     <View style={styles.panel}>
    //         <View style={{alignItems: 'center'}}>
    //             <Text style={styles.panelTitle}>Upload Photo</Text>
    //             <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
    //         </View>
    //         <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
    //             <Text style={styles.panelButtonTitle}>Take Photo</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
    //             <Text style={styles.panelButtonTitle}>Choose From Library</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity
    //             style={styles.panelButton} // @ts-ignore
    //             onPress={() => bs.current.snapTo(1)}>
    //             <Text style={styles.panelButtonTitle}>Cancel</Text>
    //         </TouchableOpacity>
    //     </View>
    // );

    return (

            <View style={styles.container}>

                <ImageBackground  style={styles.backgroundImage} source={require('../../../../assets/background-semi.png')} >

                <Animated.View
                style={{ margin: 20, opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)), }}>

                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity  // @ts-ignore
                            onPress={() => bs.current.snapTo(0)}>
                            <View
                                style={styles.profileImageContainer}>
                                <ImageBackground
                                    source={{
                                        uri: newPicture? newPicture: editedUser.profilePicture? editedUser.profilePicture:
                                                'https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg',
                                    }}
                                    style={{height: 100, width: 100}}
                                    imageStyle={{borderRadius: 15}}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <TouchableOpacity onPress={pickImage}>
                                            <Icon
                                                name="camera"
                                                size={35}
                                                color="#fff"
                                                style={{
                                                    opacity: 0.7,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderWidth: 1,
                                                    borderColor: '#fff',
                                                    borderRadius: 10,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </ImageBackground>
                            </View>
                        </TouchableOpacity>

                        <Text style={{marginTop: 20, marginBottom:20, fontSize: 18, fontWeight: 'bold'}}> {user.firstName} {user.lastName} </Text>
                    </View>

                    <View style={styles.action}>
                        <FontAwesome name="user-o" color="#000" size={20} />
                        <TextInput
                            value={editedUser.firstName}
                            onChangeText={(text) => onChangeTextUserDetails(text, "firstName")}
                            placeholder="First Name"
                            placeholderTextColor="#666666"
                            autoCorrect={false}
                            style={[ styles.textInput, { color: "#000" } ]}
                        />
                    </View>

                    <View style={styles.action}>
                        <FontAwesome name="user-o" color="#000" size={20} />
                        <TextInput
                            value={editedUser.lastName}
                            onChangeText={(text) => onChangeTextUserDetails(text, "lastName")}
                            placeholder="Last Name"
                            placeholderTextColor="#666666"
                            autoCorrect={false}
                            style={[ styles.textInput, { color: "#000" },]}
                        />
                    </View>

                    <View style={styles.action}>
                        <FontAwesome name="envelope-o" color="#000" size={20} />
                        <TextInput
                            value={editedUser.email}
                            onChangeText={(text) => onChangeTextUserDetails(text, "email")}
                            placeholder="Email"
                            placeholderTextColor="#666666"
                            keyboardType="email-address"
                            autoCorrect={false}
                            style={[ styles.textInput, { color: "#000" } ]}
                        />
                    </View>

                    <View style={styles.action}>
                        <Feather name="phone" color="#000" size={20} />
                        <TextInput
                            value={editedUser.phoneNumber}
                            onChangeText={text => onChangeTextUserDetails(text, "phoneNumber")}
                            placeholder="Phone"
                            placeholderTextColor="#666666"
                            keyboardType="number-pad"
                            autoCorrect={false}
                            style={[ styles.textInput, { color: "#000"} ]}
                        />
                    </View>

                    <View style={styles.action}>
                        <Icon name="map-marker-outline" color="#000" size={24} />
                        <TextInput
                            value={editedUser.city}
                            onChangeText={text => onChangeTextUserDetails(text, "city")}
                            placeholder="City"
                            placeholderTextColor="#666666"
                            autoCorrect={false}
                            style={[ styles.textInput, { color: "#000" }]}
                        />
                    </View>

                    <TouchableOpacity style={styles.commandButton} onPress={submitEdit}>
                        <Text style={styles.panelButtonTitle}>Submit</Text>
                    </TouchableOpacity>
                </Animated.View>

                </ImageBackground>

            </View>
    );
};

export default EditProfile;