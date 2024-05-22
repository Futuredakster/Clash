const express = require("express");
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { tournaments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { Op } = require('sequelize');

router.get("/", validateToken, async (req, res) => {
  const { tournament_name } = req.query;
  try {
    let whereCondition = { is_published: true };
    if (tournament_name && tournament_name.trim() !== '') {
      whereCondition.tournament_name = {
        [Op.like]: `%${tournament_name}%`
      };
    }

    const listOfPosts = await tournaments.findAll({
      where: whereCondition,
      order: [['start_date', 'ASC']]
    });

    // Construct the image URL for each tournament
    const tournamentsWithImageUrl = listOfPosts.map(tournament => ({
      ...tournament.dataValues,
      imageUrl: tournament.image_filename ? `${req.protocol}://${req.get('host')}/uploads/${tournament.image_filename}` : null
    }));

    res.json(tournamentsWithImageUrl);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/byaccount", validateToken, async (req, res) => {
  const { tournament_name } = req.query;
  const account_id = req.user.account_id;
  try {
    let whereCondition = { account_id };
    if (tournament_name && tournament_name.trim() !== '') {
      whereCondition.tournament_name = {
        [Op.like]: `%${tournament_name}%`
      };
    }
    const listOfPosts = await tournaments.findAll({
      where: whereCondition,
      order: [['start_date', 'ASC']]
    });

    // Construct the image URL for each tournament
    const tournamentsWithImageUrl = listOfPosts.map(tournament => ({
      ...tournament.dataValues,
      imageUrl: tournament.image_filename ? `${req.protocol}://${req.get('host')}/uploads/${tournament.image_filename}` : null
    }));

    res.json(tournamentsWithImageUrl);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', '..', 'backend', 'uploads'); 
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = Date.now() + '-' + file.originalname;
    cb(null, uniqueFilename);
  }
});


const upload = multer({ storage: storage });

router.post("/", validateToken, upload.single('image'), async (req, res) => {
  try {
    const { tournament_name, start_date, end_date, is_published } = req.body;
    const account_id = req.user.account_id;

   
    const imageFilename = req.file.filename;

 
    const tournament = await tournaments.create({
      tournament_name,
      start_date,
      end_date,
      is_published,
      account_id,
      image_filename: imageFilename
    });

    res.json(tournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete("/", validateToken, async (req, res) => {
  const account_id = req.user.account_id;
  const tournament_id = req.body.tournament_id; // Assuming 'tournament_name' is in req.body

  try {
    const deletedTournament = await tournaments.destroy({
      where: {
        account_id: account_id,
        tournament_id: tournament_id
      }
    });

    if (deletedTournament > 0) {
      res.status(200).json({ message: 'Tournament deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Tournament not found or not deleted.' });
    }
  } catch (error) {
    console.error('Error occurred while deleting tournament:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.patch("/", validateToken, upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    const tournamentRes = await tournaments.findOne({ where: { account_id: req.user.account_id, tournament_id: data.tournament_id } });
    
    if (tournamentRes) {
      const Tournament = tournamentRes.dataValues;
      Tournament.tournament_name = isNotNullOrEmpty(data.tournament_name) ? data.tournament_name : Tournament.tournament_name;
      Tournament.start_date = isNotNullOrEmpty(data.start_date) ? data.start_date : Tournament.start_date;
      Tournament.end_date = isNotNullOrEmpty(data.end_date) ? data.end_date : Tournament.end_date;
      
      if (req.file) {
        Tournament.image_filename = req.file.filename;
      }

      await tournaments.update(Tournament, {
        where: { tournament_id: data.tournament_id }
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

module.exports = router;

/*router.patch("/", validateToken, async (req, res) => {
  const data = req.body;
  let updatesPerformed = false;
  const Tournament = await tournaments.findOne({ where: { account_id: data.account_id, tournament_id: data.tournament_id } });
  if (Tournament.tournament_name !== data.tournament_name && data.tournament_name !== "") {
    await tournaments.update({ tournament_name: data.tournament_name }, {
      where: {
        tournament_id: data.tournament_id
      }
    }  
  )
  updatesPerformed = true;
  }  if (Tournament.start_date != data.start_date && data.start_date !== "") {
    var startDate = await tournaments.update({ start_date: data.start_date }, {
      where: {
        tournament_id: data.tournament_id
      }
    })
    updatesPerformed = true;
  }  if (Tournament.end_date != data.end_date && data.end_date !== "") {
    var endDate = await tournaments.update({ end_date: data.end_date }, {
      where: {
        tournament_id: data.tournament_id
      }
    })
    updatesPerformed = true;
  }
  if (updatesPerformed) {
    return res.json({ message: "Tournament updated successfully" });
  } else {
    return res.status(500).json({ message: "No updates performed" });
  }
}) */

function isNotNullOrEmpty(str) {
  return str !== null && str !== '';
}

module.exports = router;

// .\node_modules\.bin\sequelize-auto -h localhost -d clash -u root -x danny -p 3306  --dialect mysql -o " /.models"