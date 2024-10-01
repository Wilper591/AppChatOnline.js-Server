import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL, {
  define: {
    timestamps: false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 20000,
  },
  operatorAliases: false,
});

const testConection = async () => {
  try {
    await db.authenticate();
    console.log("DB Conectada con Éxito");
  } catch (error) {
    console.error("ERROR: no se ha podido conectar a la DB: ", error);
  }
};

export { db, testConection };
