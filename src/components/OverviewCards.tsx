import React from 'react';
import { Users, Clock, BookOpen, Building2, BrainCircuit, Workflow, MessageSquareCode, TrendingUp, Sparkles, Zap, Award } from 'lucide-react';
import { DashboardData } from '../types';

interface OverviewCardsProps {
  data: DashboardData;
  selectedYear: 'all' | '2569' | '2568';
}

export default function OverviewCards({ data, selectedYear }: OverviewCardsProps) {
  const { summary } = data;

  // Format helper for numbers
  const formatNum = (num: number) => num.toLocaleString('th-TH');

  const selectedYearLabel = selectedYear === 'all'
    ? 'ปี 2568 - 2569 (ยอดสะสมทั้งหมด)'
    : `ปีประเมิน ${selectedYear}`;

  return (
    <div className="space-y-6">
      {/* Cards Title Grid */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-l-4 border-purple-800 pl-3">
        <div>
          <h2 className="font-sans text-lg font-bold text-purple-950 sm:text-xl flex items-center gap-2">
            <span>สรุปผลการวิเคราะห์สถิติมุมมองระดับบริหาร</span>
            <span className="text-sm font-semibold rounded-md bg-purple-100 text-purple-800 px-2.5 py-0.5 border border-purple-250">
              {selectedYearLabel}
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            วิเคราะห์กิจกรรมสัมมนา ข้อมูลกิจกรรมความสนใจและผลสัมฤทธิ์สะสมในการเพิ่มพูนทักษะดิจิทัลของ ฝพจ. กฟภ.
          </p>
        </div>
        <span className="inline-flex self-start sm:self-center items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-250">
          <TrendingUp className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
          อัปเดตแบบ Real-time
        </span>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* KPI 1: Participants */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-purple-50/50" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">ผู้เข้ารับการอบรมสะสม</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-750">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-sans text-3xl font-extrabold text-purple-950 sm:text-4xl">
              {formatNum(summary.totalParticipants)}
            </span>
            <span className="ml-1 text-sm font-semibold text-amber-600">คน</span>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            {selectedYear === 'all' ? (
              <>
                <span className="font-semibold text-purple-800">ปี 68: {formatNum(summary.byYear['2568'].participants)} คน</span>
                <span className="text-slate-350">|</span>
                <span className="font-semibold text-purple-800">ปี 69: {formatNum(summary.byYear['2569'].participants)} คน</span>
              </>
            ) : (
              <span className="font-medium text-slate-400">สัดส่วนผู้รับการอบรมในเอกสาร {selectedYearText(selectedYear, summary)}</span>
            )}
          </div>
        </div>

        {/* KPI 2: Total Hours */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-amber-50/50" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">จำนวนชั่วโมงบรรยายความรู้</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-sans text-3xl font-extrabold text-purple-950 sm:text-4xl">
              {formatNum(summary.totalHours)}
            </span>
            <span className="ml-1 text-sm font-semibold text-amber-600">ชั่วโมง</span>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            {selectedYear === 'all' ? (
              <>
                <span className="font-semibold text-amber-700">ปี 68: {formatNum(summary.byYear['2568'].hours)} ชม.</span>
                <span className="text-slate-350">|</span>
                <span className="font-semibold text-amber-700">ปี 69: {formatNum(summary.byYear['2569'].hours)} ชม.</span>
              </>
            ) : (
              <span className="font-medium text-slate-400">ชั่วโมงบรรยายทั้งปีสะสมในระบบดึงสด</span>
            )}
          </div>
        </div>

        {/* KPI 3: Unique Courses */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-purple-50/50" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">หัวข้อ/หลักสูตรพัฒนาทั้งหมด</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-800">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-sans text-3xl font-extrabold text-purple-950 sm:text-4xl">
              {formatNum(summary.uniqueCoursesCount)}
            </span>
            <span className="ml-1 text-sm font-semibold text-amber-600">วิชา</span>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <span>จำนวนคลาสจัดสอนรวม:</span>
            <span className="font-bold text-purple-950">{formatNum(summary.totalRecords)} ครั้ง</span>
          </div>
        </div>

        {/* KPI 4: Target Departments */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-amber-50/50" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">หน่วยงานที่ได้รับการยกระดับ</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Building2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-sans text-3xl font-extrabold text-purple-950 sm:text-4xl">
              {formatNum(summary.uniqueDepartmentsCount)}
            </span>
            <span className="ml-1 text-sm font-semibold text-amber-600">หน่วยงาน</span>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400 justify-between">
            <span className="truncate text-slate-400">ฝ่ายงานส่วนกลางและเขตภูมิภาค</span>
            <span className="font-semibold text-purple-800">ฝพจ. ดูแลครอบคลุม</span>
          </div>
        </div>

      </div>

      {/* Course Domains Title Section */}
      <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-3 pt-2">
        <div>
          <h3 className="font-sans text-base font-bold text-purple-950">
            วิเคราะห์เจาะลึก 3 แกนหลักสูตรเด่นด้านเทคโนโลยี
          </h3>
          <p className="text-xs text-slate-500">
            สรุปชั่วโมงและจำนวนผู้เรียนของ 3 เทคโนโลยีเป้าหมายอัปเกรดเพื่อเร่งสปีดสู่ PEA Digital Utility
          </p>
        </div>
      </div>

      {/* Technical Domains Detail Grid - HIGHLY PROMINENT DESIGN */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Domain Card 1: AI (Deep Violet Elegant Theme) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/90 via-white to-violet-50/40 p-6 shadow-md transition-all hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 hover:ring-violet-400">
          {/* Top subtle decoration strip & side absolute glow */}
          <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600" />
          <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-violet-400/10 blur-xl" />

          {/* Core tech indicator badge */}
          <div className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow">
            <Sparkles className="h-3 w-3 text-amber-300 animate-spin" />
            <span>Core Focus</span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-violet-950">
                ด้าน Artificial Intelligence (AI)
              </h4>
              <p className="text-[11px] font-semibold text-violet-700">
                Generative AI, Agentics, Prompt Engineering
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-violet-950/5 p-4 border border-violet-100">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">เปิดสอนไปแล้ว</span>
              <span className="font-sans text-xl font-black text-violet-900">
                {summary.domains.AI.totalCourses} หลักสูตร
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">ผู้รับการอบรมรวม</span>
              <span className="font-sans text-xl font-black text-violet-900">
                {formatNum(summary.domains.AI.totalParticipants)} คน
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center justify-between border-b border-violet-100 pb-1.5">
              <span className="font-medium">ชั่วโมงสัมมนาสะสม</span>
              <span className="font-extrabold text-violet-950 bg-violet-100/50 px-2 py-0.5 rounded">
                {summary.domains.AI.totalHours} ชั่วโมง
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">สัดส่วนผู้เรียน ปี 2568:</span>
              <span className="font-bold text-violet-800">
                {formatNum(summary.domains.AI.participantCountByYear[2568] || 0)} คน
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">สัดส่วนผู้เรียน ปี 2569:</span>
              <span className="font-bold text-violet-800">
                {formatNum(summary.domains.AI.participantCountByYear[2569] || 0)} คน
              </span>
            </div>
          </div>
        </div>

        {/* Domain Card 2: Automation (Cool Sky Dynamic Theme) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-sky-300 bg-gradient-to-br from-sky-50/90 via-white to-sky-50/30 p-6 shadow-md transition-all hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 hover:ring-sky-400">
          <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-sky-500 via-teal-400 to-sky-600" />
          <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-sky-400/10 blur-xl" />

          {/* Active tech indicator badge */}
          <div className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-sky-700 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow">
            <Zap className="h-3 w-3 text-yellow-300" />
            <span>High Impact</span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-700 text-white shadow-lg shadow-sky-200">
              <Workflow className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-sky-950">
                ด้าน Automation (RPA/n8n)
              </h4>
              <p className="text-[11px] font-semibold text-sky-700">
                Robotic Process Automation, Workflow Integration
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-sky-950/5 p-4 border border-sky-100">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">เปิดสอนไปแล้ว</span>
              <span className="font-sans text-xl font-black text-sky-900">
                {summary.domains.Automation.totalCourses} หลักสูตร
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">ผู้รับการอบรมรวม</span>
              <span className="font-sans text-xl font-black text-sky-900">
                {formatNum(summary.domains.Automation.totalParticipants)} คน
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center justify-between border-b border-sky-100 pb-1.5">
              <span className="font-medium">ชั่วโมงสัมมนาสะสม</span>
              <span className="font-extrabold text-sky-950 bg-sky-100/50 px-2 py-0.5 rounded">
                {summary.domains.Automation.totalHours} ชั่วโมง
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">สัดส่วนผู้เรียน ปี 2568:</span>
              <span className="font-bold text-sky-800">
                {formatNum(summary.domains.Automation.participantCountByYear[2568] || 0)} คน
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">สัดส่วนผู้เรียน ปี 2569:</span>
              <span className="font-bold text-sky-800">
                {formatNum(summary.domains.Automation.participantCountByYear[2569] || 0)} คน
              </span>
            </div>
          </div>
        </div>

        {/* Domain Card 3: Copilot Studio (Luxury Gold Theme) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 p-6 shadow-md transition-all hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 hover:ring-amber-400">
          <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
          <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-amber-400/10 blur-xl" />

          {/* Specialized tech badge */}
          <div className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow">
            <Award className="h-3 w-3 text-amber-200" />
            <span>Innovator</span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-white shadow-lg shadow-amber-200">
              <MessageSquareCode className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-amber-950">
                ด้าน Copilot Studio
              </h4>
              <p className="text-[11px] font-semibold text-amber-700">
                Microsoft Copilot, Interactive AI Chatbots
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-amber-950/5 p-4 border border-amber-100">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">เปิดสอนไปแล้ว</span>
              <span className="font-sans text-xl font-black text-amber-900">
                {summary.domains['Copilot Studio'].totalCourses} หลักสูตร
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">ผู้รับการอบรมรวม</span>
              <span className="font-sans text-xl font-black text-amber-900">
                {formatNum(summary.domains['Copilot Studio'].totalParticipants)} คน
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
              <span className="font-medium">ชั่วโมงสัมมนาสะสม</span>
              <span className="font-extrabold text-amber-950 bg-amber-100/50 px-2 py-0.5 rounded">
                {summary.domains['Copilot Studio'].totalHours} ชั่วโมง
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">สัดส่วนผู้เรียน ปี 2568:</span>
              <span className="font-bold text-amber-800">
                {formatNum(summary.domains['Copilot Studio'].participantCountByYear[2568] || 0)} คน
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">สัดส่วนผู้เรียน ปี 2569:</span>
              <span className="font-bold text-amber-800">
                {formatNum(summary.domains['Copilot Studio'].participantCountByYear[2569] || 0)} คน
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Year detail text helper for clean sub-labels
function selectedYearText(selectedYear: 'all' | '2569' | '2568', summary: any) {
  if (selectedYear === 'all') return 'ทั้งหมด';
  const participants = summary.totalParticipants;
  const yearKey = selectedYear as '2568' | '2569';
  return `เฉพาะปี มค.-ธค. ${selectedYear}`;
}
