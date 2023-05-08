import {StyleSheet} from "react-native";

const styles = () => StyleSheet.create({
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
    AdvertisementText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#FF5733'
    },
    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // box:{
    //     width: 45,
    //     height: 45,
    //     backgroundColor: '#5AD2F4'
    // }
    bubble:{
        width:100,
        height:100,
        borderRadius:50,
        backgroundColor:"#fc5c64",
        position:"absolute",
        left:150,
        bottom:200,
        justifyContent:"center",
        alignItems:"center",
    },
    container:{
        flex:1,
        backgroundColor:"orange"
    },
    clapButton:{
        width:100,
        height:100,
        borderRadius:50,
        backgroundColor:"white",
        position:"absolute",
        left:180,
        bottom:350,
        justifyContent:"center",
        alignItems:"center",
        shadowColor:"black",
        shadowOffset:{
            width:5,
            height:5
        },
        shadowOpacity:0.7
    },
    img:{
        width:60,
        height:60,
    },
    text:{
        color:"white",
        fontSize:22
    }
})

export default styles