import React from 'react'
import { AlertCircle, Wifi, WifiOff, RefreshCw, Settings, ExternalLink } from 'lucide-react'

interface ConnectionStatusProps {
  isConnected: boolean
  error?: string | null
  onRetry?: () => void
  showDetails?: boolean
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  error, 
  onRetry,
  showDetails = false 
}) => {
  if (isConnected && !error) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <Wifi className="text-green-600" size={20} />
        <div>
          <h4 className="text-green-800 font-semibold">Connected</h4>
          <p className="text-green-600 text-sm">Database connection established</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <WifiOff className="text-red-600" size={20} />
        <div>
          <h4 className="text-red-800 font-semibold">Connection Issue</h4>
          <p className="text-red-600 text-sm">
            {error || 'Unable to connect to the database'}
          </p>
        </div>
      </div>
      
      {showDetails && (
        <div className="bg-white border border-red-200 rounded p-3 text-sm text-slate-700">
          <p className="font-medium mb-2">Possible causes:</p>
          <ul className="space-y-1 text-sm list-disc list-inside">
            <li>Missing environment variables in deployment</li>
            <li>Database connection timeout</li>
            <li>Network connectivity issues</li>
            <li>Supabase service temporary unavailability</li>
          </ul>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} />
            Retry Connection
          </button>
        )}
        
        <a
          href="https://status.supabase.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <ExternalLink size={16} />
          Check Status
        </a>
      </div>
    </div>
  )
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-96 flex items-center justify-center p-8">
      <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md w-full text-center shadow-lg">
        <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h3>
        <p className="text-slate-600 mb-4">
          {error.message || 'An unexpected error occurred while loading the application.'}
        </p>
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Reload Page
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
              Technical Details
            </summary>
            <pre className="mt-2 p-2 bg-slate-100 rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

export default ConnectionStatus
