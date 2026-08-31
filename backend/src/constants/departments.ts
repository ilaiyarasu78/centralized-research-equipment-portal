export interface DepartmentInfo {
  code: string;
  name: string;
}

export const DEPARTMENTS: DepartmentInfo[] = [
  { code: 'CSE', name: 'Computer Science and Engineering' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'ECE', name: 'Electronics and Communication Engineering' },
  { code: 'EEE', name: 'Electrical and Electronics Engineering' },
  { code: 'MECH', name: 'Mechanical Engineering' },
  { code: 'CIVIL', name: 'Civil Engineering' },
  { code: 'AIDS', name: 'Artificial Intelligence and Data Science' },
  { code: 'AIML', name: 'Artificial Intelligence and Machine Learning' }
];

export const DEPARTMENT_CODES = DEPARTMENTS.map(d => d.code);
