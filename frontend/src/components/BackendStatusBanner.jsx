import React, { useState } from 'react';
import { AlertTriangle, Server, Copy, Check, ChevronDown, ChevronUp, X } from 'lucide-react';

export default function BackendStatusBanner({ onRetry }) {
  const [showDetails, setShowDetails] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedCors, setCopiedCors] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      const isCloud = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      return sessionStorage.getItem('pb_dismiss_backend_banner') === 'true' || isCloud;
    }
    return false;
  });

  if (dismissed) return null;

  const startCmd = `uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload`;

  const corsCode = `from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(startCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyCors = () => {
    navigator.clipboard.writeText(corsCode);
    setCopiedCors(true);
    setTimeout(() => setCopiedCors(false), 2000);
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('pb_dismiss_backend_banner', 'true');
    } catch {}
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
        <div className="flex items-start md:items-center gap-3">
          <div className="p-1.5 bg-amber-200/70 rounded-lg text-amber-800 shrink-0 mt-0.5 md:mt-0">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="font-semibold text-amber-950">
              Unable to connect to Python Buddy backend. Make sure FastAPI is running on{' '}
              <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono text-xs">
                http://127.0.0.1:8000
              </code>
            </p>
            <p className="text-xs text-amber-800 mt-0.5">
              API requests are failing. Please check if your FastAPI server is started or CORS is permitted.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pl-10 md:pl-0">
          <button
            onClick={onRetry}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Retry Connection
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
          >
            Troubleshooting {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-amber-200/80 text-amber-800 rounded-lg transition-colors ml-1 cursor-pointer"
            title="Dismiss this banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-amber-200/80 grid md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white/80 p-3 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-1.5 font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Server className="w-4 h-4 text-blue-600" />
                1. Start FastAPI Backend:
              </span>
              <button
                onClick={handleCopyCmd}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-normal text-[11px]"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedCmd ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-2 rounded text-[11px] overflow-x-auto font-mono">
              {startCmd}
            </pre>
          </div>

          <div className="bg-white/80 p-3 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-1.5 font-bold text-slate-800">
              <span>2. If CORS error occurs in FastAPI:</span>
              <button
                onClick={handleCopyCors}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-normal text-[11px]"
              >
                {copiedCors ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedCors ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-2 rounded text-[11px] overflow-x-auto font-mono">
              {corsCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
