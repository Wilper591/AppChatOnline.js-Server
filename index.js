import { testConection } from "./src/config/db.js";
import cors from "cors";
import express from "express";
import rutasUsuario from "./src/routes/usuario.routes.js";
import rutasMensaje from "./src/routes/mensaje.routes.js";
import { Server } from "socket.io";
import http from "http";

const app = express();
const PORT = process.env.PORT || 3000;
testConection();

// Configuración de Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Rutas
app.use("/apiV1/usuario", rutasUsuario);
app.use("/apiV1/mensaje", rutasMensaje);

// Crear el servidor HTTP a partir de Express
const server = http.createServer(app);

// Integrar Socket.io con el servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Manejo de conexiones de Socket.io
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado:", socket.id);

  // Evento para escuchar mensajes
  socket.on("chatMessage", (msg) => {
    console.log("Mensaje recibido:", msg);

    // Reenviar el mensaje a todos los clientes conectados
    io.emit("message", { id: socket.id, msg });
  });

  // Manejo de desconexión
  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado:", socket.id);
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`SERVIDOR LEVANTADO EN EL PUERTO: ${PORT} - PID: ${process.pid}`);
});
