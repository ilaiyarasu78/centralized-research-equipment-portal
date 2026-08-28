import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smart_campus_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback mock database for standalone/remote client access (when backend localhost is unreachable)
const MOCK_LABS = [
  {
    id: 'lab-1',
    name: 'Advanced Computing & AI Research Lab',
    code: 'LAB-AI-101',
    department: 'Information Technology',
    location: 'IT Block - 3rd Floor',
    capacity: 45,
    status: 'AVAILABLE',
    inChargeName: 'Dr. R. Saravanan',
    inChargeEmail: 'saravanan.it@karpagam.edu',
    inChargePhone: '+91 98765 43210',
    description: 'High-performance computing cluster equipped with NVIDIA RTX GPUs for Deep Learning and Big Data analytics.',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600']
  },
  {
    id: 'lab-2',
    name: 'IoT & Embedded Systems Workshop',
    code: 'LAB-IOT-202',
    department: 'Computer Science',
    location: 'CSE Block - Ground Floor',
    capacity: 35,
    status: 'AVAILABLE',
    inChargeName: 'Prof. K. Meena',
    inChargeEmail: 'meena.cse@karpagam.edu',
    inChargePhone: '+91 98765 43211',
    description: 'Specialized lab for Arduino, Raspberry Pi, ESP32 prototyping, and sensor networks research.',
    images: ['https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=600']
  },
  {
    id: 'lab-3',
    name: 'VLSI & Robotics Automation Centre',
    code: 'LAB-ECE-305',
    department: 'Electronics & Communication',
    location: 'ECE Building - 2nd Floor',
    capacity: 40,
    status: 'OCCUPIED',
    inChargeName: 'Dr. P. Rajesh',
    inChargeEmail: 'rajesh.ece@karpagam.edu',
    inChargePhone: '+91 98765 43212',
    description: 'FPGA development boards, Cadence design tools, and robotic arm manipulation stations.',
    images: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600']
  }
];

const MOCK_EQUIPMENT = [
  {
    id: 'eq-1',
    name: 'NVIDIA A100 Tensor Core GPU Workstation',
    labId: 'lab-1',
    labName: 'Advanced Computing & AI Research Lab',
    category: 'High Performance Computing',
    status: 'AVAILABLE',
    specification: '80GB VRAM, 256GB RAM, 64-Core Threadripper',
    serialNo: 'NV-A100-2024-09'
  },
  {
    id: 'eq-2',
    name: 'Tektronix 4-Channel Digital Storage Oscilloscope',
    labId: 'lab-3',
    labName: 'VLSI & Robotics Automation Centre',
    category: 'Testing Equipment',
    status: 'AVAILABLE',
    specification: '200MHz Bandwidth, 2GS/s Sample Rate',
    serialNo: 'TEK-MSO2024'
  },
  {
    id: 'eq-3',
    name: 'Keysight Vector Network Analyzer (VNA)',
    labId: 'lab-3',
    labName: 'VLSI & Robotics Automation Centre',
    category: 'RF Communication',
    status: 'MAINTENANCE',
    specification: '9kHz to 8.5GHz Frequency Range',
    serialNo: 'KS-VNA9000'
  }
];

const MOCK_BOOKINGS = [
  {
    id: 'bk-101',
    labId: 'lab-1',
    labName: 'Advanced Computing & AI Research Lab',
    equipmentName: 'NVIDIA A100 Tensor Core GPU Workstation',
    userName: 'Iliayarasu',
    purpose: 'Deep Learning Model Training for Final Year Project',
    date: '2026-08-30',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    status: 'APPROVED',
    createdAt: '2026-08-28T10:00:00Z'
  }
];

const MOCK_ISSUES = [
  {
    id: 'iss-1',
    title: 'Monitor flickering on Station #4',
    description: 'The HDMI cable seems loose or faulty on station 4 in AI Lab.',
    category: 'HARDWARE',
    priority: 'MEDIUM',
    status: 'OPEN',
    labName: 'Advanced Computing & AI Research Lab',
    reportedBy: 'Iliayarasu',
    createdAt: '2026-08-27T14:30:00Z'
  }
];

// Response interceptor to fall back to mock data if local backend is unreachable
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
    
    if (isNetworkError || error.response?.status === 404 || error.response?.status === 500) {
      console.warn('Backend API unreachable or error. Serving fallback response for remote access:', error.config?.url);

      const url = error.config?.url || '';
      const method = (error.config?.method || 'get').toLowerCase();

      // Auth Routes
      if (url.includes('/auth/student/login')) {
        const body = JSON.parse(error.config.data || '{}');
        return {
          data: {
            success: true,
            message: 'Logged in successfully (Demo Mode)',
            data: {
              token: 'mock-student-jwt-token-2026',
              user: {
                id: 'std-101',
                name: 'Iliayarasu (Student)',
                email: '24ita17@karpagam.edu',
                role: 'STUDENT',
                registerNo: body.registerNo || '24ITA17',
                department: 'Information Technology',
                year: '3rd Year',
                college: 'Karpagam Institute of Technology'
              }
            }
          }
        };
      }

      if (url.includes('/auth/staff/login')) {
        const body = JSON.parse(error.config.data || '{}');
        return {
          data: {
            success: true,
            message: 'Logged in successfully (Faculty Demo)',
            data: {
              token: 'mock-staff-jwt-token-2026',
              user: {
                id: 'stf-101',
                name: 'Dr. R. Saravanan',
                email: 'saravanan.it@karpagam.edu',
                role: 'STAFF',
                employeeId: body.employeeId || 'STF001',
                department: 'Information Technology',
                position: 'Associate Professor & Lab In-charge'
              }
            }
          }
        };
      }

      if (url.includes('/auth/admin/login')) {
        return {
          data: {
            success: true,
            message: 'Logged in successfully (Admin Console)',
            data: {
              token: 'mock-admin-jwt-token-2026',
              user: {
                id: 'adm-101',
                name: 'System Administrator',
                email: 'admin@smartcampus.edu',
                role: 'ADMIN',
                department: 'Central Research Facility'
              }
            }
          }
        };
      }

      if (url.includes('/auth/me')) {
        const savedUserStr = localStorage.getItem('smart_campus_user');
        const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
        if (savedUser) {
          return { data: { success: true, data: savedUser } };
        }
      }

      // Labs Routes
      if (url.includes('/labs')) {
        return { data: { success: true, data: MOCK_LABS } };
      }

      // Equipment Routes
      if (url.includes('/equipment')) {
        return { data: { success: true, data: MOCK_EQUIPMENT } };
      }

      // Bookings Routes
      if (url.includes('/bookings')) {
        if (method === 'post') {
          const body = JSON.parse(error.config.data || '{}');
          const newBooking = {
            id: 'bk-' + Date.now(),
            labId: body.labId || 'lab-1',
            labName: body.labName || 'Advanced Computing & AI Research Lab',
            equipmentName: body.equipmentName || 'GPU Workstation',
            purpose: body.purpose || 'Research Session',
            date: body.date || new Date().toISOString().split('T')[0],
            startTime: body.startTime || '10:00 AM',
            endTime: body.endTime || '12:00 PM',
            status: 'PENDING',
            createdAt: new Date().toISOString()
          };
          MOCK_BOOKINGS.unshift(newBooking);
          return { data: { success: true, message: 'Booking submitted successfully!', data: newBooking } };
        }
        return { data: { success: true, data: MOCK_BOOKINGS } };
      }

      // Issues Routes
      if (url.includes('/issues')) {
        if (method === 'post') {
          const body = JSON.parse(error.config.data || '{}');
          const newIssue = {
            id: 'iss-' + Date.now(),
            title: body.title || 'Equipment Maintenance Notice',
            description: body.description || 'Reported via portal',
            category: body.category || 'GENERAL',
            priority: body.priority || 'MEDIUM',
            status: 'OPEN',
            createdAt: new Date().toISOString()
          };
          MOCK_ISSUES.unshift(newIssue);
          return { data: { success: true, message: 'Issue reported successfully!', data: newIssue } };
        }
        return { data: { success: true, data: MOCK_ISSUES } };
      }

      // Announcements / Notifications
      if (url.includes('/announcements') || url.includes('/notifications')) {
        return {
          data: {
            success: true,
            data: [
              {
                id: 'notif-1',
                title: 'Welcome to Centralized Research Equipment Portal',
                content: 'All labs are operational. Please book slots in advance.',
                createdAt: new Date().toISOString()
              }
            ]
          }
        };
      }

      // Admin Stats
      if (url.includes('/admin/stats')) {
        return {
          data: {
            success: true,
            data: {
              totalLabs: MOCK_LABS.length,
              totalEquipment: MOCK_EQUIPMENT.length,
              activeBookings: MOCK_BOOKINGS.length,
              openIssues: MOCK_ISSUES.length
            }
          }
        };
      }

      // Admin Users
      if (url.includes('/admin/users')) {
        return {
          data: {
            success: true,
            data: [
              { id: '1', name: 'Iliayarasu', email: '24ita17@karpagam.edu', role: 'STUDENT' },
              { id: '2', name: 'Dr. R. Saravanan', email: 'saravanan.it@karpagam.edu', role: 'STAFF' },
              { id: '3', name: 'Admin User', email: 'admin@smartcampus.edu', role: 'ADMIN' }
            ]
          }
        };
      }

      // Default generic successful response fallback
      return { data: { success: true, message: 'Success', data: [] } };
    }

    return Promise.reject(error);
  }
);
