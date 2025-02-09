// Middleware creado por nosotros para verificar si la request es de un usuario
// o de un administrador.
let jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function getJWTScope(token) {
  const secret = process.env.JWT_SECRET;
  let payload = jwt.verify(token, secret);
  return payload.scope;
}

async function isUser(ctx, next) {
  await next();
  const token = ctx.request.header.authorization.split(" ")[1];
  const scope = getJWTScope(token);
  ctx.assert(scope.includes("user"), 403, "Unauthorized, not a user");
}

async function isAdmin(ctx, next) {
  await next();
  const token = ctx.request.header.authorization.split(" ")[1];
  const scope = getJWTScope(token);
  ctx.assert(scope.includes("admin"), 403, "Unauthorized, not an admin");
}

module.exports = { isUser, isAdmin };