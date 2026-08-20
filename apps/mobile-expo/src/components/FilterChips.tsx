import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { spacing, radius } from '@/src/theme/spacing';

interface FilterChipsProps {
  filters: readonly string[];
  active: string;
  onSelect: (filter: string) => void;
  activeColor: string;
  surfaceVariantColor: string;
  onSurfaceVariantColor: string;
  onPrimaryColor: string;
}

export function FilterChips({
  filters,
  active,
  onSelect,
  activeColor,
  surfaceVariantColor,
  onSurfaceVariantColor,
  onPrimaryColor,
}: FilterChipsProps) {
  return (
    <FlatList
      horizontal
      data={filters as unknown as string[]}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.chip,
            {
              backgroundColor:
                active === item ? activeColor : surfaceVariantColor,
            },
          ]}
          onPress={() => onSelect(item)}
        >
          <Text
            style={[
              styles.chipText,
              {
                color: active === item ? onPrimaryColor : onSurfaceVariantColor,
              },
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.list}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
