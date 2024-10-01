import { Mensaje } from "../models/Mensaje.js";
import { Usuario } from "../models/Usuario.js";
import { db } from "../config/db.js";

const crearMensaje = async (req, res) => {
  try {
    const { mensaje, id } = req.body;
    console.log(mensaje);
    console.log(id);

    /* Inicia la transacción */
    const transaction = await db.transaction();

    const newMsg = await Mensaje.create(
      {
        usuario_id: id,
        mensaje,
      },
      { transaction }
    );

    if (!newMsg) {
      /* Error */
      await transaction.rollback();
      console.log({
        status: "Error",
        message: "No se pudo crear al nuevo usuario",
        code: 500,
      });
      res.status(500).json({
        status: "Error",
        message: "No se pudo crear al nuevo usuario",
        code: 500,
      });
    } else {
      /* Finaliza transcción */
      await transaction.commit();
      /* Success */
      console.log({
        status: "Success",
        message: "Mensaje Almacenado Exitosamente.",
        code: 200,
      });
      res.status(200).json({
        status: "Success",
        message: "Mensaje Almacenado Exitosamente.",
        code: 200,
      });
    }
  } catch (error) {
    console.log({
      status: "Error",
      message: error.message,
      mensajeDelProgramador: "Guardado de mensaje fallido",
    });
    res.status(500).json({
      status: "Error",
      message: error.message,
      mensajeDelProgramador: "Guardado de mensaje fallido",
    });
  }
};

const leerMensajes = async (req, res) => {
  try {
    const getMsg = await Mensaje.findAll({
      attributes: ["id", "mensaje", "fecha_hora"],
      include: [
        {
          model: Usuario,
          attributes: ["username"],
        },
      ],
      limit: 15,
      order: [["fecha_hora", "DESC"]],
    });

    if (!getMsg) {
      /* Error */
      console.log({
        status: "Error",
        message: "No se pudieron obtener los mensajes.",
        code: 500,
      });
      res.status(500).json({
        status: "Error",
        message: "No se pudieron obtener los mensajes.",
        code: 500,
      });
    } else {
      /* Success */
      console.log({
        status: "Success",
        message: "Mensajes Encontrados Exitosamente.",
        code: 200,
        account: getMsg,
      });
      res.status(200).json({
        status: "Success",
        message: "Mensajes Encontrados Exitosamente.",
        code: 200,
        account: getMsg,
      });
    }
  } catch (error) {
    console.log({
      status: "Error",
      message: error.message,
      mensajeDelProgramador: "Búsqueda de Mensajes Fallida.",
    });
    res.status(500).json({
      status: "Error",
      message: error.message,
      mensajeDelProgramador: "Búsqueda de Mensajes Fallida.",
    });
  }
};

export { crearMensaje, leerMensajes };
