import React from 'react';

class PreviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[PreviewErrorBoundary] caught rendering error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            color: '#ef4444',
            padding: '0.75rem',
            fontSize: '0.75rem',
            border: '1px solid #fee2e2',
            borderRadius: '4px',
            backgroundColor: '#fef2f2',
            marginTop: '0.5rem',
          }}
        >
          <strong>Preview Render Error:</strong> {this.state.error?.message || String(this.state.error)}
        </div>
      );
    }

    return this.props.children;
  }
}

export default PreviewErrorBoundary;
