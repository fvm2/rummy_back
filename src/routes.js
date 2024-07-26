const Router = require("koa-router");

// Rutas Modelos
const instrucciones = require("./routes/instrucciones");
const partidas = require("./routes/partidas");

// así exporto el router, ya que además estoy exportando funciones al controlador de partidas, funciona como antes
const { router: cartas } = require("./routes/cartas");
const { router: turnos } = require("./routes/turnos");

const usuarios = require("./routes/usuarios");
const auth = require("./routes/auth");
const scopes = require("./routes/ejemploScope");

// Middleware JWT
const jwtMiddleware = require("koa-jwt");
const dotenv = require("dotenv");
dotenv.config();

const router = new Router();

router.use("/instrucciones", instrucciones.routes());
router.use("/partidas", partidas.routes());
router.use("/turnos", turnos.routes());
router.use("/cartas", cartas.routes(), cartas.allowedMethods());
router.use("/auth", auth.routes());

// Rutas protegidas por JWT, solo aplica para las rutas que estén debajo de este middleware
router.use(jwtMiddleware({ secret: process.env.JWT_SECRET }));
router.use("/usuarios", usuarios.routes());

// Ruta de prueba para scopes de JWT
router.use("/scopes-ejemplo", scopes.routes());

module.exports = router;