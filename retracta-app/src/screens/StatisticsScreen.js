import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function StatisticsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estatísticas</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumo dos Últimos 7 Dias</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Retrações por chuva:</Text>
          <Text style={styles.statValue}>4</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Dias com chuva:</Text>
          <Text style={styles.statValue}>2</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Horas ao ar livre (média):</Text>
          <Text style={styles.statValue}>12h / dia</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EAF0FE',
    padding: 16,
  },
  title: {
    fontFamily: 'LexendGiga_700Bold',
    fontSize: 20,
    color: '#004AAD',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'LexendGiga_700Bold',
    fontSize: 14,
    color: '#004AAD',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
    statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#545454',
  },
  statValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#000000',
  },
});