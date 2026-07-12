import express from 'express';
import User from '../models/User';
import Department from '../models/Department';
import Asset from '../models/Asset';
import AssetCategory from '../models/AssetCategory';
import Allocation from '../models/Allocation';
import Booking from '../models/Booking';
import MaintenanceRequest from '../models/MaintenanceRequest';
import Notification from '../models/Notification';

const router = express.Router();

// Helper to create CRUD routes
const createCrudRoutes = (modelName: string, Model: any) => {
  const path = `/${modelName}`;
  
  // GET all
  router.get(path, async (req, res) => {
    try {
      const data = await Model.find();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST create
  router.post(path, async (req, res) => {
    try {
      const newItem = new Model(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // PUT update
  router.put(`${path}/:id`, async (req, res) => {
    try {
      const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedItem) return res.status(404).json({ error: 'Not found' });
      res.json(updatedItem);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETE
  router.delete(`${path}/:id`, async (req, res) => {
    try {
      const deletedItem = await Model.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Generate CRUD for all models
createCrudRoutes('users', User);
createCrudRoutes('departments', Department);
createCrudRoutes('assets', Asset);
createCrudRoutes('categories', AssetCategory);
createCrudRoutes('allocations', Allocation);
createCrudRoutes('bookings', Booking);
createCrudRoutes('maintenance', MaintenanceRequest);
createCrudRoutes('notifications', Notification);

export default router;
