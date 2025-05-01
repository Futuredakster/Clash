const express = require("express");
const multer = require("multer");
const router = express.Router();
const { tournaments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { Op } = require("sequelize");
const { cloudinary, storage } = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const upload = multer({ storage });
console.log(upload);

router.get("/", validateToken, async (req, res) => {
  console.log('This should show up!');
  const { tournament_name } = req.query;
  try {
    let whereCondition = { is_published: true };
    if (tournament_name && tournament_name.trim() !== "") {
      whereCondition.tournament_name = {
        [Op.like]: `%${tournament_name}%`,
      }; 
    }

    const listOfPosts = await tournaments.findAll({
      where: whereCondition,
      order: [["start_date", "ASC"]],
    });

    const tournamentsWithImageUrl = listOfPosts.map((tournament) => ({
      ...tournament.dataValues,
      imageUrl: tournament.image_filename || null,
    }));

    res.json(tournamentsWithImageUrl);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/praticipent", async (req, res) => {
  const { tournament_name } = req.query;
  try {
    let whereCondition = { is_published: true };
    if (tournament_name && tournament_name.trim() !== "") {
      whereCondition.tournament_name = {
        [Op.like]: `%${tournament_name}%`,
      };
      
    }

    const listOfPosts = await tournaments.findAll({
      where: whereCondition,
      order: [["start_date", "ASC"]],
    });

    const tournamentsWithImageUrl = listOfPosts.map((tournament) => ({
      ...tournament.dataValues,
      imageUrl: tournament.image_filename || null,
    }));

    res.json(tournamentsWithImageUrl);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/default", async (req, res) => {
  try {
    const { tournament_id } = req.query;
    const tournament = await tournaments.findOne({
      where: { tournament_id: tournament_id },
    });

    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    res.json(tournament);
  } catch (error) {
    console.error("Error fetching tournament:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/byaccount", validateToken, async (req, res) => {
  const { tournament_name } = req.query;
  const account_id = req.user.account_id;
  try {
    let whereCondition = { account_id };
    if (tournament_name && tournament_name.trim() !== "") {
      whereCondition.tournament_name = {
        [Op.like]: `%${tournament_name}%`,
      };
      
    }
    const listOfPosts = await tournaments.findAll({
      where: whereCondition,
      order: [["start_date", "ASC"]],
    });

    const tournamentsWithImageUrl = listOfPosts.map((tournament) => ({
      ...tournament.dataValues,
      imageUrl: tournament.image_filename || null,
    }));

    res.json(tournamentsWithImageUrl);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/",
  validateToken,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        console.error("Upload middleware error:", err);
        return res.status(400).json({ error: "Upload failed: " + err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      console.log("✅ Entered route");

      const isPublishedBool = req.body.is_published === 'true' || req.body.is_published === true;
      const { tournament_name, start_date, end_date } = req.body;
      const account_id = req.user.account_id;

      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      const imageUrl = req.file?.url || req.file?.path;

      const tournament = await tournaments.create({
        tournament_name,
        start_date,
        end_date,
        is_published: isPublishedBool,
        account_id,
        image_filename: imageUrl,
      });

      res.json(tournament);
    } catch (error) {
      console.error("Error creating tournament:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);



router.patch("/publish", validateToken, async (req, res) => {
  try {
    const tournament_id = req.body.tournament_id;
    const tournamentRes = await tournaments.findOne({
      where: {
        account_id: req.user.account_id,
        tournament_id: tournament_id,
      },
    });
    if (tournamentRes) {
      const Tournament = tournamentRes.dataValues;
      Tournament.is_published = true;
      await tournaments.update(Tournament, {
        where: { tournament_id: tournament_id },
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
  const account_id = req.user.account_id;
  const tournament_id = req.body.tournament_id;

  try {
    const deletedTournament = await tournaments.destroy({
      where: {
        account_id: account_id,
        tournament_id: tournament_id,
      },
    });

    if (deletedTournament > 0) {
      res.status(200).json({ message: "Tournament deleted successfully." });
    } else {
      res.status(404).json({ message: "Tournament not found or not deleted." });
    }
  } catch (error) {
    console.error("Error occurred while deleting tournament:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

function isNotNullOrEmpty(str) {
  return str !== null && str !== "";
}

module.exports = router;