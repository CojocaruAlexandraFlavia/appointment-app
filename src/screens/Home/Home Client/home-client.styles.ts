import {StyleSheet} from "react-native";

const styles = () => StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 10
    },
    logo: {
        width: 135,
        height: 150,
        alignSelf: 'center',
        borderRadius: 200/2,
    },
    backgroundImage: {
        flex: 1,
        width: 355,
        height: 870,
        resizeMode: 'cover', // or 'stretch'
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default styles