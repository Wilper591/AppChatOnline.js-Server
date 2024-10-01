import { Usuario } from "../models/Usuario.js";
import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import generarJWT from "../helpers/generarJWT.js";

const iniciarSesion = async (req, res) => {
  try {
    const { username, password } = req.body;
    /* Busca el usuario en la BD por el Email ingresado */
    const loggedUser = await Usuario.findOne({ where: { username } });
    /* Valida si el Email Existe */
    if (!loggedUser) {
      const error = new Error("El Usuario no Existe");
      return res.status(401).json({ msg: error.message });
    }
    // Compara la contraseña ingresada por el usuario y la almacenada en la BD
    const validPassword = await bcrypt.compare(password, loggedUser.password);
    /* Valida si la contraseña es correcta */
    if (!validPassword) {
      const error = new Error("El Password es Incorrecto");
      return res.status(401).json({ msg: error.message });
    } else {
      const token = generarJWT(
        loggedUser.id,
        loggedUser.username,
        loggedUser.nombre
      );

      console.log({
        status: "Success",
        is_Active: true,
        message: "Usuario logueado",
        token,
      });
      res.status(200).json({
        status: "Success",
        is_Active: true,
        message: "Usuario logueado",
        token,
      });
    }
  } catch (error) {
    console.log({
      status: "Error",
      message: error.message,
      mensajeDelProgramador: "Login fallido",
    });
    res.status(500).json({
      status: "Error",
      message: error.message,
      mensajeDelProgramador: "Login fallido",
    });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre, username, correo, password } = req.body;

    const validateUsername = await Usuario.findOne({ where: { username } });
    /* Valida si el Username Existe */
    if (validateUsername) {
      const error = new Error("El Usuario Ya Existe");
      return res.status(401).json({ msg: error.message });
    }

    const validateCorreo = await Usuario.findOne({ where: { correo } });
    /* Valida si el Correo esta registrado */
    if (validateCorreo) {
      const error = new Error("El Correo Ya Esta Registrado");
      return res.status(401).json({ msg: error.message });
    }

    // Generar un salt y hashear el password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    /* Inicia la transacción */
    const transaction = await db.transaction();

    const newUser = await Usuario.create(
      {
        nombre,
        username,
        correo,
        password: hashedPassword,
      },
      { transaction }
    );
    if (!newUser.dataValues) {
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
        message: "Usuario creado Éxitosamente",
        code: 200,
        account: newUser.dataValues,
      });
      res.status(200).json({
        status: "Success",
        message: "Usuario creado Éxitosamente",
        code: 200,
        account: newUser.dataValues,
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.log({
      message: error.message,
      status: "Error de Servidor",
      code: 500,
      mensajeDelProgramador: "Creacion de nuevo usuario fallida.",
    });
    res.status(500).json({
      message: error.message,
      status: "Error de Servidor",
      code: 500,
      mensajeDelProgramador: "Creacion de nuevo usuario fallida.",
    });
  }
};

const perfilUsuario = async (req, res) => {
  try {
    const { usuario } = req;

    res.status(200).json(usuario);
  } catch (error) {
    console.log({
      status: "Error",
      message: error.message,
      mensajeDelProgramador: "Búsqueda de datos fallido",
    });
    res.status(500).json({
      status: "Error",
      message: error.message,
      mensajeDelProgramador: "Búsqueda de datos fallido",
    });
  }
};
export { iniciarSesion, crearUsuario, perfilUsuario };
