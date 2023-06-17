import {StyleSheet} from "react-native";

const styles = () => StyleSheet.create({
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
})

export default styles