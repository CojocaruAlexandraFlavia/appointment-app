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
                navigation.navigate('Drawer')
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

    return (   
        <Center w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
                <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{color: "warmGray.50"}}>Welcome</Heading>
                <Heading mt="1" _dark={{color: "warmGray.200"}} color="coolGray.600" fontWeight="medium" size="xs">
                    Sign in to continue!
                </Heading>

                <VStack space={3} mt="5">
                    <FormControl isInvalid={errors.email !== ""}>
                        <FormControl.Label>Email</FormControl.Label>
                        <Input w={{base: "100%", md: "25%"}} size={5} color="muted.400"
                               InputLeftElement={ <Icon as={<MaterialIcons name="person" />} ml={2}/>}
                               value={credentials.email}  isInvalid={errors.email !== ""}
                               onChangeText={text => onChangeText("email", text)}/>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.email}</FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.password !== ""}>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input w={{ base: "100%", md: "25%"}} value={credentials.password} isInvalid={errors.password !== ""} 
                            onChangeText={text => onChangeText("password", text)} type={showPassword ? "text" : "password"} InputLeftElement={
                            <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Icon as={
                                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="1" ml={2} color="muted.400" />
                            </Pressable>} />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>
                        <Link _text={{fontSize: "xs", fontWeight: "500", color: "indigo.500"}} alignSelf="flex-end" mt="1">
                            Forget Password?
                        </Link>
                    </FormControl>

                    <Checkbox alignItems="flex-start" mt="5" isChecked value="demo" colorScheme="primary" accessibilityLabel="Remember me">
                        <Text pl="3" fontWeight="normal" _light={{ color: "coolGray.800" }} _dark={{ color: "coolGray.400" }}>
                            Remember me and keep me logged in
                        </Text>
                    </Checkbox>
                    <Button mt="2" colorScheme="indigo" onPress={signInUsingEmailAndPassword}>Sign in</Button>
                    {firebaseLoginError && <Text mt={4} alignSelf='center' fontSize='xl' color='red.500'>Error: {firebaseLoginError}</Text>}
                </VStack>
            </Box>

            <HStack space="2" mb={{ base: "6", md: "7" }} alignItems="center" justifyContent="center">
                <Divider w="30%" _light={{ bg: "coolGray.200" }} _dark={{ bg: "coolGray.700" }}></Divider>
                <Text fontSize="sm" fontWeight="medium" _light={{ color: "coolGray.300" }} _dark={{ color: "coolGray.500" }}>
                    or
                </Text>
                <Divider w="30%" _light={{ bg: "coolGray.200" }} _dark={{ bg: "coolGray.700" }}></Divider>
            </HStack>

            <HStack space="4" alignItems="center" justifyContent="center">
                <Pressable onPress={signInUsingFacebook}>
                    <IconFacebook />
                </Pressable>
                <Pressable onPress={signInUsingGoogle}>
                    <IconGoogle />
                </Pressable>
            </HStack>

            <VStack space={5} mt="5">
                    <HStack mt="6" justifyContent="center">
                        <Text fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200"}}>
                            I'm a new user.{" "}
                        </Text>
                        <Link _text={{fontSize: "sm", fontWeight: "bold", textDecoration: "none",}} _light={{_text: {color: "primary.900",},}}
                              _dark={{_text: {color: "primary.500",},}}
                              onPress={() => navigation.navigate('Register')}>
                            Register
                        </Link>
                    </HStack>
            </VStack>

        </Center>
    )
}

export default Login