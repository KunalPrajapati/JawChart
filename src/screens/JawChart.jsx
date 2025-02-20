/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {Svg, Path, Circle, Text as SvgText, G, Rect} from 'react-native-svg';
import {ToothShapes} from '../utils/constants';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';

const TOOTH_DISEASES = [
  'Cavity',
  'Gingivitis',
  'Periodontitis',
  'Root Canal Required',
  'Crown Required',
  'Filling Required',
  'Cleaning Required',
];

const JawChart = () => {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [toothConditions, setToothConditions] = useState({});
  const bottomSheetRef = useRef(null);
  const navigation = useNavigation();

  const upperTeeth = [
    {id: 32, x: 50, y: 230, ToothComponent: ToothShapes.Tooth1},
    {id: 31, x: 70, y: 145, ToothComponent: ToothShapes.Tooth2},
    {id: 30, x: 90, y: 55, ToothComponent: ToothShapes.Tooth3},
    {id: 29, x: 110, y: -20, ToothComponent: ToothShapes.Tooth4},
    {id: 28, x: 140, y: -75, ToothComponent: ToothShapes.Tooth5},
    {id: 27, x: 110, y: 5, ToothComponent: ToothShapes.Tooth6},
    {id: 26, x: 140, y: 0, ToothComponent: ToothShapes.Tooth7},
    {id: 25, x: 170, y: -10, ToothComponent: ToothShapes.Tooth8},
    {id: 24, x: 200, y: -10, ToothComponent: ToothShapes.Tooth9},
    {id: 23, x: 230, y: -10, ToothComponent: ToothShapes.Tooth10},
    {id: 22, x: 255, y: 15, ToothComponent: ToothShapes.Tooth11},
    {id: 21, x: 275, y: 30, ToothComponent: ToothShapes.Tooth12},
    {id: 20, x: 290, y: 70, ToothComponent: ToothShapes.Tooth13},
    {id: 19, x: 300, y: 110, ToothComponent: ToothShapes.Tooth14},
    {id: 18, x: 315, y: 170, ToothComponent: ToothShapes.Tooth15},
    {id: 17, x: 335, y: 225, ToothComponent: ToothShapes.Tooth16},
  ];

  const lowerTeeth = [
    {id: 1, x: 60, y: 300, ToothComponent: ToothShapes.Tooth1},
    {id: 2, x: 85, y: 325, ToothComponent: ToothShapes.Tooth2},
    {id: 3, x: 110, y: 345, ToothComponent: ToothShapes.Tooth3},
    {id: 4, x: 135, y: 360, ToothComponent: ToothShapes.Tooth4},
    {id: 5, x: 160, y: 370, ToothComponent: ToothShapes.Tooth5},
    {id: 6, x: 125, y: 495, ToothComponent: ToothShapes.Tooth6},
    {id: 7, x: 150, y: 508, ToothComponent: ToothShapes.Tooth7},
    {id: 8, x: 180, y: 510, ToothComponent: ToothShapes.Tooth8},
    {id: 9, x: 210, y: 510, ToothComponent: ToothShapes.Tooth9},
    {id: 10, x: 242, y: 505, ToothComponent: ToothShapes.Tooth10},
    {id: 11, x: 270, y: 495, ToothComponent: ToothShapes.Tooth11},
    {id: 12, x: 290, y: 468, ToothComponent: ToothShapes.Tooth12},
    {id: 13, x: 310, y: 440, ToothComponent: ToothShapes.Tooth13},
    {id: 14, x: 320, y: 395, ToothComponent: ToothShapes.Tooth14},
    {id: 15, x: 335, y: 345, ToothComponent: ToothShapes.Tooth15},
    {id: 16, x: 345, y: 300, ToothComponent: ToothShapes.Tooth16},
  ];

  useEffect(() => {
    loadToothConditions();
  }, []);

  const loadToothConditions = async () => {
    try {
      const savedConditions = await AsyncStorage.getItem('toothConditions');
      if (savedConditions) {
        setToothConditions(JSON.parse(savedConditions));
      }
    } catch (error) {
      console.error('Error loading tooth conditions:', error);
    }
  };

  const handleToothPress = (tooth, isUpper) => {
    console.log('Tooth pressed:', tooth);
    setSelectedTooth({
      ...tooth,
      isUpper,
    });
    setSelectedDisease(null);

    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  };

  const handleSaveCondition = async () => {
    if (selectedTooth && selectedDisease) {
      const newConditions = {
        ...toothConditions,
      };

      if (selectedDisease === TOOTH_DISEASES[0]) {
        delete newConditions[selectedTooth.id];
      } else {
        newConditions[selectedTooth.id] = selectedDisease;
      }

      try {
        await AsyncStorage.setItem(
          'toothConditions',
          JSON.stringify(newConditions),
        );
        setToothConditions(newConditions);
        bottomSheetRef.current?.close();
      } catch (error) {
        console.error('Error saving condition:', error);
      }
    }
  };

  const getToothColor = toothId => {
    if (toothConditions[toothId]) {
      switch (toothConditions[toothId]) {
        case 'Cavity':
          return '#FF0000';
        case 'Gingivitis':
          return '#FF3333';
        case 'Periodontitis':
          return '#FF6666';
        case 'Root Canal Required':
          return '#CC0000';
        case 'Crown Required':
          return '#FF1a1a';
        case 'Filling Required':
          return '#FF4d4d';
        case 'Cleaning Required':
          return '#FFB3B3';
        default:
          return '#FF0000';
      }
    }
    return '#dce3de';
  };

  const renderTooth = (tooth, isUpper) => {
    const ToothComponent = tooth.ToothComponent;
    return (
      <G key={tooth.id}>
        <ToothComponent
          x={tooth.x}
          y={tooth.y}
          fill={getToothColor(tooth.id)}
        />
        <Rect
          x={tooth.x}
          y={tooth.y}
          width={tooth.width}
          height={tooth.height}
          fill="transparent"
          onPress={() => handleToothPress(tooth, isUpper)}
        />
      </G>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Medical Record</Text>
      <Text style={styles.subtitle}>
        {Object.keys(toothConditions).length} teeth marked with conditions
      </Text>

      <View style={styles.svgContainer}>
        <Svg height="1000" width="400" viewBox="-20 20 450 1000">
          {upperTeeth.map(tooth => {
            const ToothComponent = tooth.ToothComponent;
            return (
              <G key={tooth.id}>
                <ToothComponent
                  x={tooth.x}
                  y={tooth.y}
                  fill={getToothColor(tooth.id)}
                />
                {/* Directly handling press inside SVG */}
                <Circle
                  cx={tooth.x + 20}
                  cy={tooth.y + 20}
                  r="20"
                  fill="transparent"
                  onPressIn={() => handleToothPress(tooth, true)} // Use onPressIn instead of onPress
                />
              </G>
            );
          })}

          {/* Lower teeth */}
          {lowerTeeth.map(tooth => {
            const ToothComponent = tooth.ToothComponent;
            return (
              <G key={tooth.id}>
                <ToothComponent
                  x={tooth.x}
                  y={tooth.y}
                  fill={getToothColor(tooth.id)}
                />
                <Circle
                  cx={tooth.x + 20}
                  cy={tooth.y + 20}
                  r="20"
                  fill="transparent"
                  onPressIn={() => handleToothPress(tooth, false)} // Use onPressIn instead of onPress
                />
              </G>
            );
          })}

          <SvgText x="190" y="50" fontSize="18" textAnchor="middle">
            Upper Jaw
          </SvgText>
          <SvgText x="225" y="450" fontSize="18" textAnchor="middle">
            Lower Jaw
          </SvgText>
        </Svg>
      </View>

      {/* Rest of the component remains the same */}
      <View style={{}}>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.indicator, styles.wantTreated]} />
            <Text style={styles.legendText}>Want to get treated</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.indicator, styles.previouslyTreated]} />
            <Text style={styles.legendText}>Previously treated</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.appoint]}
          onPress={() => navigation.navigate('AppointmentScreen')}>
          <Text style={styles.saveButtonText}>Book an Appointment</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%']}
        enablePanDownToClose>
        <BottomSheetView style={styles.bottomSheetContent}>
          {selectedTooth && (
            <>
              <Text style={styles.bottomSheetTitle}>
                Tooth #{selectedTooth.id}
                {toothConditions[selectedTooth.id] && (
                  <Text style={styles.currentCondition}>
                    {' '}
                    - Current: {toothConditions[selectedTooth.id]}
                  </Text>
                )}
              </Text>

              <Picker
                selectedValue={selectedDisease}
                onValueChange={itemValue => setSelectedDisease(itemValue)}
                style={styles.picker}>
                {TOOTH_DISEASES.map((disease, index) => (
                  <Picker.Item key={index} label={disease} value={disease} />
                ))}
              </Picker>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  selectedDisease === null && styles.saveButtonDisabled,
                ]}
                onPress={handleSaveCondition}
                disabled={selectedDisease === null}>
                <Text style={styles.saveButtonText}>
                  {selectedDisease === TOOTH_DISEASES[0]
                    ? 'Clear Condition'
                    : 'Save Condition'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  svgContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  bottomSheetContent: {
    flex: 1,
    padding: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  diseaseList: {
    gap: 8,
  },
  diseaseItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedDisease: {
    backgroundColor: '#E8F3FF',
    borderColor: '#0066FF',
  },
  diseaseText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#0066FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  appoint: {
    backgroundColor: '#0066FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    width: 200,
    alignSelf: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentCondition: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  wantTreated: {
    backgroundColor: 'red',
  },
  previouslyTreated: {
    backgroundColor: '#FFD700',
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
});

export default JawChart;
