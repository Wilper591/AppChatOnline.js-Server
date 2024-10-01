import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generarJWT = (id, username, nombre) => {
  return jwt.sign({ id, username, nombre }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
};

export default generarJWT;
