import { View, Text, StyleSheet } from 'react-native';
import { spacing, radius } from '@/src/theme/spacing';

interface StatCardProps {
  value: number;
  label: string;
  color: string;
}

export function StatCard({ value, label, color }: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  value: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  label: { fontSize: 12, color: '#FFFFFF', marginTop: spacing.xs },
});
