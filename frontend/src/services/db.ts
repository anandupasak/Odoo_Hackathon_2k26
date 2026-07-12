export type Role = 'Admin' | 'Asset Manager' | 'Department Head' | 'Employee';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId: string | null;
  status: 'Active' | 'Inactive';
};

export type Department = {
  id: string;
  name: string;
  headId: string | null;
  parentId: string | null;
  status: 'Active' | 'Inactive';
};

export type AssetCategory = {
  id: string;
  name: string;
  optionalFields: string[]; // e.g., 'warranty_period'
};

export type AssetStatus = 'Available' | 'Allocated' | 'Reserved' | 'Under Maintenance' | 'Lost' | 'Retired' | 'Disposed';

export type Asset = {
  id: string;
  tag: string;
  name: string;
  categoryId: string;
  serialNumber: string;
  acquisitionDate: string;
  acquisitionCost: number;
  condition: string;
  location: string;
  status: AssetStatus;
  isShared: boolean;
};

export type Allocation = {
  id: string;
  assetId: string;
  assigneeId: string; // User ID or Department ID
  assigneeType: 'User' | 'Department';
  startDate: string;
  expectedReturnDate: string | null;
  status: 'Active' | 'Returned' | 'Transfer Pending';
  returnNotes?: string;
};

export type Booking = {
  id: string;
  assetId: string;
  userId: string;
  startTime: string; // ISO date string
  endTime: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
};

export type MaintenanceRequest = {
  id: string;
  assetId: string;
  userId: string;
  issueDescription: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Technician Assigned' | 'In Progress' | 'Resolved';
  dateRaised: string;
  dateResolved?: string;
};

export type Notification = {
  id: string;
  userId: string; // Target user
  message: string;
  type: 'Alert' | 'Approval' | 'Booking';
  createdAt: string;
  read: boolean;
};

// Initial Data
const initialDepartments: Department[] = [
  { id: 'dept-1', name: 'Engineering', headId: 'user-2', parentId: null, status: 'Active' },
  { id: 'dept-2', name: 'Facilities', headId: null, parentId: null, status: 'Active' },
  { id: 'dept-3', name: 'Field Ops (West)', headId: 'user-3', parentId: 'dept-2', status: 'Inactive' },
];

const initialUsers: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@company.com', role: 'Admin', departmentId: null, status: 'Active' },
  { id: 'user-2', name: 'Aditi Rao', email: 'aditi@company.com', role: 'Department Head', departmentId: 'dept-1', status: 'Active' },
  { id: 'user-3', name: 'Rohan Mehta', email: 'rohan@company.com', role: 'Asset Manager', departmentId: 'dept-2', status: 'Active' },
  { id: 'user-4', name: 'Priya Shah', email: 'priya@company.com', role: 'Employee', departmentId: 'dept-1', status: 'Active' },
];

const initialCategories: AssetCategory[] = [
  { id: 'cat-1', name: 'Electronics', optionalFields: ['Warranty Period'] },
  { id: 'cat-2', name: 'Furniture', optionalFields: ['Material'] },
  { id: 'cat-3', name: 'Rooms', optionalFields: ['Capacity'] },
];

const initialAssets: Asset[] = [
  { id: 'asset-1', tag: 'AF-0012', name: 'Dell Laptop', categoryId: 'cat-1', serialNumber: 'SN12345', acquisitionDate: '2023-01-15', acquisitionCost: 1200, condition: 'Good', location: 'Bangalore', status: 'Allocated', isShared: false },
  { id: 'asset-2', tag: 'AF-0062', name: 'Projector', categoryId: 'cat-1', serialNumber: 'SN98765', acquisitionDate: '2022-05-20', acquisitionCost: 500, condition: 'Needs Repair', location: 'HQ Floor 2', status: 'Under Maintenance', isShared: true },
  { id: 'asset-3', tag: 'AF-0201', name: 'Office Chair', categoryId: 'cat-2', serialNumber: 'SN45678', acquisitionDate: '2024-02-10', acquisitionCost: 150, condition: 'New', location: 'Warehouse', status: 'Available', isShared: false },
  { id: 'asset-4', tag: 'ROOM-B2', name: 'Boardroom B2', categoryId: 'cat-3', serialNumber: 'N/A', acquisitionDate: '2020-01-01', acquisitionCost: 0, condition: 'Good', location: 'HQ Floor 1', status: 'Available', isShared: true },
];

const initialAllocations: Allocation[] = [
  { id: 'alloc-1', assetId: 'asset-1', assigneeId: 'user-4', assigneeType: 'User', startDate: '2024-03-01', expectedReturnDate: '2025-03-01', status: 'Active' }
];

const initialBookings: Booking[] = [
  { id: 'book-1', assetId: 'asset-4', userId: 'user-2', startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(), endTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(), status: 'Upcoming' }
];

export const seedDatabase = () => {
  if (!localStorage.getItem('af_users')) {
    localStorage.setItem('af_users', JSON.stringify(initialUsers));
    localStorage.setItem('af_departments', JSON.stringify(initialDepartments));
    localStorage.setItem('af_categories', JSON.stringify(initialCategories));
    localStorage.setItem('af_assets', JSON.stringify(initialAssets));
    localStorage.setItem('af_allocations', JSON.stringify(initialAllocations));
    localStorage.setItem('af_bookings', JSON.stringify(initialBookings));
    localStorage.setItem('af_maintenance', JSON.stringify([]));
    localStorage.setItem('af_notifications', JSON.stringify([]));
  }
};

export const getDB = <T>(key: string): T[] => {
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const setDB = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};
