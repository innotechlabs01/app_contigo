import { View, Text, StyleSheet } from 'react-native';
import { spacing, radius, shadow } from '@/src/theme/spacing';
import { statusColors, statusLabels } from '@/src/theme/status';
import type { ServiceRequest } from '@/src/types';

interface RequestCardProps {
  item: ServiceRequest;
  surfaceColor: string;
  subtitleColor: string;
  showDetails?: boolean;
}

export function RequestCard({
  item,
  surfaceColor,
  subtitleColor,
  showDetails = false,
}: RequestCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: surfaceColor }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.service_type}</Text>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: statusColors[item.status] + '20' },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
            {statusLabels[item.status]}
          </Text>
        </View>
      </View>
      <Text style={[styles.cardSubtitle, { color: subtitleColor }]}>
        {item.full_name}
      </Text>
      <Text style={[styles.cardDate, { color: subtitleColor }]}>
        {item.preferred_date}
      </Text>
      {showDetails && (
        <>
          <Text style={[styles.cardDate, { color: subtitleColor }]}>
            Direccion: {item.address}
          </Text>
          {item.notes ? (
            <Text style={[styles.cardNotes, { color: subtitleColor }]}>
              Notas: {item.notes}
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadow.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  cardSubtitle: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  cardDate: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  cardNotes: {
    fontSize: 12,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});
