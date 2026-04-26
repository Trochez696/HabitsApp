import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  Habit,
  addHabit,
  deleteHabit,
  getAllHabits,
  toggleHabitCompletion,
} from '@/service/database';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HabitsScreen() {
  const colorScheme = useColorScheme();
  const [habits, setHabits] = useState<Habit[]>([]);2
  const [newHabitName, setNewHabitName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadHabits = useCallback(async () => {
    try {
      const data = await getAllHabits();
      setHabits(data);
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  }, [loadHabits]);

  const handleAddHabit = async () => {
    if (newHabitName.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un nombre para el hábito');
      return;
    }

    try {
      await addHabit(newHabitName.trim());
      setNewHabitName('');
      await loadHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
      Alert.alert('Error', 'No se pudo agregar el hábito');
    }
  };

  const handleToggleHabit = async (id: number, completed: number) => {
    try {
      await toggleHabitCompletion(id, completed === 0 ? 1 : 0);
      await loadHabits();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const handleDeleteHabit = (id: number) => {
    Alert.alert(
      'Eliminar Hábito',
      '¿Estás seguro de que quieres eliminar este hábito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabit(id);
              await loadHabits();
            } catch (error) {
              console.error('Error deleting habit:', error);
            }
          },
        },
      ]
    );
  };

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <ThemedView style={styles.habitItem}>
      <TouchableOpacity
        style={styles.habitContent}
        onPress={() => handleToggleHabit(item.id, item.completed)}
        onLongPress={() => handleDeleteHabit(item.id)}
      >
        <View style={[
          styles.checkbox,
          item.completed === 1 && styles.checkboxChecked
        ]}>
          {item.completed === 1 && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
        <ThemedText style={[
          styles.habitName,
          item.completed === 1 && styles.habitCompleted
        ]}>
          {item.name}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Mis Hábitos
      </ThemedText>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nuevo hábito..."
          placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
          value={newHabitName}
          onChangeText={setNewHabitName}
          onSubmitEditing={handleAddHabit}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        renderItem={renderHabitItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>
            No hay hábitos aún. ¡Agrega uno!
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  habitItem: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  habitName: {
    fontSize: 16,
    flex: 1,
  },
  habitCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    opacity: 0.6,
  },
});
