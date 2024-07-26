// Ruta de Prueba
const Router = require("koa-router");

const router = new Router();

const instrucciones = [
  {
    "id": 1,
    "content": "Solo puedes jugar en tu turno"
  },
  {
    "id": 2,
    "content": "Los turnos duran 1 minuto"
  },
  {
    "id": 3,
    "content": "Bara bajar tus cartas por primera vez, deben sumar 30 puntos"
  }
];

router.get("instrucciones.show", "/show", async (ctx) => {
  ctx.body = instrucciones;
});

module.exports = router;