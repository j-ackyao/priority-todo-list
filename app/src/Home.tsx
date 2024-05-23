import { StyleSheet, Text, TouchableOpacity, Alert, View, SafeAreaView, Image, Button, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NavigationBar from './NavigationBar';


export default function Home() {
    // for some reason, defined as never, so specify type as any
    return (
        <NavigationBar>
            <View style={styles.home}>
                <TouchableOpacity onLongPress={() => Alert.alert("awesome easter egg", undefined, [{text:"awesome"}])}>
                    <Image style={styles.titleImage} source={{
                    uri: "https://png.pngtree.com/png-vector/20191129/ourmid/pngtree-office-checklist-icon-business-checklist-survey-test-icon-png-image_2047566.jpg"}} />
                </TouchableOpacity>
                <Text style={styles.title}>Priority Todo list</Text>
                <PageList />
            </View>
        </NavigationBar>
    )
}

function PageList() {
    const navigation: NativeStackNavigationProp<any> = useNavigation<NativeStackNavigationProp<any>>();
    return (
        <View style={styles.pageList}>
            
            <Text style={styles.pages} onPress={() => {navigation.navigate("Todo")}}>My list</Text>
            {/* <Text style={styles.pages} onPress={() => {navigation.push("Test")}}>test</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    home: {
        alignItems: 'center',
        marginTop: '33%',
        gap: 30
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
    pageList: {
        gap: 10,
    },
    pages: {
        fontSize: 30,
        color: "royalblue",
    }

});