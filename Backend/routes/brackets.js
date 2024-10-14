const express = require("express");
const router = express.Router();
const { Divisions, participant, brackets } = require("../models"); 
const { validateToken } = require("../middlewares/AuthMiddleware");
const { Sequelize } = require('sequelize');

router.post("/", async (req, res) => {
    const { division_id } = req.body;
  
    try {
      // Fetch participants for the given division
      const participants = await participant.findAll({
        attributes: ['name'],
        include: [
          {
            model: Divisions,
            where: { division_id: division_id }, // Filter by division_id
            through: { attributes: [] } // Remove join table attributes from the result
          }
        ]
      });
  
      const participantNames = participants.map(participant => participant.name);
  
      // If only 1 participant, return with a bracket against 'Bi'
      if (participantNames.length === 1) {
        const user1 = participantNames[0];
        const user2 = "Bi"; // Assign a 'Bye' opponent
  
        await brackets.create({ division_id, user1, user2 });
        return res.json({ message: "Bracket created with one participant vs Bye", bracket: { user1, user2 } });
      }
  
      // Shuffle participant names array for random pairing
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]]; // Swap
        }
      }
      
      shuffleArray(participantNames);
  
      // Pair participants and create brackets
      const bracketPromises = [];
      while (participantNames.length > 1) {
        const user1 = participantNames.pop();  // Get the last participant
        const user2 = participantNames.pop();  // Get the next last participant
  
        // Ensure both names are unique in the pairing
        if (user1 !== user2) {
          // Create a bracket entry for this pair
          bracketPromises.push(brackets.create({ division_id, user1, user2 }));
        }
      }
  
      // If one participant is left unpaired, pair them with 'Bi'
      if (participantNames.length === 1) {
        const user1 = participantNames.pop();
        const user2 = "Bi";
        bracketPromises.push(brackets.create({ division_id, user1, user2 }));
      }
  
      // Wait for all bracket creation promises to complete
      await Promise.all(bracketPromises);
  
      return res.json({ message: "Brackets created successfully" });
    } catch (error) {
      console.error("Error creating brackets:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  

module.exports = router;
