import { css } from '@emotion/react';

const styles = {
  parent: css`
    background-color: white;
    width: 350px;
    height: 100%;
    box-shadow: -1px 0px 5px rgb(0 0 0 / 25%);
    z-index: 100;
  `,

  container: css`
    display: flex;
    flex-direction: column;
    height: 100%;
  `,

  header: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
  `,

  title: css`
    color: #4a4a4a;
    width: 80%;
  `,

  icon: css`
    font-size: 1.25rem;
    padding: 0 0.5rem 0.5rem 0;
  `,

  searchContainer: css`
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #fff;
    border: 2px solid #ddd;
    border-radius: 0.25rem;
    position: relative;
    margin: 0 1rem 1rem;
  `,

  textInput: css`
    border: none;
    flex: none;
    padding: none;
    &:focus {
      border: none;
      box-shadow: none;
    }
  `,

  noInfoIcon: css`
    padding: 0.125em;
    cursor: pointer;
  `,
};

export default styles;
