import { useTheme } from "@emotion/react"
import React from "react"
import { Text } from "react-native"
import { colors } from "../../../lib/constants"

import styles from "../styles"

const CodeLine = ({ value }) => {
	const theme = useTheme()
	if (value.type !== "PLAIN_TEXT") {
		return null
	}

	return (
		<Text style={[styles.codeBlockText, { color: colors[theme.palette.mode].bodyText }]}>
			{value.value}
		</Text>
	)
}

export default CodeLine
