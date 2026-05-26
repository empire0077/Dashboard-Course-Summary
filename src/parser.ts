import { TrainingRecord, DashboardData, DomainStats, DepartmentSummary } from './types';

// Robust CSV Row Tokenizer
function parseCSVRow(rowText: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < rowText.length; i++) {
    const char = rowText[i];
    if (char === '"') {
      if (inQuotes && rowText[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchAndParseTrainingData(): Promise<DashboardData> {
  const sheetId1 = '1slVO_LEuwKpz2bLE-pUAsMSupOTwOEOYqyST670nu6w'; // 2568
  const sheetId2 = '1RUjtcig3pYqd_bhi90ILLv7aMLnrEqk8amNvTxfGwHQ'; // 2569

  const tabsConfig = [
    { year: 2568 as const, sheetId: sheetId1, gid: '0', category: 'AI' as const },
    { year: 2568 as const, sheetId: sheetId1, gid: '141974645', category: 'Automation' as const },
    { year: 2568 as const, sheetId: sheetId1, gid: '1288975700', category: 'Copilot Studio' as const },
    { year: 2569 as const, sheetId: sheetId2, gid: '0', category: 'AI' as const },
    { year: 2569 as const, sheetId: sheetId2, gid: '641776211', category: 'Automation' as const },
    { year: 2569 as const, sheetId: sheetId2, gid: '2146379007', category: 'Copilot Studio' as const },
  ];

  const records: TrainingRecord[] = [];

  for (const tab of tabsConfig) {
    const url = `https://docs.google.com/spreadsheets/d/${tab.sheetId}/export?format=csv&gid=${tab.gid}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Failed to fetch ${tab.category} (${tab.year}) from GID ${tab.gid}: ${res.statusText}`);
        continue;
      }
      const rawText = await res.text();
      const lines = rawText.split('\n');
      
      for (const line of lines) {
        if (!line.trim()) continue;
        const columns = parseCSVRow(line);
        if (columns.length < 2) continue;

        // Check if first column is an integer (sequence number)
        const seqVal = columns[0].trim();
        if (/^\d+$/.test(seqVal)) {
          const index = parseInt(seqVal, 10);
          const department = columns[1] || '';
          const objective = columns[2] || '';
          const course = columns[3] || '';
          const date = columns[4] || '';
          
          // Remove internal double quotes if stored parsed like "หลักสูตร ""การประยุกต์..."""
          let courseClean = course;
          if (courseClean.startsWith('"') && courseClean.endsWith('"')) {
            courseClean = courseClean.slice(1, -1);
          }
          courseClean = courseClean.replace(/""/g, '"');

          let deptClean = department;
          if (deptClean.startsWith('"') && deptClean.endsWith('"')) {
            deptClean = deptClean.slice(1, -1);
          }

          // Clean values of commas e.g. "1,703" -> "1703"
          const hoursRaw = (columns[5] || '0').replace(/,/g, '').trim();
          const pRaw = (columns[6] || '0').replace(/,/g, '').trim();

          const hours = parseFloat(hoursRaw) || 0;
          const participants = parseInt(pRaw, 10) || 0;

          if (deptClean && courseClean) {
            records.push({
              id: `${tab.year}-${tab.category}-${index}`,
              year: tab.year,
              category: tab.category,
              index,
              department: deptClean,
              objective,
              course: courseClean,
              date,
              hours,
              participants
            });
          }
        }
      }
    } catch (error: any) {
      console.error(`Error parser-fetch for ${tab.category} in year ${tab.year}:`, error.message);
    }
  }

  // --- COMPUTE AGGREGATIONS ---
  let totalHours = 0;
  let totalParticipants = 0;

  const uniqueDepartments = new Set<string>();
  const uniqueCourses = new Set<string>();

  const byYear = {
    '2568': { recordsCount: 0, hours: 0, participants: 0 },
    '2569': { recordsCount: 0, hours: 0, participants: 0 }
  };

  const domainMap: { [key in 'AI' | 'Automation' | 'Copilot Studio']: DomainStats } = {
    AI: {
      category: 'AI',
      totalCourses: 0,
      totalDepartments: 0,
      totalHours: 0,
      totalParticipants: 0,
      courseCountByYear: { 2568: 0, 2569: 0 },
      participantCountByYear: { 2568: 0, 2569: 0 }
    },
    Automation: {
      category: 'Automation',
      totalCourses: 0,
      totalDepartments: 0,
      totalHours: 0,
      totalParticipants: 0,
      courseCountByYear: { 2568: 0, 2569: 0 },
      participantCountByYear: { 2568: 0, 2569: 0 }
    },
    'Copilot Studio': {
      category: 'Copilot Studio',
      totalCourses: 0,
      totalDepartments: 0,
      totalHours: 0,
      totalParticipants: 0,
      courseCountByYear: { 2568: 0, 2569: 0 },
      participantCountByYear: { 2568: 0, 2569: 0 }
    }
  };

  // Maps for counting domain-specific entries
  const domainDeptsMap: { [key: string]: Set<string> } = {
    AI: new Set(),
    Automation: new Set(),
    'Copilot Studio': new Set()
  };

  const domainCoursesMap: { [key: string]: Set<string> } = {
    AI: new Set(),
    Automation: new Set(),
    'Copilot Studio': new Set()
  };

  // Department Aggregates Map
  const deptSummaryMap = new Map<string, DepartmentSummary>();

  for (const record of records) {
    totalHours += record.hours;
    totalParticipants += record.participants;

    uniqueDepartments.add(record.department);
    uniqueCourses.add(record.course);

    // By Year
    const yearStr = record.year.toString() as '2568' | '2569';
    byYear[yearStr].recordsCount += 1;
    byYear[yearStr].hours += record.hours;
    byYear[yearStr].participants += record.participants;

    // By Domain
    const dm = domainMap[record.category];
    dm.totalHours += record.hours;
    dm.totalParticipants += record.participants;
    dm.courseCountByYear[record.year] = (dm.courseCountByYear[record.year] || 0) + 1;
    dm.participantCountByYear[record.year] = (dm.participantCountByYear[record.year] || 0) + record.participants;
    
    domainDeptsMap[record.category].add(record.department);
    domainCoursesMap[record.category].add(record.course);

    // Department grouping
    let deptSum = deptSummaryMap.get(record.department);
    if (!deptSum) {
      deptSum = {
        name: record.department,
        recordCount: 0,
        totalHours: 0,
        totalParticipants: 0,
        categories: {
          AI: 0,
          Automation: 0,
          'Copilot Studio': 0
        },
        courses: []
      };
      deptSummaryMap.set(record.department, deptSum);
    }

    deptSum.recordCount += 1;
    deptSum.totalHours += record.hours;
    deptSum.totalParticipants += record.participants;
    deptSum.categories[record.category] += 1;
    
    deptSum.courses.push({
      id: record.id,
      courseName: record.course,
      category: record.category,
      year: record.year,
      date: record.date,
      hours: record.hours,
      participants: record.participants,
      objective: record.objective
    });
  }

  // Polish Domain Stats
  for (const category of ['AI', 'Automation', 'Copilot Studio'] as const) {
    domainMap[category].totalCourses = domainCoursesMap[category].size;
    domainMap[category].totalDepartments = domainDeptsMap[category].size;
  }

  // Polish Department summaries, sorted by participant counts descending
  const departmentsSummary = Array.from(deptSummaryMap.values()).sort(
    (a, b) => b.totalParticipants - a.totalParticipants
  );

  return {
    records,
    summary: {
      totalRecords: records.length,
      totalHours: Number(totalHours.toFixed(1)),
      totalParticipants,
      uniqueDepartmentsCount: uniqueDepartments.size,
      uniqueCoursesCount: uniqueCourses.size,
      byYear,
      domains: domainMap
    },
    departmentsSummary,
    timestamp: new Date().toISOString()
  };
}
