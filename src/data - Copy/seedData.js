export const USERS = [
  { id: 1, name: 'Rahul Verma', email: 'rahul@structura.in', password: 'admin123', role: 'admin', avatar: 'RV', phone: '+91 98765 43210', dept: 'Management', joinDate: '2018-03-01', designation: 'Chief Civil Engineer' },
  { id: 2, name: 'Priya Sharma', email: 'priya@structura.in', password: 'pm123', role: 'project_manager', avatar: 'PS', phone: '+91 87654 32109', dept: 'Projects', joinDate: '2019-06-15', designation: 'Project Manager', managedBy: 1 },
  { id: 3, name: 'Ankit Joshi', email: 'ankit@structura.in', password: 'pm123', role: 'project_manager', avatar: 'AJ', phone: '+91 76543 21098', dept: 'Projects', joinDate: '2020-01-10', designation: 'Project Manager', managedBy: 1 },
  { id: 4, name: 'Suresh Kumar', email: 'suresh@structura.in', password: 'sup123', role: 'supervisor', avatar: 'SK', phone: '+91 65432 10987', dept: 'Site', joinDate: '2019-09-20', designation: 'Senior Supervisor', managedBy: 2 },
  { id: 5, name: 'Meera Patel', email: 'meera@structura.in', password: 'sup123', role: 'supervisor', avatar: 'MP', phone: '+91 54321 09876', dept: 'Site', joinDate: '2021-03-05', designation: 'Site Supervisor', managedBy: 2 },
  { id: 6, name: 'Rajesh Singh', email: 'rajesh@structura.in', password: 'sup123', role: 'supervisor', avatar: 'RS', phone: '+91 43210 98765', dept: 'Site', joinDate: '2020-07-14', designation: 'Site Supervisor', managedBy: 3 },
  { id: 7, name: 'Amit Yadav', email: 'amit@structura.in', password: 'emp123', role: 'employee', avatar: 'AY', phone: '+91 32109 87654', dept: 'Construction', joinDate: '2022-01-15', designation: 'Civil Technician', managedBy: 4 },
  { id: 8, name: 'Kavita Nair', email: 'kavita@structura.in', password: 'emp123', role: 'employee', avatar: 'KN', phone: '+91 21098 76543', dept: 'Construction', joinDate: '2022-04-20', designation: 'Site Engineer', managedBy: 4 },
  { id: 9, name: 'Deepak Mishra', email: 'deepak@structura.in', password: 'emp123', role: 'employee', avatar: 'DM', phone: '+91 10987 65432', dept: 'Surveying', joinDate: '2021-11-08', designation: 'Surveyor', managedBy: 5 },
  { id: 10, name: 'Nisha Gupta', email: 'nisha@structura.in', password: 'emp123', role: 'employee', avatar: 'NG', phone: '+91 09876 54321', dept: 'Construction', joinDate: '2023-02-01', designation: 'Assistant Engineer', managedBy: 6 },
];

export const PROJECTS = [
  { id: 1, name: 'Patna Ring Road Bridge', client: 'NHAI', value: '₹4.2 Cr', status: 'active', progress: 68, deadline: '2025-12-30', location: 'Patna, Bihar', manager: 2, category: 'Infrastructure', startDate: '2024-01-15', description: '6-lane flyover bridge spanning 420m over the Ganga canal.', priority: 'high' },
  { id: 2, name: 'Bihar Housing Complex', client: 'BSPHCL', value: '₹1.8 Cr', status: 'active', progress: 42, deadline: '2026-03-15', location: 'Muzaffarpur, Bihar', manager: 3, category: 'Residential', startDate: '2024-06-01', description: '144-unit affordable housing complex with community facilities.', priority: 'medium' },
  { id: 3, name: 'Gaya Industrial Shed', client: 'Private Ltd.', value: '₹65 L', status: 'completed', progress: 100, deadline: '2024-09-30', location: 'Gaya, Bihar', manager: 2, category: 'Industrial', startDate: '2024-02-01', description: 'Steel-frame industrial warehouse spanning 2400 sqm.', priority: 'low' },
  { id: 4, name: 'Hajipur Water Treatment', client: 'PHED Bihar', value: '₹2.1 Cr', status: 'planning', progress: 12, deadline: '2026-08-01', location: 'Hajipur, Bihar', manager: 3, category: 'Water Works', startDate: '2025-01-01', description: '15 MLD capacity water treatment plant serving 80,000 residents.', priority: 'high' },
  { id: 5, name: 'Bhagalpur Road Widening', client: 'PWD Bihar', value: '₹90 L', status: 'on_hold', progress: 31, deadline: '2025-06-30', location: 'Bhagalpur, Bihar', manager: 2, category: 'Road', startDate: '2024-03-01', description: 'Widening of NH-80 for 18km stretch, 4-lane conversion.', priority: 'medium' },
];

export const TASKS = [
  { id: 1, title: 'Structural load calculation — Pier 3', projectId: 1, assignedTo: 7, assignedBy: 4, priority: 'high', status: 'in_progress', deadline: '2026-05-30', notes: 'Refer IRC:78-2014 guidelines.' },
  { id: 2, title: 'Soil testing — Block B foundation', projectId: 2, assignedTo: 9, assignedBy: 5, priority: 'high', status: 'pending', deadline: '2026-06-02', notes: 'Coordinate with lab technician.' },
  { id: 3, title: 'Bar bending schedule — Slab 4', projectId: 1, assignedTo: 8, assignedBy: 4, priority: 'medium', status: 'completed', deadline: '2026-05-20', notes: '' },
  { id: 4, title: 'Site survey — North Zone', projectId: 2, assignedTo: 9, assignedBy: 5, priority: 'medium', status: 'in_progress', deadline: '2026-05-28', notes: '' },
  { id: 5, title: 'Compaction report — Road layer 2', projectId: 5, assignedTo: 10, assignedBy: 6, priority: 'low', status: 'pending', deadline: '2026-06-05', notes: '' },
  { id: 6, title: 'Estimate for water pipeline', projectId: 4, assignedTo: 8, assignedBy: 5, priority: 'high', status: 'pending', deadline: '2026-06-01', notes: 'Include fitment costs.' },
];

export const ATTENDANCE = {
  '2026-05-27': { 7: 'present', 8: 'present', 9: 'absent', 10: 'present', 4: 'present', 5: 'half', 6: 'present', 2: 'present', 3: 'absent' },
  '2026-05-26': { 7: 'present', 8: 'absent', 9: 'present', 10: 'present', 4: 'present', 5: 'present', 6: 'present', 2: 'present', 3: 'present' },
  '2026-05-25': { 7: 'half', 8: 'present', 9: 'present', 10: 'absent', 4: 'present', 5: 'present', 6: 'half', 2: 'present', 3: 'present' },
};

export const NOTICES = [
  { id: 1, title: 'Safety Drill — 30 May 2026', body: 'Mandatory safety drill for all site staff. Attendance is compulsory. Report at Site A by 08:00 AM.', date: '2026-05-24', postedBy: 1, audience: 'all', priority: 'high' },
  { id: 2, title: 'Monthly Progress Meeting', body: 'All Project Managers to submit site progress reports before meeting on 2nd June.', date: '2026-05-22', postedBy: 1, audience: 'pm', priority: 'medium' },
  { id: 3, title: 'Salary Disbursement — 1 June', body: 'June salaries will be credited to accounts on 1st June 2026 as usual.', date: '2026-05-20', postedBy: 1, audience: 'all', priority: 'low' },
  { id: 4, title: 'Equipment Maintenance Schedule', body: 'All heavy equipment scheduled for maintenance on 29 May. Coordinate with store incharge.', date: '2026-05-19', postedBy: 2, audience: 'supervisor', priority: 'medium' },
];

export const EXPENSES = [
  { id: 1, projectId: 1, desc: 'Steel rods — 40MT', amount: 920000, date: '2026-05-10', category: 'Material', approvedBy: 1 },
  { id: 2, projectId: 1, desc: 'Crane rental — 7 days', amount: 175000, date: '2026-05-12', category: 'Equipment', approvedBy: 2 },
  { id: 3, projectId: 2, desc: 'Cement — 500 bags', amount: 340000, date: '2026-05-08', category: 'Material', approvedBy: 3 },
  { id: 4, projectId: 4, desc: 'Survey instruments', amount: 85000, date: '2026-05-15', category: 'Equipment', approvedBy: 1 },
  { id: 5, projectId: 5, desc: 'Bitumen — 8MT', amount: 280000, date: '2026-05-18', category: 'Material', approvedBy: 2 },
];
