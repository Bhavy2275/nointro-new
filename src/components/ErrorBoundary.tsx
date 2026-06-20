'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Three.js/WebGL component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-[#0a0a0a] border border-red-500/20 p-8 rounded-lg text-center select-none">
          <span className="font-primary font-bold text-xs tracking-widest text-red-500 uppercase mb-2">
            WebGL Rendering Issue
          </span>
          <p className="font-secondary text-[11px] text-white/50 max-w-[300px] leading-relaxed uppercase">
            Failed to render 3D component. Your browser or hardware may not support WebGL2 rendering.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
