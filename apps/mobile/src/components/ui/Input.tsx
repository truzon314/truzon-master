import { StyleSheet, View, Text, TouchableOpacity, TextInput, StyleProp, ViewStyle, TextStyle } from 'react-native';
import React, { forwardRef, useState, ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<TextStyle>;
  name?: string;
  secureTextEntry?: boolean;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'visible-password';
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  autoComplete?: 'none' | 'username' | 'password' | 'email' | 'name' | 'tel' | 'street-address' | 'postal-code' | 'cc-number' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'off' | 'one-time-code' | 'new-password' | 'postal-address-country' | 'postal-address-locality' | 'postal-address-region' | 'username-email';
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  editable?: boolean;
  disabled?: boolean;
  selectionColor?: string;
  placeholderTextColor?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  type?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerStyle,
      inputStyle,
      labelStyle,
      name,
      type: _type,
      secureTextEntry = false,
      style,
      ...textInputProps
    },
    ref
  ) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
      ? colors.error.DEFAULT
      : isFocused
      ? colors.primary[600]
      : colors.border.DEFAULT;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: colors.text.secondary }, labelStyle]}>
            {label}
          </Text>
        )}
        <View
          style={[
            styles.inputWrapper,
            { borderColor, borderWidth: isFocused || error ? 2 : 1 },
          ]}
        >
          {leftIcon && (
            <View style={styles.iconContainer}>
              {React.isValidElement(leftIcon)
                ? React.cloneElement(leftIcon as React.ReactElement, { color: isFocused ? colors.primary[600] : colors.text.tertiary } as any)
                : leftIcon}
            </View>
          )}
          <TextInput
            ref={ref}
            {...(textInputProps as any)}
            secureTextEntry={secureTextEntry}
            onFocus={() => { setIsFocused(true); textInputProps.onFocus?.(); }}
            onBlur={() => { setIsFocused(false); textInputProps.onBlur?.(); }}
            style={[
              styles.input,
              { color: colors.text.primary, paddingLeft: leftIcon ? 0 : 0 },
              style,
              inputStyle,
            ]}
            placeholderTextColor={colors.text.tertiary}
            selectionColor={colors.primary[600]}
          />
          {rightIcon && (
            <View style={styles.iconContainer}>
              {React.isValidElement(rightIcon)
                ? React.cloneElement(rightIcon as React.ReactElement, { color: colors.text.tertiary } as any)
                : rightIcon}
            </View>
          )}
        </View>
        {error && <Text style={[styles.errorText, { color: colors.error.DEFAULT }]}>{error}</Text>}
        {helperText && !error && <Text style={[styles.helperText, { color: colors.text.tertiary }]}>{helperText}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 8 },
  label: { fontSize: 14, fontFamily: 'WorkSans_500Medium', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
  },
  input: { flex: 1, fontSize: 16, fontFamily: 'WorkSans_400Regular', paddingVertical: 16 },
  iconContainer: { paddingHorizontal: 8 },
  errorText: { fontSize: 12, fontFamily: 'WorkSans_400Regular', marginTop: 6, marginLeft: 4 },
  helperText: { fontSize: 12, fontFamily: 'WorkSans_400Regular', marginTop: 6, marginLeft: 4 },
});

export interface TextareaProps extends InputProps {
  numberOfLines?: number;
}

export const Textarea = forwardRef<TextInput, TextareaProps>(
  ({ label, error, helperText, numberOfLines = 4, containerStyle, inputStyle, labelStyle, leftIcon, rightIcon, type: _type, style, ...textInputProps }, ref) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
      ? colors.error.DEFAULT
      : isFocused
      ? colors.primary[600]
      : colors.border.DEFAULT;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: colors.text.secondary }, labelStyle]}>
            {label}
          </Text>
        )}
        <View
          style={[
            textareaStyles.textareaWrapper,
            { borderColor, borderWidth: isFocused || error ? 2 : 1 },
          ]}
        >
          <TextInput
            ref={ref}
            {...(textInputProps as any)}
            multiline
            numberOfLines={numberOfLines}
            onFocus={() => { setIsFocused(true); textInputProps.onFocus?.(); }}
            onBlur={() => { setIsFocused(false); textInputProps.onBlur?.(); }}
            style={[
              textareaStyles.textarea,
              { color: colors.text.primary },
              style,
              inputStyle,
            ]}
            placeholderTextColor={colors.text.tertiary}
            selectionColor={colors.primary[600]}
            textAlignVertical="top"
          />
        </View>
        {error && <Text style={[styles.errorText, { color: colors.error.DEFAULT }]}>{error}</Text>}
        {helperText && !error && <Text style={[styles.helperText, { color: colors.text.tertiary }]}>{helperText}</Text>}
      </View>
    );
  }
);

Textarea.displayName = 'Textarea';

const textareaStyles = StyleSheet.create({
  textareaWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textarea: { fontSize: 16, fontFamily: 'WorkSans_400Regular', minHeight: 100 },
});
