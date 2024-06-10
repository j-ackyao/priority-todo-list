import { ScrollView, StyleSheet, Text, TouchableOpacity, Alert, View, Button, Platform, Modal, Touchable, TouchableWithoutFeedback, TextInput, Keyboard, TextInputBase, RefreshControl } from 'react-native';
import NavigationBar from '../NavigationBar';
import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Animated from 'react-native-reanimated';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { getToken } from '../user/Login';
const HOURS_ROUND_DECIMALS = 2;

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// copied from todos endpoint, keep separate (?)

interface Task {
    text: string
    hours: number
    deadline: Date
    priority: "high" | "medium" | "low"
}

interface Tasks {
    [id: string]: Task
}

function requestAddTask(task: Task): Promise<void> {
    return new Promise(async (resolve, reject) => {
        fetch(API_URL + "/todos", {
            method: "POST",
            body: JSON.stringify(task),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": await getToken()
            }
        }).then((res) => {
            if (res.ok) {
                resolve();
            } else {
                Alert.alert("Error", `Failed to add task (${res.status})`);
                reject(`Failed to add task, status ${res.status}`);
            }
        });
    });
}

function requestDeleteTask(id: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        fetch(API_URL + "/todos", {
            method: "DELETE",
            body: JSON.stringify({id: id}),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": await getToken()
            }
        }).then((res) => {
            if (res.ok) {
                resolve();
            } else {
                Alert.alert("Error", `Failed to delete task (${res.status})`);
                reject(`Failed to add task, status ${res.status}`);
            }
        }).catch((err) => {
            Alert.alert("Something went wrong!", "Please try again later"); 
            console.log(`inner catch of requestGetTasks: ${err}`);
            reject("Failed to delete task");
        });
    });
}

function requestGetTasks(): Promise<Tasks> {
    return new Promise(async (resolve, reject) => {
        fetch(API_URL + "/todos", {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": await getToken()
            }
        }).then((res) => {
            res.json().then((json) => {
                resolve(json);
            });
        }).catch((err) => {
            Alert.alert("Something went wrong!", "Please try again later");
            console.log(err);
            reject("Failed to fetch tasks");
        });
    });
}

function TaskElement(props: {task: Task, id: string}) {

    const [checked, setChecked] = useState(false)

    return (
        <View style={styles.task}>
            <TouchableOpacity style={styles.checkBox} disabled={checked} onPress={() => {
                    setChecked(true);
                    requestDeleteTask(props.id);
                }}>
                <Text style={styles.cross}>{checked ? "X" : ""}</Text>
            </TouchableOpacity>
            <View>
                <Text style={StyleSheet.compose(styles.taskText, {textDecorationLine: checked ? "line-through" : "none"})}>
                    {props.task.text}
                </Text>
                <Text>
                    {`${props.task.hours}h | ${props.task.priority.charAt(0).toUpperCase() + props.task.priority.slice(1)} priority | ${new Date(props.task.deadline).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    })}`}
                </Text>
            </View>
        </View>
    )
}

export default function Todo() {
    // get from database
    const [tasks, setTasks] = useState<Tasks>();
    if (!tasks) {
        requestGetTasks().then((tasks) => {
            setTasks(tasks);
        });
    }
    
    const [addTaskVisible, setAddTaskVisible] = useState(false);

    const [text, setText] = useState("");
    const [hours, setHours] = useState("");

    const [deadlineOpen, setDeadlineOpen] = useState(false);
    const [deadline, setDeadline] = useState<Date>(new Date());

    const [priority, setPriority] = useState(null);
    const [priorityDrop, setPriorityDrop] = useState(false);
    const [priorities, setPriorities] = useState([
        {label: "High", value: "high"},
        {label: "Medium", value: "medium"},
        {label: "Low", value: "low"},
    ]);

    const submitTask = () => {
        if (!text || !hours || !priority) {
            Alert.alert("Missing value(s)", `${!text? "Text" : !hours ? "Hours" : "Priority"} is blank`);
            return;
        }

        let task = {
            text: text,
            hours: Number.parseFloat(hours),
            deadline: deadline,
            priority: priority
        }
        requestAddTask(task).then(() => {
            requestGetTasks().then((tasks) => {
                setTasks(tasks);
            });
        });
        clearForm();
    }

    const clearForm = () => {
        setAddTaskVisible(false);
        setText("");
        setHours("");
        setPriorityDrop(false);
        setPriority(null);
        setDeadline(new Date);
    }

    const [refresh, setRefresh] = useState(false);

    // TODO extract each component to reduce the indent hell
    return (
        <NavigationBar components={[<Button title={"Add task"} onPress={() => setAddTaskVisible(true)}/>]}>

            <Modal animationType="slide" transparent={true} visible={addTaskVisible}>
                <TouchableWithoutFeedback onPress={() => {
                    if (Keyboard.isVisible() || priorityDrop || deadlineOpen) {
                        Keyboard.dismiss();
                        setPriorityDrop(false);
                        setDeadlineOpen(false);
                    } else {
                        clearForm();
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
                                    <TextInput style={styles.hourInput} 
                                    placeholderTextColor={"grey"} 
                                    placeholder={"# of hours"} 
                                    inputMode="decimal"
                                    onChangeText={(hours) => {setHours(hours.toString())}}
                                    onEndEditing={() => {
                                        let rounded = (Math.round(parseFloat(hours) * 10 ** HOURS_ROUND_DECIMALS) / 10 ** HOURS_ROUND_DECIMALS);
                                        if (!Number.isNaN(rounded)) {
                                            setHours(rounded.toString());
                                        }
                                    }}>
                                        {hours}
                                    </TextInput>
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
                                </View>
                                <View style={styles.deadlineRow}>
                                    <Text style={styles.deadlineText}>
                                        Deadline
                                    </Text>
                                {/** wow this date picker kinda sucks... consider changing, but working for now */}
                                    <RNDateTimePicker
                                    mode={"date"} 
                                    onTouchEnd={() => {
                                        // necessary to track if it's open
                                        if (!deadlineOpen) {
                                            setDeadlineOpen(true);
                                        }
                                    }}
                                    onChange={(event: DateTimePickerEvent, date: Date | undefined) => {
                                        if (event.type === "set" && date) {
                                            setDeadline(date);
                                        } else if (event.type === "dismissed") {
                                            setDeadlineOpen(false);
                                        }
                                    }} 
                                    value={deadline} 
                                    minimumDate={new Date()}
                                    style={styles.deadlineButton}
                                    accentColor='gray'
                                    />
                                </View>

                                <View style={styles.addTaskHorizontal}>
                                    <Button onPress={submitTask} title={"Add new task"}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Modal>
            <ScrollView contentContainerStyle={{paddingBottom: 100}} style={{height: "100%"}}>
                <RefreshControl refreshing={refresh} onRefresh={() => {
                    requestGetTasks().then((tasks) => {
                        setTasks(tasks);
                        setRefresh(false);
                    });
                }}/>
                    <View style={styles.list}>
                        {
                            !tasks ? <View/> :
                            Object.keys(tasks).map((id) => {
                                return <TaskElement key={id} task={tasks[id]} id={id}/>
                            })
                        }
                    </View>
            </ScrollView>
        </NavigationBar>
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
        padding: 10,
        fontSize: 20
    },
    hourInput: {
        width: "47.5%",
        minHeight: 50,
        backgroundColor: "lightgray",
        borderRadius: 10,
        padding: 10,
        fontSize: 20
    },
    dropdownButton: {
        width: "47.5%",
        height: 50
    },
    dropdownContainer: {
        backgroundColor: "lightgrey",
        borderWidth: 0,
        borderRadius: 10,
        zIndex: 1000,
        elevation: 1000
    },
    deadlineButton: {
        // borderWidth: 1,
        // marginRight: 10
    },
    deadlineRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // borderWidth: 1
        borderRadius: 10,
        backgroundColor: "lightgray",
        padding: 10
    },
    deadlineText: {
        fontSize: 20,
        color: "gray"
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