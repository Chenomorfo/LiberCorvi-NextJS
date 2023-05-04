import { Sequelize } from "sequelize";

const DB_CONN = (dbName = "") => {
  return new Sequelize(dbName, "root", "", {
    host: "localhost",
    dialect: "mysql",
  });
};

let sequelize = DB_CONN("Biblioteca_API");

try {
  await sequelize.sync();
  console.log("DB Succefully Connected");
} catch (error) {
  if (error.name === "SequelizeConnectionRefusedError")
    console.log("Please, connect XAMPP");

  if (error.name === "SequelizeConnectionError") {
    sequelize = DB_CONN();
    await sequelize.query("CREATE DATABASE Biblioteca_API");
    await sequelize.close();
    sequelize = DB_CONN("Biblioteca_API");
  }
}

export default sequelize;
