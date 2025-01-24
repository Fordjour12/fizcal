import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import RecentTransactions from '@/components/RecentTransactions';

type TimeFrame = 'week' | 'month' | 'year';

interface TimeFrameData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

export default function Reports() {
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('week');

  // Sample data - Replace with actual data from your backend
  const timeFrameData: Record<TimeFrame, TimeFrameData> = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [250, 320, 280, 400, 290, 350, 300]
      }]
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        data: [1200, 1400, 1100, 1300]
      }]
    },
    year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        data: [4500, 4200, 4800, 4300, 4600, 4700, 4400, 4900, 4200, 4600, 4700, 4800]
      }]
    }
  };

  const stats = {
    totalSpent: 4800,
    avgPerDay: 160,
    topCategory: 'Shopping',
    mostExpensive: 420
  };

  const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={24} color="#8A7CFF" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Report</Text>
        <View style={styles.timeFrameSelector}>
          {(['week', 'month', 'year'] as TimeFrame[]).map((timeFrame) => (
            <TouchableOpacity
              key={timeFrame}
              style={[
                styles.timeFrameButton,
                activeTimeFrame === timeFrame && styles.activeTimeFrameButton,
              ]}
              onPress={() => setActiveTimeFrame(timeFrame)}
            >
              <Text
                style={[
                  styles.timeFrameButtonText,
                  activeTimeFrame === timeFrame && styles.activeTimeFrameButtonText,
                ]}
              >
                {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={timeFrameData[activeTimeFrame]}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#1a1a1a',
            backgroundGradientFrom: '#1a1a1a',
            backgroundGradientTo: '#1a1a1a',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(138, 124, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#8A7CFF',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Spent"
          value={`$${stats.totalSpent}`}
          icon="wallet-outline"
        />
        <StatCard
          title="Avg per Day"
          value={`$${stats.avgPerDay}`}
          icon="trending-up-outline"
        />
        <StatCard
          title="Top Category"
          value={stats.topCategory}
          icon="pie-chart-outline"
        />
        <StatCard
          title="Largest Expense"
          value={`$${stats.mostExpensive}`}
          icon="alert-circle-outline"
        />
      </View>

      <View style={styles.transactionList}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {/* Add your transaction list items here */}
<RecentTransactions/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  timeFrameSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeTimeFrameButton: {
    backgroundColor: '#8A7CFF',
  },
  timeFrameButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTimeFrameButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginHorizontal: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    width: (Dimensions.get('window').width - 48) / 2,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  transactionList: {
    padding: 16,
  },
});