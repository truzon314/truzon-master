import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

import { StyleProp, ViewStyle } from 'react-native';

export const Select = ({
  label,
  placeholder = 'Select an option',
  value,
  onValueChange,
  options,
  error,
  helperText,
  style,
  containerStyle,
  disabled = false,
}: SelectProps) => {
  const { colors, spacing, typography } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const borderColor = error
    ? colors.error.DEFAULT
    : isFocused
    ? colors.primary[600]
    : colors.border.DEFAULT;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>}
      <View style={[styles.selectWrapper, { borderColor, borderWidth: isFocused || error ? 2 : 1 }]}>
        <TouchableOpacity
          onPress={() => !disabled && setIsFocused(true)}
          disabled={disabled}
          style={styles.selectInner}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.selectText,
              {
                color: value ? colors.text.primary : colors.text.tertiary,
                opacity: disabled ? 0.6 : 1,
              },
            ]}
          >
            {value ? options.find((o) => o.value === value)?.label : placeholder}
          </Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={[styles.errorText, { color: colors.error.DEFAULT }]}>{error}</Text>}
      {helperText && !error && <Text style={[styles.helperText, { color: colors.text.tertiary }]}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 8 },
  label: { fontSize: 14, fontFamily: 'WorkSans_500Medium', marginBottom: 8 },
  selectWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  selectText: { fontSize: 16, fontFamily: 'WorkSans_400Regular', flex: 1 },
  errorText: { fontSize: 12, fontFamily: 'WorkSans_400Regular', marginTop: 6, marginLeft: 4 },
  helperText: { fontSize: 12, fontFamily: 'WorkSans_400Regular', marginTop: 6, marginLeft: 4 },
});

import React from 'react';