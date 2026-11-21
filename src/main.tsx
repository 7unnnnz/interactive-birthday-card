import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message || 'Lỗi không xác định' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lỗi giao diện được bắt an toàn:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center p-6 bg-[#080510] text-slate-100 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🎂</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Đang tải lại thiệp sinh nhật...</h2>
          <p className="text-xs text-slate-400 max-w-sm mb-6">
            Dữ liệu vừa được khôi phục về trạng thái an toàn nhất.
          </p>
          <button
            onClick={() => {
              window.location.hash = '';
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-full bg-gold-400 hover:bg-gold-500 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-gold-500/20 cursor-pointer"
          >
            Mở lại thiệp ngay
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>,
);
