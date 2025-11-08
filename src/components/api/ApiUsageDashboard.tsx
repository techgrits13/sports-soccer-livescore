import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ApiUsageService } from '@/services/apiUsageService';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ApiUsageDashboard = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        setLoading(true);
        const data = await ApiUsageService.getSportMonksQuota();
        setUsage(data);
        setError(null);
      } catch (err) {
        setError('Failed to load API usage data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchUsage, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: colors.text }]}>Loading API usage...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.tint }]}>API Usage Dashboard</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {usage?.requestsToday || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Requests Today</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {usage?.dailyLimit || 3000}
          </Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Daily Limit</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={[
            styles.statValue, 
            { 
              color: usage && usage.requestsToday > usage.dailyLimit * 0.9 
                ? colors.error 
                : colors.success 
            }
          ]}>
            {Math.round(((usage?.requestsToday || 0) / (usage?.dailyLimit || 3000)) * 100)}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Usage</Text>
        </View>
      </View>
      
      <Text style={[styles.footer, { color: colors.text }]}>
        Resets daily at midnight UTC
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  text: {
    textAlign: 'center',
  },
});

export default ApiUsageDashboard;
