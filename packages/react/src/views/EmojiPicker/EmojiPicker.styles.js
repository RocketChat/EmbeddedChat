import { css } from '@emotion/react';
import { alpha, lighten, darken } from '@embeddedchat/ui-elements';

const getEmojiPickerStyles = ({ theme, mode }) => {
  const calculatedColors =
    mode === 'light'
      ? darken(theme.colors.background, 0.03)
      : lighten(theme.colors.background, 1);
  const styles = {
    emojiPicker: css`
      .EmojiPickerReact {
        --epr-bg-color: ${theme.colors.background};
        --epr-text-color: ${theme.colors.foreground};
        --epr-picker-border-color: ${theme.colors.border};
        --epr-category-label-bg-color: ${theme.colors.background};
        --epr-category-icon-active-color: ${theme.colors.secondary};
        --epr-emoji-size: 20px;
        --epr-category-navigation-button-size: 20px;
        --epr-emoji-gap: 10px;

        --epr-hover-bg-color: ${calculatedColors};
        --epr-highlight-color: ${calculatedColors};
        --epr-focus-bg-color: ${calculatedColors};
        --epr-horizontal-padding: 10px;
        --epr-picker-border-radius: ${theme.radius};
        --epr-search-border-color: var(--epr-highlight-color);
        --epr-header-padding: 15px var(--epr-horizontal-padding);
        --epr-active-skin-tone-indicator-border-color: var(
          --epr-highlight-color
        );
        --epr-active-skin-hover-color: var(--epr-hover-bg-color);
        --epr-search-input-bg-color-active: var(--epr-search-input-bg-color);
        --epr-search-input-padding: 0 30px;
        --epr-search-input-border-radius: ${theme.radius};
        --epr-search-input-height: 40px;
        --epr-search-input-text-color: var(--epr-text-color);
        --epr-search-input-placeholder-color: var(--epr-text-color);
        --epr-search-bar-inner-padding: var(--epr-horizontal-padding);
        --epr-emoji-variation-picker-height: 45px;
        --epr-emoji-variation-picker-bg-color: var(--epr-bg-color);
        --epr-preview-height: 70px;
        --epr-preview-text-size: 14px;
        --epr-preview-text-padding: 0 var(--epr-horizontal-padding);
        --epr-preview-border-color: var(--epr-picker-border-color);
        --epr-preview-text-color: var(--epr-text-color);
        --epr-category-padding: 0 var(--epr-horizontal-padding);
        --epr-category-label-text-color: var(--epr-text-color);
        --epr-category-label-padding: 0 var(--epr-horizontal-padding);
        --epr-category-label-height: 40px;

        --epr-emoji-padding: 5px;
        --epr-emoji-fullsize: calc(
          var(--epr-emoji-size) + var(--epr-emoji-padding) * 2
        );
        --epr-emoji-hover-color: var(--epr-hover-bg-color);
        --epr-emoji-variation-indicator-color: var(--epr-picker-border-color);
        --epr-emoji-variation-indicator-color-hover: var(--epr-text-color);
        --epr-header-overlay-z-index: 3;
        --epr-emoji-variations-indictator-z-index: 1;
        --epr-category-label-z-index: 2;
        --epr-skin-variation-picker-z-index: 5;
        --epr-preview-z-index: 6;

        /* Use these properties of color if needed ->

      --epr-shadow: 'theme-color';
      --epr-search-input-bg-color: 'theme-color';
      --epr-skin-tone-picker-menu-color: 'theme-color';
      --epr-dark: 'theme-color'
      --epr-dark-emoji-variation-picker-bg-color: var(--epr-dark);
      --epr-dark-highlight-color: silver;
      --epr-dark-text-color: var(--epr-highlight-color);
      --epr-dark-hover-bg-color: 'theme-color';
      --epr-dark-focus-bg-color: 'theme-color';
      --epr-dark-search-input-bg-color: 'theme-color';
      --epr-dark-category-label-bg-color:'theme-color';
      --epr-dark-picker-border-color: 'theme-color';
      --epr-dark-bg-color: 'theme-color';
      --epr-dark-search-input-bg-color-active: var(--epr-dark);
      --epr-dark-emoji-variation-indicator-color: 'theme-color';
      --epr-dark-category-icon-active-color:'theme-color';
      --epr-dark-skin-tone-picker-menu-color: 'theme-color';
      */
      }

      .EmojiPickerReact li.epr-emoji-category > .epr-emoji-category-label {
        font-size: 12px;
      }

      .EmojiPickerReact.epr-dark-theme {
        /* We are not using dark mode option provided by emoji picker, 
      all the colors for both light and dark mode is defined above*/
      }

      .EmojiPickerReact .epr-body::-webkit-scrollbar,
      .EmojiPickerReact .epr-emoji-list::-webkit-scrollbar {
        width: 4px;
        height: 7.7px;
      }

      .EmojiPickerReact .epr-body::-webkit-scrollbar-thumb,
      .EmojiPickerReact .epr-emoji-list::-webkit-scrollbar-thumb {
        background: ${alpha(theme.colors.primary, 0.5)};
        border-radius: 4px;
      }

      .EmojiPickerReact .epr-body::-webkit-scrollbar-thumb:hover,
      .EmojiPickerReact .epr-emoji-list::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.primary};
      }
    `,
  };

  return styles;
};

export default getEmojiPickerStyles;
