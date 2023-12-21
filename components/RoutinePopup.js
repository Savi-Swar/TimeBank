import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { getRoutineStats } from "../firebase"

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':');
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

// Helper function to convert minutes to hh:mm
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins < 10 ? '0' : ''}${mins}`;
}

function RoutinePopup({ visible, onClose, routine }) {
    const [stats, setStats] = useState(null);
    // Calculate min and max values for y-axis


    useEffect(() => {
        if (routine) {
            getRoutineStats(routine.kid, routine.name)
                .then(data => {
                    // console.log(data);
                    setStats(data);
                });
        }
    }, [routine]);
    
    if (routine) {
        const { name, st, et } = routine;
        const screenWidth = Dimensions.get("window").width;
        const endTimeInMinutes = timeToMinutes(et);
    
        // Calculate minutes earned for each finish time
        const minutesEarnedData = stats && stats.times
            ? stats.times.map(time => endTimeInMinutes - timeToMinutes(time))
            : [];
    
        const data = {
            labels: Array.from({ length: minutesEarnedData.length }, (_, i) => (i + 1).toString()),
            datasets: [
                {
                    data: minutesEarnedData,
                }
            ]
        };
    
        
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>{name}</Text>
                        <Text style={styles.modalText}>Start Time: {st}</Text>
                        <Text style={styles.modalText}>End Time: {et}</Text>
                        {/* <Text style={styles.modalText}>Kid: {kid}</Text> */}
                        {stats &&
                            <>
                                {stats.averageTime !== undefined ? <Text style={styles.modalText}>Average Minutes Saved: {stats.averageTime}</Text> : null}
                                {stats.lastCompleted !== undefined ? <Text style={styles.modalText}>Last Completed: {stats.lastCompleted}</Text> : null}
                                {stats.timesCompleted !== undefined ? <Text style={styles.modalText}>Times Completed: {stats.timesCompleted}</Text> : null}
                                {stats.times &&
                                <>
                               <Text style={styles.modalTitle}>Minutes Earned for {name}</Text>
                                <LineChart
                                    data={data}
                                    width={screenWidth}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: "#e26a00",
                                        backgroundGradientFrom: "#fb8c00",
                                        backgroundGradientTo: "#ffa726",
                                        decimalPlaces: 0, // Since you're dealing with minutes
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        }
                                    }}
                                    bezier
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16
                                    }}
                                />
                                </>
                                }
                            </>
                        }

                        <Button title="Back" onPress={onClose} />
                    </View>
                </View>
            </Modal>
        );
    } else {
        return null;  // or you can return a loader, default view, or any other fallback component here
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default RoutinePopup;
