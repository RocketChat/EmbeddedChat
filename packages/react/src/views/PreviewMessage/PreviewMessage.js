import React from 'react'
import getQuoteMessageStyles from '../QuoteMessage/QuoteMessage.styles'
import { useComponentOverrides, useTheme, Box } from '@embeddedchat/ui-elements'
import { Markup } from '@embeddedchat/markups/src'

const PreviewMessage = ({ className = '', style = {}, message }) => {
    const { theme } = useTheme();
    const styles = getQuoteMessageStyles(theme);
    const { classNames, styleOverrides } = useComponentOverrides('QuoteMessage');
  return (
    <Box
    className={`ec-quote-msg ${className} ${classNames}`}
    style={{ ...styleOverrides, ...style }}
    css={styles.messageContainer}
    >
    <Markup tokens={message} />
    </Box>
  )
}

export default PreviewMessage
