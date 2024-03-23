import { useTheme } from "@emotion/react"
import React from "react"
import { StyleSheet, Text } from "react-native"
import Touchable from "react-native-platform-touchable"
import useComponentOverrides from "../../theme/useComponentOverrides"
import { ActivityIndicator } from "../ActivityIndicator"
import { sharedStyles } from "../Styles"

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    justifyContent: "center",
    height: 48,
    borderRadius: 4,
    marginBottom: 12
  },
  text: {
    ...sharedStyles.textMedium,
    ...sharedStyles.textAlignCenter
  },
  disabled: {
    opacity: 0.3
  }
})

const Button = ({
  disabled = false,
  loading = false,
  fontSize = 16,
  title,
  onPress,
  color,
  style,
  styleText,
  ...otherProps
}) => {
  const theme = useTheme()
  const { styleOverrides } = useComponentOverrides('Button', style);
  const textColor = theme.palette?.[color]?.contrastText;
  const backgroundColor = theme.palette?.[color]?.main;
  return (
    <Touchable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        { backgroundColor },
        disabled && styles.disabled,
        styleOverrides,
      ]}
      accessibilityLabel={title}
      {...otherProps}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          style={[styles.text, { color: textColor, fontSize }, styleText]}
          accessibilityLabel={title}
        >
          {title}
        </Text>
      )}
    </Touchable>
  )
}

export default Button
