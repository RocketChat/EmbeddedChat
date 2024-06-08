import { css } from '@emotion/react';

export const fileMetricsStyles = {
  metrics: css`
    display: flex;
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    margin-inline: -0.25rem;
    margin-top: 0.5rem;
  `,

  metricsItem: css`
    letter-spacing: 0rem;
    font-size: 0.625rem;
    font-weight: 700;
    line-height: 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 0.25rem;
  `,

  metricsItemLabel: css`
    margin: 0.25rem;
    margin-inline-start: 0.25rem;
    white-space: nowrap;
  `,
};

export const filePreviewContainerStyles = {
  previewContainer: css`
    margin: 3px;
    width: 2.25em;
    max-height: 2.25em;
    display: flex;
    justify-content: flex-end;
  `,
};

export const filePreviewHeaderStyles = {
  previewHeader: css`
    display: flex;
    overflow-x: hidden;
    flex-direction: row;
    flex-grow: 0;
    flex-shrink: 1;
    min-width: 1px;
    padding-right: 3px;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    margin-block: 0.125rem;
    gap: 0.125rem;
    align-items: center;
    max-width: 85%;
  `,

  previewHeaderName: css`
    letter-spacing: 0rem;
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
  `,

  previewHeaderTimestap: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0rem;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
    flex-shrink: 0;
  `,
};

export const fileDisplayStyles = {
  message: css`
    display: flex;
    position: relative;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-around;
    padding-top: 0.5rem;
    -webkit-padding-before: 0.5rem;
    padding-block-start: 0.5rem;
    padding-bottom: 0.25rem;
    -webkit-padding-after: 0.25rem;
    padding-block-end: 0.25rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-inline: 1.25rem;
    cursor: pointer;
  `,

  previewUsername: css`
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
  `,

  modalContent: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 0.5rem 0.5rem;
  `,

  centeredColumnStyles: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
};
