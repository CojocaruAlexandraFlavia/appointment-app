import {
    Box,
    Button,
    Center,
    Checkbox,
    Divider,
    FormControl,
    Heading,
    HStack,
    Icon,
    Input,
    Link,
    Pressable,
    Text,
    VStack,
    WarningOutlineIcon
} from "native-base"
import {View, Image, StyleSheet, ImageBackground, SafeAreaView} from 'react-native';
import React, {ReactElement, useState} from "react"
import {MaterialIcons} from "@expo/vector-icons";
import IconGoogle from "../../components/IconGoogle";
import IconFacebook from "../../components/IconFacebook";
import {LoginScreenNavigationProps} from "../../navigation/navigator.types";
import {
    FacebookAuthProvider,
    getAuth,
    getRedirectResult,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect
} from "firebase/auth";
import app, {auth, firestore} from "../../utils/firebase";
import {LoginData} from "../../utils/types";
import {collection, getDocs, query, where} from "firebase/firestore";
import {useUserDataContext} from "../../store/user-data.context";
import {userConverter} from "../Profile/user.class";

import {FirebaseError} from "@firebase/util";
import {AlertComponent} from "../../components/alert.component";

const emptyData: LoginData = {
    email: "",
    password: ""
}

const Login: React.FC<LoginScreenNavigationProps> = ({navigation}: LoginScreenNavigationProps): ReactElement => {

    const [showPassword, setShowPassword] = useState(false)
    const [credentials, setCredentials] = useState<LoginData>(emptyData)
    const [errors, setErrors] = useState<LoginData>(emptyData)
    const [firebaseLoginError, setFirebaseLoginError] = useState("")

    const {setUser} = useUserDataContext()

    const findFormErrors = () : LoginData => {
        const errors = {...emptyData}
        if(credentials.email === "") errors.email = "Required field"
        if(credentials.password === "") errors.password = "Required field"

        return errors
    }

    const retrieveUserByFieldFromFirestore = async (field: string, value: string) => {
        const collectionRef = collection(firestore, "users");
        const firestoreUserQuery = query(collectionRef, where(field, "==", value)).withConverter(userConverter);
        const firestoreUserSnapshot = await getDocs(firestoreUserQuery)
        const userDocumentSnapshot = firestoreUserSnapshot.docs[0]
        return {...userDocumentSnapshot.data(), id: userDocumentSnapshot.id}
    }
    
    const signInUsingEmailAndPassword = async () => {
        const formErrors : LoginData = findFormErrors()
        if (Object.values(formErrors).some(item => item !== "")) {
            setFirebaseLoginError("")
            setErrors(formErrors)
        } else {
            try {
                await signInWithEmailAndPassword(
                    auth,
                    credentials.email,
                    credentials.password
                )

                const user = await retrieveUserByFieldFromFirestore("email", credentials.email)
                setUser(user)

                setFirebaseLoginError("")
                setCredentials({ email: "", password: ""})
                if (user.role === "CLIENT") {
                    navigation.navigate('Drawer')
                } else {
                    navigation.navigate("Tabs")
                }
            } catch (e) {
                console.log(e)
                const errorCode = (e as { code: string }).code
                let errorMessage = errorCode.split('/')[1].replaceAll('-', ' ')
                errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
                setFirebaseLoginError(errorMessage)
            }
        }
    }

    // not working yet
    const signInUsingFacebook = async () => {
        try {
            const provider = new FacebookAuthProvider();
            const auth = getAuth();
            // await signInWithRedirect(auth, provider)
            const result = await signInWithPopup(auth, provider)
            console.log("after redirect")
            //const result = await getRedirectResult(auth);
            console.log(result)
            if (result) {
                // This is the signed-in user
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user
                console.log(user)
                // let firestoreUser
                // if (user.email) {
                //     firestoreUser = await retrieveUserByFieldFromFirestore("email",user.email)
                // } else if (user.phoneNumber) {
                //     firestoreUser = await retrieveUserByFieldFromFirestore("phoneNumber", user.phoneNumber)
                // }

                // setUser(firestoreUser)
            }
        } catch (error) {
            console.log(error)
            if (error instanceof FirebaseError) {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData?.email;
                const credential = FacebookAuthProvider.credentialFromError(error);
                setFirebaseLoginError(`Facebook login error: ${errorMessage}, for user ${email}`)
            } else {
                setFirebaseLoginError("Facebook login error, please try again")
            }
        }
    }

    // not working yet
    const signInUsingGoogle = () => {
        const provider = new GoogleAuthProvider()
        console.log(auth)
        try {
            signInWithPopup(auth, provider)
                .then((result) => {
                    console.log("then")
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    console.log(user, token)
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                })
        } catch(error) {
            console.log(error)
            // ...
        }
    }

    const onChangeText = (key: string, value: string) => {
        if (errors[key as keyof LoginData] !== "") {
            setErrors({...errors, [key]: ""})
        }
        setCredentials({...credentials, [key]: value})
    }

    const styles = StyleSheet.create({
        container: {
            paddingTop: 10,
        },
        logo: {
            width: 125,
            height: 140,
            alignSelf: 'center',
            borderRadius: 200/2
        },
        backgroundImage: {
            flex: 1,
            width: 400,
            // height: null,
            resizeMode: 'cover', // or 'stretch'
            justifyContent: 'center',
            alignItems: 'center',
        }
    });

    return (
        <Center w="100%">
            <SafeAreaView >
                <ImageBackground  style={styles.backgroundImage} source={require('../../../assets/background-semi.png')} >
                    <View style={styles.container} >

                        <Box safeArea p="2" py="8" w="90%" maxW="290">

                            <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{color: "warmGray.50"}}>Welcome</Heading>
                            <Heading mt="1" _dark={{color: "warmGray.200"}} color="coolGray.600" fontWeight="medium" size="xs">
                                Sign in to continue!
                            </Heading>

                            <VStack space={1} mt="1">
                            <View style={styles.container}>
                                <Image style={styles.logo} source={require('../../../assets/logo.png')} />
                            </View>

                                <FormControl isInvalid={errors.email !== ""}>
                                    <FormControl.Label _text={{bold: true, color:"black"}}>Email</FormControl.Label>
                                    <Input w={{base: "100%", md: "25%"}} size={5}
                                           // color="muted.400"
                                           InputLeftElement={ <Icon as={<MaterialIcons name="person" />} ml={2}/>}
                                           value={credentials.email}  isInvalid={errors.email !== ""}
                                           backgroundColor={"white"}
                                           onChangeText={text => onChangeText("email", text)}/>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.email}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.password !== ""}>
                                    <FormControl.Label _text={{bold: true, color:"black"}}>Password</FormControl.Label>
                                    <Input w={{ base: "100%", md: "25%"}} size={5}
                                           value={credentials.password} isInvalid={errors.password !== ""}
                                           backgroundColor={"white"}
                                           onChangeText={text => onChangeText("password", text)} type={showPassword ? "text" : "password"}
                                           InputLeftElement={
                                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                                        <Icon as={
                                            <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="1" ml={2} color="muted.400" />
                                        </Pressable>} />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>
                                    {/*<Link _text={{fontSize: "xs", fontWeight: "500", color: "indigo.500"}} alignSelf="flex-end" mt="1">*/}
                                    {/*    Forget Password?*/}
                                    {/*</Link>*/}
                                </FormControl>

                                <Checkbox alignItems="flex-start" mt="5" isChecked value="demo" colorScheme="primary" accessibilityLabel="Remember me">
                                    <Text style={{fontStyle: 'italic'}} pl="3" fontWeight="normal" _light={{ color: "coolGray.800" }} _dark={{ color: "coolGray.400" }}>
                                        Remember me and keep me logged in
                                    </Text>
                                </Checkbox>
                                <Button mt="4" colorScheme="indigo" onPress={signInUsingEmailAndPassword}>Sign in</Button>
                                {
                                    firebaseLoginError && <AlertComponent status={"error"} text={firebaseLoginError} onClose={() => setFirebaseLoginError("")}/>
                                }
                            </VStack>
                        </Box>

                        <HStack space="2" mb={{ base: "1", md: "3" }} alignItems="center" justifyContent="center">
                            <Divider w="30%" _light={{ bg: "black" }} _dark={{ bg: "black" }}></Divider>
                            <Text fontSize="sm" fontWeight="medium" _light={{ color: "black" }} _dark={{ color: "black" }}>
                                or
                            </Text>
                            <Divider w="30%" _light={{ bg: "black" }} _dark={{ bg: "black" }}></Divider>
                        </HStack>

                        {/*<HStack space="4" alignItems="center" justifyContent="center">*/}
                        {/*    <Pressable onPress={signInUsingFacebook}>*/}
                        {/*        <IconFacebook />*/}
                        {/*    </Pressable>*/}
                        {/*    <Pressable onPress={signInUsingGoogle}>*/}
                        {/*        <IconGoogle />*/}
                        {/*    </Pressable>*/}
                        {/*</HStack>*/}

                        <VStack space={1} mt="1">
                                <HStack mt="6" justifyContent="center">
                                    <Text fontSize="sm" color="black" _dark={{color: "warmGray.200"}}>
                                        I'm a new user.{" "}
                                    </Text>
                                    <Link _text={{fontSize: "sm", fontWeight: "bold", textDecoration: "none",}} _light={{_text: {color: "primary.900",},}}
                                          _dark={{_text: {color: "primary.500",},}}
                                          onPress={() => navigation.navigate('Register')}>
                                        Register
                                    </Link>
                                </HStack>
                        </VStack>

                    </View>
                </ImageBackground>
            </SafeAreaView>
        </Center>
    )
}

export default Login