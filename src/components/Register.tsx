import { Center, VStack, Box, Button, Heading, Input, FormControl, WarningOutlineIcon  } from "native-base"
import { ReactElement, useState } from "react"
import { useUserDataContext } from "../store/UserData.context"
import { ScrollView } from 'react-native';

type RegisterData = {
    email: string, 
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
}

//type Props = NativeStackScreenProps<ParamListBase, 'Login'>;

const Register = ({navigation}: any): ReactElement => {

    const [credentials, setCredentials] = useState<RegisterData>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: ""

    })
    const [errors, setErrors] = useState<RegisterData>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: ""
    })

    const {setUser} = useUserDataContext()

    const findFormErrors = () : RegisterData => {
        const errors : RegisterData = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phoneNumber: ""
        }
        if(credentials.email === "") errors.email = "Required field"
        if(credentials.password === "") errors.password = "Required field"
        
        if(credentials.firstName === "") errors.firstName = "Required field"
        else if(credentials.firstName.length < 3) errors.firstName = "First Name is too short"
        
        if(credentials.lastName === "") errors.lastName = "Required field"
        else if(credentials.lastName.length < 3) errors.lastName = "Last Name is too short"
        
        if(credentials.phoneNumber === "") errors.phoneNumber = "Required field"
        else if(credentials.phoneNumber.length < 10) errors.phoneNumber = "Phone Number is too short"

        return errors
    }
    
    const auth = () => {
        const formErrors : RegisterData = findFormErrors()
        if (!Object.values(formErrors).includes("")) {
            setErrors(formErrors)
        } else {
            console.log("ok")
            //setUser({})
            navigation.navigate('HomeClient')
        }
    }

    const onChangeText = (key: string, value: string) => {
        if (errors[key as keyof RegisterData] !== "") {
            setErrors({...errors, [key]: ""})
        }
        setCredentials({...credentials, [key]: value})
    }

    return (   
       <ScrollView > 
        <Center w="100%"> 
            <Box safeArea p="2" py="8" w="90%" maxW="290"> 
                <Heading size="lg" fontWeight="500" color="coolGray.800" _dark={{color: "warmGray.50"}}>Welcome</Heading>
                <Heading mt="1" _dark={{color: "warmGray.200"}} color="coolGray.600" fontWeight="medium" size="xs">
                    Sign up to continue!
                </Heading>
                <VStack space={5} mt="5">
                    <FormControl isRequired isInvalid={errors.email !== ""}>
                        <FormControl.Label _text={{bold: true}} >Email</FormControl.Label>
                        <Input value={credentials.email} isInvalid={errors.email !== ""} onChangeText={text => onChangeText("email", text)}/>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.email}</FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.password !== ""}>
                        <FormControl.Label _text={{bold: true}} >Password</FormControl.Label>
                        <Input type="password" value={credentials.password} isInvalid={errors.password !== ""} onChangeText={text => onChangeText("password", text)} />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>
                    </FormControl>

                    {/* <FormControl isRequired isInvalid={errors.password !== ""}>
                        <FormControl.Label _text={{bold: true}} >Confirm Password</FormControl.Label>
                        <Input type="password" value={credentials.password} isInvalid={errors.password !== ""} onChangeText={text => onChangeText("password", text)} />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>
                     </FormControl> */}

                     <FormControl isRequired isInvalid={errors.firstName !== ""}>
                        <FormControl.Label _text={{bold: true}} >First Name</FormControl.Label>
                        <Input value={credentials.firstName} isInvalid={errors.firstName !== ""} onChangeText={text => onChangeText("firstName", text)}/>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>First Name should contain at least 3 characters. </FormControl.HelperText>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.firstName}</FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.lastName !== ""}>
                        <FormControl.Label _text={{bold: true}} >Last Name</FormControl.Label>
                        <Input value={credentials.lastName} isInvalid={errors.lastName !== ""} onChangeText={text => onChangeText("lastName", text)}/>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Last Name should contain at least 3 characters. </FormControl.HelperText>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.lastName}</FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.phoneNumber !== ""}>
                        <FormControl.Label _text={{bold: true}} >Phone Number</FormControl.Label>
                        <Input value={credentials.phoneNumber} isInvalid={errors.phoneNumber !== ""} onChangeText={text => onChangeText("phoneNumber", text)}/>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Phone Number should contain 10 characters. </FormControl.HelperText>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.phoneNumber}</FormControl.ErrorMessage>
                    </FormControl>

                    <Button mt="2" colorScheme="indigo" onPress={auth}>Sign up</Button>
                </VStack>
            </Box>
        </Center> 
        </ScrollView>
    )
}

export default Register