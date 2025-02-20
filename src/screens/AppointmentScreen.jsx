// AppointmentScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {format} from 'date-fns';

const ScheduleModal = ({visible, onClose, onSchedule}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Scaling');

  const handleSchedule = () => {
    if (!title || !time) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate time format (24-hour)
    const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3])$/;
    if (!timeRegex.test(time)) {
      Alert.alert('Error', 'Please enter a valid hour (0-23)');
      return;
    }

    onSchedule({
      name: title,
      id: 'ID: RSVA' + Math.floor(Math.random() * 10000),
      type: type,
      time: parseInt(time),
    });

    // Reset form
    setTitle('');
    setTime('');
    setType('Scaling');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Schedule New Appointment</Text>

          <TextInput
            style={styles.input}
            placeholder="Patient Name"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Hour (0h-23h)"
            value={time}
            onChangeText={setTime}
            keyboardType="number-pad"
            maxLength={2}
          />

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'Scaling' && styles.selectedTypeButton,
              ]}
              onPress={() => setType('Scaling')}>
              <Text style={styles.typeButtonText}>Scaling</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'Tele-Consultation' && styles.selectedTypeButton,
              ]}
              onPress={() => setType('Tele-Consultation')}>
              <Text style={styles.typeButtonText}>Tele-Consultation</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.scheduleButton]}
              onPress={handleSchedule}>
              <Text style={styles.buttonText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const TimeSlot = ({time, appointment}) => {
  const hour = parseInt(time);
  const formattedTime = `${hour}:00`;
  const endTime = `${hour + 1}:00`;

  return (
    <View style={styles.timeSlotContainer}>
      <Text style={styles.timeText}>{formattedTime}</Text>
      <View style={styles.appointmentContainer}>
        {appointment ? (
          <View
            style={[
              styles.appointmentCard,
              appointment.type === 'Scaling'
                ? styles.scalingCard
                : styles.teleConsultCard,
            ]}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.nameText}>{appointment.name}</Text>
              <Text style={styles.idText}>{appointment.id}</Text>
            </View>
            <View style={styles.appointmentTypeContainer}>
              <Text style={styles.typeText}>{appointment.type}</Text>
              <Text
                style={
                  styles.timeRangeText
                }>{`${formattedTime} - ${endTime}`}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptySlot} />
        )}
      </View>
    </View>
  );
};

const AppointmentScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState({
    9: {name: 'Riya Kumar', id: 'ID: RSVA00426', type: 'Scaling'},
    10: {name: 'Pawan Sathe', id: 'ID: RSVA00426', type: 'Tele-Consultation'},
    12: {name: 'Samaira Jain', id: 'ID: RSVA00426', type: 'Scaling'},
  });

  const handleScheduleAppointment = appointmentData => {
    setAppointments(prev => ({
      ...prev,
      [appointmentData.time]: {
        name: appointmentData.name,
        id: appointmentData.id,
        type: appointmentData.type,
      },
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity>
          <Text style={styles.searchButton}>🔍</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.dateSelector}>
        <Text style={styles.dateText}>
          {format(selectedDate, 'dd MMMM, yyyy')}
        </Text>
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.tabText}>Day (9)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Week (63)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Month (250)</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.timelineContainer}>
        {Array.from({length: 24}, (_, i) => i).map(hour => (
          <TimeSlot
            key={hour}
            time={hour.toString()}
            appointment={appointments[hour.toString()]}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <ScheduleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSchedule={handleScheduleAppointment}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    fontSize: 24,
  },
  searchButton: {
    fontSize: 20,
  },
  dateSelector: {
    backgroundColor: '#E8EAFF',
    padding: 12,
    margin: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#4A4A4A',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2D31FA',
  },
  tabText: {
    color: '#4A4A4A',
    fontWeight: '500',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  timeText: {
    width: 50,
    color: '#4A4A4A',
    fontSize: 14,
  },
  appointmentContainer: {
    flex: 1,
    marginLeft: 16,
  },
  appointmentCard: {
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scalingCard: {
    backgroundColor: '#FFE8E8',
  },
  teleConsultCard: {
    backgroundColor: '#E8FFEA',
  },
  appointmentInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
  },
  idText: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 4,
  },
  appointmentTypeContainer: {
    alignItems: 'flex-end',
  },
  typeText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  timeRangeText: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 4,
  },
  emptySlot: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2D31FA',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#2D31FA',
    borderColor: '#2D31FA',
  },
  typeButtonText: {
    color: 'black',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  scheduleButton: {
    backgroundColor: '#2D31FA',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AppointmentScreen;
