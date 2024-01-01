import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import BubbleText from './BubbleText';
import { scale, verticalScale, moderateScaleFont, moderateScale } from '../scaling';

function Graphs({ weeklyArray, title, Yaxis, Xaxis }) {
  // Processing the data and ensuring there are 10 data points
  const processedData = [];
  for (let i = 0; i < 10; i++) {
    const key = Object.keys(weeklyArray)[i];
    processedData.push({
      x: i + 1, // Week number
      y: key ? weeklyArray[key] : 0 // Value or 0 if no data
    });
  }

  // Determine the maximum value in the data set
  const maxValue = Math.max(...processedData.map(d => d.y), 100);
  // hey pilot?
  // yes?
  // why is my y axis label cut off?
  // I think it's because the axis label is too long
  // I'll try to fix it
  // what does that mean?
  // I'm going to try to make the axis label shorter
  // what do you mean by shorter? the label is "minutes" the top is being cut off. 
  // i cant see the top half of the letters and I Have no idea why
  // oh thats because the axis label is too long


  return (
  <View>
      <BubbleText size={moderateScaleFont(32)} color="#650000" text={title} />
        <VictoryChart 
          width={scale(430)} 
          height={verticalScale(305)} 
          domainPadding={scale(10)}
          domain={{ y: [0, maxValue] }} // Set the y-axis domain
        >
          <VictoryAxis
            style={{
              axisLabel: { padding: scale(30), fontSize: moderateScaleFont(20), fill: '#650000' },
              tickLabels: { fontSize: moderateScaleFont(15), fill: '#650000' }
            }}
            label={Xaxis}
          />

          <VictoryAxis 

            dependentAxis
            style={{
              tickLabels: { fontSize: moderateScaleFont(15), fill: '#650000' }
            }}
            />
          <VictoryBar
            data={processedData}
            style={{
              data: {
                fill: '#FF67A0',
                strokeWidth: scale(2),
                stroke: '#650000',
              },
            }}
            barRatio={0.8}
            cornerRadius={{ top: scale(5) }}
          />
        </VictoryChart>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(20),
    backgroundColor: '#FFCD01',


  },
});

export default Graphs;
