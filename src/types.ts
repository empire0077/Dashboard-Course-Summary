export interface TrainingRecord {
  id: string;
  year: 2568 | 2569;
  category: 'AI' | 'Automation' | 'Copilot Studio';
  index: number;
  department: string;
  objective: string;
  course: string;
  date: string;
  hours: number;
  participants: number;
}

export interface DomainStats {
  category: 'AI' | 'Automation' | 'Copilot Studio';
  totalCourses: number;
  totalDepartments: number;
  totalHours: number;
  totalParticipants: number;
  courseCountByYear: { [year: number]: number };
  participantCountByYear: { [year: number]: number };
}

export interface DepartmentSummary {
  name: string;
  recordCount: number;
  totalHours: number;
  totalParticipants: number;
  categories: {
    AI: number;
    Automation: number;
    'Copilot Studio': number;
  };
  courses: Array<{
    id: string;
    courseName: string;
    category: 'AI' | 'Automation' | 'Copilot Studio';
    year: number;
    date: string;
    hours: number;
    participants: number;
    objective: string;
  }>;
}

export interface DashboardData {
  records: TrainingRecord[];
  summary: {
    totalRecords: number;
    totalHours: number;
    totalParticipants: number;
    uniqueDepartmentsCount: number;
    uniqueCoursesCount: number;
    byYear: {
      '2568': {
        recordsCount: number;
        hours: number;
        participants: number;
      };
      '2569': {
        recordsCount: number;
        hours: number;
        participants: number;
      };
    };
    domains: {
      AI: DomainStats;
      Automation: DomainStats;
      'Copilot Studio': DomainStats;
    };
  };
  departmentsSummary: DepartmentSummary[];
  timestamp: string; // Dynamic fetch timestamp
}
