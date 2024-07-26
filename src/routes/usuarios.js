const Router = require("koa-router");

const router = new Router();

async function index(ctx) {
  try {
    const usuarios = await ctx.orm.User.findAll();
    ctx.body = usuarios;
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error);
  }
}

async function show(ctx) {
  try {
    const usuario = await ctx.orm.User.findByPk(ctx.params.id);
    if (!usuario) {
      ctx.throw(404, "User not found");
      return;
    }
    ctx.body = usuario;
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error);
  }
}

async function getPlayers(ctx) {
  try {
    console.log(ctx.params.userId);
    console.log(ctx.params.gameId);
    console.log("Intentando getPlayers");

    const players = await ctx.orm.Player.findAll({
      where: {
        user_id: ctx.params.userId,
        game_id: ctx.params.gameId
      }
    });
    ctx.body = players;
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error);
    //ctx.body = "error";
  }
}

async function getPlayerId(ctx) {
  try {
    console.log(ctx.request.body);
    console.log("EL USER ID ES:", ctx.request.body.userId);
    console.log("EL GAME ID ES:", ctx.request.body.gameId);
    console.log("Intentando tener el id del player");

    const players = await ctx.orm.Player.findOne({
      where: {
        user_id: ctx.request.body.userId,
        game_id: ctx.request.body.gameId
      }
    });
    ctx.body = { playerId: players.id };
    ctx.status = 200;
    // res.send({ playerId: players.id });

  } catch (error) {
    ctx.throw(400, error);
    //ctx.body = "error";
  }
}

router.get("usuarios.index", "/index", async (ctx) => index(ctx));
router.get("usuarios.show", "/show/:id", async (ctx) => show(ctx));
router.get("usuarios.players", "/:userId/jugadores/:gameId", async (ctx) => getPlayers(ctx));
router.post("usuarios.playersId", "/get-player-id", async (ctx) => getPlayerId(ctx));

module.exports = router;