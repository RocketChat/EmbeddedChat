import React from "react"
import { Platform, View } from "react-native"
import { ActionsButton, SendButton } from "./buttons"
import styles from "./styles"

const RightButtons = React.memo(
	({ showSend, submit, showMessageBoxActions, isActionsEnabled }) => {
		const isIOS = Platform.OS === 'ios';
		if (showSend) {
			return <SendButton onPress={submit} />
		}
		if (isActionsEnabled) {
			return <ActionsButton onPress={showMessageBoxActions} />
		}
		return !isIOS ? <View style={styles.buttonsWhitespace} /> : null
	}
)

RightButtons.displayName = 'RightButtons'

export default RightButtons
