export type Role = 'STUDENT' | 'STAFF' | 'ADMIN';

export interface StudentProfileData {
  id: string;
  userId: string;
  registerNo: string;
  department: string;
  program: string;
  year: number;
  semester: number;
  section: string;
  batch: string;
  admissionYear: number;
  phone?: string;
  personalEmail?: string;
  college: string;
  academicStatus: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  accountStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLoginAt?: string | Date;
  createdAt?: string | Date;
  registerNo?: string;
  employeeId?: string;
  department?: string;
  personalEmail?: string;
  phone?: string;
  program?: string;
  year?: number;
  semester?: number;
  section?: string;
  batch?: string;
  admissionYear?: number;
  college?: string;
  academicStatus?: string;
  position?: string;
  studentProfile?: StudentProfileData;
}

export interface Lab {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  location: string;
  capacity: number;
  openingHours: string;
  status: string;
  image?: string;
  isAvailable: boolean;
  totalEquipments?: number;
  availableEquipments?: number;
}

export interface Equipment {
  id: string;
  name: string;
  equipmentId: string;
  category: string;
  labId: string;
  manufacturer?: string;
  model?: string;
  description?: string;
  specifications?: string;
  status: 'AVAILABLE' | 'BOOKED' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
  isAvailable: boolean;
  image?: string;
  lab?: {
    id: string;
    name: string;
    location: string;
  };
}

export interface Booking {
  id: string;
  userId: string;
  equipmentId: string;
  labId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  rejectionReason?: string;
  createdAt: string;
  equipment?: Equipment;
  lab?: Lab;
  user?: {
    name: string;
    email: string;
  };
}

export interface Issue {
  id: string;
  issueNo: string;
  userId: string;
  labId?: string;
  equipmentId?: string;
  title: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  description: string;
  imageUrl?: string;
  resolutionNotes?: string;
  assignedStaffId?: string;
  createdAt: string;
  lab?: Lab;
  equipment?: Equipment;
  user?: {
    name: string;
    email: string;
  };
  assignedStaff?: {
    name: string;
    avatar?: string;
  };
  comments?: IssueComment[];
}

export interface IssueComment {
  id: string;
  issueId: string;
  userId: string;
  content: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  isImportant: boolean;
  createdAt: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

export interface LostFoundItem {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  status: 'LOST' | 'FOUND' | 'CLAIMED';
  contactInfo: string;
  imageUrl?: string;
  createdAt: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  category: string;
  lat: number;
  lng: number;
  floor: string;
  labId?: string;
  description?: string;
}
