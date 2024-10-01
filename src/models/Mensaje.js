import Sequelize from "sequelize";
import { db } from "../config/db.js";
import moment from "moment-timezone";
import { Usuario } from "./Usuario.js";

const Mensaje = db.define(
  "mensajes_chat",
  {
    usuario_id: {
      type: Sequelize.INTEGER,
    },
    mensaje: {
      type: Sequelize.STRING,
    },
    fecha_hora: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    hooks: {
      beforeCreate: (mensaje) => {
        mensaje.fecha_hora = moment().tz("America/Santiago").format();
      },
      beforeUpdate: (mensaje) => {
        mensaje.fecha_hora = moment().tz("America/Santiago").format();
      },
    },
    tableName: "mensajes_chat",
    timestamps: false,
  }
);

Mensaje.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  targetKey: "id"
})

Usuario.hasMany(Mensaje, {
  foreignKey: "usuario_id",
  sourceKey: "id",
});

export { Mensaje };
