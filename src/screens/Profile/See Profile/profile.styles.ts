import {StyleSheet} from "react-native";

const styles = () => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cda9e6'
    },
    userInfoSection: {
        paddingHorizontal: 10,
        marginBottom: 25,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: '500',
        color: 'black'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
        color: 'black'
    },
    infoBoxWrapper: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        borderTopColor: 'black',
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 100,
        backgroundColor: 'white'
    },
    infoBox: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        color: "black"
    },
    menuWrapper: {
        marginTop: 10,
        color: "black",
    },
    menuItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        color: "black",
    },
    menuItemText: {
        color: 'black',
        marginLeft: 20,
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 26,
    },
    backgroundImage: {
        flex: 1,
        // width: 400,
        // height: null,
        resizeMode: 'cover', // or 'stretch'
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default styles