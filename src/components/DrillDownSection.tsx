import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, SlidersHorizontal, BookOpen, Clock, Users, Building2, Sparkles, BrainCircuit, Workflow, MessageSquareCode, Layers } from 'lucide-react';
import { DepartmentSummary } from '../types.js';

interface DrillDownSectionProps {
  departments: DepartmentSummary[];
}

type SortField = 'participants' | 'hours' | 'records' | 'name';

export default function DrillDownSection({ departments }: DrillDownSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('participants');
  const [expandedDepts, setExpandedDepts] = useState<{ [deptName: string]: boolean }>({});

  // Toggle drill-down panel for a specific department
  const toggleExpand = (deptName: string) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptName]: !prev[deptName],
    }));
  };

  // Expand or Collapse All buttons
  const expandAll = () => {
    const allExpanded: { [key: string]: boolean } = {};
    departments.forEach(d => { allExpanded[d.name] = true; });
    setExpandedDepts(allExpanded);
  };

  const collapseAll = () => {
    setExpandedDepts({});
  };

  // Filter based on search query
  const filteredDepts = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort departments
  const sortedDepts = [...filteredDepts].sort((a, b) => {
    switch (sortBy) {
      case 'hours':
        return b.totalHours - a.totalHours;
      case 'records':
        return b.recordCount - a.recordCount;
      case 'name':
        return a.name.localeCompare(b.name, 'th-TH');
      case 'participants':
      default:
        return b.totalParticipants - a.totalParticipants;
    }
  });

  // Category Icon helper
  const renderCategoryTag = (category: 'AI' | 'Automation' | 'Copilot Studio') => {
    switch (category) {
      case 'AI':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 border border-purple-100">
            <BrainCircuit className="h-3 w-3" /> AI
          </span>
        );
      case 'Automation':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 border border-sky-100">
            <Workflow className="h-3 w-3 text-sky-600" /> Auto
          </span>
        );
      case 'Copilot Studio':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-100">
            <MessageSquareCode className="h-3 w-3 text-amber-500" /> Copilot
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm sm:p-6">
      
      {/* Title block with control actions */}
      <div className="flex flex-col gap-4 border-l-4 border-amber-500 pl-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-sans text-lg font-bold text-purple-950 sm:text-xl flex items-center gap-2">
            สรุปยอดอบรมจำแนกรายหน่วยงาน (Drill Down สรุปหลักสูตร)
          </h2>
          <p className="text-xs text-slate-500">
            จัดหมวดหมู่สะสมความร่วมมือของกองฝึกอบรม คณะวิทยากร และเขตต่าง ๆ (คลิกการ์ดหน่วยงานเพื่อแผงรายละเอียด)
          </p>
        </div>

        {/* Global Expand operations */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={expandAll}
            className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
          >
            แผงข้อมูลทั้งหมด
          </button>
          <button
            onClick={collapseAll}
            className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
          >
            ยุบข้อมูลทั้งหมด
          </button>
        </div>
      </div>

      {/* Filter and sorting control toolbar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 bg-slate-50 p-3 rounded-xl border border-slate-100">
        
        {/* Search Input */}
        <div className="relative sm:col-span-7">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อหน่วยงาน (เช่น ศฝฟ., กฟฉ.1, AI Developers)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-4 pl-9 text-xs placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="relative sm:col-span-5 flex items-center gap-2">
          <label className="text-xs font-semibold text-purple-950 whitespace-nowrap flex items-center gap-1 h-full">
            <SlidersHorizontal className="h-3.5 w-3.5 text-purple-800" /> เรียงตาม:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-purple-500 focus:outline-none focus:ring-h focus:ring-purple-500"
          >
            <option value="participants">ผู้เข้าอบรมสูงสุด (รวมปี 2568 - 2569)</option>
            <option value="hours">จำนวนชั่วโมงเรียนสูงสุด</option>
            <option value="records">จำนวนรอบ/หลักสูตรมากที่สุด</option>
            <option value="name">ชื่อหน่วยงาน (ก-ฮ)</option>
          </select>
        </div>

      </div>

      {/* Primary Department Cards List */}
      {sortedDepts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <Building2 className="h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm text-slate-400 font-medium">ไม่พบผลการค้นพบหน่วยงาน</p>
          <p className="text-xs text-slate-400">กรุณาลองปรับเปลี่ยนคำค้นหาอีกครั้ง</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {sortedDepts.map((dept, index) => {
            const isExpanded = !!expandedDepts[dept.name];
            return (
              <div
                key={dept.name}
                className={`overflow-hidden rounded-xl border transition-all ${
                  isExpanded
                    ? 'border-purple-400 bg-purple-50/20 ring-1 ring-purple-100 shadow-sm'
                    : 'border-slate-100 bg-white hover:border-purple-200 hover:shadow-sm'
                }`}
              >
                {/* Header Section (Clickable) */}
                <div
                  onClick={() => toggleExpand(dept.name)}
                  className="flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center cursor-pointer select-none"
                >
                  
                  {/* Department Title & Quick breakdown tags */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                      <span className="font-sans text-xs font-bold text-purple-900 border-b border-amber-500 pb-0.5">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-bold text-purple-950 sm:text-base">
                        {dept.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {dept.categories.AI > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-purple-600 bg-purple-50/70 px-1.5 py-0.2 rounded border border-purple-100">
                            AI ({dept.categories.AI})
                          </span>
                        )}
                        {dept.categories.Automation > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-sky-600 bg-sky-50/70 px-1.5 py-0.2 rounded border border-sky-100">
                            Automation ({dept.categories.Automation})
                          </span>
                        )}
                        {dept.categories['Copilot Studio'] > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            Copilot ({dept.categories['Copilot Studio']})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Primary Numbers & Toggle Status */}
                  <div className="flex w-full flex-wrap items-center justify-between gap-4 sm:w-auto sm:justify-end">
                    
                    {/* Numbers Grid */}
                    <div className="grid grid-cols-3 gap-6 text-center sm:gap-8 pr-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">จำนวนหลักสูตร</span>
                        <span className="font-sans text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
                          <BookOpen className="h-3 w-3 text-slate-400" /> {dept.recordCount} คอร์ส
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">เวลารวมสอน</span>
                        <span className="font-sans text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" /> {dept.totalHours} ชม.
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">พนักงานอบรม</span>
                        <span className="font-sans text-sm font-bold text-purple-900 flex items-center justify-center gap-1 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          <Users className="h-3.5 w-3.5 text-purple-700" /> {dept.totalParticipants.toLocaleString('th-TH')} คน
                        </span>
                      </div>
                    </div>

                    {/* Expand Trigger Icon */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200">
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-purple-800" /> : <ChevronDown className="h-4 w-4" />}
                    </div>

                  </div>

                </div>

                {/* Sub Drill Down Detail Drawer */}
                {isExpanded && (
                  <div className="border-t border-purple-200/50 bg-white p-4 font-sans text-xs sm:p-5">
                    <div className="mb-3.5 flex items-center gap-2 text- purple-950 font-bold border-b border-dashed border-purple-100 pb-2">
                      <Layers className="h-3.5 w-3.5 text-amber-500" />
                      <span>หลักสูตรความรู้ที่ {dept.name} ได้ลงทะเบียนและศึกษาเรียนรู้:</span>
                    </div>

                    {/* Responsive Courses Table inside Expanded drawer */}
                    <div className="overflow-x-auto rounded-lg border border-slate-100">
                      <table className="w-full text-left font-sans text-xs text-slate-600">
                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-2 border-b border-slate-100 text-center w-12">ปี/พ.ศ.</th>
                            <th className="px-4 py-2 border-b border-slate-100">ด้านวิชาการ</th>
                            <th className="px-4 py-2 border-b border-slate-100">ชื่อหลักสูตรที่อบรม</th>
                            <th className="px-4 py-2 border-b border-slate-100">Objective</th>
                            <th className="px-4 py-2 border-b border-slate-100 text-center">วันที่จัดบรรยาย</th>
                            <th className="px-4 py-2 border-b border-slate-100 text-center w-20">เวลาอบรม</th>
                            <th className="px-4 py-2 border-b border-slate-100 text-right w-24">จำนวนพนักงาน</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {dept.courses.map((course, cIdx) => (
                            <tr key={course.id || cIdx} className="hover:bg-slate-50/50 transition">
                              
                              {/* Year Badge */}
                              <td className="px-4 py-3 text-center font-bold">
                                <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-extrabold ${
                                  course.year === 2568 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {course.year}
                                </span>
                              </td>

                              {/* Technical category Domain Tag */}
                              <td className="px-4 py-3">{renderCategoryTag(course.category)}</td>

                              {/* Course Title name */}
                              <td className="px-4 py-3 font-semibold text-purple-950">
                                {course.courseName}
                              </td>

                              {/* Learning Objective */}
                              <td className="px-4 py-3">
                                {course.objective ? (
                                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">
                                    {course.objective}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>

                              {/* Date values */}
                              <td className="px-4 py-3 text-center whitespace-nowrap text-slate-500">
                                {course.date || <span className="text-slate-300">-</span>}
                              </td>

                              {/* Lecture hour values */}
                              <td className="px-4 py-3 text-center font-bold text-slate-700">
                                {course.hours} <span className="text-slate-400 font-normal">ชม.</span>
                              </td>

                              {/* Total attendees inside the course */}
                              <td className="px-4 py-3 text-right font-extrabold text-purple-900 pr-5">
                                {course.participants.toLocaleString('th-TH')} <span className="text-slate-400 font-normal">คน</span>
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
