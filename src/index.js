// para conectar a la db y poder correr la app

const app = require("./app");
const db = require("./models");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3000;

// autencicar acceso a db
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión exitosa a la base de datos.");
    app.listen(PORT, (err) => {
      if (err) {
        return console.error("Fallo al conectar a un puerto", err);
      }
      console.log(`Escuchando en el puerto ${PORT}`);
      return app;
    });
  })
  .catch((err) => console.error("No se pudo conectar a la base de datos:", err));