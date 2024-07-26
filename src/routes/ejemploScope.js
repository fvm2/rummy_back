const Router = require("koa-router");
const authUtils = require("../lib/auth/jwt");

const router = new Router();

router.get("/protecteduser", authUtils.isUser, async (ctx) => {
  //ctx.body = `Bienvenido a la ruta protegida de usuario, ${ctx.state.user.username}`;
  ctx.body = {
    message: `Bienvenido a la ruta protegida de usuario, ${ctx.state.user.username}`,
    user: ctx.state.user
  };
  console.log(ctx.state);
  console.log(ctx.state.user);
  //ctx.status = 200;
});

router.get("/protectedadmin", authUtils.isAdmin, async (ctx) => {
  ctx.body = `Bienvenido a la ruta protegida de admin, ${ctx.state.user.username}`;
  ctx.status = 200;
});

module.exports = router;