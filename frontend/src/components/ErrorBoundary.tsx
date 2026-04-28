import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] p-8">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-rose-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-10 w-10 text-rose-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Something went wrong</h2>
              <p className="text-slate-500 font-medium mt-2 text-sm">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              {this.state.error && (
                <p className="text-xs text-slate-400 mt-3 font-mono bg-slate-100 p-3 rounded-xl overflow-auto max-h-24">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary px-8 mx-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
