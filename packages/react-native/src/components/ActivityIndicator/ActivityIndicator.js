import { useTheme } from "@emotion/react"
import React from "react"
import { ActivityIndicator, StyleSheet } from "react-native"
import { colors } from "../../lib/constants"
import useComponentOverrides from "../../theme/useComponentOverrides"

const styles = StyleSheet.create({
	indicator: {
		padding: 16,
		flex: 1
	},
	absolute: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center"
	}
})

const ECActivityIndicator = ({ absolute, ...props }) => {
	const { styleOverrides } = useComponentOverrides('ActivityIndicator');
	const theme = useTheme();
	return (
		<ActivityIndicator
			style={[styles.indicator, absolute && styles.absolute, styleOverrides]}
			color={colors[theme.palette.mode].auxiliaryText}
			{...props}
		/>
	)
}

export default ECActivityIndicator
