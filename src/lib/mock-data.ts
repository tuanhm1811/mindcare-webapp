// Mock Data for MindCare AI Assistant Prototype

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  diagnoses: Diagnosis[];
  medications: Medication[];
  riskLevel: 'low' | 'medium' | 'high';
  treatmentStartDate: string;
  totalSessions: number;
  lastSessionDate: string;
  nextSessionDate?: string;
  status: 'active' | 'inactive' | 'discharged';
  notes?: string;
}

export interface Diagnosis {
  code: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosedDate: string;
  status: 'active' | 'in_remission' | 'resolved';
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  prescribedBy: string;
  notes?: string;
}

export interface Session {
  id: string;
  patientId: string;
  patientName: string;
  clinicianId: string;
  scheduledAt: string;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  sessionType: 'initial' | 'follow_up' | 'crisis' | 'assessment';
  sessionNumber: number;
  chiefConcern?: string;
  notes?: ClinicalNote;
}

export interface ClinicalNote {
  id: string;
  sessionId: string;
  noteType: 'SOAP' | 'DAP' | 'BIRP' | 'free_form';
  content: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    data?: string;
    intervention?: string;
    response?: string;
    freeText?: string;
  };
  mood?: string;
  affect?: string;
  appearance?: string;
  aiSummary?: string;
  homework?: string[];
  riskAssessment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assessment {
  id: string;
  patientId: string;
  sessionId?: string;
  toolType: 'PHQ9' | 'GAD7' | 'PCL5' | 'AUDIT' | 'CSSRS';
  score: number;
  maxScore: number;
  interpretation: string;
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  responses: Record<string, number>;
  administeredAt: string;
}

export interface AIInsight {
  type: 'risk' | 'pattern' | 'suggestion' | 'progress';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  relatedData?: string;
}

export interface TodaySchedule {
  session: Session;
  patient: Patient;
}

// Session History with full details
export interface ConversationMessage {
  id: string;
  speaker: 'clinician' | 'patient';
  content: string;
  timestamp: string;
  tags?: string[]; // e.g., 'key_insight', 'risk_indicator', 'progress'
}

export interface SessionHistory {
  id: string;
  sessionId: string;
  patientId: string;
  patientName: string;
  sessionNumber: number;
  sessionDate: string;
  duration: number;
  sessionType: 'initial' | 'follow_up' | 'crisis' | 'assessment';
  status: 'completed' | 'cancelled' | 'no_show';

  // Summary
  summary: {
    chiefConcern: string;
    keyPoints: string[];
    progress: string;
    moodState: 'improved' | 'stable' | 'declined';
    riskLevel: 'low' | 'medium' | 'high';
  };

  // Full conversation transcript
  conversation: ConversationMessage[];

  // Clinical notes
  clinicalNote: {
    noteType: 'SOAP' | 'DAP' | 'BIRP';
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };

  // Homework & follow-up
  homework: {
    task: string;
    status: 'assigned' | 'completed' | 'partial' | 'not_done';
    notes?: string;
  }[];

  // Assessment scores if any
  assessments?: {
    toolType: string;
    score: number;
    maxScore: number;
    interpretation: string;
  }[];

  // AI-generated insights
  aiInsights?: string[];

  // Additional notes
  additionalNotes?: string;
}

// Mock Patients Data
export const mockPatients: Patient[] = [
  {
    id: 'P001',
    firstName: 'Văn A',
    lastName: 'Nguyễn',
    dateOfBirth: '1998-03-15',
    age: 28,
    gender: 'male',
    phone: '0901234567',
    email: 'nguyenvana@email.com',
    address: 'Quận 1, TP. Hồ Chí Minh',
    emergencyContact: {
      name: 'Nguyễn Thị Mẹ',
      relationship: 'Mẹ',
      phone: '0907654321'
    },
    diagnoses: [
      {
        code: 'F32.1',
        name: 'Rối loạn trầm cảm chủ yếu, mức độ trung bình',
        severity: 'moderate',
        diagnosedDate: '2024-01-15',
        status: 'active'
      }
    ],
    medications: [
      {
        name: 'Sertraline',
        dosage: '50mg',
        frequency: '1 lần/ngày, buổi sáng',
        startDate: '2024-01-20',
        prescribedBy: 'BS. Trần Văn B'
      }
    ],
    riskLevel: 'low',
    treatmentStartDate: '2024-01-15',
    totalSessions: 12,
    lastSessionDate: '2024-02-01',
    nextSessionDate: '2024-02-04',
    status: 'active'
  },
  {
    id: 'P002',
    firstName: 'Thị B',
    lastName: 'Trần',
    dateOfBirth: '1991-07-22',
    age: 35,
    gender: 'female',
    phone: '0912345678',
    email: 'tranthib@email.com',
    address: 'Quận 3, TP. Hồ Chí Minh',
    emergencyContact: {
      name: 'Trần Văn Chồng',
      relationship: 'Chồng',
      phone: '0918765432'
    },
    diagnoses: [
      {
        code: 'F41.1',
        name: 'Rối loạn lo âu lan tỏa',
        severity: 'mild',
        diagnosedDate: '2024-02-01',
        status: 'active'
      }
    ],
    medications: [],
    riskLevel: 'low',
    treatmentStartDate: '2024-02-01',
    totalSessions: 5,
    lastSessionDate: '2024-01-28',
    nextSessionDate: '2024-02-04',
    status: 'active'
  },
  {
    id: 'P003',
    firstName: 'Văn C',
    lastName: 'Lê',
    dateOfBirth: '1981-11-08',
    age: 45,
    gender: 'male',
    phone: '0923456789',
    email: 'levanc@email.com',
    address: 'Quận 7, TP. Hồ Chí Minh',
    emergencyContact: {
      name: 'Lê Thị Vợ',
      relationship: 'Vợ',
      phone: '0929876543'
    },
    diagnoses: [
      {
        code: 'F31.1',
        name: 'Rối loạn lưỡng cực I, giai đoạn hưng cảm hiện tại',
        severity: 'severe',
        diagnosedDate: '2023-06-10',
        status: 'active'
      }
    ],
    medications: [
      {
        name: 'Lithium',
        dosage: '600mg',
        frequency: '2 lần/ngày',
        startDate: '2023-06-15',
        prescribedBy: 'BS. Trần Văn B'
      },
      {
        name: 'Quetiapine',
        dosage: '200mg',
        frequency: '1 lần/ngày, trước khi ngủ',
        startDate: '2023-07-01',
        prescribedBy: 'BS. Trần Văn B'
      }
    ],
    riskLevel: 'high',
    treatmentStartDate: '2023-06-10',
    totalSessions: 28,
    lastSessionDate: '2024-01-30',
    nextSessionDate: '2024-02-04',
    status: 'active'
  },
  {
    id: 'P004',
    firstName: 'Thị D',
    lastName: 'Phạm',
    dateOfBirth: '2004-05-20',
    age: 22,
    gender: 'female',
    phone: '0934567890',
    email: 'phamthid@email.com',
    address: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    emergencyContact: {
      name: 'Phạm Văn Bố',
      relationship: 'Bố',
      phone: '0930987654'
    },
    diagnoses: [
      {
        code: 'F40.10',
        name: 'Rối loạn lo âu xã hội',
        severity: 'moderate',
        diagnosedDate: '2024-01-10',
        status: 'active'
      }
    ],
    medications: [],
    riskLevel: 'low',
    treatmentStartDate: '2024-01-10',
    totalSessions: 6,
    lastSessionDate: '2024-01-25',
    status: 'active'
  },
  {
    id: 'P005',
    firstName: 'Văn E',
    lastName: 'Hoàng',
    dateOfBirth: '1971-09-12',
    age: 55,
    gender: 'male',
    phone: '0945678901',
    email: 'hoangvane@email.com',
    address: 'Quận Tân Bình, TP. Hồ Chí Minh',
    emergencyContact: {
      name: 'Hoàng Thị Vợ',
      relationship: 'Vợ',
      phone: '0941098765'
    },
    diagnoses: [
      {
        code: 'F43.10',
        name: 'Rối loạn stress sau sang chấn (PTSD)',
        severity: 'severe',
        diagnosedDate: '2023-09-01',
        status: 'active'
      }
    ],
    medications: [
      {
        name: 'Paroxetine',
        dosage: '40mg',
        frequency: '1 lần/ngày',
        startDate: '2023-09-15',
        prescribedBy: 'BS. Trần Văn B'
      },
      {
        name: 'Prazosin',
        dosage: '2mg',
        frequency: '1 lần/ngày, trước khi ngủ',
        startDate: '2023-10-01',
        prescribedBy: 'BS. Trần Văn B'
      }
    ],
    riskLevel: 'high',
    treatmentStartDate: '2023-09-01',
    totalSessions: 20,
    lastSessionDate: '2024-01-29',
    status: 'active'
  },
  {
    id: 'P006',
    firstName: 'Thị F',
    lastName: 'Vũ',
    dateOfBirth: '1996-02-28',
    age: 30,
    gender: 'female',
    phone: '0956789012',
    email: 'vuthif@email.com',
    address: 'Quận 10, TP. Hồ Chí Minh',
    emergencyContact: {
      name: 'Vũ Văn Anh',
      relationship: 'Anh trai',
      phone: '0952109876'
    },
    diagnoses: [
      {
        code: 'F41.0',
        name: 'Rối loạn hoảng sợ',
        severity: 'moderate',
        diagnosedDate: '2023-11-15',
        status: 'active'
      }
    ],
    medications: [
      {
        name: 'Escitalopram',
        dosage: '10mg',
        frequency: '1 lần/ngày',
        startDate: '2023-11-20',
        prescribedBy: 'BS. Trần Văn B'
      }
    ],
    riskLevel: 'medium',
    treatmentStartDate: '2023-11-15',
    totalSessions: 10,
    lastSessionDate: '2024-01-27',
    status: 'active'
  },
  {
    id: 'P007',
    firstName: 'Văn G',
    lastName: 'Đặng',
    dateOfBirth: '1986-12-05',
    age: 40,
    gender: 'male',
    phone: '0967890123',
    email: 'dangvang@email.com',
    address: 'Quận Phú Nhuận, TP. Hồ Chí Minh',
    emergencyContact: {
      name: 'Đặng Thị Vợ',
      relationship: 'Vợ',
      phone: '0963210987'
    },
    diagnoses: [
      {
        code: 'F42.2',
        name: 'Rối loạn ám ảnh cưỡng chế (OCD)',
        severity: 'moderate',
        diagnosedDate: '2023-08-20',
        status: 'active'
      }
    ],
    medications: [
      {
        name: 'Fluvoxamine',
        dosage: '150mg',
        frequency: '1 lần/ngày',
        startDate: '2023-09-01',
        prescribedBy: 'BS. Trần Văn B'
      }
    ],
    riskLevel: 'medium',
    treatmentStartDate: '2023-08-20',
    totalSessions: 18,
    lastSessionDate: '2024-01-26',
    status: 'active'
  },
  {
    id: 'P008',
    firstName: 'Thị H',
    lastName: 'Bùi',
    dateOfBirth: '2001-08-17',
    age: 25,
    gender: 'female',
    phone: '0978901234',
    email: 'buithih@email.com',
    address: 'Quận 5, TP. Hồ Chí Minh',
    emergencyContact: {
      name: 'Bùi Thị Mẹ',
      relationship: 'Mẹ',
      phone: '0974321098'
    },
    diagnoses: [
      {
        code: 'F60.3',
        name: 'Rối loạn nhân cách ranh giới (BPD)',
        severity: 'severe',
        diagnosedDate: '2023-05-10',
        status: 'active'
      }
    ],
    medications: [
      {
        name: 'Lamotrigine',
        dosage: '100mg',
        frequency: '1 lần/ngày',
        startDate: '2023-06-01',
        prescribedBy: 'BS. Trần Văn B'
      }
    ],
    riskLevel: 'high',
    treatmentStartDate: '2023-05-10',
    totalSessions: 35,
    lastSessionDate: '2024-02-02',
    status: 'active'
  },
  {
    id: 'P009',
    firstName: 'Văn I',
    lastName: 'Ngô',
    dateOfBirth: '1966-04-10',
    age: 60,
    gender: 'male',
    phone: '0989012345',
    email: 'ngovani@email.com',
    address: 'Quận 2, TP. Hồ Chí Minh',
    emergencyContact: {
      name: 'Ngô Thị Vợ',
      relationship: 'Vợ',
      phone: '0985432109'
    },
    diagnoses: [
      {
        code: 'F32.2',
        name: 'Trầm cảm tuổi già',
        severity: 'moderate',
        diagnosedDate: '2023-12-01',
        status: 'active'
      }
    ],
    medications: [
      {
        name: 'Mirtazapine',
        dosage: '30mg',
        frequency: '1 lần/ngày, trước khi ngủ',
        startDate: '2023-12-10',
        prescribedBy: 'BS. Trần Văn B'
      }
    ],
    riskLevel: 'medium',
    treatmentStartDate: '2023-12-01',
    totalSessions: 8,
    lastSessionDate: '2024-01-24',
    status: 'active'
  },
  {
    id: 'P010',
    firstName: 'Thị K',
    lastName: 'Đỗ',
    dateOfBirth: '2008-01-25',
    age: 18,
    gender: 'female',
    phone: '0990123456',
    email: 'dothik@email.com',
    address: 'Quận Gò Vấp, TP. Hồ Chí Minh',
    emergencyContact: {
      name: 'Đỗ Văn Bố',
      relationship: 'Bố',
      phone: '0996543210'
    },
    diagnoses: [
      {
        code: 'F43.21',
        name: 'Rối loạn thích ứng với khí sắc trầm cảm',
        severity: 'mild',
        diagnosedDate: '2024-01-20',
        status: 'active'
      }
    ],
    medications: [],
    riskLevel: 'low',
    treatmentStartDate: '2024-01-20',
    totalSessions: 3,
    lastSessionDate: '2024-01-31',
    status: 'active'
  }
];

// Helper to get current week dates
const getThisWeekDate = (dayOffset: number, hour: number) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOffset - dayOfWeek;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);
  targetDate.setHours(hour, 0, 0, 0);
  return targetDate.toISOString();
};

// Mock Sessions Data (This week's schedule)
export const mockSessions: Session[] = [
  // Monday (day 1)
  {
    id: 'S001',
    patientId: 'P001',
    patientName: 'Nguyễn Văn A',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(1, 9),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 13,
    chiefConcern: 'Theo dõi tiến triển điều trị trầm cảm'
  },
  {
    id: 'S002',
    patientId: 'P002',
    patientName: 'Trần Thị B',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(1, 10),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 6,
    chiefConcern: 'Quản lý lo âu trong công việc'
  },
  {
    id: 'S003',
    patientId: 'P004',
    patientName: 'Phạm Thị D',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(1, 14),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 7,
    chiefConcern: 'Lo âu xã hội - Kỹ năng giao tiếp'
  },
  // Tuesday (day 2)
  {
    id: 'S004',
    patientId: 'P003',
    patientName: 'Lê Văn C',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(2, 9),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 29,
    chiefConcern: 'Đánh giá ổn định khí sắc'
  },
  {
    id: 'S005',
    patientId: 'P006',
    patientName: 'Vũ Thị F',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(2, 11),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 11,
    chiefConcern: 'Rối loạn hoảng sợ - Kỹ thuật thở'
  },
  {
    id: 'S006',
    patientId: 'P008',
    patientName: 'Bùi Thị H',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(2, 14),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 36,
    chiefConcern: 'DBT skills training - Emotion regulation'
  },
  // Wednesday (day 3)
  {
    id: 'S007',
    patientId: 'P005',
    patientName: 'Hoàng Văn E',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(3, 9),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 21,
    chiefConcern: 'PTSD - Xử lý ký ức sang chấn'
  },
  {
    id: 'S008',
    patientId: 'P007',
    patientName: 'Đặng Văn G',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(3, 10),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 19,
    chiefConcern: 'OCD - ERP therapy'
  },
  {
    id: 'S009',
    patientId: 'P009',
    patientName: 'Ngô Văn I',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(3, 14),
    duration: 50,
    status: 'scheduled',
    sessionType: 'assessment',
    sessionNumber: 9,
    chiefConcern: 'Đánh giá định kỳ trầm cảm tuổi già'
  },
  // Thursday (day 4)
  {
    id: 'S010',
    patientId: 'P001',
    patientName: 'Nguyễn Văn A',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(4, 9),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 14,
    chiefConcern: 'CBT - Tái cấu trúc nhận thức'
  },
  {
    id: 'S011',
    patientId: 'P010',
    patientName: 'Đỗ Thị K',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(4, 10),
    duration: 50,
    status: 'scheduled',
    sessionType: 'initial',
    sessionNumber: 4,
    chiefConcern: 'Rối loạn thích ứng - Hỗ trợ tâm lý'
  },
  {
    id: 'S012',
    patientId: 'P003',
    patientName: 'Lê Văn C',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(4, 15),
    duration: 50,
    status: 'scheduled',
    sessionType: 'crisis',
    sessionNumber: 30,
    chiefConcern: 'Theo dõi khẩn cấp - Dấu hiệu hưng cảm'
  },
  // Friday (day 5)
  {
    id: 'S013',
    patientId: 'P002',
    patientName: 'Trần Thị B',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(5, 9),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 7,
    chiefConcern: 'Lo âu - Kỹ năng đối phó stress'
  },
  {
    id: 'S014',
    patientId: 'P008',
    patientName: 'Bùi Thị H',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(5, 11),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 37,
    chiefConcern: 'DBT - Interpersonal effectiveness'
  },
  {
    id: 'S015',
    patientId: 'P005',
    patientName: 'Hoàng Văn E',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(5, 14),
    duration: 50,
    status: 'scheduled',
    sessionType: 'assessment',
    sessionNumber: 22,
    chiefConcern: 'PCL-5 assessment'
  },
  // Saturday (day 6)
  {
    id: 'S016',
    patientId: 'P006',
    patientName: 'Vũ Thị F',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(6, 9),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 12,
    chiefConcern: 'Panic disorder - Exposure therapy'
  },
  {
    id: 'S017',
    patientId: 'P004',
    patientName: 'Phạm Thị D',
    clinicianId: 'C001',
    scheduledAt: getThisWeekDate(6, 10),
    duration: 50,
    status: 'scheduled',
    sessionType: 'follow_up',
    sessionNumber: 8,
    chiefConcern: 'Social anxiety - Role play practice'
  }
];

// Mock Assessments
export const mockAssessments: Assessment[] = [
  // Patient P001 - Depression
  {
    id: 'A001',
    patientId: 'P001',
    sessionId: 'S001',
    toolType: 'PHQ9',
    score: 9,
    maxScore: 27,
    interpretation: 'Trầm cảm mức độ nhẹ',
    severity: 'mild',
    responses: { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 1, q7: 1, q8: 1, q9: 1 },
    administeredAt: '2024-02-01'
  },
  {
    id: 'A002',
    patientId: 'P001',
    toolType: 'PHQ9',
    score: 14,
    maxScore: 27,
    interpretation: 'Trầm cảm mức độ trung bình',
    severity: 'moderate',
    responses: { q1: 2, q2: 2, q3: 1, q4: 2, q5: 1, q6: 2, q7: 1, q8: 2, q9: 1 },
    administeredAt: '2024-01-15'
  },
  {
    id: 'A003',
    patientId: 'P001',
    toolType: 'PHQ9',
    score: 18,
    maxScore: 27,
    interpretation: 'Trầm cảm mức độ trung bình-nặng',
    severity: 'moderately_severe',
    responses: { q1: 2, q2: 3, q3: 2, q4: 2, q5: 2, q6: 2, q7: 2, q8: 2, q9: 1 },
    administeredAt: '2024-01-01'
  },
  // Patient P002 - Anxiety
  {
    id: 'A004',
    patientId: 'P002',
    toolType: 'GAD7',
    score: 8,
    maxScore: 21,
    interpretation: 'Lo âu mức độ nhẹ',
    severity: 'mild',
    responses: { q1: 1, q2: 1, q3: 1, q4: 2, q5: 1, q6: 1, q7: 1 },
    administeredAt: '2024-01-28'
  },
  {
    id: 'A005',
    patientId: 'P002',
    toolType: 'GAD7',
    score: 12,
    maxScore: 21,
    interpretation: 'Lo âu mức độ trung bình',
    severity: 'moderate',
    responses: { q1: 2, q2: 2, q3: 2, q4: 2, q5: 1, q6: 2, q7: 1 },
    administeredAt: '2024-02-01'
  },
  // Patient P005 - PTSD
  {
    id: 'A006',
    patientId: 'P005',
    toolType: 'PCL5',
    score: 45,
    maxScore: 80,
    interpretation: 'Triệu chứng PTSD có ý nghĩa lâm sàng',
    severity: 'moderate',
    responses: {},
    administeredAt: '2024-01-29'
  }
];

// Mock AI Insights for Patient P001
export const mockAIInsights: Record<string, AIInsight[]> = {
  P001: [
    {
      type: 'progress',
      title: 'Cải thiện điểm PHQ-9',
      description: 'Điểm PHQ-9 giảm từ 18 xuống 9 trong 4 tuần qua, cho thấy đáp ứng tốt với điều trị.',
      priority: 'low'
    },
    {
      type: 'pattern',
      title: 'Pattern giấc ngủ',
      description: 'Bệnh nhân thường báo cáo triệu chứng tệ hơn sau những đêm ngủ ít hơn 6 tiếng.',
      priority: 'medium'
    },
    {
      type: 'suggestion',
      title: 'Gợi ý buổi tới',
      description: 'Cân nhắc tập trung vào kỹ năng quản lý stress công việc - đây là trigger chính được ghi nhận.',
      priority: 'high'
    }
  ],
  P003: [
    {
      type: 'risk',
      title: 'Theo dõi lithium',
      description: 'Cần xét nghiệm lithium định kỳ - lần cuối cách đây 6 tuần.',
      priority: 'high'
    },
    {
      type: 'pattern',
      title: 'Dấu hiệu hưng cảm',
      description: 'Ghi nhận giảm nhu cầu ngủ và tăng năng lượng trong 2 buổi gần nhất.',
      priority: 'high'
    }
  ],
  P005: [
    {
      type: 'risk',
      title: 'Triggers cần tránh',
      description: 'Bệnh nhân phản ứng mạnh với âm thanh lớn và đông người - tránh exposure therapy quá nhanh.',
      priority: 'high'
    },
    {
      type: 'progress',
      title: 'Cải thiện ác mộng',
      description: 'Prazosin giúp giảm tần suất ác mộng từ 5/tuần xuống 1-2/tuần.',
      priority: 'low'
    }
  ],
  P008: [
    {
      type: 'risk',
      title: 'Risk of self-harm',
      description: 'Bệnh nhân có tiền sử tự gây thương tích - cần đánh giá hàng buổi.',
      priority: 'high'
    },
    {
      type: 'suggestion',
      title: 'DBT Focus',
      description: 'Tiếp tục module Emotion Regulation, bệnh nhân đang áp dụng tốt TIPP skills.',
      priority: 'medium'
    }
  ]
};

// Sample clinical note for ongoing session
export const sampleClinicalNote: ClinicalNote = {
  id: 'N001',
  sessionId: 'S001',
  noteType: 'SOAP',
  content: {
    subjective: 'Bệnh nhân báo cáo cảm thấy tốt hơn tuần này. Ngủ được 6-7 tiếng/đêm, cải thiện so với 4-5 tiếng trước đó. Vẫn còn lo lắng về deadline công việc nhưng đã sử dụng kỹ thuật thở để quản lý.',
    objective: '',
    assessment: '',
    plan: ''
  },
  mood: 'neutral',
  affect: 'congruent',
  appearance: 'neat',
  createdAt: '2024-02-04T09:00:00',
  updatedAt: '2024-02-04T09:15:00'
};

// Last session summary for pre-session brief
export const lastSessionSummary = {
  patientId: 'P001',
  sessionDate: '2024-02-01',
  keyPoints: [
    'Bệnh nhân báo cáo giấc ngủ cải thiện sau khi áp dụng sleep hygiene',
    'Đã thảo luận về CBT techniques cho negative thoughts',
    'Homework: Ghi nhật ký mood 3 lần/ngày'
  ],
  homework: [
    { task: 'Ghi nhật ký mood', status: 'completed' },
    { task: 'Tập thể dục 30 phút/ngày', status: 'partial' },
    { task: 'Thực hành kỹ thuật thở khi stress', status: 'completed' }
  ],
  riskLevel: 'low',
  nextFocusAreas: [
    'Tiếp tục theo dõi giấc ngủ',
    'Bắt đầu behavioral activation',
    'Đánh giá PHQ-9'
  ]
};

// Clinician profile
export const currentClinician = {
  id: 'C001',
  name: 'BS. Trần Văn B',
  title: 'Bác sĩ Tâm thần',
  credentials: 'MD, Board Certified Psychiatrist',
  specialty: 'Mood Disorders, Anxiety',
  email: 'dr.tranvanb@mindcare.vn',
  avatar: '/avatars/doctor.png'
};

// Dashboard stats
export const dashboardStats = {
  totalPatients: 24,
  activePatients: 22,
  totalSessions: 156,
  sessionsThisWeek: 18,
  pendingNotes: 3,
  upcomingAssessments: 5
};

// Mock Session History Data - Detailed past sessions
export const mockSessionHistory: SessionHistory[] = [
  // Patient P001 - Nguyễn Văn A - Session 12
  {
    id: 'SH001',
    sessionId: 'S-P001-12',
    patientId: 'P001',
    patientName: 'Nguyễn Văn A',
    sessionNumber: 12,
    sessionDate: '2024-02-01T09:00:00',
    duration: 50,
    sessionType: 'follow_up',
    status: 'completed',
    summary: {
      chiefConcern: 'Theo dõi tiến triển điều trị trầm cảm',
      keyPoints: [
        'Giấc ngủ cải thiện đáng kể (6-7 tiếng/đêm)',
        'Đã áp dụng thành công kỹ thuật thở khi stress',
        'Vẫn còn lo lắng về công việc nhưng kiểm soát được',
        'Điểm PHQ-9 giảm từ 14 xuống 9'
      ],
      progress: 'Bệnh nhân có tiến triển tích cực. Triệu chứng trầm cảm giảm rõ rệt so với buổi trước.',
      moodState: 'improved',
      riskLevel: 'low'
    },
    conversation: [
      {
        id: 'c1',
        speaker: 'clinician',
        content: 'Chào anh A, tuần này anh cảm thấy như thế nào?',
        timestamp: '09:00'
      },
      {
        id: 'c2',
        speaker: 'patient',
        content: 'Dạ chào bác sĩ. Em thấy tốt hơn tuần trước nhiều ạ. Đặc biệt là việc ngủ, em ngủ được 6-7 tiếng mỗi đêm rồi.',
        timestamp: '09:01',
        tags: ['progress']
      },
      {
        id: 'c3',
        speaker: 'clinician',
        content: 'Rất tốt! Vậy là kỹ thuật sleep hygiene đã có hiệu quả. Còn về tâm trạng thì sao?',
        timestamp: '09:02'
      },
      {
        id: 'c4',
        speaker: 'patient',
        content: 'Tâm trạng em cũng đỡ hơn ạ. Vẫn có lúc lo lắng về deadline công việc, nhưng em đã thử dùng kỹ thuật thở như bác sĩ hướng dẫn và thấy bớt căng thẳng.',
        timestamp: '09:03',
        tags: ['key_insight']
      },
      {
        id: 'c5',
        speaker: 'clinician',
        content: 'Anh có thể kể chi tiết hơn về những lúc lo lắng không?',
        timestamp: '09:05'
      },
      {
        id: 'c6',
        speaker: 'patient',
        content: 'Dạ, thường là buổi tối khi em nghĩ về những việc phải làm ngày hôm sau. Nhưng em đã học cách viết ra danh sách và không để nó ảnh hưởng đến giấc ngủ nữa.',
        timestamp: '09:06',
        tags: ['key_insight', 'progress']
      },
      {
        id: 'c7',
        speaker: 'clinician',
        content: 'Đó là một chiến lược rất tốt. Tuần này chúng ta sẽ thảo luận thêm về cách xử lý những suy nghĩ tiêu cực. Anh có nhận thấy pattern nào trong những suy nghĩ đó không?',
        timestamp: '09:08'
      },
      {
        id: 'c8',
        speaker: 'patient',
        content: 'Em hay nghĩ là mình sẽ làm không tốt, mọi người sẽ thất vọng về mình...',
        timestamp: '09:10',
        tags: ['key_insight']
      },
      {
        id: 'c9',
        speaker: 'clinician',
        content: 'Đây là một dạng cognitive distortion gọi là "fortune telling" - dự đoán kết quả tiêu cực. Hôm nay chúng ta sẽ học cách nhận diện và thách thức những suy nghĩ này.',
        timestamp: '09:12'
      }
    ],
    clinicalNote: {
      noteType: 'SOAP',
      subjective: 'Bệnh nhân báo cáo cải thiện giấc ngủ (6-7 tiếng/đêm so với 4-5 tiếng trước đó). Tâm trạng tốt hơn. Vẫn còn lo lắng về công việc nhưng đã kiểm soát được bằng kỹ thuật thở và viết danh sách. Nhận diện được pattern suy nghĩ tiêu cực "fortune telling".',
      objective: 'Bệnh nhân đến đúng giờ, ăn mặc gọn gàng. Giao tiếp mắt tốt. Giọng nói bình thường. Affect phù hợp với nội dung. Không có dấu hiệu psychomotor agitation hay retardation. PHQ-9: 9/27 (giảm từ 14).',
      assessment: 'F32.1 - Rối loạn trầm cảm chủ yếu, mức độ trung bình - đang cải thiện. Đáp ứng tốt với điều trị kết hợp (thuốc + CBT). Không có ý định tự hại.',
      plan: '1. Tiếp tục Sertraline 50mg/ngày\n2. Tiếp tục CBT - bắt đầu cognitive restructuring\n3. Homework: Ghi nhật ký mood 3 lần/ngày, nhận diện cognitive distortions\n4. Tái khám sau 1 tuần'
    },
    homework: [
      { task: 'Ghi nhật ký mood 3 lần/ngày', status: 'assigned' },
      { task: 'Nhận diện và ghi lại cognitive distortions', status: 'assigned' },
      { task: 'Tiếp tục kỹ thuật thở khi stress', status: 'assigned' }
    ],
    assessments: [
      { toolType: 'PHQ-9', score: 9, maxScore: 27, interpretation: 'Trầm cảm mức độ nhẹ' }
    ],
    aiInsights: [
      'Bệnh nhân có tiến triển tích cực với điểm PHQ-9 giảm 5 điểm',
      'Sleep hygiene đã có hiệu quả - cân nhắc giảm focus vào giấc ngủ',
      'Nhận diện được cognitive distortion - sẵn sàng cho cognitive restructuring'
    ],
    additionalNotes: 'Bệnh nhân có động lực điều trị tốt. Tuân thủ thuốc đầy đủ. Gia đình hỗ trợ tích cực.'
  },

  // Patient P001 - Session 11
  {
    id: 'SH002',
    sessionId: 'S-P001-11',
    patientId: 'P001',
    patientName: 'Nguyễn Văn A',
    sessionNumber: 11,
    sessionDate: '2024-01-25T09:00:00',
    duration: 50,
    sessionType: 'follow_up',
    status: 'completed',
    summary: {
      chiefConcern: 'Khó ngủ và lo âu công việc',
      keyPoints: [
        'Giấc ngủ vẫn khó khăn (4-5 tiếng/đêm)',
        'Áp lực công việc tăng cao',
        'Đã hướng dẫn sleep hygiene',
        'Bắt đầu kỹ thuật thở'
      ],
      progress: 'Triệu chứng ổn định nhưng chưa cải thiện rõ rệt.',
      moodState: 'stable',
      riskLevel: 'low'
    },
    conversation: [
      {
        id: 'c1',
        speaker: 'clinician',
        content: 'Anh A, tuần này tình hình giấc ngủ như thế nào?',
        timestamp: '09:00'
      },
      {
        id: 'c2',
        speaker: 'patient',
        content: 'Dạ vẫn khó ngủ lắm bác sĩ. Em chỉ ngủ được 4-5 tiếng, hay thức dậy giữa đêm.',
        timestamp: '09:01'
      },
      {
        id: 'c3',
        speaker: 'clinician',
        content: 'Anh có thể mô tả routine buổi tối của anh không?',
        timestamp: '09:02'
      },
      {
        id: 'c4',
        speaker: 'patient',
        content: 'Em thường làm việc đến 10-11 giờ đêm, rồi lướt điện thoại một lúc mới ngủ.',
        timestamp: '09:03',
        tags: ['key_insight']
      },
      {
        id: 'c5',
        speaker: 'clinician',
        content: 'Tôi thấy có vài điểm chúng ta có thể cải thiện. Hôm nay tôi sẽ hướng dẫn anh về sleep hygiene.',
        timestamp: '09:05'
      }
    ],
    clinicalNote: {
      noteType: 'SOAP',
      subjective: 'Bệnh nhân tiếp tục khó ngủ (4-5 tiếng/đêm), hay thức dậy giữa đêm. Áp lực công việc cao, làm việc muộn. Tâm trạng chưa cải thiện.',
      objective: 'PHQ-9: 14/27 (không đổi). Appearance neat. Affect mildly anxious. Speech normal rate.',
      assessment: 'F32.1 - Trầm cảm mức độ trung bình. Mất ngủ có thể do poor sleep hygiene. Cần can thiệp behavior.',
      plan: '1. Giữ Sertraline 50mg\n2. Hướng dẫn sleep hygiene\n3. Kỹ thuật thở để giảm stress\n4. Homework: Áp dụng sleep hygiene, ghi lại giấc ngủ'
    },
    homework: [
      { task: 'Ngưng dùng điện thoại 1 tiếng trước khi ngủ', status: 'completed', notes: 'Đã làm được 5/7 ngày' },
      { task: 'Không làm việc sau 9 giờ tối', status: 'partial', notes: 'Khó thực hiện do deadline' },
      { task: 'Thực hành kỹ thuật thở trước khi ngủ', status: 'completed' }
    ],
    assessments: [
      { toolType: 'PHQ-9', score: 14, maxScore: 27, interpretation: 'Trầm cảm mức độ trung bình' }
    ],
    aiInsights: [
      'Poor sleep hygiene là yếu tố chính gây mất ngủ',
      'Cần theo dõi sát nếu không cải thiện sau 1 tuần'
    ]
  },

  // Patient P003 - Lê Văn C - Session 28 (High risk patient)
  {
    id: 'SH003',
    sessionId: 'S-P003-28',
    patientId: 'P003',
    patientName: 'Lê Văn C',
    sessionNumber: 28,
    sessionDate: '2024-01-30T10:00:00',
    duration: 50,
    sessionType: 'follow_up',
    status: 'completed',
    summary: {
      chiefConcern: 'Theo dõi ổn định khí sắc - Bipolar I',
      keyPoints: [
        'Khí sắc ổn định, không có dấu hiệu hưng cảm',
        'Ngủ đều 7 tiếng/đêm',
        'Tuân thủ thuốc tốt',
        'Xét nghiệm lithium trong ngưỡng'
      ],
      progress: 'Ổn định trong giai đoạn euthymic.',
      moodState: 'stable',
      riskLevel: 'medium'
    },
    conversation: [
      {
        id: 'c1',
        speaker: 'clinician',
        content: 'Anh C, tôi thấy kết quả xét nghiệm lithium của anh rất tốt. Tuần này anh cảm thấy thế nào?',
        timestamp: '10:00'
      },
      {
        id: 'c2',
        speaker: 'patient',
        content: 'Dạ em thấy ổn bác sĩ. Không có cảm giác phấn khích quá mức hay buồn chán gì.',
        timestamp: '10:01'
      },
      {
        id: 'c3',
        speaker: 'clinician',
        content: 'Giấc ngủ thì sao?',
        timestamp: '10:02'
      },
      {
        id: 'c4',
        speaker: 'patient',
        content: 'Em ngủ đều 7 tiếng mỗi đêm ạ.',
        timestamp: '10:03',
        tags: ['progress']
      },
      {
        id: 'c5',
        speaker: 'clinician',
        content: 'Rất tốt. Anh có thấy mình đang có năng lượng nhiều hơn bình thường không? Nói nhiều hơn? Ít cần ngủ hơn?',
        timestamp: '10:04'
      },
      {
        id: 'c6',
        speaker: 'patient',
        content: 'Không ạ, em thấy bình thường.',
        timestamp: '10:05'
      }
    ],
    clinicalNote: {
      noteType: 'SOAP',
      subjective: 'Bệnh nhân báo cáo khí sắc ổn định. Ngủ 7 tiếng/đêm. Không có triệu chứng hưng cảm (tăng năng lượng, giảm nhu cầu ngủ, nói nhiều). Không có triệu chứng trầm cảm.',
      objective: 'Lithium level: 0.8 mEq/L (trong ngưỡng). Euthymic. Speech normal rate and volume. No psychomotor changes. Insight good.',
      assessment: 'F31.1 - Bipolar I, hiện ổn định (euthymic). Đáp ứng tốt với Lithium + Quetiapine.',
      plan: '1. Tiếp tục Lithium 600mg x2/ngày, Quetiapine 200mg hs\n2. Xét nghiệm lithium sau 6 tuần\n3. Theo dõi dấu hiệu sớm của episode mới\n4. Tái khám sau 1 tuần'
    },
    homework: [
      { task: 'Theo dõi mood chart hàng ngày', status: 'assigned' },
      { task: 'Báo cáo ngay nếu có dấu hiệu bất thường', status: 'assigned' }
    ],
    assessments: [],
    aiInsights: [
      'Đã ổn định 3 tháng - cân nhắc tăng interval tái khám',
      'Lithium level tốt - tiếp tục liều hiện tại'
    ],
    additionalNotes: 'Gia đình được giáo dục về dấu hiệu sớm của episode hưng cảm.'
  },

  // Patient P008 - Bùi Thị H - Session 35 (DBT - BPD)
  {
    id: 'SH004',
    sessionId: 'S-P008-35',
    patientId: 'P008',
    patientName: 'Bùi Thị H',
    sessionNumber: 35,
    sessionDate: '2024-01-29T14:00:00',
    duration: 50,
    sessionType: 'follow_up',
    status: 'completed',
    summary: {
      chiefConcern: 'DBT skills training - Distress tolerance',
      keyPoints: [
        'Đã sử dụng TIPP skills thành công trong tuần',
        'Không có hành vi tự gây thương tích',
        'Xung đột với bạn trai nhưng đã xử lý tốt',
        'Urges to self-harm giảm'
      ],
      progress: 'Tiến triển tích cực trong việc áp dụng DBT skills.',
      moodState: 'improved',
      riskLevel: 'high'
    },
    conversation: [
      {
        id: 'c1',
        speaker: 'clinician',
        content: 'H, trước tiên tôi muốn hỏi - tuần này có hành vi tự gây thương tích nào không?',
        timestamp: '14:00'
      },
      {
        id: 'c2',
        speaker: 'patient',
        content: 'Dạ không ạ. Em có urges nhưng đã dùng TIPP.',
        timestamp: '14:01',
        tags: ['risk_indicator', 'progress']
      },
      {
        id: 'c3',
        speaker: 'clinician',
        content: 'Rất tốt! Hãy kể cho tôi nghe về tình huống đó.',
        timestamp: '14:02'
      },
      {
        id: 'c4',
        speaker: 'patient',
        content: 'Em và bạn trai cãi nhau. Em rất tức giận và muốn... như trước. Nhưng em đã chạy bộ thật nhanh, rồi dội nước lạnh lên mặt.',
        timestamp: '14:03',
        tags: ['key_insight']
      },
      {
        id: 'c5',
        speaker: 'clinician',
        content: 'Đó chính xác là TIPP - Temperature và Intense exercise. Em đã làm rất giỏi!',
        timestamp: '14:05'
      },
      {
        id: 'c6',
        speaker: 'patient',
        content: 'Dạ, sau đó em bình tĩnh hơn và gọi điện cho bạn trai nói chuyện lại.',
        timestamp: '14:06',
        tags: ['progress']
      }
    ],
    clinicalNote: {
      noteType: 'SOAP',
      subjective: 'Bệnh nhân báo cáo không có hành vi tự hại trong tuần. Có urges sau xung đột với bạn trai nhưng đã áp dụng TIPP skills thành công (chạy bộ, nước lạnh). Sau đó giải quyết xung đột bằng giao tiếp.',
      objective: 'Alert, cooperative. No new scars or injuries. Affect reactive, appropriate. Good eye contact.',
      assessment: 'F60.3 - BPD. Tiến triển tích cực với DBT. Distress tolerance skills đang effective. Risk of self-harm giảm nhưng vẫn cần monitor.',
      plan: '1. Tiếp tục Lamotrigine 100mg\n2. DBT next: Emotion regulation\n3. Homework: Diary card, practice identifying emotions\n4. Safety plan vẫn active'
    },
    homework: [
      { task: 'Hoàn thành diary card mỗi ngày', status: 'assigned' },
      { task: 'Practice nhận diện cảm xúc trước khi react', status: 'assigned' },
      { task: 'Gọi crisis line nếu urges > 7/10', status: 'assigned' }
    ],
    assessments: [],
    aiInsights: [
      'DBT skills đang effective - chuyển sang emotion regulation',
      'Risk giảm nhưng cần tiếp tục monitor',
      'Relationship với bạn trai là trigger chính'
    ],
    additionalNotes: 'Safety plan reviewed. Emergency contacts confirmed.'
  },

  // Patient P005 - Hoàng Văn E - Session 20 (PTSD)
  {
    id: 'SH005',
    sessionId: 'S-P005-20',
    patientId: 'P005',
    patientName: 'Hoàng Văn E',
    sessionNumber: 20,
    sessionDate: '2024-01-22T15:00:00',
    duration: 50,
    sessionType: 'follow_up',
    status: 'completed',
    summary: {
      chiefConcern: 'PTSD - Xử lý ký ức sang chấn',
      keyPoints: [
        'Ác mộng giảm còn 1-2 lần/tuần',
        'Prazosin có hiệu quả',
        'Bắt đầu PE therapy',
        'Tránh đám đông nhưng đang tập từ từ'
      ],
      progress: 'Cải thiện triệu chứng hyperarousal. Bắt đầu exposure therapy.',
      moodState: 'improved',
      riskLevel: 'medium'
    },
    conversation: [
      {
        id: 'c1',
        speaker: 'clinician',
        content: 'Anh E, Prazosin đang dùng thế nào?',
        timestamp: '15:00'
      },
      {
        id: 'c2',
        speaker: 'patient',
        content: 'Dạ tốt hơn nhiều bác sĩ. Tuần này em chỉ có 2 đêm ác mộng thôi.',
        timestamp: '15:01',
        tags: ['progress']
      },
      {
        id: 'c3',
        speaker: 'clinician',
        content: 'So với 5-6 lần trước đó, đây là tiến bộ lớn. Còn flashbacks thì sao?',
        timestamp: '15:02'
      },
      {
        id: 'c4',
        speaker: 'patient',
        content: 'Vẫn có, nhất là khi nghe tiếng ồn lớn đột ngột. Nhưng em đã biết cách grounding.',
        timestamp: '15:03',
        tags: ['key_insight']
      },
      {
        id: 'c5',
        speaker: 'clinician',
        content: 'Hôm nay chúng ta sẽ bắt đầu prolonged exposure. Tôi sẽ giải thích quy trình trước.',
        timestamp: '15:05'
      }
    ],
    clinicalNote: {
      noteType: 'SOAP',
      subjective: 'Ác mộng giảm 1-2 lần/tuần (từ 5-6). Flashbacks vẫn có khi triggered bởi tiếng ồn lớn nhưng đã áp dụng grounding. Tránh đám đông.',
      objective: 'PCL-5: 45 (giảm từ 55). Hypervigilant nhưng đỡ hơn. Cooperative với treatment.',
      assessment: 'F43.10 - PTSD, đang cải thiện. Prazosin effective cho nightmares. Ready for PE.',
      plan: '1. Tiếp tục Paroxetine 40mg, Prazosin 2mg\n2. Bắt đầu Prolonged Exposure\n3. In vivo exposure hierarchy created\n4. Homework: Listen to session recording daily'
    },
    homework: [
      { task: 'Nghe lại recording imaginal exposure mỗi ngày', status: 'assigned' },
      { task: 'In vivo: đi siêu thị vào giờ vắng', status: 'assigned' }
    ],
    assessments: [
      { toolType: 'PCL-5', score: 45, maxScore: 80, interpretation: 'PTSD có ý nghĩa lâm sàng, cải thiện' }
    ],
    aiInsights: [
      'Prazosin effective - tiếp tục liều hiện tại',
      'Ready for trauma processing',
      'Avoid flooding - gradual exposure'
    ]
  }
];

// Helper functions
export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find(p => p.id === id);
}

export function getSessionsByPatientId(patientId: string): Session[] {
  return mockSessions.filter(s => s.patientId === patientId);
}

export function getAssessmentsByPatientId(patientId: string): Assessment[] {
  return mockAssessments.filter(a => a.patientId === patientId);
}

export function getAIInsightsByPatientId(patientId: string): AIInsight[] {
  return mockAIInsights[patientId] || [];
}

export function getTodaySchedule(): TodaySchedule[] {
  return mockSessions.map(session => ({
    session,
    patient: getPatientById(session.patientId)!
  }));
}

export function getSessionHistoryByPatientId(patientId: string): SessionHistory[] {
  return mockSessionHistory.filter(sh => sh.patientId === patientId);
}

export function getSessionHistoryById(id: string): SessionHistory | undefined {
  return mockSessionHistory.find(sh => sh.id === id);
}

export function getAllSessionHistory(): SessionHistory[] {
  return mockSessionHistory;
}
