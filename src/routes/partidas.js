const Router = require("koa-router");

const router = new Router();
const { crearMazo, repartirCartas } = require("./cartas.js");

// Ejemplo request body: { "usuario_id": 1 }
// Ejemplo request url: POST /partida/crear
async function crearPartida(ctx) {
  // En el ORM crear un nuevo jugador con id = surrogate key,
  // usuario_id = id del usuario que crea la partida y
  // crear partida con id = surrogate key, estado = "en espera(0)"
  console.log("Cuerpo de la solicitud:", ctx.request.body);
  const user_id = ctx.request.body.user_id;

  let partida;
  try {
    partida = await ctx.orm.Game.create({
      status: 0,
      deck: null,
      turn: 1,
      playing_time: 0,
      initial_cards: 12,
      shop: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    ctx.throw(400, `Error en Partida: ${error}`); // Para debuggear
    //ctx.throw(400, 'No se pudo crear la partida');
  }

  let jugador;
  try {
    jugador = await ctx.orm.Player.create({
      number: 1,
      points: 0,
      has_played: false,
      normal_cards: null,
      special_cards: null,
      game_id: partida.id,
      user_id: user_id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

  } catch (error) {
    ctx.throw(400, `Error en Jugador: ${error}`); // Para debuggear
    //ctx.throw(400, 'No se pudo crear el jugador');
  }

  // Esto es equivalente a ctx.response.status = 201 segun la documentacion de koa y un post en stackoverflow https://stackoverflow.com/questions/42212432/how-to-send-a-http-response-using-koajs
  ctx.body = {message: `Partida ${partida.id} creada, eres el jugador 1`,
    game_id: partida.id,};
  ctx.status = 201;
}

// Ejemplo request body: { "usuario_id": 1, "partida_id": 1}
async function unirsePartida(ctx) {
  const user_id = ctx.request.body.user_id;
  const game_id = ctx.request.body.game_id;

  let partida; // Esto permite acceder a partida fuera del bloque try
  try {
    partida = await ctx.orm.Game.findByPk(game_id);
    console.log(partida.status);
    console.log(partida.turn);

  } catch (error) {
    ctx.throw(404, "Partida no encontrada");
  }

  // Esto es parecido a lo de arriba pero no es lo mismo.
  if (!partida) {
    ctx.throw(404, "Partida no encontrada");
  }

  if (partida.status !== 0) { // 0 = en espera
    ctx.throw(400, "Partida no disponible");
  }

  const nJugadores = await ctx.orm.Player.count({
    where: { game_id: game_id }
  });

  if (nJugadores >= 4) {
    ctx.throw(400, "Partida llena");
  }

  // Si todo está bien
  try {
    await ctx.orm.Player.create({
      number: nJugadores + 1,
      points: 0,
      has_played: false,
      normal_cards: null,
      special_cards: null,
      game_id: game_id,
      user_id: user_id
    });

    // Antes llamaba a empezar partida si habian 4 jugadores, lo separaré en otro endpoint para poder porbarlo de mejor manera.
    ctx.body = "Te has unido con éxito a la partida, numero de jugador: " + (nJugadores + 1);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(500, "No se pudo unir a la partida");
  }
}

// Ejemplo request body: { "partida_id": 1 }
async function empezarPartida(ctx) {
  const game_id = ctx.request.body.game_id;

  const user_id = ctx.request.body.user_id;

  console.log("Cuerpo de la solicitud:", ctx.request.body);

  let partida;
  let jugadores;
  try {
    partida = await ctx.orm.Game.findByPk(game_id);
    jugadores = await ctx.orm.Player.findAll({
      where: { game_id: game_id }
    });
    console.log(jugadores);
  } catch (error) {
    ctx.throw(404, "Partida no encontrada");
  }

  if (partida.status === 1) {
    ctx.throw(400, "La partida ya empezó. No se puede empezar de nuevo");
  }

  if (partida.status === 2) {
    ctx.throw(400, "La partida ya terminó. No se puede empezar de nuevo");
  }

  if (user_id !== jugadores[0].user_id) {
    ctx.throw(400, "Solo el creador de la partida puede empezarla");
  }

  try {
    // Asumiendo que 'jugadores' ya está definido o es accesible en este contexto
    if (Object.keys(jugadores).length === 4) {
      partida.status = 1; // Prepara la partida para ser iniciada

      // Intenta crear el mazo y el tablero
      await crearMazo(ctx);
      console.log("mazo creado");
      await crearTablero(ctx, game_id);
      console.log("tablero creado");
      await repartirCartas(ctx, game_id);
      console.log("cartas repartidas");

      // Guarda los cambios de la partida solo si no hay errores
      await partida.save();
      ctx.body = `Partida ${game_id} empezada`;
      ctx.status = 200;
    } else {
      ctx.throw(400, "Deben haber exactamente 4 jugadores para empezar la partida");
    }
  } catch (error) {
    // Maneja los errores de las funciones llamadas
    console.error("Error al intentar iniciar la partida:", error);

    // Aquí decides cómo manejar el error. Podrías, por ejemplo, no cambiar el estado de `partida`
    // y enviar un mensaje de error al cliente.
    ctx.status = 500; // Internal Server Error
    ctx.body = `Error al empezar la partida ${game_id}: ${error.message}`;
  }
};

async function crearTablero(ctx, game_id) {
  const totalCasillas = 36;
  let casillas = [];

  try {
    for (let number = 1; number <= totalCasillas; number++) {
      const nuevaCasilla = {
        number: number,
        cards: JSON.stringify([]),
        special_card: null,
        game_id: game_id,
        player_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      casillas.push(nuevaCasilla);
    }

    // Usar bulkCreate para insertar todas las casillas en la base de datos de una sola vez
    await ctx.orm.Square.bulkCreate(casillas);

    ctx.status = 200;
    ctx.body = {
      message: "Tablero creado exitosamente",
      game_id: game_id
    };
  } catch (error) {
    console.error("Error al crear el tablero:", error);
    ctx.throw(500, "Error interno al crear el tablero");
  }
}

// Ejemplo request url: GET /partida/obtener/info/1
async function obtenerInfoPartida(ctx) {
  const game_id = ctx.params.id;

  let partida;
  let jugadores;
  try {
    partida = await ctx.orm.Game.findByPk(game_id);
    jugadores = await ctx.orm.Player.findAll({
      where: { game_id: game_id }
    });
  } catch (error) {
    ctx.throw(404, "Partida no encontrada");
  }

  if (!partida) {
    ctx.throw(404, "Partida no encontrada");
  }

  if (!jugadores) {
    ctx.throw(404, "Jugadores no encontrados");
  }

  let n_jugadores = Object.keys(jugadores).length;
  ctx.body = {
    partida: partida,
    n_jugadores: n_jugadores
  };
  ctx.status = 200;
}

// Ejemplo request url: GET /partida/obtener/ids
async function obtenerIdsPartidas(ctx) {
  const partidas = await ctx.orm.Game.findAll({
    attributes: ["id"]
  });

  ctx.body = partidas;
  ctx.status = 200;
}

async function obtenerInfoSalaEspera(ctx) {
  const game_id = ctx.params.id;

  let partida;
  let jugadores;
  try {
    partida = await ctx.orm.Game.findByPk(game_id);
    jugadores = await ctx.orm.Player.findAll({
      where: { game_id: game_id }
    });
  } catch (error) {
    ctx.throw(404, "Partida no encontrada");
  }

  if (!partida) {
    ctx.throw(404, "Partida no encontrada");
  }

  if (!jugadores) {
    ctx.throw(404, "Jugadores no encontrados");
  }

  n_jugadores = Object.keys(jugadores).length;
  info_jugadores = [];

  for (let i = 0; i < n_jugadores; i++) {
    user = await ctx.orm.User.findByPk(jugadores[i].user_id);
    info_jugadores.push({
      n_jugador: jugadores[i].number,
      username: user.username,
      wins: user.wins,
      played_matches: user.played_matches
    });
  }

  ctx.body = {
    partida: partida,
    n_jugadores: n_jugadores,
    info_jugadores: info_jugadores
  };
  ctx.status = 200;
}

// Puntaje del jugador que envia la solicitud (suma de puntos de las cartas que ha bajado):

// Turno actual:
async function getTurnoActual(ctx) {
  const { gameId } = ctx.request.body;  // Cambiado a ctx.request.body para POST
  if (!gameId) {
    ctx.status = 400;
    ctx.body = { error: "gameId is required" };
    return;
  }
  const game = await ctx.orm.Game.findOne({
    where: { id: gameId }
  });
  if (!game) {
    ctx.status = 404;
    ctx.body = { error: "Game not found" };
    return;
  }
  const turno = game.turn;
  ctx.body = { turno: turno };
  ctx.status = 200;
}

// Email de todos los jugadores en una partida y cantidad de cartas que tienen:
async function getEmailsCartas(ctx) {
  const { gameId } = ctx.request.body;  // Cambiado a ctx.request.body para POST
  if (!gameId) {
    ctx.status = 400;
    ctx.body = { error: "gameId is required" };
    return;
  }
  const players = await ctx.orm.Player.findAll({
    where: { game_id: gameId }
  });
  if (!players) {
    ctx.status = 404;
    ctx.body = { error: "Players not found" };
    return;
  }
  const emails = [];
  for (const player of players) {
    const user = await ctx.orm.User.findOne({
      where: { id: player.user_id }
    });
    if (user) {
      emails.push({
        email: user.email,
        normal_cards: player.normal_cards,
        special_cards: player.special_cards
      });
    }
  }
  ctx.body = emails;
  ctx.status = 200;
}

const obtenerCasilla = async (ctx) => {
  const { id, number } = ctx.params;
  const casilla = await ctx.orm.Square.findOne({
    where: { game_id: id, number: number }
  });
  if (!casilla) {
    ctx.status = 404;
    ctx.body = { error: "Square not found" };
    return;
  }
  ctx.body = casilla;
  ctx.status = 200;

};

const obtenerPuntos = async (ctx) => {
    const player_id = ctx.request.body.playerId;
    const player = await ctx.orm.Player.findByPk(player_id);
    const points = player.points;
    ctx.body = points;
    ctx.status = 200;
};


router.post("partidas.crear", "/crear", async (ctx) => crearPartida(ctx));
router.post("partidas.unirse", "/unirse", async (ctx) => unirsePartida(ctx)); // no estoy seguro si es get o post
router.post("partidas.empezar", "/empezar", async (ctx) => empezarPartida(ctx));

router.get("partidas.info", "/info/:id", async (ctx) => obtenerInfoPartida(ctx));
router.get("partidas.ids", "/ids", async (ctx) => obtenerIdsPartidas(ctx));

router.get("partidas.espera", "/salaEspera/:id", async (ctx) => obtenerInfoSalaEspera(ctx));

// falta partidas/id para unirse al juego y que se renderize el juego
// (se puede hacer de otra forma igual), pero esa era la idea de lo que se ejecute al unirse

// Para el dashboard info-juego en Game.jsx
router.post("partidas.turno", "/turnoActual", async (ctx) => getTurnoActual(ctx));
router.post("partidas.emails", "/emailsCartas", async (ctx) => getEmailsCartas(ctx));

router.get("partidas.casilla", "/:id/casilla/:number", async (ctx) => obtenerCasilla(ctx));

router.post("partidas.puntos", "/puntos", async (ctx) => obtenerPuntos(ctx));

module.exports = router;