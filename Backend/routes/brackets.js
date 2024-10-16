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
      attributes: ['name'], // Include participant_id
      include: [
        {
          model: Divisions,
          where: { division_id: division_id }, // Filter by division_id
          through: { attributes: [] } // Remove join table attributes from the result
        }
      ]
    });

    // Fetch existing brackets for this division
    const existingBrackets = await brackets.findAll({
      where: { division_id },
      attributes: ['user1', 'user2']
    });

    const existingParticipants = new Set(
      existingBrackets.flatMap(bracket => [bracket.user1, bracket.user2])
    );

    const availableParticipants = participants.filter(
      participant => !existingParticipants.has(participant.name)
    );

    const participantNames = availableParticipants.map(participant => participant.name);

    // If only 1 available participant, return with a bracket against 'Bi'
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


  router.get("/", async (req, res) => {
    const { division_id } = req.query;
  
    // Log for debugging to see what division_id is being passed
    console.log('division_id:', division_id);
  
    // Check if division_id is provided
    if (!division_id) {
      return res.status(400).json({ error: "division_id is required" });
    }
  
    try {
      // Query the database for brackets with the given division_id
      const bracket = await brackets.findAll({
        where: {
          division_id: division_id // Ensure division_id is used correctly in the query
        }
      });
  
      // If no brackets found, return 404
      if (bracket.length === 0) {
        return res.status(404).json({ error: "No brackets found for the provided division_id" });
      }
  
      // Return the found bracket
      console.log(bracket);
      return res.json(bracket);
    } catch (error) {
      // Log the error for debugging
      console.error("Error fetching brackets:", error);
  
      // Return a 500 internal server error
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  

module.exports = router;
