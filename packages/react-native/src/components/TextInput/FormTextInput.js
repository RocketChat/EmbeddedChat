import { useTheme } from "@emotion/react"
import React, { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Touchable from "react-native-platform-touchable"
import { colors } from "../../lib/constants"
import ActivityIndicator from "../ActivityIndicator"
import { CustomIcon } from "../CustomIcon"
import { sharedStyles } from "../Styles"
import TextInput from "./TextInput";

const styles = StyleSheet.create({
	error: {
		...sharedStyles.textAlignCenter,
		paddingTop: 5
	},
	inputContainer: {
		marginBottom: 10
	},
	label: {
		marginBottom: 10,
		fontSize: 14,
		...sharedStyles.textSemibold
	},
	input: {
		...sharedStyles.textRegular,
		height: 48,
		fontSize: 16,
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderWidth: 1,
		borderRadius: 4
	},
	inputIconLeft: {
		paddingLeft: 45
	},
	inputIconRight: {
		paddingRight: 45
	},
	wrap: {
		position: "relative",
		justifyContent: "center"
	},
	iconContainer: {
		position: "absolute"
	},
	iconLeft: {
		left: 12
	},
	iconRight: {
		right: 12
	}
})

const FormTextInput = ({
	label,
	error,
	loading,
	containerStyle,
	inputStyle,
	inputRef,
	iconLeft,
	iconRight,
	onClearInput,
	value,
	left,
	testID,
	secureTextEntry,
	placeholder,
	rows,
	...inputProps
}) => {
	const theme = useTheme()
	const [showPassword, setShowPassword] = useState(false)
	const showClearInput = onClearInput && value && value.length > 0
	return (
		<View style={[styles.inputContainer, containerStyle]}>
			{label ? (
				<Text
					style={[
						styles.label,
						{ color: colors[theme.palette.mode].titleText },
						error?.error && { color: colors[theme.palette.mode].dangerColor }
					]}
				>
					{label}
				</Text>
			) : null}

			<View style={styles.wrap}>
				<TextInput
					style={[
						styles.input,
						iconLeft && styles.inputIconLeft,
						(secureTextEntry || iconRight || showClearInput) &&
						styles.inputIconRight,
						{
							backgroundColor: colors.backgroundColor,
							borderColor: colors.separatorColor,
							color: colors.titleText
						},
						error?.error && {
							color: colors.dangerColor,
							borderColor: colors.dangerColor
						},
						inputStyle
					]}
					// @ts-ignore ref error
					ref={inputRef}
					autoCorrect={false}
					autoCapitalize="none"
					underlineColorAndroid="transparent"
					secureTextEntry={secureTextEntry && !showPassword}
					testID={testID}
					accessibilityLabel={placeholder}
					placeholder={placeholder}
					value={value}
					rows={rows}
					{...inputProps}
				/>

				{iconLeft ? (
					<CustomIcon
						name={iconLeft}
						size={20}
						color={colors.auxiliaryText}
						style={[styles.iconContainer, styles.iconLeft]}
					/>
				) : null}

				{showClearInput ? (
					<Touchable
						onPress={onClearInput}
						style={[styles.iconContainer, styles.iconRight]}
					>
						<CustomIcon
							name="input-clear"
							size={20}
							color={colors.auxiliaryTintColor}
						/>
					</Touchable>
				) : null}

				{iconRight && !showClearInput ? (
					<CustomIcon
						name={iconRight}
						testID={testID ? `${testID}-icon-right` : undefined}
						size={20}
						color={colors.bodyText}
						style={[styles.iconContainer, styles.iconRight]}
					/>
				) : null}

				{secureTextEntry ? (
					<Touchable
						onPress={() => setShowPassword(!showPassword)}
						style={[styles.iconContainer, styles.iconRight]}
					>
						<CustomIcon
							name={showPassword ? "unread-on-top" : "unread-on-top-disabled"}
							size={20}
							color={colors.auxiliaryText}
						/>
					</Touchable>
				) : null}

				{loading ? (
					<ActivityIndicator
						style={[styles.iconContainer, styles.iconRight]}
						color={colors[theme.palette.mode].bodyText}
						testID={testID ? `${testID}-loading` : undefined}
					/>
				) : null}
				{left}
			</View>
			{error && error.reason ? (
				<Text style={[styles.error, { color: colors[theme.palette.mode].dangerColor }]}>
					{error.reason}
				</Text>
			) : null}
		</View>
	)
}

export default FormTextInput;
