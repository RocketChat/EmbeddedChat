import React from "react"
import { Text } from "react-native"

import shortnameToUnicode from "../../../lib/shortnameToUnicode"
import styles from "../styles";
import { useTheme } from "@emotion/react"
import { colors } from "../../../lib/constants"

// TODO: Support for custom Emoji

const Emoji = ({ block, isBigEmoji }) => {
  const theme = useTheme();

  if ("unicode" in block) {
    return (
      <Text
        style={[
          { color: colors[theme.palette.mode].bodyText },
          isBigEmoji ? styles.textBig : styles.text
        ]}
      >
        {block.unicode}
      </Text>
    )
  }
  const emojiToken = block?.shortCode
    ? `:${block.shortCode}:`
    : `:${block.value?.value}:`
  const emojiUnicode = shortnameToUnicode(emojiToken)

  return (
    <Text
      style={[
        { color: colors[theme.palette.mode].bodyText },
        isBigEmoji && emojiToken !== emojiUnicode ? styles.textBig : styles.text
      ]}
    >
      {emojiUnicode}
    </Text>
  )
}

export default Emoji
