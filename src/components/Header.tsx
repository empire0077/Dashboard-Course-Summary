import React from 'react';
import { BrainCircuit, Cpu, Workflow, RefreshCw, Sparkles, Award } from 'lucide-react';

interface HeaderProps {
  loading: boolean;
  onRefresh: () => void;
  timestamp: string | null;
  totalParticipants: number;
}

export default function Header({ loading, onRefresh, timestamp, totalParticipants }: HeaderProps) {
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '';

  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <header className="relative w-full border-b border-purple-100 bg-white py-6 shadow-sm">
      {/* Decorative Golden Top Line */}
      <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-purple-800 via-amber-400 to-purple-800" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-800 to-purple-600 shadow-md shadow-purple-200 ring-2 ring-amber-400">
            <BrainCircuit className="h-6 w-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                PEA Knowledge Hub
              </span>
              <span className="flex items-center gap-1 text-xs text-purple-700 font-medium">
                <Sparkles className="h-3 w-3 text-amber-500" /> Official Dashboard
              </span>
            </div>
            <h1 className="mt-1 font-sans text-xl font-bold tracking-tight text-purple-950 sm:text-2xl">
              แดชบอร์ดสรุปผลการอบรมให้ความรู้ <span className="text-amber-600">กฟภ.</span>
            </h1>
            <p className="text-xs text-slate-500">
              ความเชี่ยวชาญ 3 ด้านหลัก: AI, Automation (RPA) และ Microsoft Copilot Studio (ปี 2568 - 2569)
            </p>
          </div>
        </div>

        {/* Action Controls & Sync Status */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
          {timestamp && (
            <div className="hidden flex-col items-end text-right md:flex">
              <span className="flex items-center gap-1.5 text-xs font-medium text-purple-950">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                เชื่อมต่อฐานข้อมูล Google Sheets สำเร็จ
              </span>
              <span className="text-[11px] text-slate-400">
                ดึงข้อมูลล่าสุดเมื่อ {formattedDate} {formattedTime} น.
              </span>
            </div>
          )}

          <button
            id="refresh_data_btn"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-800 to-purple-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all hover:from-purple-700 hover:to-purple-800 hover:shadow-lg disabled:opacity-50 ring-1 ring-purple-950 active:scale-95 cursor-pointer max-xs:w-full justify-center"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-amber-300`} />
            <span>{loading ? 'กำลังดึงข้อมูล...' : 'รีเฟรชข้อมูล'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
