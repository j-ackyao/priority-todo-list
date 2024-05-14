import { StyleSheet, Text, TouchableOpacity, Alert, View, Button, Platform, Modal, Touchable, TouchableWithoutFeedback, TextInput, Keyboard, TextInputBase } from 'react-native';
import NavigationBar from './NavigationBar';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Animated from 'react-native-reanimated';


const DECIMALS = 2;


export default function Todo() {
    
    // get from database

    const [tasks, setTasks] = useState<ReactElement[]>([]);

    const [addTaskVisible, setAddTaskVisible] = useState(false);

    const [text, setText] = useState("");
    const [hours, setHours] = useState("");

    const [priority, setPriority] = useState(null);
    const [priorityDrop, setPriorityDrop] = useState(false);
    const [priorities, setPriorities] = useState([
        {label: "High", value: "high"},
        {label: "Medium", value: "medium"},
        {label: "Low", value: "low"},
    ])

    function submitTask() {

    }

    return (
        <NavigationBar components={[<Button title={"Add task"} onPress={() => setAddTaskVisible(true)}/>]}>

            <Modal animationType="slide" transparent={true} visible={addTaskVisible}>
                <TouchableWithoutFeedback onPress={() => {
                    if (Keyboard.isVisible()) {
                        Keyboard.dismiss();
                    } else {
                        setAddTaskVisible(false);
                        setText("");
                        setHours("");
                        setPriorityDrop(false);
                        setPriority(null);
                    }
                }}>
                    <Animated.View style={styles.addTaskCenter}>
                        {/* Ignore parent onPress event */}
                        <TouchableOpacity activeOpacity={1}>
                            <View style={styles.addTaskForm}>
                                <TextInput 
                                style={styles.textInput} 
                                placeholderTextColor={"grey"} 
                                placeholder={"Task to do"}
                                onChangeText={(text) => {setText(text)}}>
                                    {text}
                                </TextInput>
                                <View style={styles.addTaskHorizontal}>
                                    {/* i dislike this very much, make own dropdown soon */}
                                    <DropDownPicker 
                                        dropDownContainerStyle={styles.dropdownContainer}                                        
                                        textStyle={{fontSize: 20}}
                                        containerStyle={styles.dropdownButton}
                                        style={styles.dropdownContainer}
                                        placeholder={"Priority"}
                                        placeholderStyle={{
                                            color: "grey",
                                        }}
                                        dropDownDirection={"TOP"}
                                        open={priorityDrop} 
                                        setOpen={setPriorityDrop} 
                                        value={priority} 
                                        setValue={setPriority} 
                                        items={priorities}/>
                                    <TextInput style={styles.hourInput} 
                                    placeholderTextColor={"grey"} 
                                    placeholder={"# of hours"} 
                                    inputMode="decimal"
                                    onChangeText={(hours) => {setHours(hours)}}
                                    onEndEditing={() => {
                                        setHours((Math.round(parseFloat(hours) * 10 ** DECIMALS) / 10 ** DECIMALS).toString())
                                    }}>
                                        {hours}
                                    </TextInput>
                                </View>
                                <View style={styles.addTaskHorizontal}>
                                    <Button onPress={submitTask} title={"Add new task"}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Modal>
            <View style={styles.list}>
                {tasks.map((task, i) => {
                    return <View key={i.toString()}>{task}</View>
                })}
            </View>
        </NavigationBar>
    )
}



function Task(props: {text: string}) {

    const [checked, setChecked] = useState(false)

    return (
        <View style={styles.task}>
            <TouchableOpacity style={styles.checkBox} disabled={checked} onPress={() => {
                    setChecked(true);
                    // del from database
                }}>
                <Text style={styles.cross}>{checked ? "X" : ""}</Text>
            </TouchableOpacity>
            <Text style={StyleSheet.compose(styles.taskText, {textDecorationLine: checked ? "line-through" : "none"})}>{props.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    addTaskBackground: {
        backgroundColor: "black"
    },
    addTaskCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    addTaskHorizontal: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between"
    },
    addTaskForm: {
        minWidth: "75%",
        maxWidth: "75%",
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
    },
    textInput: {
        minWidth: "100%",
        minHeight: 50,
        backgroundColor: "lightgray",
        borderRadius: 10,
        padding: 5,
        fontSize: 20
    },
    hourInput: {
        width: "45%",
        minHeight: 50,
        backgroundColor: "lightgray",
        borderRadius: 10,
        padding: 5,
        fontSize: 20
    },
    dropdownButton: {
        width: "50%",
        height: 50
    },
    dropdownContainer: {
        backgroundColor: "lightgrey",
        borderWidth: 0,
        borderRadius: 10,
        zIndex: 1000,
        elevation: 1000
    },

    list: {
        height: "100%",
        width: "100%",
        flexDirection: "column",
        gap: 10,
        padding: 20,
    },
    task: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    checkBox: {
        width: 40,
        height: 40,
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        borderWidth: 3,
        borderRadius: 5
    },
    cross: {
        textAlign: "center",
        fontSize: 30
    },
    taskText: {
        fontSize: 20,
        flexShrink: 1,
        textDecorationStyle: "solid",
    }
});