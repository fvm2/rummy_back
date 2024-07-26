const Router = require("koa-router");
let jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const router = new Router();

async function signUp(ctx) {
  const authInfo = ctx.request.body;

  let user = await ctx.orm.User.findOne({ where: { mail: authInfo.mail } });
  if (user) {
    ctx.throw(400, "User already exists");
    return;
  }

  try {
    const saltRounds = 10;
    const hashedPwd = await bcrypt.hash(authInfo.password, saltRounds);

    user = await ctx.orm.User.create({
      mail: authInfo.mail,
      password: hashedPwd,
      username: authInfo.username,
      wins: 0,
      played_matches: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    ctx.throw(400, error);
  }

  ctx.body = "Usuario creado";
  ctx.status = 201;

  // login
  await logIn(ctx);

}

async function logIn(ctx) {
  let user;
  const authInfo = ctx.request.body;

  try {
    user = await ctx.orm.User.findOne({ where: { mail: authInfo.mail } });
  } catch (error) {
    ctx.throw(400, error);
  }

  if (!user) {
    ctx.throw(400, "User not found");
    return;
  }

  const isValid = await bcrypt.compare(authInfo.password, user.password);
  if (!isValid) {
    ctx.throw(400, "Invalid password");
    return;
  }

  ctx.body = { username: user.username, mail: user.mail};
  ctx.status = 200;

  // Creamos JWT
  const expirationTime = 60 * 60 * 24; // 24 horas
  const JWT_KEY = process.env.JWT_SECRET;

  let token = jwt.sign(
    { scope: ["user"] },
    JWT_KEY,
    // acá se sacaron las llaves, antes se pasaban como dos objetos, ahora como uno
    { subject: user.id.toString() ,
      expiresIn: expirationTime }
  );

  ctx.body = {
    "access_token": token,
    "token_type": "Bearer",
    "expires_in": expirationTime
  };

  ctx.status = 200;
}

router.post("auth.signup", "/signup", async (ctx) => signUp(ctx));
router.post("auth.login", "/login", async (ctx) => logIn(ctx));

module.exports = router;