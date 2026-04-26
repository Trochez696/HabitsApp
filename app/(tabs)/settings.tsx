import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    Preferences,
    getPreferences,
    updateShowAlerts,
    updateSortBy,
    updateTheme,
} from '@/service/database';
import { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [manualTheme, setManualTheme] = useState<string>('system');

  const loadPreferences = useCallback(async () => {
    try {
      const prefs = await getPreferences();
      setPreferences(prefs);
      setManualTheme(prefs.theme);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const handleThemeChange = async (theme: string) => {
    try {
      await updateTheme(theme);
      setManualTheme(theme);
      await loadPreferences();
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const handleShowAlertsChange = async (value: boolean) => {
    try {
      await updateShowAlerts(value ? 1 : 0);
      await loadPreferences();
    } catch (error) {
      console.error('Error updating showAlerts:', error);
    }
  };

  const handleSortByChange = async (sortBy: string) => {
    try {
      await updateSortBy(sortBy);
      await loadPreferences();
    } catch (error) {
      console.error('Error updating sortBy:', error);
    }
  };

  const ThemeOption = ({ label, value, currentValue }: { label: string, value: string, currentValue: string }) => (
    <TouchableOpacity
      style={[
        styles.themeOption,
        currentValue === value && styles.themeOptionSelected
      ]}
      onPress={() => handleThemeChange(value)}
    >
      <Text style={[
        styles.themeOptionText,
        currentValue === value && styles.themeOptionTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SortOption = ({ label, value }: { label: string, value: string }) => (
    <TouchableOpacity
      style={[
        styles.sortOption,
        preferences?.sortBy === value && styles.sortOptionSelected
      ]}
      onPress={() => handleSortByChange(value)}
    >
      <Text style={[
        styles.sortOptionText,
        preferences?.sortBy === value && styles.sortOptionTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (!preferences) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Cargando...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Configuración
      </ThemedText>

      {/* Sección: Tema */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Tema
        </ThemedText>
        
        <View style={styles.themeOptions}>
          <ThemeOption label="Claro" value="light" currentValue={manualTheme} />
          <ThemeOption label="Oscuro" value="dark" currentValue={manualTheme} />
          <ThemeOption label="Sistema" value="system" currentValue={manualTheme} />
        </View>
      </ThemedView>

      {/* Sección: Alertas */}
      <ThemedView style={styles.section}>
        <View style={styles.settingRow}>
          <ThemedText>Mostrar alertas</ThemedText>
          <Switch
            value={preferences.showAlerts === 1}
            onValueChange={handleShowAlertsChange}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor="#f4f3f4"
          />
        </View>
      </ThemedView>

      {/* Sección: Ordenar hábitos */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Ordenar hábitos por
        </ThemedText>
        
        <View style={styles.sortOptions}>
          <SortOption label="Nombre" value="name" />
          <SortOption label="Fecha" value="date" />
          <SortOption label="Estado" value="status" />
        </View>
      </ThemedView>

      {/* Información de la app */}
      <ThemedView style={styles.infoSection}>
        <ThemedText style={styles.infoText}>
          Habit Tracker v1.0.0
        </ThemedText>
        <ThemedText style={styles.infoText}>
          Base de datos SQLite
        </ThemedText>
      </ThemedView>
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
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  themeOptionSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  themeOptionText: {
    fontSize: 14,
  },
  themeOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortOption: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  sortOptionSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  sortOptionText: {
    fontSize: 14,
  },
  sortOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoSection: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
});