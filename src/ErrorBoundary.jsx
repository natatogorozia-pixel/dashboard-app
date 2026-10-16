import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary დაიჭირა შეცდომა:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>⚠️ სისტემური შეცდომა (Runtime Error)</h2>
          <p>სამწუხაროდ, აპლიკაციის ამ ნაწილში მოხდა შეფერხება.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            სცადეთ ხელახლა (Retry)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}