import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-bold text-red-500 mb-2">Lỗi ứng dụng</h1>
            <p className="text-gray-400 text-sm mb-4">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 rounded-lg text-sm font-bold"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
