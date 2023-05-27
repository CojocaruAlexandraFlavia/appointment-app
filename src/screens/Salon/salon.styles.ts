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
    salonProfileItemText: {
        color: '#000',
        marginLeft: 10,
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 26,

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
        position:"relative",
        // display: 'flex',
        left:200,
        bottom:5,
        justifyContent:"center",
        alignItems:"center",
    },
    container:{
        // flex:1,
        paddingTop: 0,
    },
    clapButton:{
        width:100,
        height:30,
        borderRadius:50,
        backgroundColor:"white",
        position:"relative",
        display: 'flex',
        left:200,
        bottom:0,
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
    },
    button:{
        backgroundColor: '#50d0c3',
        padding: 7,
        borderRadius:5,
        margin:3,
        elevation:5,
        marginTop:8,
    },
    buttonText:{
        color: 'black',
        fontSize: 15,
        alignSelf: 'center'
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