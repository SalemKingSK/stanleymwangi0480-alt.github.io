import * as React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Called when the user chooses to go back to the form. */
  onReset?: () => void;
  /** Short label for the failing area, shown in the message. */
  label?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render errors in a subtree so one broken reading section shows a
 * recoverable message instead of a blank screen. Also covers a failed lazy
 * chunk load (e.g. an old cached page asking for a file a new deploy removed).
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", this.props.label ?? "", error, info.componentStack);
  }

  private handleBack = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const isChunkError = /Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
      error.message,
    );
    return (
      <div
        role="alert"
        className="mx-auto my-16 max-w-md rounded-2xl p-6 text-center"
        style={{ background: "rgba(20,8,50,0.85)", border: "1px solid rgba(212,175,55,0.3)" }}
      >
        <p className="font-cinzel text-sm uppercase tracking-widest" style={{ color: "#d4af37" }}>
          {this.props.label ? `${this.props.label} could not be shown` : "Something went wrong"}
        </p>
        <p className="mt-3 text-sm text-slate-300">
          {isChunkError
            ? "Part of the app was updated while this page was open. Reload to get the latest version."
            : "This reading hit an unexpected error. Your saved profiles are safe. Try again or go back to the form."}
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full px-4 py-2 text-xs font-semibold"
            style={{ background: "linear-gradient(135deg, #d4af37 0%, #a07820 100%)", color: "#04001a" }}
          >
            Reload
          </button>
          {this.props.onReset && (
            <button
              type="button"
              onClick={this.handleBack}
              className="rounded-full px-4 py-2 text-xs text-slate-200"
              style={{ border: "1px solid rgba(212,175,55,0.35)" }}
            >
              Back to form
            </button>
          )}
        </div>
      </div>
    );
  }
}
