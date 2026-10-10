import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080c15] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white">Something went wrong</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              An interface error occurred. We have recovered state. Click below to reload the platform cleanly.
            </p>
            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-950 text-left font-mono text-[11px] text-rose-300 break-all overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('aura_current_user');
                window.location.reload();
              }}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Session & Reload</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
