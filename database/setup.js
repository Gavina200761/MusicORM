const { Sequelize, DataTypes } = require("sequelize");
const { dbConfig, environment } = require("./config");

const sequelize = new Sequelize(dbConfig);

const Track = sequelize.define(
	"Track",
	{
		trackId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		songTitle: {
			type: DataTypes.STRING,
			allowNull: false
		},
		artistName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		albumName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		genre: {
			type: DataTypes.STRING,
			allowNull: false
		},
		duration: {
			type: DataTypes.INTEGER
		},
		releaseYear: {
			type: DataTypes.INTEGER
		}
	},
	{
		tableName: "tracks",
		timestamps: false
	}
);

const initializeDatabase = async () => {
	try {
		await sequelize.authenticate();
		console.log(
			`Connected to ${environment} SQLite database at ${dbConfig.storage}`
		);

		await sequelize.sync();
		console.log("Database tables created/synchronized.");
	} catch (error) {
		console.error("Database initialization failed:", error.message);
		throw error;
	} finally {
		await sequelize.close();
		console.log("Database connection closed.");
	}
};

if (require.main === module) {
	initializeDatabase().catch(() => process.exit(1));
}

module.exports = {
	sequelize,
	Track,
	environment,
	initializeDatabase
};
