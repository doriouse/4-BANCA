import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function StatisticsScreen() {
  const [filter, setFilter] = useState('7d'); // '7d', '1m', '12m'

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estatísticas e Histórico</Text>

      {/* Seletor de Período */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === '7d' && styles.filterActive]} 
          onPress={() => setFilter('7d')}>
          <Text style={[styles.filterText, filter === '7d' && styles.filterTextActive]}>Últimos 7 Dias</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === '1m' && styles.filterActive]} 
          onPress={() => setFilter('1m')}>
          <Text style={[styles.filterText, filter === '1m' && styles.filterTextActive]}>Último Mês</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === '12m' && styles.filterActive]} 
          onPress={() => setFilter('12m')}>
          <Text style={[styles.filterText, filter === '12m' && styles.filterTextActive]}>12 Meses</Text>
        </TouchableOpacity>
      </View>

      {/* Card de Indicadores */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {filter === '7d' ? 'Resumo dos Últimos 7 Dias' : filter === '1m' ? 'Resumo do Último Mês' : 'Resumo Anual (12 Meses)'}
        </Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Retrações por chuva:</Text>
          <Text style={styles.statValue}>{filter === '7d' ? '4' : filter === '1m' ? '18' : '142'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Dias com chuva:</Text>
          <Text style={styles.statValue}>{filter === '7d' ? '2' : filter === '1m' ? '8' : '65'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Horas ao ar livre (média):</Text>
          <Text style={styles.statValue}>12h / dia</Text>
        </View>
      </View>

      {/* Representação Visual de Gráfico */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Desempenho de Exposição</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: '80%' }]} />
            <Text style={styles.chartLabel}>Seg</Text>
          </View>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: '60%' }]} />
            <Text style={styles.chartLabel}>Ter</Text>
          </View>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: '90%' }]} />
            <Text style={styles.chartLabel}>Qua</Text>
          </View>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: '40%' }]} />
            <Text style={styles.chartLabel}>Qui</Text>
          </View>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: '70%' }]} />
            <Text style={styles.chartLabel}>Sex</Text>
          </View>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: '85%' }]} />
            <Text style={styles.chartLabel}>Sáb</Text>
          </View>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: '95%' }]} />
            <Text style={styles.chartLabel}>Dom</Text>
          </View>
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterActive: {
    backgroundColor: '#004AAD',
  },
  filterText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#545454',
  },
  filterTextActive: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
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
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  chartBarWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 16,
    backgroundColor: '#38B6FF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#545454',
    marginTop: 6,
  },
});