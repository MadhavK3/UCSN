import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                    <h1 style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
                    <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', maxWidth: '800px', width: '100%', overflow: 'auto' }}>
                        <h3 style={{ color: '#fca5a5', marginTop: 0 }}>Error: {this.state.error?.toString()}</h3>
                        <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px', color: '#9ca3af' }}>
                            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>Component Stack Trace</summary>
                            {this.state.errorInfo?.componentStack}
                        </details>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#0891b2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
