import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, Button, Container, Box } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // You could send error to monitoring service here
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth='md'>
          <Box sx={{ mt: 4, mb: 4 }}>
            <Alert severity='error' variant='outlined'>
              <AlertTitle>Algo salió mal</AlertTitle>
              Ha ocurrido un error inesperado. Por favor, intenta refrescar la
              página.
              {process.env.NODE_ENV === 'development' && (
                <Box
                  sx={{ mt: 2, fontFamily: 'monospace', fontSize: '0.8rem' }}
                >
                  {this.state.error?.message}
                </Box>
              )}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant='contained'
                  onClick={this.handleReset}
                  sx={{ mr: 1 }}
                >
                  Reintentar
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => window.location.reload()}
                >
                  Refrescar página
                </Button>
              </Box>
            </Alert>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
