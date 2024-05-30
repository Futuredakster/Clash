const express = require("express");
const router = express.Router();
const {Divisions} = require ("../models");
const {participant} = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { Sequelize } = require('sequelize');


router.post('/', validateToken, async (req, res) => {
    try {
      const data = req.body;
      const division = await Divisions.create(data);
      res.json("Bracket Created");
    } catch (error) {
      console.error("Error creating division:", error);
      res.status(500).json({ error: "Something went wrong while creating the division." });
    }
  });

  router.get('/',validateToken,async (req,res) =>{
    const { tournament_id } = req.query;
    const divisions = await Divisions.findAll({
        where: {tournament_id:tournament_id},
      });
      res.json(divisions);
  });

  router.get('/praticepent',async (req,res) =>{
    const { tournament_id } = req.query;
    
const divisions = await Divisions.findAll({
      where: { tournament_id: tournament_id },
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('participant_id')), 'participant_count']
        ]
      },
      include: [
        {
          model: participant,
          attributes: []
        }
      ],
      group: ['Divisions.division_id']
    });
      res.json(divisions);
  });

  router.get('/default',async (req,res) => {
    const { division_id } = req.query;
    const divisions = await Divisions.findOne({
        where: {division_id:division_id},
      });
     // */
      res.json(divisions);
  });



  router.patch("/", validateToken, async (req, res) => {
    try {
      const data = req.body;
      const DivisionRes = await Divisions.findOne({ where: { division_id: data.division_id } });
      
      if (DivisionRes) {
        const Division = DivisionRes.dataValues;
        Division.age_group = isNotNullOrEmpty(data.age_group) ? data.age_group : Division.age_group;
        Division.proficiency_level = isNotNullOrEmpty(data.proficiency_level) ? data.proficiency_level : Division.proficiency_level;
        Division.gender = isNotNullOrEmpty(data.gender) ? data.gender : Division.gender;
  
        await Divisions.update(Division, {
          where: { division_id: data.division_id }
        });
  
        res.status(200).json({ message: "Successfully updated" });
      } else {
        console.log("Not found");
        res.status(404).json({ error: "Tournament not found" });
      }
    } catch (error) {
      console.error("Error updating tournament:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.delete("/", validateToken, async (req, res) => {
    const division_id = req.body.division_id; 
    try {
      const deletedDivision = await Divisions.destroy({
        where: {
          division_id: division_id
        }
      });
  
      if (deletedDivision > 0) {
        res.status(200).json({ message: 'Tournament deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Tournament not found or not deleted.' });
      }
    } catch (error) {
      console.error('Error occurred while deleting tournament:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

  function isNotNullOrEmpty(str) {
    return str !== null && str !== '';
  }

module.exports = router;