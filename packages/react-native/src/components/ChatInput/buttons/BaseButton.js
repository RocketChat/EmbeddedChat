import React from "react"
import { View } from "react-native"
import Touchable from 'react-native-platform-touchable';
import styles from "../styles"
import { CustomIcon } from "../../CustomIcon"
import { colors } from "../../../lib/constants"
import { useTheme } from "@emotion/react"

const BaseButton = ({ accessibilityLabel, icon, color, ...props }) => {
	const theme = useTheme();
	return (
		<Touchable
      style={[styles.actionButton]}
      {...props}>
			<View
				accessible
				accessibilityLabel={accessibilityLabel}
				accessibilityRole="button"
			>
				<CustomIcon
					name={icon}
					size={24}
					color={color || colors[theme.palette.mode].auxiliaryTintColor}
				/>
			</View>
			</Touchable>
	)
}

export default BaseButton
