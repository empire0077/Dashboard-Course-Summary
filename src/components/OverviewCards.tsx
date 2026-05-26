import React from 'react';
import { Users, Clock, BookOpen, Building2, BrainCircuit, Workflow, MessageSquareCode, Award, TrendingUp } from 'lucide-react';
import { DashboardData } from '../types.js';

interface OverviewCardsProps {
  data: DashboardData;
}

export default function OverviewCards({ data }: OverviewCardsProps) {
  const { summary } = data;

  // Format helper for numbers
  const formatNum = (num: number) => num.toLocaleString('th-TH');

  return (
    <div className="space-y-6">
      {/* Cards Title Grid */}
      <div className="flex items-center justify-between border-l-4 border-purple-800 pl-3">
        <div>
          <h2 className="font-sans text-lg font-bold text-purple-950 sm:text-xl">
            สรุปภาพรวมการอบรมให้ความรู้ (สรุปยอดสะสมปี 2568 - 2569)
          </h2>
          <p className="text-xs text-slate-500">
            วิเคราะห์ข้อมูลกิจกรรมความสนใจ ผลสะสมการจัดทำหลักสูตรนวัตกรรมและการเพิ่มพูนทักษะพนักงาน
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-800 border border-purple-100 sm:flex">
          <TrendingUp className="h-3.5 w-3.5 text-purple-700" />
          ขับเคลื่อนด้วยเทคโนโลยี
        </span>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* KPI 1: Participants */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-purple-50/50" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ผู้เข้ารับการอบรมสะสม</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-sans text-3xl font-extrabold text-purple-950 sm:text-4xl">
              {formatNum(summary.totalParticipants)}
            </span>
            <span className="ml-1 text-sm font-semibold text-amber-600">คน</span>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <span>แบ่งเป็น:</span>
            <span className="font-medium text-purple-800">ปี 68: {formatNum(summary.byYear['2568'].participants)} คน</span>
            <span className="text-slate-300">|</span>
            <span className="font-medium text-purple-800">ปี 69: {formatNum(summary.byYear['2569'].participants)} คน</span>
          </div>
        </div>

        {/* KPI 2: Total Hours */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-amber-50/50" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">จำนวนชั่วโมงบรรยายรวม</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-sans text-3xl font-extrabold text-purple-950 sm:text-4xl">
              {formatNum(summary.totalHours)}
            </span>
            <span className="ml-1 text-sm font-semibold text-amber-600">ชั่วโมง</span>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <span>แบ่งเป็น:</span>
            <span className="font-medium text-amber-700">ปี 68: {formatNum(summary.byYear['2568'].hours)} ชม.</span>
            <span className="text-slate-300">|</span>
            <span className="font-medium text-amber-700">ปี 69: {formatNum(summary.byYear['2569'].hours)} ชม.</span>
          </div>
        </div>

        {/* KPI 3: Unique Courses */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-purple-50/50" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">หลักสูตรจัดอบรมทั้งหมด</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-800">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-sans text-3xl font-extrabold text-purple-950 sm:text-4xl">
              {formatNum(summary.uniqueCoursesCount)}
            </span>
            <span className="ml-1 text-sm font-semibold text-amber-600">วิชา</span>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <span>จำนวนรอบสอนสะสม:</span>
            <span className="font-bold text-purple-950">{formatNum(summary.totalRecords)} ครั้ง</span>
            <span className="text-slate-300">|</span>
            <span>ปี 68: {summary.byYear['2568'].recordsCount} ครั้ง</span>
          </div>
        </div>

        {/* KPI 4: Target Departments */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-amber-50/50" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">หน่วยงานที่ได้รับการสอน</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-sans text-3xl font-extrabold text-purple-950 sm:text-4xl">
              {formatNum(summary.uniqueDepartmentsCount)}
            </span>
            <span className="ml-1 text-sm font-semibold text-amber-600">หน่วยงาน</span>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400 justify-between">
            <span className="truncate">ครอบคลุมส่วนกลางและสาขาเขต</span>
            <span className="font-semibold text-purple-800">100% Core AI</span>
          </div>
        </div>

      </div>

      {/* Technical Domains Detail Bento Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        
        {/* Domain Card 1: AI */}
        <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm ring-1 ring-purple-500/5 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700 ring-1 ring-purple-100">
              <BrainCircuit className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-purple-950 sm:text-base">ด้าน Artificial Intelligence (AI)</h3>
              <p className="text-[11px] text-slate-400">Generative AI, Agentics, Prompt Engineering</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50/60 p-4 border border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 block line-clamp-1">หลักสูตรที่สร้าง</span>
              <span className="font-sans text-lg font-extrabold text-purple-900">
                {summary.domains.AI.totalCourses} หลักสูตร
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block line-clamp-1">พนักงานอบรมรวม</span>
              <span className="font-sans text-lg font-extrabold text-purple-900">
                {formatNum(summary.domains.AI.totalParticipants)} คน
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>ชั่วโมงบรรยายรวม</span>
              <span className="font-bold text-slate-800">{summary.domains.AI.totalHours} ชั่วโมง</span>
            </div>
            <div className="flex items-center justify-between border-t border-dotted border-slate-200 pt-2 text-[11px]">
              <span className="text-slate-400">ยอดพนักงาน ปี 2568:</span>
              <span className="font-semibold text-purple-700">{formatNum(summary.domains.AI.participantCountByYear[2568] || 0)} คน</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">ยอดพนักงาน ปี 2569:</span>
              <span className="font-semibold text-purple-700">{formatNum(summary.domains.AI.participantCountByYear[2569] || 0)} คน</span>
            </div>
          </div>
        </div>

        {/* Domain Card 2: Automation (RPA) */}
        <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm ring-1 ring-purple-500/5 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
              <Workflow className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-sky-950 sm:text-base">ด้าน Automation (RPA/n8n)</h3>
              <p className="text-[11px] text-slate-400">Robotic Process Automation, Workflow</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50/60 p-4 border border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 block line-clamp-1">หลักสูตรที่สร้าง</span>
              <span className="font-sans text-lg font-extrabold text-sky-900">
                {summary.domains.Automation.totalCourses} หลักสูตร
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block line-clamp-1">พนักงานอบรมรวม</span>
              <span className="font-sans text-lg font-extrabold text-sky-900">
                {formatNum(summary.domains.Automation.totalParticipants)} คน
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>ชั่วโมงบรรยายรวม</span>
              <span className="font-bold text-slate-800">{summary.domains.Automation.totalHours} ชั่วโมง</span>
            </div>
            <div className="flex items-center justify-between border-t border-dotted border-slate-200 pt-2 text-[11px]">
              <span className="text-slate-400">ยอดพนักงาน ปี 2568:</span>
              <span className="font-semibold text-sky-700">{formatNum(summary.domains.Automation.participantCountByYear[2568] || 0)} คน</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">ยอดพนักงาน ปี 2569:</span>
              <span className="font-semibold text-sky-700">{formatNum(summary.domains.Automation.participantCountByYear[2569] || 0)} คน</span>
            </div>
          </div>
        </div>

        {/* Domain Card 3: Copilot Studio */}
        <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm ring-1 ring-purple-500/5 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              <MessageSquareCode className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950 sm:text-base">ด้าน Copilot Studio</h3>
              <p className="text-[11px] text-slate-400">Microsoft Copilot Studio, Interactive Chatbots</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50/60 p-4 border border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 block line-clamp-1">หลักสูตรที่สร้าง</span>
              <span className="font-sans text-lg font-extrabold text-amber-900">
                {summary.domains['Copilot Studio'].totalCourses} หลักสูตร
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block line-clamp-1">พนักงานอบรมรวม</span>
              <span className="font-sans text-lg font-extrabold text-amber-900">
                {formatNum(summary.domains['Copilot Studio'].totalParticipants)} คน
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>ชั่วโมงบรรยายรวม</span>
              <span className="font-bold text-slate-800">{summary.domains['Copilot Studio'].totalHours} ชั่วโมง</span>
            </div>
            <div className="flex items-center justify-between border-t border-dotted border-slate-200 pt-2 text-[11px]">
              <span className="text-slate-400">ยอดพนักงาน ปี 2568:</span>
              <span className="font-semibold text-amber-700">{formatNum(summary.domains['Copilot Studio'].participantCountByYear[2568] || 0)} คน</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">ยอดพนักงาน ปี 2569:</span>
              <span className="font-semibold text-amber-700">{formatNum(summary.domains['Copilot Studio'].participantCountByYear[2569] || 0)} คน</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
