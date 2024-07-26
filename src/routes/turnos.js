const Router = require("koa-router");

const router = new Router();

// Hice un cambio a como llevamos el orden y simplemente cuando se crea un nuevo jugador
// en una partida su atributo orden equivale a la cantidad de jugadores en la partida,
// calculado antes de crear el nuevo jugador, más 1.

// Ejemplo request body: { "partida_id": 1, "jugador_id": 1 }
// NOTA: borre los return false y true.
async function validarTurno(ctx, game_id, player_id) {
  // const game_id = ctx.request.body.game_id;
  // const player_id = ctx.request.body.player_id;

  let partida;
  let jugador;
  try {
    partida = await ctx.orm.Game.findByPk(game_id);
    jugador = await ctx.orm.Player.findByPk(player_id);
  } catch (error) {
    ctx.throw(404, "Partida o Jugador no encontrados");
  }

  if (!partida) {
    console.log(partida);
    ctx.throw(404, "Partida no encontrada");
  }

  if (!jugador) {
    ctx.throw(404, "Jugador no encontrado");
  }

  if (partida.status !== 1) { // 1 = en curso
    ctx.throw(400, "Partida no disponible");
  }

  console.log(partida.turn, jugador.number);

  if (partida.turn === jugador.number) {
    console.log("Es el turno del jugador.");
    // ctx.body = `Es el turno de  ${player_id}`;
    // ctx.status = 200;
    return true;
  } else {
    // ctx.body = `No es el turno del jugador ${player_id}`;
    // ctx.status = 200;
    return false;
  }
}

async function cambiarTurno(ctx, game_id) {
  try {
    // Obtener el juego actual por gameId
    const game_id = ctx.request.body.gameId;
    const player_id = ctx.request.body.playerId;
    const game = await ctx.orm.Game.findByPk(game_id);

    const turnoValido = await validarTurno(ctx, game_id, player_id);
    if (!turnoValido) {
      ctx.throw(400, "No es tu turno");
    }

    if (!game) {
      ctx.throw(404, "Juego no encontrado.");
    }
    // Calcular el próximo turno
    game.turn = game.turn % 4 + 1; // Esto asegura que después de 4, vuelva a 1

    // Guardar el cambio en la base de datos
    await game.save();

    console.log(`Turno actualizado a ${game.turn}`);
    //ctx.body = `Turno actualizado a ${game.turn}`;
    ctx.body = game.turn;
    ctx.status = 200;
    return game.turn; // Retorna el nuevo turno para confirmación o uso posterior
  } catch (error) {
    console.error("Error al cambiar el turno: ", error.message);
    throw error;  // Manejo de errores adecuado o re-throw
  }
}

// robar carta tiene que ser validar turno, luego robar carta y luego cambiar turno

router.post("turnos.validar", "/validar", async (ctx) => validarTurno(ctx));
//router.post('turnos.robar', '/robar', async (ctx) => robarCarta(ctx)); // post o get?
router.post("turnos.cambiar", "/cambiar", async (ctx) => cambiarTurno(ctx)); // post o get?

module.exports = {
  router,
  validarTurno,
  cambiarTurno
};