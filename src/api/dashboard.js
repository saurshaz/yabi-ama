const express = require('express');
const router = express.Router();

// Mock data for dashboards
let dashboards = [];

// Route to add a new dashboard
router.post('/add', (req, res) => {
    const newDashboard = req.body;
    dashboards.push(newDashboard);
    res.status(201).json({ message: 'Dashboard added successfully', dashboard: newDashboard });
});

// Route to edit an existing dashboard
router.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const updatedDashboard = req.body;
    dashboards = dashboards.map(dashboard => (dashboard.id === id ? updatedDashboard : dashboard));
    res.json({ message: 'Dashboard updated successfully', dashboard: updatedDashboard });
});

// Route to list all saved dashboards
router.get('/list', (req, res) => {
    res.json(dashboards);
});

module.exports = router;
