import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SMART CAMPUS Database Seeding...');

  // Clean existing tables
  await prisma.feedback.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.lostFoundItem.deleteMany();
  await prisma.equipmentRequest.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.issueComment.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.campusLocation.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.lab.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Student@123', 10);
  const staffPasswordHash = await bcrypt.hash('Staff@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const gopinathPasswordHash = await bcrypt.hash('gopinathece9566', 10);

  // 1. Create Admin Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. S. Arunkumar',
      email: 'admin@smartcampus.edu',
      password: adminPasswordHash,
      role: 'ADMIN',
      avatar: null,
      adminProfile: {
        create: {
          department: 'Campus Administration & IT Services',
          phone: '+91 98765 43210'
        }
      }
    }
  });

  const gopinathAdmin = await prisma.user.create({
    data: {
      name: 'Gopinath (ECE Administrator)',
      email: 'gopinath.ece@karpagamtech.ac.in',
      password: gopinathPasswordHash,
      role: 'ADMIN',
      avatar: null,
      adminProfile: {
        create: {
          department: 'Electronics & Communication Engineering',
          phone: '+91 95660 12345'
        }
      }
    }
  });

  // 2. Create Staff Users
  const staff1 = await prisma.user.create({
    data: {
      name: 'Prof. Rajesh Kumar',
      email: 'rajesh.k@smartcampus.edu',
      password: staffPasswordHash,
      role: 'STAFF',
      avatar: null,
      staffProfile: {
        create: {
          employeeId: 'STF001',
          department: 'Electronics & Communication',
          phone: '+91 98765 11111',
          position: 'IDEA Lab In-Charge'
        }
      }
    }
  });

  const staff2 = await prisma.user.create({
    data: {
      name: 'Dr. Meena Sundaram',
      email: 'meena.s@smartcampus.edu',
      password: staffPasswordHash,
      role: 'STAFF',
      avatar: null,
      staffProfile: {
        create: {
          employeeId: 'STF002',
          department: 'VLSI Design & Systems',
          phone: '+91 98765 22222',
          position: 'Cadence & Synopsys Lab Manager'
        }
      }
    }
  });

  // 3. Create Student Users
  const student1 = await prisma.user.create({
    data: {
      name: 'Karthik R',
      email: 'karthik.r@smartcampus.edu',
      password: passwordHash,
      role: 'STUDENT',
      avatar: null,
      studentProfile: {
        create: {
          registerNo: '23CSE001',
          department: 'Computer Science & Engineering',
          year: 3,
          phone: '+91 98765 99999',
          college: 'Karpagam Institute of Technology'
        }
      }
    }
  });

  // Student 24ITA17 requested by user
  const student3 = await prisma.user.create({
    data: {
      name: 'Student 24ITA17',
      email: '24ita17@karpagam.edu',
      password: passwordHash,
      role: 'STUDENT',
      avatar: null,
      studentProfile: {
        create: {
          registerNo: '24ita17',
          department: 'Information Technology',
          year: 2,
          phone: '+91 98765 77777',
          college: 'Karpagam Institute of Technology'
        }
      }
    }
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Ananya Verma',
      email: 'ananya.v@smartcampus.edu',
      password: passwordHash,
      role: 'STUDENT',
      avatar: null,
      studentProfile: {
        create: {
          registerNo: '23ECE014',
          department: 'Electronics & Communication',
          year: 4,
          phone: '+91 98765 88888',
          college: 'Karpagam Institute of Technology'
        }
      }
    }
  });

  // 4. Create Labs (High-res Unsplash CDN images)
  const ideaLab = await prisma.lab.create({
    data: {
      name: 'IDEA LAB',
      code: 'LAB-IDEA-01',
      category: 'Innovation Hub',
      description: 'Advanced prototyping, PCB fabrication, 3D printing, SMT and fabrication tools.',
      location: 'Block A, 1st Floor, Room 102',
      capacity: 45,
      openingHours: '08:00 AM - 09:00 PM',
      status: 'OPERATIONAL',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
    }
  });

  const cadenceLab = await prisma.lab.create({
    data: {
      name: 'CADENCE LAB',
      code: 'LAB-CAD-02',
      category: 'VLSI Design',
      description: 'Industry standard EDA tools for VLSI design, simulation and verification.',
      location: 'Block B, 2nd Floor, Room 205',
      capacity: 35,
      openingHours: '08:30 AM - 07:00 PM',
      status: 'OPERATIONAL',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
    }
  });

  const synopsysLab = await prisma.lab.create({
    data: {
      name: 'SYNOPSYS LAB',
      code: 'LAB-SYN-03',
      category: 'EDA Suite',
      description: 'Comprehensive EDA solutions for design, verification and sign-off flows.',
      location: 'Block B, 2nd Floor, Room 208',
      capacity: 30,
      openingHours: '09:00 AM - 06:00 PM',
      status: 'OPERATIONAL',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'
    }
  });

  const matlabLab = await prisma.lab.create({
    data: {
      name: 'MATLAB LAB',
      code: 'LAB-MAT-04',
      category: 'Computing',
      description: 'High performance computing, modeling, simulation and data analysis tools.',
      location: 'Block C, 3rd Floor, Room 310',
      capacity: 50,
      openingHours: '08:00 AM - 08:00 PM',
      status: 'OPERATIONAL',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    }
  });

  const labviewLab = await prisma.lab.create({
    data: {
      name: 'LABVIEW LAB',
      code: 'LAB-LVIEW-05',
      category: 'Virtual Instrumentation',
      description: 'Test, measurement and control systems design using NI LabVIEW platform.',
      location: 'Block A, Ground Floor, Room 004',
      capacity: 25,
      openingHours: '09:00 AM - 05:30 PM',
      status: 'OPERATIONAL',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800'
    }
  });

  const texasLab = await prisma.lab.create({
    data: {
      name: 'TEXAS INNOVATION LAB',
      code: 'LAB-TI-06',
      category: 'Embedded Systems',
      description: 'IoT, Robotics, Embedded development and advanced innovation projects.',
      location: 'Innovation Tower, 4th Floor',
      capacity: 40,
      openingHours: '08:00 AM - 10:00 PM',
      status: 'OPERATIONAL',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800'
    }
  });

  const libraryLab = await prisma.lab.create({
    data: {
      name: 'LIBRARY',
      code: 'LAB-LIB-07',
      category: 'Knowledge Center',
      description: 'Access to books, journals, digital resources, e-books and research materials.',
      location: 'Central Library Building',
      capacity: 200,
      openingHours: '24/7 Access',
      status: 'OPERATIONAL',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800'
    }
  });

  const roboticsLab = await prisma.lab.create({
    data: {
      name: 'ROBOTICS LAB',
      code: 'LAB-RAI-08',
      category: 'Robotics & AI',
      description: 'Autonomous drones, industrial arm manipulation, edge AI perception & ROS development.',
      location: 'Innovation Wing, 3rd Floor',
      capacity: 35,
      openingHours: '08:30 AM - 08:30 PM',
      status: 'OPERATIONAL',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
    }
  });

  // 5. Create Equipment for ALL Labs
  const ender3 = await prisma.equipment.create({
    data: {
      name: '3D Printer - Ender 3',
      equipmentId: 'EQ-IDEA-3D-01',
      category: '3D Printing',
      labId: ideaLab.id,
      manufacturer: 'Creality',
      model: 'Ender 3 Pro V2',
      description: 'Precision FDM 3D printer with heated bed and high temp nozzle for PLA/ABS.',
      specifications: 'Build volume: 220x220x250mm, Nozzle: 0.4mm, Max Temp: 260C',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?auto=format&fit=crop&q=80&w=400'
    }
  });

  const pcbMill = await prisma.equipment.create({
    data: {
      name: 'PCB Mill Machine',
      equipmentId: 'EQ-IDEA-PCB-02',
      category: 'Electronics',
      labId: ideaLab.id,
      manufacturer: 'Bantam Tools',
      model: 'Desktop CNC Milling',
      description: 'High-precision double-sided PCB milling machine for prototyping circuit boards.',
      specifications: 'Spindle: 28,000 RPM, Trace width: down to 6 mil',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400'
    }
  });

  const cadenceWorkstation = await prisma.equipment.create({
    data: {
      name: 'Cadence Virtuoso EDA Workstation',
      equipmentId: 'EQ-CAD-EDA-01',
      category: 'VLSI Design',
      labId: cadenceLab.id,
      manufacturer: 'Cadence Systems',
      model: 'IC 6.1.8 Suite',
      description: 'Custom IC design workstation with analog/mixed-signal layout & simulation tools.',
      specifications: '32-Core Intel Xeon, 128GB RAM, Dual 4K Monitors',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400'
    }
  });

  const synopsysCompiler = await prisma.equipment.create({
    data: {
      name: 'Synopsys Design Compiler Station',
      equipmentId: 'EQ-SYN-DC-01',
      category: 'EDA Suite',
      labId: synopsysLab.id,
      manufacturer: 'Synopsys Inc',
      model: 'Design Compiler NXT',
      description: 'RTL synthesis & logic optimization station for ultra-low-power VLSI chips.',
      specifications: 'Linux RHEL 8, 64-Core Threadripper, Synopsys Synthesis License',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400'
    }
  });

  const matlabHPC = await prisma.equipment.create({
    data: {
      name: 'MATLAB High-Performance Compute Server',
      equipmentId: 'EQ-MAT-HPC-01',
      category: 'Computing',
      labId: matlabLab.id,
      manufacturer: 'MathWorks / Dell PowerEdge',
      model: 'R750 Parallel Server',
      description: 'Parallel computing cluster node for deep learning, signal processing and matrix math.',
      specifications: 'NVIDIA A100 80GB GPU, Parallel Computing Toolbox, 256GB RAM',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400'
    }
  });

  const oscilloscope = await prisma.equipment.create({
    data: {
      name: 'Oscilloscope - DSOX1204G',
      equipmentId: 'EQ-LVIEW-OSC-01',
      category: 'Testing',
      labId: labviewLab.id,
      manufacturer: 'Keysight',
      model: 'DSOX1204G',
      description: '4-Channel Digital Storage Oscilloscope with built-in function generator.',
      specifications: 'Bandwidth: 70/100/200 MHz, Sample rate: 2 GSa/s',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=400'
    }
  });

  const niElvis = await prisma.equipment.create({
    data: {
      name: 'NI ELVIS II+',
      equipmentId: 'EQ-LVIEW-NI-02',
      category: 'Testing',
      labId: labviewLab.id,
      manufacturer: 'National Instruments',
      model: 'ELVIS II+',
      description: 'Educational Laboratory Virtual Instrumentation Suite for hands-on learning.',
      specifications: '12 integrated instruments including DMM, Bode Plotter, Function Gen',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=400'
    }
  });

  const tiLaunchpad = await prisma.equipment.create({
    data: {
      name: 'Texas Instruments LaunchPad IoT Kit',
      equipmentId: 'EQ-TI-IOT-01',
      category: 'Embedded Systems',
      labId: texasLab.id,
      manufacturer: 'Texas Instruments',
      model: 'CC2650 SimpleLink Kit',
      description: 'Wireless MCU development kit supporting Bluetooth Low Energy, Zigbee and Thread.',
      specifications: 'ARM Cortex-M4F, Ultra-low-power radio, Sensor BoosterPack included',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=400'
    }
  });

  const libraryStation = await prisma.equipment.create({
    data: {
      name: 'Digital Library IEEE & E-Journal Station',
      equipmentId: 'EQ-LIB-EJ-01',
      category: 'Knowledge Center',
      labId: libraryLab.id,
      manufacturer: 'Dell OptiPlex',
      model: '7090 Ultra',
      description: 'Dedicated high-speed terminal for accessing IEEE Xplore, ScienceDirect and Springer.',
      specifications: 'High-res dual display, Gigabit Ethernet, Digital Archival software',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=400'
    }
  });

  const roboticsArm = await prisma.equipment.create({
    data: {
      name: '6-DOF Industrial Robotic Arm Trainer',
      equipmentId: 'EQ-RAI-ARM-01',
      category: 'Robotics & AI',
      labId: roboticsLab.id,
      manufacturer: 'Niryo',
      model: 'Ned2 Robotic Arm',
      description: '6-axis collaborative robot arm for vision-guided pick-and-place and ROS 2 control.',
      specifications: 'Payload: 500g, Reach: 440mm, Integrated HD Camera & ROS 2 driver',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400'
    }
  });

  // 6. Create Campus Spatial Map Locations
  await prisma.campusLocation.createMany({
    data: [
      {
        name: 'AICTE IDEA LAB',
        code: 'LOC-IDEA-01',
        category: 'Innovation Hub',
        description: 'Prototyping, PCB milling & 3D printing center',
        floor: '1st Floor',
        lat: 12.9718,
        lng: 77.5942,
        labId: ideaLab.id
      },
      {
        name: 'CADENCE LAB',
        code: 'LOC-CAD-02',
        category: 'VLSI Design',
        description: 'Advanced microelectronics & chip design lab',
        floor: '2nd Floor',
        lat: 12.9722,
        lng: 77.5950,
        labId: cadenceLab.id
      },
      {
        name: 'SYNOPSYS LAB',
        code: 'LOC-SYN-03',
        category: 'EDA Suite',
        description: 'Comprehensive chip sign-off & EDA tools',
        floor: '2nd Floor',
        lat: 12.9720,
        lng: 77.5952,
        labId: synopsysLab.id
      },
      {
        name: 'MATLAB LAB',
        code: 'LOC-MAT-04',
        category: 'Computing',
        description: 'High-performance computing & data analytics hub',
        floor: '3rd Floor',
        lat: 12.9712,
        lng: 77.5940,
        labId: matlabLab.id
      },
      {
        name: 'LABVIEW LAB',
        code: 'LOC-LVIEW-05',
        category: 'Virtual Instrumentation',
        description: 'Test, DAQ & measurement instrumentation lab',
        floor: 'Ground Floor',
        lat: 12.9715,
        lng: 77.5944,
        labId: labviewLab.id
      },
      {
        name: 'TEXAS INNOVATION LAB',
        code: 'LOC-TI-06',
        category: 'Embedded Systems',
        description: 'IoT, microcontroller & wireless sensor center',
        floor: '4th Floor',
        lat: 12.9725,
        lng: 77.5948,
        labId: texasLab.id
      },
      {
        name: 'CENTRAL LIBRARY',
        code: 'LOC-LIB-07',
        category: 'Knowledge Center',
        description: 'Digital research library & e-journal facility',
        floor: 'Ground Floor',
        lat: 12.9710,
        lng: 77.5946,
        labId: libraryLab.id
      },
      {
        name: 'ROBOTICS & AI CENTER',
        code: 'LOC-RAI-08',
        category: 'Robotics & AI',
        description: 'Drones, robotic manipulators & edge AI facility',
        floor: '3rd Floor',
        lat: 12.9724,
        lng: 77.5943,
        labId: roboticsLab.id
      }
    ]
  });

  // 7. Create Bookings
  await prisma.booking.createMany({
    data: [
      {
        userId: student1.id,
        equipmentId: ender3.id,
        labId: ideaLab.id,
        date: '2026-08-28',
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        purpose: '3D Printing Robotics Chassis Component',
        status: 'APPROVED'
      },
      {
        userId: student1.id,
        equipmentId: oscilloscope.id,
        labId: labviewLab.id,
        date: '2026-08-29',
        startTime: '02:00 PM',
        endTime: '04:00 PM',
        purpose: 'Signal Modulation Analysis Assignment',
        status: 'PENDING'
      }
    ]
  });

  console.log('✅ Database Seeded with 24ITA17, All 8 Labs, Equipment & Map Locations!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

