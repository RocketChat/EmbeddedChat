import React from "react"

import BaseButton from "./BaseButton"

const CancelEditingButton = ({ onPress }) => (
	<BaseButton
		onPress={onPress}
		accessibilityLabel="Cancel_editing"
		icon="close"
	/>
)

export default CancelEditingButton
