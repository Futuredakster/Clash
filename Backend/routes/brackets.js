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
      attributes: ['participant_id', 'name'],
      include: [
        {
          model: Divisions,
          where: { division_id },
          through: { attributes: [] }
        }
      ]
    });

    // Fetch existing brackets with win_user info
    const existingBrackets = await brackets.findAll({
      where: { division_id },
      attributes: ['participant_id1', 'participant_id2', 'win_user1', 'win_user2', 'round'],
      order: [['bracket_id', 'ASC']]
    });

    // Determine the next round number
    let nextRound = 1;
    const roundsWithWinners = existingBrackets
      .filter(bracket => bracket.win_user1 || bracket.win_user2)
      .map(bracket => bracket.round);
    if (roundsWithWinners.length > 0) {
      nextRound = Math.max(...roundsWithWinners) + 1;
    }
    console.log("Next round will be:", nextRound);

    // Collect unavailable participants based on win/lose logic
    const unavailableParticipantIds = new Set();

    for (let i = 0; i < existingBrackets.length; i += 2) {
      const bracket1 = existingBrackets[i];
      const bracket2 = existingBrackets[i + 1];

      if (!bracket2) continue;

      const b1HasWinner = bracket1.win_user1 || bracket1.win_user2;
      const b2HasWinner = bracket2.win_user1 || bracket2.win_user2;

      const b1NoWinner = !bracket1.win_user1 && !bracket1.win_user2;
      const b2NoWinner = !bracket2.win_user1 && !bracket2.win_user2;

      if (b1HasWinner && b2NoWinner) {
        if (bracket1.win_user1) unavailableParticipantIds.add(bracket1.participant_id1);
        if (bracket1.win_user2) unavailableParticipantIds.add(bracket1.participant_id2);
      }

      if (b2HasWinner && b1NoWinner) {
        if (bracket2.win_user1) unavailableParticipantIds.add(bracket2.participant_id1);
        if (bracket2.win_user2) unavailableParticipantIds.add(bracket2.participant_id2);
      }
    }

    // Add losers to unavailable set
    existingBrackets.forEach(bracket => {
      if (bracket.participant_id1 && bracket.win_user1 === false) {
        unavailableParticipantIds.add(bracket.participant_id1);
      }
      if (bracket.participant_id2 && bracket.win_user2 === false) {
        unavailableParticipantIds.add(bracket.participant_id2);
      }
    });

    const availableParticipants = participants.filter(
      p => !unavailableParticipantIds.has(p.participant_id)
    );

    const biAlreadyUsed = existingBrackets.some(
      bracket => bracket.participant_id1 === -1 || bracket.participant_id2 === -1
    );

    // If only 1 available participant, create Bye bracket
    if (availableParticipants.length === 1 && !biAlreadyUsed) {
      const participant_id1 = availableParticipants[0].participant_id;
      const user1 = availableParticipants[0].name;
      const user2 = "Bi";

      await brackets.create({
        division_id,
        participant_id1,
        participant_id2: -1,
        win_user1: false,
        win_user2: false,
        user1,
        user2,
        round: nextRound
      });

      return res.json({
        message: "Bracket created with one participant vs Bye",
        bracket: { user1, user2 }
      });
    }

    // Shuffle available participants
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    shuffleArray(availableParticipants);

    const bracketPromises = [];
    while (availableParticipants.length > 1) {
      const participant1 = availableParticipants.pop();
      const participant2 = availableParticipants.pop();

      const participant_id1 = participant1.participant_id;
      const participant_id2 = participant2.participant_id;
      const user1 = participant1.name;
      const user2 = participant2.name;

      if (participant_id1 !== participant_id2) {
        bracketPromises.push(
          brackets.create({
            division_id,
            participant_id1,
            participant_id2,
            win_user1: false,
            win_user2: false,
            user1,
            user2,
            round: nextRound
          })
        );
      }
    }

    // Handle leftover participant (Bye)
    if (availableParticipants.length === 1 && !biAlreadyUsed) {
      const participant1 = availableParticipants.pop();
      const participant_id1 = participant1.participant_id;
      const user1 = participant1.name;
      const user2 = "Bi";

      bracketPromises.push(
        brackets.create({
          division_id,
          participant_id1,
          participant_id2: -1,
          win_user1: false,
          win_user2: false,
          user1,
          user2,
          round: nextRound
        })
      );
    }

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
        return res.json([]); // Return an empty array
      }
      // Return the found bracket
      return res.json(bracket);
    } catch (error) {
      // Log the error for debugging
      console.error("Error fetching brackets:", error);
  
      // Return a 500 internal server error
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

  router.get('/One', async (req,res) => {
    const { bracket_id } = req.query;
    const bracket = await brackets.findOne({
      where: {
        bracket_id: bracket_id
      }
    })
    return res.json(bracket);
  });

  router.patch('/updatePoints', async (req, res) => { 
    const { bracket_id, user, points } = req.body;
    try {
        // Fetch the bracket by bracket_id
        let bracket = await brackets.findOne({ where: { bracket_id: bracket_id } });
     
        if (!bracket) {
            console.log("error");
            return res.status(404).send({ error: 'Bracket not found' });
        }

        // Determine which user to update based on 'user'
        if (user === 'user1') {
            await brackets.update(
                { points_user1: points },
                { where: { bracket_id: bracket_id } }
            );
        } else if (user === 'user2') {
            await brackets.update(
                { points_user2: points },
                { where: { bracket_id: bracket_id } }
            );
        } else {
            return res.status(400).send({ error: 'Invalid user' });
        }

        // Fetch updated bracket after updating points
        bracket = await brackets.findOne({ where: { bracket_id: bracket_id } });

        // Check if win condition is met for user1
        if (bracket.points_user1 >= 8) {
            await brackets.update(
                { win_user1: true },
                { where: { bracket_id: bracket_id } }
            );
        } else if (bracket.points_user1 < 8) {
            await brackets.update(
                { win_user1: false },
                { where: { bracket_id: bracket_id } }
            );
        }

        // Check if win condition is met for user2
        if (bracket.points_user2 >= 8) {
            await brackets.update(
                { win_user2: true },
                { where: { bracket_id: bracket_id } }
            );
        } else if (bracket.points_user2 < 8) {
            await brackets.update(
                { win_user2: false },
                { where: { bracket_id: bracket_id } }
            );
        }

        res.status(200).send({ message: 'Points updated successfully' });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while updating points' });
    }
});


  
module.exports = router;
