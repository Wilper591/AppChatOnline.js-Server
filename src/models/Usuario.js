import Sequelize from "sequelize";
import { db } from "../config/db.js";

const Usuario = db.define(
  "usuarios_testing",
  {
    nombre: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    correo: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true, 
  }
);

export { Usuario };
