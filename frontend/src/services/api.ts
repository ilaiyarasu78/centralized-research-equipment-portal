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
    id: 'lab-idea-01',
    name: 'AICTE IDEA LAB',
    code: 'LAB-IDEA-01',
    category: 'Innovation Hub',
    department: 'Electronics & Prototyping',
    location: 'Block A, 1st Floor, Room 102',
    capacity: 45,
    status: 'OPERATIONAL',
    openingHours: '08:00 AM - 09:00 PM',
    inChargeName: 'Prof. Rajesh Kumar',
    inChargeEmail: 'rajesh.k@smartcampus.edu',
    inChargePhone: '+91 98765 11111',
    description: 'Advanced prototyping, PCB fabrication, 3D printing, SMT and fabrication tools.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    totalEquipments: 45,
    availableEquipments: 14
  },
  {
    id: 'lab-cad-02',
    name: 'CADENCE LAB',
    code: 'LAB-CAD-02',
    category: 'VLSI Design',
    department: 'VLSI & Microelectronics',
    location: 'Block B, 2nd Floor, Room 205',
    capacity: 35,
    status: 'OPERATIONAL',
    openingHours: '08:30 AM - 07:00 PM',
    inChargeName: 'Dr. Meena Sundaram',
    inChargeEmail: 'meena.s@smartcampus.edu',
    inChargePhone: '+91 98765 22222',
    description: 'Industry standard EDA tools for VLSI design, simulation and verification.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    totalEquipments: 38,
    availableEquipments: 9
  },
  {
    id: 'lab-syn-03',
    name: 'SYNOPSYS LAB',
    code: 'LAB-SYN-03',
    category: 'EDA Suite',
    department: 'Semiconductor Engineering',
    location: 'Block B, 2nd Floor, Room 208',
    capacity: 30,
    status: 'OPERATIONAL',
    openingHours: '09:00 AM - 06:00 PM',
    inChargeName: 'Dr. Meena Sundaram',
    inChargeEmail: 'meena.s@smartcampus.edu',
    inChargePhone: '+91 98765 22222',
    description: 'Comprehensive EDA solutions for design, verification and sign-off flows.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    totalEquipments: 32,
    availableEquipments: 10
  },
  {
    id: 'lab-mat-04',
    name: 'MATLAB LAB',
    code: 'LAB-MAT-04',
    category: 'Computing',
    department: 'Computer Science',
    location: 'Block C, 3rd Floor, Room 310',
    capacity: 50,
    status: 'OPERATIONAL',
    openingHours: '08:00 AM - 08:00 PM',
    inChargeName: 'Dr. R. Saravanan',
    inChargeEmail: 'saravanan.it@karpagam.edu',
    inChargePhone: '+91 98765 43210',
    description: 'High performance computing, modeling, simulation and data analysis tools.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    totalEquipments: 50,
    availableEquipments: 20
  },
  {
    id: 'lab-lview-05',
    name: 'LABVIEW LAB',
    code: 'LAB-LVIEW-05',
    category: 'Virtual Instrumentation',
    department: 'Instrumentation Engineering',
    location: 'Block A, Ground Floor, Room 004',
    capacity: 25,
    status: 'OPERATIONAL',
    openingHours: '09:00 AM - 05:30 PM',
    inChargeName: 'Prof. K. Meena',
    inChargeEmail: 'meena.cse@karpagam.edu',
    inChargePhone: '+91 98765 43211',
    description: 'Test, measurement and control systems design using NI LabVIEW platform.',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
    totalEquipments: 30,
    availableEquipments: 11
  },
  {
    id: 'lab-ti-06',
    name: 'TEXAS INNOVATION LAB',
    code: 'LAB-TI-06',
    category: 'Embedded Systems',
    department: 'IoT & Embedded Systems',
    location: 'Innovation Tower, 4th Floor',
    capacity: 40,
    status: 'OPERATIONAL',
    openingHours: '08:00 AM - 10:00 PM',
    inChargeName: 'Prof. Rajesh Kumar',
    inChargeEmail: 'rajesh.k@smartcampus.edu',
    inChargePhone: '+91 98765 11111',
    description: 'IoT, Robotics, Embedded development and advanced innovation projects.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800',
    totalEquipments: 40,
    availableEquipments: 18
  },
  {
    id: 'lab-lib-07',
    name: 'LIBRARY',
    code: 'LAB-LIB-07',
    category: 'Knowledge Center',
    department: 'Central Library',
    location: 'Central Library Building',
    capacity: 200,
    status: 'OPERATIONAL',
    openingHours: '24/7 Access',
    inChargeName: 'Dr. S. Arunkumar',
    inChargeEmail: 'admin@smartcampus.edu',
    inChargePhone: '+91 98765 43210',
    description: 'Access to books, journals, digital resources, e-books and research materials.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    totalEquipments: 65,
    availableEquipments: 28
  },
  {
    id: 'lab-rai-08',
    name: 'ROBOTICS LAB',
    code: 'LAB-RAI-08',
    category: 'Robotics & AI',
    department: 'Robotics & Automation',
    location: 'Innovation Wing, 3rd Floor',
    capacity: 35,
    status: 'OPERATIONAL',
    openingHours: '08:30 AM - 08:30 PM',
    inChargeName: 'Dr. P. Rajesh',
    inChargeEmail: 'rajesh.ece@karpagam.edu',
    inChargePhone: '+91 98765 43212',
    description: 'Autonomous drones, industrial arm manipulation, edge AI perception & ROS development.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    totalEquipments: 26,
    availableEquipments: 7
  }
];

const MOCK_EQUIPMENT = [
  {
    id: 'eq-idea-1',
    name: '3D Printer - Ender 3',
    equipmentId: 'EQ-IDEA-3D-01',
    category: '3D Printing',
    labId: 'lab-idea-01',
    labName: 'AICTE IDEA LAB',
    manufacturer: 'Creality',
    model: 'Ender 3 Pro V2',
    description: 'Precision FDM 3D printer with heated bed and high temp nozzle for PLA/ABS.',
    specifications: 'Build volume: 220x220x250mm, Nozzle: 0.4mm, Max Temp: 260C',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'eq-idea-2',
    name: 'PCB Mill Machine',
    equipmentId: 'EQ-IDEA-PCB-02',
    category: 'Electronics',
    labId: 'lab-idea-01',
    labName: 'AICTE IDEA LAB',
    manufacturer: 'Bantam Tools',
    model: 'Desktop CNC Milling',
    description: 'High-precision double-sided PCB milling machine for prototyping circuit boards.',
    specifications: 'Spindle: 28,000 RPM, Trace width: down to 6 mil',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'eq-cad-1',
    name: 'Cadence Virtuoso EDA Workstation',
    equipmentId: 'EQ-CAD-EDA-01',
    category: 'VLSI Design',
    labId: 'lab-cad-02',
    labName: 'CADENCE LAB',
    manufacturer: 'Cadence Systems',
    model: 'IC 6.1.8 Suite',
    description: 'Custom IC design workstation with analog/mixed-signal layout & simulation tools.',
    specifications: '32-Core Intel Xeon, 128GB RAM, Dual 4K Monitors',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'eq-syn-1',
    name: 'Synopsys Design Compiler Station',
    equipmentId: 'EQ-SYN-DC-01',
    category: 'EDA Suite',
    labId: 'lab-syn-03',
    labName: 'SYNOPSYS LAB',
    manufacturer: 'Synopsys Inc',
    model: 'Design Compiler NXT',
    description: 'RTL synthesis & logic optimization station for ultra-low-power VLSI chips.',
    specifications: 'Linux RHEL 8, 64-Core Threadripper, Synopsys Synthesis License',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'eq-mat-1',
    name: 'MATLAB High-Performance Compute Server',
    equipmentId: 'EQ-MAT-HPC-01',
    category: 'Computing',
    labId: 'lab-mat-04',
    labName: 'MATLAB LAB',
    manufacturer: 'MathWorks / Dell PowerEdge',
    model: 'R750 Parallel Server',
    description: 'Parallel computing cluster node for deep learning, signal processing and matrix math.',
    specifications: 'NVIDIA A100 80GB GPU, Parallel Computing Toolbox, 256GB RAM',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'eq-lview-1',
    name: 'Oscilloscope - DSOX1204G',
    equipmentId: 'EQ-LVIEW-OSC-01',
    category: 'Testing',
    labId: 'lab-lview-05',
    labName: 'LABVIEW LAB',
    manufacturer: 'Keysight',
    model: 'DSOX1204G',
    description: '4-Channel Digital Storage Oscilloscope with built-in function generator.',
    specifications: 'Bandwidth: 70/100/200 MHz, Sample rate: 2 GSa/s',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'eq-lview-2',
    name: 'NI ELVIS II+',
    equipmentId: 'EQ-LVIEW-NI-02',
    category: 'Testing',
    labId: 'lab-lview-05',
    labName: 'LABVIEW LAB',
    manufacturer: 'National Instruments',
    model: 'ELVIS II+',
    description: 'Educational Laboratory Virtual Instrumentation Suite for hands-on learning.',
    specifications: '12 integrated instruments including DMM, Bode Plotter, Function Gen',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'eq-ti-1',
    name: 'Texas Instruments LaunchPad IoT Kit',
    equipmentId: 'EQ-TI-IOT-01',
    category: 'Embedded Systems',
    labId: 'lab-ti-06',
    labName: 'TEXAS INNOVATION LAB',
    manufacturer: 'Texas Instruments',
    model: 'CC2650 SimpleLink Kit',
    description: 'Wireless MCU development kit supporting Bluetooth Low Energy, Zigbee and Thread.',
    specifications: 'ARM Cortex-M4F, Ultra-low-power radio, Sensor BoosterPack included',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'eq-lib-1',
    name: 'Digital Library IEEE & E-Journal Station',
    equipmentId: 'EQ-LIB-EJ-01',
    category: 'Knowledge Center',
    labId: 'lab-lib-07',
    labName: 'LIBRARY',
    manufacturer: 'Dell OptiPlex',
    model: '7090 Ultra',
    description: 'Dedicated high-speed terminal for accessing IEEE Xplore, ScienceDirect and Springer.',
    specifications: 'High-res dual display, Gigabit Ethernet, Digital Archival software',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'eq-rai-1',
    name: '6-DOF Industrial Robotic Arm Trainer',
    equipmentId: 'EQ-RAI-ARM-01',
    category: 'Robotics & AI',
    labId: 'lab-rai-08',
    labName: 'ROBOTICS LAB',
    manufacturer: 'Niryo',
    model: 'Ned2 Robotic Arm',
    description: '6-axis collaborative robot arm for vision-guided pick-and-place and ROS 2 control.',
    specifications: 'Payload: 500g, Reach: 440mm, Integrated HD Camera & ROS 2 driver',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400'
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
  (response) => {
    const contentType = response.headers?.['content-type'] || '';
    if (
      (response.data && typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE')) ||
      contentType.includes('text/html')
    ) {
      console.warn('HTML content received instead of JSON. Forcing fallback to mock data.');
      const err = new Error('HTML response returned instead of JSON') as any;
      err.response = response;
      err.config = response.config;
      err.code = 'ERR_HTML_RESPONSE';
      throw err;
    }
    return response;
  },
  async (error) => {
    const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.code === 'ERR_HTML_RESPONSE';
    const status = error.response?.status;
    const isErrorStatus = status === 403 || status === 404 || status === 500 || status === 502 || status === 503 || status === 504;
    
    if (isNetworkError || isErrorStatus) {
      console.warn('Backend API unreachable or error. Serving fallback response for remote access:', error.config?.url);

      const url = error.config?.url || '';
      const method = (error.config?.method || 'get').toLowerCase();

      // Auth Routes
      if (url.includes('/auth/register')) {
        const body = JSON.parse(error.config.data || '{}');
        const role = body.role || 'STUDENT';
        const name = body.fullName || body.name || '';
        const email = body.collegeEmail || body.email || '';
        const registerNo = body.registerNumber || body.registerNo || '';
        const department = body.department || 'Information Technology';
        const password = body.password || '';

        const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
        
        // check duplicate
        const exists = mockRegisteredUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase() || (u.registerNo && u.registerNo.toLowerCase() === registerNo.toLowerCase()));
        if (exists) {
          return Promise.reject({
            response: {
              status: 400,
              data: { success: false, message: 'An account with this email or register number already exists.' }
            }
          });
        }

        const newUser = {
          id: 'std-' + Date.now(),
          name,
          email,
          role,
          registerNo,
          department,
          year: body.year ? String(body.year) + 'th Year' : '1st Year',
          college: 'Karpagam Institute of Technology',
          phone: body.phone || '9876543210',
          personalEmail: body.personalEmail || '',
          password
        };

        mockRegisteredUsers.push(newUser);
        localStorage.setItem('mock_registered_users', JSON.stringify(mockRegisteredUsers));

        return {
          data: {
            success: true,
            message: 'Registration Successful! Your Smart Campus account has been created successfully (Demo Mode).',
            data: { token: 'mock-jwt-' + Date.now(), user: newUser }
          }
        };
      }

      if (url.includes('/auth/student/login')) {
        const body = JSON.parse(error.config.data || '{}');
        const regNo = (body.registerNo || body.registerNumber || '').trim().toLowerCase();
        
        const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
        const matched = mockRegisteredUsers.find((u: any) => u.role === 'STUDENT' && u.registerNo.toLowerCase() === regNo);
        if (matched) {
          return {
            data: {
              success: true,
              message: 'Logged in successfully (Demo Mode)',
              data: {
                token: 'mock-student-jwt-token-2026',
                user: matched
              }
            }
          };
        }

        const isDefault = regNo === '24ita17' || regNo === '23cse001';
        if (!isDefault) {
          return Promise.reject({
            response: {
              status: 401,
              data: { success: false, message: 'Invalid Register Number or password (Demo Mode).' }
            }
          });
        }
        const cleanRegNo = (body.registerNo || '24ITA17').trim();
        return {
          data: {
            success: true,
            message: 'Logged in successfully (Demo Mode)',
            data: {
              token: 'mock-student-jwt-token-2026',
              user: {
                id: 'std-101',
                name: isDefault ? 'Iliayarasu (Student)' : `Student ${cleanRegNo}`,
                email: isDefault ? '24ita17@karpagam.edu' : `${cleanRegNo.toLowerCase()}@karpagam.edu`,
                role: 'STUDENT',
                registerNo: cleanRegNo,
                department: 'Information Technology',
                year: '3rd Year',
                college: 'Karpagam Institute of Technology',
                phone: '9876543210',
                personalEmail: isDefault ? 'ilaiya.personal@gmail.com' : ''
              }
            }
          }
        };
      }

      if (url.includes('/auth/staff/login')) {
        const body = JSON.parse(error.config.data || '{}');
        const empId = (body.employeeId || '').trim().toLowerCase();

        const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
        const matched = mockRegisteredUsers.find((u: any) => u.role === 'STAFF' && u.registerNo.toLowerCase() === empId);
        if (matched) {
          return {
            data: {
              success: true,
              message: 'Logged in successfully (Faculty Demo)',
              data: {
                token: 'mock-staff-jwt-token-2026',
                user: {
                  id: matched.id,
                  name: matched.name,
                  email: matched.email,
                  role: 'STAFF',
                  employeeId: matched.registerNo,
                  department: matched.department,
                  position: body.position || 'Assistant Professor'
                }
              }
            }
          };
        }

        const isDefault = empId === 'stf001' || empId === 'stf002';
        if (!isDefault) {
          return Promise.reject({
            response: {
              status: 401,
              data: { success: false, message: 'Invalid Employee ID or password (Demo Mode).' }
            }
          });
        }
        const cleanEmpId = (body.employeeId || 'STF001').trim();
        return {
          data: {
            success: true,
            message: 'Logged in successfully (Faculty Demo)',
            data: {
              token: 'mock-staff-jwt-token-2026',
              user: {
                id: 'stf-101',
                name: isDefault ? 'Dr. R. Saravanan' : `Faculty ${cleanEmpId}`,
                email: isDefault ? 'saravanan.it@karpagam.edu' : `${cleanEmpId.toLowerCase()}@karpagam.edu`,
                role: 'STAFF',
                employeeId: cleanEmpId,
                department: 'Information Technology',
                position: 'Associate Professor & Lab In-charge'
              }
            }
          }
        };
      }

      if (url.includes('/auth/admin/login')) {
        const body = JSON.parse(error.config?.data || '{}');
        const email = (body.email || body.username || '').toLowerCase().replace(/\s+/g, '');
        const isGopinath = email.includes('gopinath.ece');
        return {
          data: {
            success: true,
            message: 'Logged in successfully (Admin Console)',
            data: {
              token: 'mock-admin-jwt-token-2026',
              user: {
                id: isGopinath ? 'adm-gopinath' : 'adm-101',
                name: isGopinath ? 'Gopinath (ECE Administrator)' : 'System Administrator',
                email: isGopinath ? 'gopinath.ece@karpagamtech.ac.in' : 'admin@smartcampus.edu',
                role: 'ADMIN',
                department: isGopinath ? 'Electronics & Communication Engineering' : 'Central Research Facility'
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

      if (url.includes('/auth/profile')) {
        const body = JSON.parse(error.config.data || '{}');
        const savedUserStr = localStorage.getItem('smart_campus_user');
        const savedUser = savedUserStr ? JSON.parse(savedUserStr) : {};
        const updatedUser = { ...savedUser, ...body };
        localStorage.setItem('smart_campus_user', JSON.stringify(updatedUser));

        // Sync with mock_registered_users
        const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
        const index = mockRegisteredUsers.findIndex((u: any) => u.email.toLowerCase() === updatedUser.email.toLowerCase() || (u.registerNo && u.registerNo.toLowerCase() === (updatedUser.registerNo || '').toLowerCase()));
        if (index !== -1) {
          mockRegisteredUsers[index] = { ...mockRegisteredUsers[index], ...body };
          localStorage.setItem('mock_registered_users', JSON.stringify(mockRegisteredUsers));
        }

        return { data: { success: true, message: 'Profile updated successfully!', data: updatedUser } };
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

      // Faculty Student Portal Routes
      if (url.includes('/faculty/students/stats')) {
        const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
        const registeredStudentsCount = mockRegisteredUsers.filter((u: any) => u.role === 'STUDENT').length;
        const total = 1 + registeredStudentsCount;
        return {
          data: {
            success: true,
            data: {
              myStudents: total,
              totalStudents: total,
              activeStudents: total
            }
          }
        };
      }

      if (url.includes('/faculty/students')) {
        if (method === 'delete') {
          const urlParts = url.split('/');
          const studentId = urlParts[urlParts.length - 1];

          // Remove the student from mock_registered_users in localStorage
          const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
          const filtered = mockRegisteredUsers.filter((u: any) => u.id !== studentId);
          localStorage.setItem('mock_registered_users', JSON.stringify(filtered));

          return {
            data: {
              success: true,
              message: 'Student removed from authorized class roster successfully.'
            }
          };
        }
        
        const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
        const registeredStudents = mockRegisteredUsers.filter((u: any) => u.role === 'STUDENT').map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: 'STUDENT',
          accountStatus: 'ACTIVE',
          createdAt: new Date().toISOString(),
          studentProfile: {
            registerNo: u.registerNo,
            department: u.department,
            program: u.program || 'B.E.',
            year: u.year ? parseInt(u.year) : 3,
            semester: u.semester ? parseInt(u.semester) : 5,
            section: u.section || 'A',
            batch: u.batch || '2024-2028',
            admissionYear: u.admissionYear || 2024,
            phone: u.phone || '9876543210',
            personalEmail: u.personalEmail || '',
            college: u.college || 'Karpagam Institute of Technology',
            academicStatus: u.academicStatus || 'REGULAR'
          }
        }));

        const defaultStudent = {
          id: 'std-101',
          name: 'Test Student',
          email: '24cse001@college.edu',
          role: 'STUDENT',
          accountStatus: 'ACTIVE',
          createdAt: new Date().toISOString(),
          studentProfile: {
            registerNo: '24CSE001',
            department: 'CSE',
            program: 'B.E.',
            year: 3,
            semester: 5,
            section: 'A',
            batch: '2024-2028',
            admissionYear: 2024,
            phone: '9876543210',
            personalEmail: 'test.student@gmail.com',
            college: 'Karpagam Institute of Technology',
            academicStatus: 'REGULAR'
          }
        };

        return {
          data: {
            success: true,
            data: [defaultStudent, ...registeredStudents]
          }
        };
      }

      // Admin Student Directory
      if (url.includes('/admin/students/stats')) {
        const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
        const registeredStudentsCount = mockRegisteredUsers.filter((u: any) => u.role === 'STUDENT').length;
        const total = 1 + registeredStudentsCount;
        return {
          data: {
            success: true,
            data: {
              totalStudents: total,
              activeStudents: total,
              inactiveStudents: 0,
              suspendedStudents: 0,
              newStudents: registeredStudentsCount
            }
          }
        };
      }

      if (url.includes('/admin/students')) {
        const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
        const registeredStudents = mockRegisteredUsers.filter((u: any) => u.role === 'STUDENT').map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: 'STUDENT',
          accountStatus: 'ACTIVE',
          createdAt: new Date().toISOString(),
          studentProfile: {
            registerNo: u.registerNo,
            department: u.department,
            program: u.program || 'B.E.',
            year: u.year ? parseInt(u.year) : 3,
            semester: u.semester ? parseInt(u.semester) : 5,
            section: u.section || 'A',
            batch: u.batch || '2024-2028',
            admissionYear: u.admissionYear || 2024,
            phone: u.phone || '9876543210',
            personalEmail: u.personalEmail || '',
            college: u.college || 'Karpagam Institute of Technology',
            academicStatus: u.academicStatus || 'REGULAR'
          }
        }));

        const defaultStudent = {
          id: 'std-101',
          name: 'Test Student',
          email: '24cse001@college.edu',
          role: 'STUDENT',
          accountStatus: 'ACTIVE',
          createdAt: new Date().toISOString(),
          studentProfile: {
            registerNo: '24CSE001',
            department: 'CSE',
            program: 'B.E.',
            year: 3,
            semester: 5,
            section: 'A',
            batch: '2024-2028',
            admissionYear: 2024,
            phone: '9876543210',
            personalEmail: 'test.student@gmail.com',
            college: 'Karpagam Institute of Technology',
            academicStatus: 'REGULAR'
          }
        };

        return {
          data: {
            success: true,
            data: [defaultStudent, ...registeredStudents]
          }
        };
      }

      // Admin Stats
      if (url.includes('/admin/stats')) {
        const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
        const studentsCount = 1 + mockRegisteredUsers.filter((u: any) => u.role === 'STUDENT').length;
        const staffCount = 2 + mockRegisteredUsers.filter((u: any) => u.role === 'STAFF').length;
        return {
          data: {
            success: true,
            data: {
              totalStudents: studentsCount,
              totalStaff: staffCount,
              totalLabs: MOCK_LABS.length,
              totalEquipment: MOCK_EQUIPMENT.length,
              availableEquipment: MOCK_EQUIPMENT.length,
              activeBookings: MOCK_BOOKINGS.length,
              pendingBookings: 0,
              openIssues: MOCK_ISSUES.length
            }
          }
        };
      }

      // Admin Users
      if (url.includes('/admin/users')) {
        if (method === 'delete') {
          const urlParts = url.split('/');
          const userId = urlParts[urlParts.length - 1];

          const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
          const filtered = mockRegisteredUsers.filter((u: any) => u.id !== userId);
          localStorage.setItem('mock_registered_users', JSON.stringify(filtered));

          return {
            data: {
              success: true,
              message: 'User account deleted successfully.'
            }
          };
        }

        const mockRegisteredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
        const registeredUsersList = mockRegisteredUsers.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role
        }));

        const defaultUsers = [
          { id: 'std-101', name: 'Test Student', email: '24cse001@college.edu', role: 'STUDENT' },
          { id: 'stf-101', name: 'Dr. R. Saravanan', email: 'saravanan.it@karpagam.edu', role: 'STAFF' },
          { id: 'adm-101', name: 'Admin User', email: 'admin@smartcampus.edu', role: 'ADMIN' }
        ];

        return {
          data: {
            success: true,
            data: [...defaultUsers, ...registeredUsersList]
          }
        };
      }

      // Default generic successful response fallback
      return { data: { success: true, message: 'Success', data: [] } };
    }

    return Promise.reject(error);
  }
);
