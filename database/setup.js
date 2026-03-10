const { Sequelize } = require("sequelize");
const { dbConfig, environment } = require("./config");

const sequelize = new Sequelize(dbConfig);

const connectDatabase = async () => {
	try {
		await sequelize.authenticate();
		console.log(
			`Connected to ${environment} SQLite database at ${dbConfig.storage}`
		);
	} catch (error) {
		console.error("Unable to connect to the database:", error.message);
		throw error;
	}
};

if (require.main === module) {
	connectDatabase()
		.then(() => sequelize.close())
		.catch(() => process.exit(1));
}

module.exports = {
	sequelize,
	environment,
	connectDatabase
};
