import { ParamListBase } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Center, HStack, Link, VStack, Box, Button, Heading, Input, FormControl, Text, WarningOutlineIcon  } from "native-base"
import { ReactElement, useState } from "react"
import { useUserDataContext } from "../store/UserData.context"

type LoginData = {
    email: string, 
    password: string
}

//type Props = NativeStackScreenProps<ParamListBase, 'Login'>;

const Login = ({navigation}: any): ReactElement => {

    const [credentials, setCredentials] = useState<LoginData>({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState<LoginData>({
        email: "",
        password: ""
    })

    const {setUser} = useUserDataContext()

    const findFormErrors = () : LoginData => {
        const errors : LoginData = {
            email: "",
            password: ""
        }
        if(credentials.email === "") errors.email = "Required field"
        if(credentials.password === "") errors.password = "Required field"

        return errors
    }
    
    const auth = () => {
        const formErrors : LoginData = findFormErrors()
        if (!Object.values(formErrors).includes("")) {
            setErrors(formErrors)
        } else {
            console.log("ok")
            //setUser({})
            navigation.navigate('HomeClient')
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
                        <Input value={credentials.email} isInvalid={errors.email !== ""} onChangeText={text => onChangeText("email", text)}/>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.email}</FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.password !== ""}>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input type="password" value={credentials.password} isInvalid={errors.password !== ""} onChangeText={text => onChangeText("password", text)} />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>
                        <Link _text={{fontSize: "xs", fontWeight: "500", color: "indigo.500"}} alignSelf="flex-end" mt="1">
                            Forget Password?
                        </Link>
                    </FormControl>
                    <Button mt="2" colorScheme="indigo" onPress={auth}>Sign in</Button>
                    <HStack mt="6" justifyContent="center">
                        <Text fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200"}}>
                            I'm a new user.{" "}
                        </Text>
                        {/* <Link _text={{color: "indigo.500",fontWeight: "medium",fontSize: "sm"}} 
                            onPress={navigation.navigate('Register')}>
                            Sign Up
                        </Link> */}
                        <Text underline onPress={() => navigation.navigate('Register')}>Register</Text>
                    </HStack>
                </VStack>
            </Box>
        </Center>
    )
}

// const styles = StyleSheet.create({
//     input: {
//       height: 40,
//       margin: 12,
//       borderWidth: 1,
//       padding: 10,
//     },
//     container: {
//         marginTop: 50,
//         marginHorizontal: 25
//     },
//     formGroup: {
//         borderWidth: 1,
//         borderColor: "black",
//         padding: 10,
//         marginBottom: 10
//     },
//     titleLogin: {
//         fontSize: 10,
//         height: 50,
//         marginBottom: 10,
//         marginTop: 100
//     }
// });

export default Login