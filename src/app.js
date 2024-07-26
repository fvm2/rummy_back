// ver si cambiar el main en package.json

const Koa = require("koa");
const KoaLogger = require("koa-logger");
const { koaBody } = require("koa-body");
const router = require("./routes.js");
const ORM = require("./models");
const cors = require("@koa/cors");

const app = new Koa();

app.context.orm = ORM;

// cors para acceder desde el frontend
app.use(cors());

app.use(KoaLogger());
app.use(koaBody());

app.use(router.routes());

// middleware, solo para probar que la app funcione
app.use( (ctx, body) => {
  //ctx.body = 'Proyecto BMVTech';
});

module.exports = app;
