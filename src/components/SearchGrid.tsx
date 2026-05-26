import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, RotateCcw, ChevronLeft, ChevronRight, BookOpen, Layers, ExternalLink, BrainCircuit, Workflow, MessageSquareCode, Copy, Check } from 'lucide-react';
import { TrainingRecord } from '../types.js';

interface SearchGridProps {
  records: TrainingRecord[];
}

export default function SearchGrid({ records }: SearchGridProps) {
  // Filters state
  const [searchText, setSearchText] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedObjective, setSelectedObjective] = useState<string>('all');
  
  // Clipboard copied status
  const [copied, setCopied] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dynamically extract unique objectives from database rows to populate the dropdown filter box
  const uniqueObjectives = useMemo(() => {
    const list = new Set<string>();
    records.forEach((r) => {
      if (r.objective && r.objective.trim()) list.add(r.objective.trim());
    });
    return Array.from(list);
  }, [records]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchText('');
    setSelectedYear('all');
    setSelectedCategory('all');
    setSelectedObjective('all');
    setCurrentPage(1);
  };

  // Filter records based on active criteria
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // 1. Text Search matching across Course Name, Department Name, Date or Objective
      const query = searchText.toLowerCase().trim();
      const matchText =
        !query ||
        rec.course.toLowerCase().includes(query) ||
        rec.department.toLowerCase().includes(query) ||
        rec.objective.toLowerCase().includes(query) ||
        rec.date.toLowerCase().includes(query);

      // 2. Year match
      const matchYear = selectedYear === 'all' || rec.year.toString() === selectedYear;

      // 3. Category match
      const matchCat = selectedCategory === 'all' || rec.category === selectedCategory;

      // 4. Objective match
      const matchObj = selectedObjective === 'all' || rec.objective === selectedObjective;

      return matchText && matchYear && matchCat && matchObj;
    });
  }, [records, searchText, selectedYear, selectedCategory, selectedObjective]);

  // Handle reset on filter changes
  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Adjust current page if filters shrink the resulting list
  const activePage = Math.min(currentPage, totalPages);

  const paginatedRecords = useMemo(() => {
    const startIdx = (activePage - 1) * pageSize;
    return filteredRecords.slice(startIdx, startIdx + pageSize);
  }, [filteredRecords, activePage, pageSize]);

  // Export Filtered records to CSV format string
  const handleExportCSV = () => {
    try {
      // Headers with UTF-8 BOM so Excel opens Thai strings perfectly
      const bom = '\uFEFF';
      const headers = ['ปี พ.ศ.', 'ด้านความรู้หลัก', 'หน่วยงาน', 'หลักสูตร', 'Objective', 'วันที่สอน', 'จำนวนชั่วโมง', 'จำนวนผู้เข้าอบรม (คน)'];
      const rows = filteredRecords.map((r) => [
        r.year,
        r.category,
        `"${r.department.replace(/"/g, '""')}"`,
        `"${r.course.replace(/"/g, '""')}"`,
        `"${r.objective.replace(/"/g, '""')}"`,
        `"${r.date.replace(/"/g, '""')}"`,
        r.hours,
        r.participants,
      ]);

      const csvContent = bom + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Training_Data_Export_PEA_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการดาวน์โหลด CSV: ' + err.message);
    }
  };

  // Copy filtered data as JSON arrays
  const handleCopyJSON = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(filteredRecords, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // fallback
    }
  };

  // Render category badge
  const renderCategoryIcon = (category: 'AI' | 'Automation' | 'Copilot Studio') => {
    switch (category) {
      case 'AI':
        return (
          <span className="flex items-center gap-1 w-fit rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-150">
            <BrainCircuit className="h-2.5 w-2.5" /> AI
          </span>
        );
      case 'Automation':
        return (
          <span className="flex items-center gap-1 w-fit rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-150">
            <Workflow className="h-2.5 w-2.5" /> Automation
          </span>
        );
      case 'Copilot Studio':
        return (
          <span className="flex items-center gap-1 w-fit rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
            <MessageSquareCode className="h-2.5 w-2.5" /> Copilot
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm sm:p-6">
      
      {/* Title section with download actions */}
      <div className="flex flex-col gap-4 border-l-4 border-purple-800 pl-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-sans text-lg font-bold text-purple-950 sm:text-xl">
            สืบค้นข้อมูลหลักสูตรอบรมเพิ่มเติม
          </h2>
          <p className="text-xs text-slate-500">
            ค้นหาข้อมูลตามหลักสูตร ปีงบประมาณ วัตถุประสงค์ หรือส่งออกผลฐานข้อมูลด้านเทคนิคที่กรองไว้เป็นไฟล์สเปรดชีต CSV
          </p>
        </div>

        {/* Data exporters */}
        <div className="flex flex-wrap gap-2">
          {/* Copy JSON */}
          <button
            onClick={handleCopyJSON}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600">คัดลอก JSON แล้ว</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>คัดลอก JSON</span>
              </>
            )}
          </button>

          {/* Download CSV */}
          <button
            id="download_csv_btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition active:scale-95 shadow-sm hover:shadow cursor-pointer ring-1 ring-emerald-800"
          >
            <Download className="h-3.5 w-3.5 text-amber-300" />
            <span>ดาวน์โหลดตาราง {totalItems > 0 ? `(${totalItems} แถว)` : ''} เป็น .CSV</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter controls ribbon */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-12 bg-slate-50 p-4 rounded-xl border border-slate-100">
        
        {/* Input Text query */}
        <div className="sm:col-span-4 select-none">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            <Search className="h-3 w-3 text-slate-400" /> คำค้นหาหลัก (Keyword)
          </label>
          <input
            type="text"
            placeholder="ชื่อวิชา, วันที่บรรยาย, หน่วยงาน..."
            value={searchText}
            onChange={(e) => handleFilterChange(setSearchText, e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Filter input: Year */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
            ช่วงปี พ.ศ.
          </label>
          <select
            value={selectedYear}
            onChange={(e) => handleFilterChange(setSelectedYear, e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="all">แสดงทุกปี พ.ศ.</option>
            <option value="2568">พ.ศ. 2568</option>
            <option value="2569">พ.ศ. 2569</option>
          </select>
        </div>

        {/* Filter input: Category Domain */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
            ด้านวิสาสะความรู้
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="all">แสดงด้านเทคโนโลยีทั้งหมด</option>
            <option value="AI">ด้าน AI</option>
            <option value="Automation">ด้าน Automation</option>
            <option value="Copilot Studio">ด้าน Copilot Studio</option>
          </select>
        </div>

        {/* Filter input: Objective */}
        <div className="sm:col-span-3">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
            วัตถุประสงค์ (Objective)
          </label>
          <select
            value={selectedObjective}
            onChange={(e) => handleFilterChange(setSelectedObjective, e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="all">แสดงทุกเป้าหมายหลัก</option>
            {uniqueObjectives.map((obj) => (
              <option key={obj} value={obj}>
                {obj}
              </option>
            ))}
          </select>
        </div>

        {/* Filter input: Reset button */}
        <div className="sm:col-span-1 flex items-end justify-center">
          <button
            onClick={handleResetFilters}
            className="w-full h-[32px] sm:w-[32px] rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition active:scale-95 flex items-center justify-center cursor-pointer"
            title="ล้างตัวกรองทั้งหมด"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Grid count summary line */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
        <span>
          พบสัญญากิจกรรมทั้งหมด <span className="font-bold text-purple-950">{totalItems} แถว</span> จากข้อมูลทั้งสิ้น {records.length} แถว
        </span>
        {totalItems > 0 && (
          <span>
            แสดงหน้า <span className="font-bold text-slate-800">{activePage}</span> จากทั้งหมด {totalPages} หน้า
          </span>
        )}
      </div>

      {/* Main Datagrid Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left font-sans text-xs text-slate-600">
          <thead className="bg-[#5a1b6b]/5 text-[#5a1b6b] border-b border-purple-200 text-[11px] font-bold tracking-wider uppercase select-none">
            <tr>
              <th className="px-4 py-3 text-center w-14">ปี พ.ศ.</th>
              <th className="px-4 py-3 w-32">ด้านความรู้</th>
              <th className="px-4 py-3">หลักสูตร / วิชาพูนทักษะ</th>
              <th className="px-4 py-3">หน่วยงานรับอบรม</th>
              <th className="px-4 py-3">Objective</th>
              <th className="px-4 py-3 text-center">วันที่จัดกิจกรรม</th>
              <th className="px-4 py-3 text-center w-24 whitespace-nowrap">ชั่วโมงบรรยาย</th>
              <th className="px-4 py-3 text-right w-24 pr-5 whitespace-nowrap">พนักงานเข้าเรียน</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <BookOpen className="h-8 w-8 text-slate-300 mb-1" />
                    <span>ไม่พบแถวข้อมูลหลักสูตรที่ตรงตามเงื่อนไขในตาราง</span>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 text-[11px] font-semibold text-purple-700 underline"
                    >
                      ล้างตัวกรองเพื่อเรียกคืนตารางตั้งต้น
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record, index) => (
                <tr
                  key={record.id}
                  className={`hover:bg-purple-50/10 transition ${
                    index % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                  }`}
                >
                  
                  {/* Year */}
                  <td className="px-4 py-3 text-center font-bold">
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      record.year === 2568
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {record.year}
                    </span>
                  </td>

                  {/* Category icon */}
                  <td className="px-4 py-3 font-semibold text-purple-950">
                    {renderCategoryIcon(record.category)}
                  </td>

                  {/* Course name */}
                  <td className="px-4 py-3 font-semibold text-slate-800 truncate max-w-xs sm:max-w-md" title={record.course}>
                    {record.course}
                  </td>

                  {/* Target department */}
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {record.department}
                  </td>

                  {/* Objective */}
                  <td className="px-4 py-3">
                    {record.objective ? (
                      <span className="rounded bg-slate-100 px-1.5 py-0.7 text-[10px] text-slate-600 border border-slate-200">
                        {record.objective}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* Training Date */}
                  <td className="px-4 py-3 text-center text-slate-500 whitespace-nowrap">
                    {record.date || <span className="text-slate-300">-</span>}
                  </td>

                  {/* Lectures duration in hours */}
                  <td className="px-4 py-3 text-center font-bold text-slate-800">
                    {record.hours} <span className="text-slate-400 font-normal">ชม.</span>
                  </td>

                  {/* Audience size size (Participants) */}
                  <td className="px-4 py-3 text-right font-bold text-purple-900 pr-5">
                    {record.participants.toLocaleString('th-TH')} <span className="text-slate-400 font-normal">คน</span>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls ribbon */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          
          {/* Rows per page toggle */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>แสดงตารางแบบ:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
            >
              <option value="10">10 แถวต่อหน้า</option>
              <option value="25">25 แถวต่อหน้า</option>
              <option value="50">50 แถวต่อหน้า</option>
            </select>
          </div>

          {/* Page numbers select controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={activePage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 select-none cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center font-sans text-xs text-slate-500 px-3 font-semibold">
              <span className="text-[#5a1b6b] mr-1">หน้า {activePage}</span> / {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={activePage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 select-none cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
