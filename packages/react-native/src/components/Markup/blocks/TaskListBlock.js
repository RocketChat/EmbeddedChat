import React from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";
import InlineElements from "../elements/InlineElements";
import { useTheme } from "@emotion/react";
import styles from "../styles";
import { colors } from "../../../lib/constants";

const TaskListBlock = ({ value }) => {
	const theme = useTheme();
	return (
		<View>
			{value.map((item, index) => (
				<View style={styles.row} key={index}>
					<Text
						style={[
							styles.text,
							{ color: colors[theme.palette.mode].bodyText },
						]}
					>
						{item.status ? "- [x] " : "- [ ] "}
					</Text>
					<Text
						style={[
							styles.inline,
							{ color: colors[theme.palette.mode].bodyText },
						]}
					>
						<InlineElements value={item.value} />
					</Text>
				</View>
			))}
		</View>
	);
};

export default TaskListBlock;

TaskListBlock.propTypes = {
	value: PropTypes.arrayOf(PropTypes.object),
};
