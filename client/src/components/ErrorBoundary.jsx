import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4'>
          <div className='max-w-md w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4'>
            <div className='flex items-center gap-3 text-red-400'>
              <AlertCircle className='w-6 h-6' />
              <h2 className='text-xl font-semibold'>Something went wrong</h2>
            </div>

            <p className='text-gray-300 text-sm'>
              {this.state.error?.message ||
                "An unexpected error occurred. Please try reloading the page."}
            </p>

            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <details className='mt-4'>
                <summary className='text-gray-400 text-sm cursor-pointer hover:text-gray-300'>
                  Error Details (Development Only)
                </summary>
                <pre className='mt-2 text-xs text-red-300 bg-black/40 p-3 rounded overflow-auto max-h-40'>
                  {this.state.error?.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReload}
              className='w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
            >
              <RefreshCw className='w-4 h-4' />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
