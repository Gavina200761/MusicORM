const express = require("express");
const { sequelize, Track } = require("./database/setup");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const requiredFields = ["songTitle", "artistName", "albumName", "genre"];

const isNonEmptyString = (value) =>
	typeof value === "string" && value.trim().length > 0;

const validateRequiredTrackFields = (payload) => {
	const missing = requiredFields.filter(
		(field) => !isNonEmptyString(payload[field])
	);

	if (missing.length > 0) {
		return `Missing or invalid required fields: ${missing.join(", ")}`;
	}

	return null;
};

app.get("/api/tracks", async (_req, res) => {
	try {
		const tracks = await Track.findAll();
		return res.status(200).json(tracks);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

app.get("/api/tracks/:id", async (req, res) => {
	try {
		const track = await Track.findByPk(req.params.id);

		if (!track) {
			return res.status(404).json({ error: "Track not found." });
		}

		return res.status(200).json(track);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

app.post("/api/tracks", async (req, res) => {
	try {
		const validationError = validateRequiredTrackFields(req.body);

		if (validationError) {
			return res.status(400).json({ error: validationError });
		}

		const newTrack = await Track.create(req.body);
		return res.status(201).json(newTrack);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

app.put("/api/tracks/:id", async (req, res) => {
	try {
		const track = await Track.findByPk(req.params.id);

		if (!track) {
			return res.status(404).json({ error: "Track not found." });
		}

		const updatedData = {
			songTitle: req.body.songTitle,
			artistName: req.body.artistName,
			albumName: req.body.albumName,
			genre: req.body.genre,
			duration: req.body.duration,
			releaseYear: req.body.releaseYear
		};

		const validationError = validateRequiredTrackFields(updatedData);
		if (validationError) {
			return res.status(400).json({ error: validationError });
		}

		await track.update(updatedData);
		return res.status(200).json(track);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

app.delete("/api/tracks/:id", async (req, res) => {
	try {
		const track = await Track.findByPk(req.params.id);

		if (!track) {
			return res.status(404).json({ error: "Track not found." });
		}

		await track.destroy();
		return res.status(200).json({ message: "Track deleted successfully." });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

const startServer = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error.message);
		process.exit(1);
	}
};

startServer();

module.exports = app;
