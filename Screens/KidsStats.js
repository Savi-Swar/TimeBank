import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import AppButton from '../components/AppButton';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as firebase from '../firebase'
import RoutineStats from './RoutineStats';
import { ActivityIndicator } from 'react-native';
import RoutinePopup from '../components/RoutinePopup';

const screenWidth = Dimensions.get("window").width;

function KidsStats({navigation, route}) {
    const [routinePopupVisible, setRoutinePopupVisible] = useState(false);
    const [selectedRoutine, setSelectedRoutine] = useState(null);

    const times = route.params.times || []; // assuming `times` is passed as a prop in route.params
    const timesInMinutes = times.map(time => {
        const [hour, minute] = time.split(':');
        return parseInt(hour) * 60 + parseInt(minute);
    });

    const { store: routines, loading: routinesLoading } = firebase.useRoutines();
    const { dataset, loading: weeklyLoading } = firebase.getWeekly(route.params.name);

    const data = {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [
          {
            data: dataset
          }
        ]
    };

    const isValidData = (data) => {
        return data.every((item) => {
            return typeof item === 'number' && !isNaN(item) && item !== Infinity && item !== -Infinity;
        });
    }
    
    if (weeklyLoading || routinesLoading) {
        return <ActivityIndicator />;
    }
    // firebase.Routines(routines, setRoutines)
    return (
        <View style={styles.container}>
            <AppButton title = "Activity" onPress = {() => navigation.navigate("ActivityScreen", {name: route.params.name})}/>
            <Text style={styles.title}>{route.params.name}'s Stats</Text>
            
            <Text style={styles.statsText}>Minutes: {route.params.minutes}</Text>
            <Text style={styles.statsText}>Minutes Earned This Week: {route.params.weekly}</Text>
            <Text style={styles.statsText}>Total Minutes Earned: {route.params.earned}</Text>
            <Text style={styles.statsText}>Total Minutes Spent: {route.params.spent}</Text>

            <Text style={styles.title}>Last Ten Weeks</Text>

            {
            isValidData(dataset) && (
                <LineChart
                    data={data}
                    width={screenWidth}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, 
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
            )}   
        <Text style={styles.title}>Routine Stats</Text>
        <RoutinePopup
            visible={routinePopupVisible}
            onClose={() => setRoutinePopupVisible(false)}
            routine={selectedRoutine}
        />

        {routines.length > 0 ? (
                <FlatList
                    data={routines}
                    keyExtractor={(routines) => routines.id}
                    renderItem={({ item }) => (
                    <View style={{width: '100%', width: 350}}>
                        <AppButton
                            title={item.title}
                            style={styles.routineButton}
                            onPress={() => {
                                setSelectedRoutine({
                                    name: item.title,
                                    st: item.startTime,
                                    et: item.endTime,
                                    kid: route.params.name
                                });
                                setRoutinePopupVisible(true);
                            }}
                        />
                    </View>
                    )}
                />
            ) : (
                <Text style={styles.emptyStateText}>
                    No routines found. Add one on a kids account!
                </Text>
            )}
            <View style = {{width: "100%", bottom: 140}}>
                <AppButton title="Back" onPress={() => navigation.navigate("KidsScreen")} style={styles.backButton}/>
            </View> 
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: "center",
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 20, // Shift everything down
        top: 100
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: 10,
    },
    graphTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: 10,
    },
    statsText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'left',
        marginVertical: 5,
    },
    routineButton: {
        width: '100%', // make the button cover most of the screen width
        marginTop: 20,
    },
    backButton: {
        width: '100%', // make the button cover most of the screen width
        marginTop: 20,
    }

});

export default KidsStats;
