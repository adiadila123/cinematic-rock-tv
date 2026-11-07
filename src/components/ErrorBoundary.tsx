"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle: string;
  fallbackBody: string;
  resetLabel: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ROCK TV section error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="glass glass-thick mx-5 my-12 max-w-4xl rounded-glass p-8 text-chalk sm:mx-auto"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-crimson">
                <AlertTriangle className="h-6 w-6 shrink-0" aria-hidden="true" />
                <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-chalk">
                  {this.props.fallbackTitle}
                </h2>
              </div>
              <p className="max-w-[60ch] text-sm text-bone">{this.props.fallbackBody}</p>
            </div>
            <button
              type="button"
              onClick={this.handleReset}
              className="glass glass-tint-crimson glass-press inline-flex items-center gap-2 rounded-full px-5 py-3 font-condensed text-base font-bold uppercase tracking-wider text-chalk"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {this.props.resetLabel}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
