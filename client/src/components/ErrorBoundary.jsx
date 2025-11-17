import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded-md">
          <h2 className="text-xl font-semibold text-red-700">Something went wrong.</h2>
          <pre className="mt-4 text-sm text-red-600">{String(this.state.error)}</pre>
          <div className="mt-4">
            <button onClick={this.handleReset} className="px-3 py-2 bg-red-600 text-white rounded-md">Retry</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
