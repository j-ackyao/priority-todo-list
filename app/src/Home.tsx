import { StyleSheet, Text, TouchableOpacity, Alert, View, SafeAreaView, Image, Button, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';


export default function Home() {
    // for some reason, defined as never, so specify type as any
    return (
        <View style={styles.home}>
            <TouchableOpacity onLongPress={() => Alert.alert("yep that's me", undefined, [{text:"awesome"}])}>
                <Image style={styles.titleImage} blurRadius={10} source={{
                width: 200,
                height: 150,
                uri: "https://j-ackyao.github.io/static/media/me2.d03bb49dbc2050cab51a.jpg"}} />
            </TouchableOpacity>
            <Text style={styles.title}>Jack's App</Text>
            <View style={{paddingTop: 100}}/>
            <ScreenList />
        </View>
        
    )
}

function ScreenList() {
    const navigation: NativeStackNavigationProp<any> = useNavigation<NativeStackNavigationProp<any>>();
    return (
        <View style={styles.screenList}>
            <Text style={styles.screenTitle} onPress={() => {navigation.navigate("Todo")}}>todo list</Text>
            <Text style={styles.screenTitle} onPress={() => {navigation.push("Test")}}>test</Text>
            <Text style={styles.screenTitle} onPress={() => {navigation.push("Home")}}>awesome dupe glitch</Text>
            
        </View>
    )
}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: '33%',
        // justifyContent: 'center',
        },
    title: {
        fontSize: 40,
        fontWeight: "400"
    },
    titleImage: {
        borderRadius: 10
    },
    screenList: {
        gap: 20,
    },
    screenTitle: {
        fontSize: 30,
        color: "royalblue",
    }

});