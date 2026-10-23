import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Icon } from '@embeddedchat/ui-elements';
import { styles } from './ErrorBoundary.styles';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box css={styles.errorContainer}>
          <Icon name="report" size="3rem" color="#ff5050" css={styles.icon} />
          <h2 css={styles.heading}>Something went wrong.</h2>
          <p css={styles.text}>
            The application encountered an unexpected error.
          </p>
          <Box css={styles.buttons}>
            <Button onClick={() => this.setState({ hasError: false })}>
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()} type="primary">
              Reload Page
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
