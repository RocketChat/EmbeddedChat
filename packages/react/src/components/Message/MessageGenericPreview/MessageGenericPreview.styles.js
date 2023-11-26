// // MessageGenericPreview.styles.js
// import { css } from '@emotion/react';
// import {
//   theme,
//   lengths,
//   colors,
//   typography,
//   mixins,
//   rich,
// } from '../../../styles'; // Adjust the path based on your project structure

// const { borderTheme, fontTheme, surfaceTheme } = theme;

// const messageGenericPreviewStyles = css`
//   .rcx-message-generic-preview {
//     display: flex;
//     overflow: hidden;
//     flex-direction: column;

//     color: ${fontTheme('secondary-info')};

//     border: ${borderTheme('default')} solid ${borderTheme('extra-light')};
//     border-radius: ${lengths('medium')};
//     background-color: ${surfaceTheme('tint')};

//     font-size: 0;

//     &__content {
//       display: flex;
//       flex-direction: row;
//       font-size: 0;

//       &-wrapper {
//         ${typography.useWithTruncatedText()};
//         display: flex;
//         flex-direction: column;
//         justify-content: center;
//         flex-grow: 1;
//         margin-block: ${lengths('8')};
//         padding-inline: ${lengths('16')};
//       }
//     }

//     &__preview {
//       display: inline-block;
//       overflow: hidden;
//       width: 100%;
//       height: 100%;
//       white-space: nowrap;
//       text-indent: 100%;
//       background-repeat: no-repeat;
//       background-position: 50%;
//       background-size: cover;
//     }

//     &__title {
//       ${typography.useWithTruncatedText()};
//       ${typography.useFontScale('p2')};
//       margin-block-end: ${lengths('4')};
//       color: ${fontTheme('default')};

//       a#{&} {
//         &:link {
//           text-decoration: none;
//           color: ${colors('info')};
//         }

//         &:visited,
//         &.is-visited {
//           color: ${colors('info')};
//         }

//         &:active,
//         &.is-active {
//           color: ${colors('info')};
//         }

//         &:hover,
//         &.is-hovered {
//           text-decoration: underline;
//         }
//       }
//     }

//     &__description {
//       ${typography.useFontScale('c1')};
//       margin-block-end: ${lengths('4')};
//       white-space: normal;
//       color: ${fontTheme('default')};

//       &:not(&--clamp) {
//         ${typography.useWithTruncatedText()};
//       }

//       &--clamp {
//         display: -webkit-box;
//         overflow: hidden;
//         -webkit-box-orient: vertical;
//         -webkit-line-clamp: 2;
//       }
//     }

//     &__footer {
//       ${typography.useWithTruncatedText()};
//       ${typography.useFontScale('c1')};
//       width: 100%;
//       color: ${fontTheme('secondary-info')};

//       a {
//         color: ${fontTheme('secondary-info')};
//       }
//     }

//     &__thumb {
//       ${mixins.sizeSquare(lengths('96'))};
//       flex-shrink: 0;
//     }

//     &__image {
//       width: fit-content;
//       max-width: inherit;
//       max-height: inherit;
//       cursor: pointer;
//     }

//     &__icon {
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       align-items: center;
//       flex-shrink: 0;
//       align-self: center;
//       width: ${lengths('48')};
//       height: ${lengths('52')};
//       margin-block: ${lengths('12')};
//       margin-inline-start: ${lengths('16')};
//       border-radius: ${lengths('medium')};
//       background-color: ${surfaceTheme('neutral')};

//       &-title {
//         ${typography.useWithTruncatedText()};
//         ${typography.useFontScale('micro')};
//         max-width: ${lengths('40')};
//         color: ${fontTheme('default')};
//       }
//     }
//   }
// `;

// export default messageGenericPreviewStyles;
