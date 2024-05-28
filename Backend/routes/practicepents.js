const express = require("express");
const {Practicepent} = require("../models");
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { name, date_of_birth, belt_color, division_id, age_group } = req.body;

    if (!name || !date_of_birth || !belt_color || !division_id || !age_group) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [minAge, maxAge] = age_group.split('-').map(Number);
    if (isNaN(minAge) || isNaN(maxAge)) {
      return res.status(400).json({ error: 'Invalid age group format' });
    }

    const [year, month, day] = date_of_birth.split('-').map(Number);
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return res.status(400).json({ error: 'Invalid date of birth format' });
    }

    const birthDate = new Date(year, month - 1, day);
    if (birthDate.toString() === 'Invalid Date') {
      return res.status(400).json({ error: 'Invalid date of birth value' });
    }

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    if (age < minAge || age > maxAge) {
      return res.json({ error: 'Wrong age' });
    }

    const newParticipant = await Practicepent.create({
      name,
      date_of_birth,
      belt_color,
      division_id
    });

    
    res.status(201).json(newParticipant);
  } catch (error) {
    console.error('Error creating participant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
