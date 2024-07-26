# BMVTech_backend

## Endpoints en funcionamiento
1. `/auth/signup`: Toma la información de un usuario y lo registra.
2. `/auth/login`: Se verifican los datos del usuario para hacer un inicio de sesión, asignandole un token.
3. `/usuarios/index`: Permite tener a todos los usuarios registrados.
4. `/usuarios/show/:id`: Permite tener a un usuario especifico a través de su id.
5. `/partidas/crear`: Se crea una partida, y se crea un jugador para el usuario.
6. `/partidas/unirse`: Usuario se une a una partida, se le crea un jugador.
7. `/partidas/empezar`: Se empieza la partida, deben haber 4 jugadores en ella.
8. `/cartas/repartir`: Se reparten aleatoriamente 12 cartas a cada jugador.
9. `/cartas/obtener`: Permite ver las cartas que estan en el juego, dentro del mazo.
10. `/cartas/robar`: Saca una carta aleatoria del mazo.
11. `/turnos/validar`: Se verifica que un jugador haga su movimiento es su turno.
12. `/turnos/cambiar`: Permite cambiar el turno del jugador.

## Notas: 
1. Los puntos 10 y 11 se utilizan funciones que van en jugadas, por ejemplo, luego hacer un movimiento, se cambia el turno. Los endpoints son para probar la función directamente.

2. El punto 8 es para testear el funcionamiento de otros endpoints, debido a que permite ver las cartas disponibles.

## Test de Endpoints
1. Crear Partida (POST): Se envia un json con el id del usuario que la crea.
```json
{
    "user_id": 1
}
```

2. Unirse a Partida (POST): Se envia un json con el id del usuario que se une, y la partida a unirse.
```json
{
    "user_id": 2,
    "game_id": 1
}
```

3. Empezar partida (POST): Se envia un json con el id de la partida a empezar, y el usuario que la empezó. Solo la puede empezar el creador de la partida.
```json
{
    "game_id": 1,
    "user_id": 1
}
```

4. Robar carta (POST): Se envia un json con el id del jugador que roba la carta y el id de la partida. Se le asigna una carta aleatoria del mazo al jugador.
```json
{
    "player_id": 1,
    "game_id": 1
}
```

5. Obtener Cartas (POST): Se envia un json con el id de la partida. Se obtienen las cartas que estan en el mazo.
```json
{
    "game_id": 1
}
```

6. Repartir Cartas (POST): Se envia un json con el id de la partida.Se repariten 12 cartas a cada jugador.
```json
{
    "game_id": 1
}
```

7. Validar Turno (POST): Se envia un json con el id del jugador y el id de la partida. Se verifica que sea su turno.
```json
{
    "player_id": 1,
    "game_id": 1
}
```

8. Cambiar Turno (POST): Se envia un json con el id de la partida. Se cambia el turno actual de la partida.
```json
{
    "game_id": 1
}
```