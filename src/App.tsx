import React, { useState, useEffect, useMemo } from 'react';
import { Sliders, RefreshCw, AlertTriangle, Cpu, HelpCircle, ShieldCheck, Database, LayoutGrid } from 'lucide-react';
import { DashboardData } from './types';
import { fetchAndParseTrainingData, aggregateRecords } from './parser';
import Header from './components/Header';
import OverviewCards from './components/OverviewCards';
import DrillDownSection from './components/DrillDownSection';
import SearchGrid from './components/SearchGrid';

export default function App() {
  const [masterData, setMasterData] = useState<DashboardData | null>(null);
  const [selectedYear, setSelectedYear] = useState<'all' | '2569' | '2568'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and dynamic compute statistics using useMemo
  const data = useMemo<DashboardData | null>(() => {
    if (!masterData) return null;
    if (selectedYear === 'all') return masterData;

    const filterYearVal = parseInt(selectedYear, 10);
    const filteredRecords = masterData.records.filter((r) => r.year === filterYearVal);

    // Compute dynamic layout calculations on response
    return aggregateRecords(filteredRecords, masterData.timestamp);
  }, [masterData, selectedYear]);

  // Fetch training program aggregates from server API proxy with client fallback
  const fetchTrainingData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[App] Attempting to fetch training statistics from backend API proxy...');
      const res = await fetch('/api/training-data');
      if (res.ok) {
        const parsedData: DashboardData = await res.json();
        setMasterData(parsedData);
      } else {
        // Fallback to client-side parse if the server gives non-200 status (e.g. 404 on Vercel static host)
        console.warn(`[App] API returned status ${res.status}. Falling back to direct client-side spreadsheet compilation...`);
        const parsedData = await fetchAndParseTrainingData();
        setMasterData(parsedData);
      }
    } catch (err: any) {
      console.warn('[App] API proxy failed to respond. Performing direct client-side spreadsheet fetch & compile...', err);
      try {
        const parsedData = await fetchAndParseTrainingData();
        setMasterData(parsedData);
      } catch (fallbackErr: any) {
        console.error('[App] Direct spreadsheet pipeline failed:', fallbackErr);
        setError(fallbackErr.message || 'ไม่สามารถรวบรวมข้อมูลกิจกรรมหรือเชื่อมโยงกับ Google Sheets และระบบสำรองได้');
      }
    } finally {
      setLoading(false);
    }
  };

  // Run fetching on mount
  useEffect(() => {
    fetchTrainingData();
  }, []);

  // Professional Full-Page Corporate Loader (White / Purple / Gold)
  if (loading && !masterData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="relative flex flex-col items-center max-w-sm rounded-2xl border border-purple-100 bg-white p-8 text-center shadow-lg">
          {/* Gold Decorative Tag */}
          <div className="absolute top-0 left-1/2 h-1.5 w-24 -translate-x-1/2 bg-amber-400 rounded-b-md" />
          
          {/* Rotating Spinner Ring */}
          <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 ring-2 ring-purple-150">
            <Cpu className="h-7 w-7 text-purple-700 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-purple-800 border-r-amber-400 animate-spin" />
          </div>

          <h3 className="font-sans text-base font-bold text-purple-950 sm:text-lg">
            กำลังเชื่อมโยง Google Sheets
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            กำลังดึงข้อมูลกิจกรรมและหลักสูตรอบรมจากสเปรดชีตปี 2568 - 2569 ของหน่วยงานสังกัด กฟภ. แบบสดใหม่...
          </p>
          
          <div className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-purple-50/50 py-2 text-[11px] font-semibold text-purple-800">
            <Database className="h-3.5 w-3.5 text-amber-500" />
            <span>กำลังจัดประเภท AI, Automation, Copilot</span>
          </div>
        </div>
      </div>
    );
  }

  // Professional Error States
  if (error && !masterData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="relative max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
          {/* Decorative Red Top Line */}
          <div className="absolute top-0 left-0 h-1.5 w-full bg-red-500 rounded-t-2xl" />
          
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 ring-4 ring-red-100">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <h3 className="font-sans text-base font-bold text-red-950 sm:text-lg">
            การดึงพารามิเตอร์ขัดข้อง
          </h3>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            กรุณาตรวจสอบการแชร์สิทธิ์ของทั้ง 2 Google Sheets ให้เป็น <span className="font-semibold text-slate-600">"ทุกคนที่มีลิงก์สามารถอ่านได้" (Anyone with the link can view)</span> หรือเชื่อมต่ออินเทอร์เน็ตสำรองแล้วลองใหม่อีกครั้ง
          </p>

          <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-[11px] text-left text-red-800 font-mono border border-slate-100 break-words">
            รายละเอียด: {error}
          </div>

          <button
            onClick={fetchTrainingData}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-purple-800 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 hover:shadow-lg transition cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-amber-300" />
            <span>ทดลองเชื่อมต่อใหม่อีกครั้ง</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans antialiased text-slate-800">
      
      {/* 1. Header component */}
      <Header
        loading={loading}
        onRefresh={fetchTrainingData}
        timestamp={masterData?.timestamp || null}
        totalParticipants={data?.summary.totalParticipants || 0}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {data && (
          <>
            {/* 2. Overview statistical summary cards */}
            <OverviewCards data={data} selectedYear={selectedYear} />

            {/* 3. Drill Down statistics grouped by department */}
            <DrillDownSection departments={data.departmentsSummary} />

            {/* 4. Complete customizable searchable datagrid list */}
            <SearchGrid records={data.records} />
          </>
        )}

      </main>

      {/* Footer corporate notes */}
      <footer className="mx-auto max-w-7xl px-4 text-center text-slate-400 sm:px-6 lg:px-8">
        <p className="border-t border-slate-200 pt-6 text-[11px]">
          ระบบรายงานกิจกรรมและสัมมนาและทักษะยกระดับดิจิทัล (AI, RPA, Copilot Studio) พนักงาน การไฟฟ้าส่วนภูมิภาค (กฟภ. / PEA) 
        </p>
        <p className="text-[11px] text-slate-500 mt-1.5 flex flex-wrap items-center justify-center gap-1.5 font-medium">
          <span>สถาปัตยกรรมระบบและพัฒนาโดย</span>
          <span className="font-bold text-slate-700">นวภัทร์ ธรรมชอบ</span>
          <span className="text-slate-300">|</span>
          <span>ติดต่อสอบถาม:</span>
          <a href="mailto:nawapat.tha@pea.co.th" className="text-purple-800 font-semibold hover:underline">
            nawapat.tha@pea.co.th
          </a>
        </p>
      </footer>
    </div>
  );
}
