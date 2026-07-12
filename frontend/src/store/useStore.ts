import { create } from 'zustand';
import { getDB, setDB } from '../services/db';
import type { User, Asset, Allocation, Department, AssetCategory, Booking, Notification, MaintenanceRequest } from '../services/db';

interface AppState {
  currentUser: User | null;
  users: User[];
  departments: Department[];
  categories: AssetCategory[];
  assets: Asset[];
  allocations: Allocation[];
  bookings: Booking[];
  maintenance: MaintenanceRequest[];
  notifications: Notification[];
  
  login: (email: string) => boolean;
  logout: () => void;
  registerUser: (user: User) => void;
  
  // Generalized CRUD for store
  loadData: () => void;
  addAsset: (asset: Asset) => void;
  updateAssetStatus: (assetId: string, status: Asset['status']) => void;
  
  addAllocation: (allocation: Allocation) => void;
  
  addBooking: (booking: Booking) => void;
  
  addMaintenance: (req: MaintenanceRequest) => void;
  
  addNotification: (notif: Notification) => void;
  markNotificationRead: (id: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [],
  departments: [],
  categories: [],
  assets: [],
  allocations: [],
  bookings: [],
  maintenance: [],
  notifications: [],

  loadData: async () => {
    try {
      const endpoints = [
        'users', 'departments', 'categories', 'assets', 
        'allocations', 'bookings', 'maintenance', 'notifications'
      ];
      
      const responses = await Promise.all(
        endpoints.map(ep => fetch(`/api/${ep}`).then(res => res.json()))
      );

      set({
        users: responses[0] || [],
        departments: responses[1] || [],
        categories: responses[2] || [],
        assets: responses[3] || [],
        allocations: responses[4] || [],
        bookings: responses[5] || [],
        maintenance: responses[6] || [],
        notifications: responses[7] || [],
      });
    } catch (error) {
      console.error('Failed to load data from API:', error);
    }
  },

  login: (email: string) => {
    const users = get().users;
    const user = users.find(u => u.email === email && u.status === 'Active');
    if (user) {
      set({ currentUser: user });
      localStorage.setItem('af_current_user', JSON.stringify(user));
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
    localStorage.removeItem('af_current_user');
  },
  
  registerUser: (user: User) => {
    const newUsers = [...get().users, user];
    setDB('af_users', newUsers);
    set({ users: newUsers });
  },

  addAsset: async (asset: Asset) => {
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asset)
      });
      const newAsset = await res.json();
      set({ assets: [...get().assets, newAsset] });
    } catch (err) { console.error(err); }
  },
  
  updateAssetStatus: async (assetId, status) => {
    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updatedAsset = await res.json();
      const updated = get().assets.map(a => a.id === assetId ? updatedAsset : a);
      set({ assets: updated });
    } catch (err) { console.error(err); }
  },

  addAllocation: async (allocation: Allocation) => {
    try {
      const res = await fetch('/api/allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allocation)
      });
      const newAllocation = await res.json();
      set({ allocations: [...get().allocations, newAllocation] });
      get().updateAssetStatus(allocation.assetId, 'Allocated');
    } catch (err) { console.error(err); }
  },

  addBooking: async (booking: Booking) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      const newBooking = await res.json();
      set({ bookings: [...get().bookings, newBooking] });
    } catch (err) { console.error(err); }
  },

  addMaintenance: async (req: MaintenanceRequest) => {
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      const newReq = await res.json();
      set({ maintenance: [...get().maintenance, newReq] });
    } catch (err) { console.error(err); }
  },

  addNotification: async (notif: Notification) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif)
      });
      const newNotif = await res.json();
      set({ notifications: [newNotif, ...get().notifications] });
    } catch (err) { console.error(err); }
  },
  
  markNotificationRead: async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      });
      const updatedNotif = await res.json();
      const updated = get().notifications.map(n => n.id === id ? updatedNotif : n);
      set({ notifications: updated });
    } catch (err) { console.error(err); }
  }
}));
