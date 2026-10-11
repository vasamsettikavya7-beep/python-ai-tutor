import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Python Buddy ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-amber-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-8 text-center shadow-2xl">
            <div className="text-5xl mb-4">🪄</div>
            <h2 className="text-2xl font-extrabold text-amber-300 mb-2">
              Magical Misfire Detected
            </h2>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              A spell incantation encountered an unexpected hex. The Python sanctuary can be restored instantly.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl shadow-lg cursor-pointer transition-all active:scale-95"
            >
              Cast Reparo (Reload App) ✨
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
