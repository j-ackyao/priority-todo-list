import { StyleSheet, Text, TouchableOpacity, Alert, View, SafeAreaView, Image, Button, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';


export default function Home() {
    // for some reason, defined as never, so specify type as any
    return (
        <View style={styles.home}>
            <TouchableOpacity onLongPress={() => Alert.alert("awesome easter egg", undefined, [{text:"awesome"}])}>
                <Image style={styles.titleImage} source={{
                uri: "https://png.pngtree.com/png-vector/20191129/ourmid/pngtree-office-checklist-icon-business-checklist-survey-test-icon-png-image_2047566.jpg"}} />
            </TouchableOpacity>
            <Text style={styles.title}>Priority Todo list</Text>
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
        borderRadius: 10,
        width: 150,
        height: 150
    },
    screenList: {
        gap: 20,
    },
    screenTitle: {
        fontSize: 30,
        color: "royalblue",
    }

});