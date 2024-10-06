import { useTheme } from "@emotion/react"
import React from "react"
import { colors } from "../../../lib/constants";
import BaseButton from "./BaseButton"

const SendButton = ({ onPress }) => {
	const theme = useTheme();
	return (
		<BaseButton
			onPress={onPress}
			accessibilityLabel="Send_message"
			icon="send-filled"
			color={colors[theme.palette.mode].tintColor}
		/>
	)
}

export default SendButton
