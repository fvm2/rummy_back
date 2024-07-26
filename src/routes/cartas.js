const { NormalCard, SpecialCard, Game } = require(".././models");
const Router = require("koa-router");
const router = new Router();

const { validarTurno, cambiarTurno } = require("./turnos.js");
const { where } = require("sequelize");

async function comprarCartaEspecial(ctx) {
  const cardCosts = {
    Dog: 4000,
    Magician: 6000,
  };

  try {

    const player_id = ctx.request.body.player_id;
    const cardType = ctx.request.body.cardType;

    const cardId = await ctx.orm.SpecialCard.findOne({
      where : {power: cardType}
    });

    console.log("El id de la carta espcial es:", cardId.id);

    const player = await ctx.orm.Player.findByPk(player_id);
    if (!player) {
      ctx.throw(404, "Jugador no encontrado");
      return;
    }
    const turnoValido = await validarTurno(ctx, player.game_id, player_id);
    if (!turnoValido) {
      ctx.throw(400, "No es tu turno");
    }

    const cardCost = cardCosts[cardType];
    console.log(`Costo de la carta ${cardType}: ${cardCost}`);
    if (player.points < cardCost) {
      ctx.throw(400, "Puntos insuficientes para comprar esta carta");
      return;
    }

    // Realizar la compra: restar puntos y añadir la carta a special_cards
    player.points -= cardCost; // Resta los puntos del costo de la carta
    console.log(`Puntos restantes: ${player.points}`);
    player.special_cards = player.special_cards ? JSON.parse(player.special_cards) : [];
    console.log(`Cartas especiales actuales: ${player.special_cards}`);
    player.special_cards.push(cardId.power); // Añadir la carta al arreglo de cartas especiales
    console.log(`Cartas especiales después de comprar: ${player.special_cards}`);
    player.special_cards = JSON.stringify(player.special_cards); // Convertir de nuevo a string para guardar
    console.log(`Cartas especiales después de comprar (string): ${player.special_cards}`);

    // Guardar los cambios en la base de datos
    await player.save();
    diccionario = {};
    diccionario[cardId.power] = cardId.image;
    ctx.status = 200;
    ctx.body = {
        dicc: diccionario,
        points: player.points
    } ;

  } catch (error) {
    ctx.throw(500, `Error al comprar la carta: ${error.message}`);
  }
}

async function procesarCartaEspecial(card, player) {
  // Si el poder de la carta es "Hands" o "Skip", ejecuta su poder
  if (card.power === "Hands" || card.power === "Skip") {
    // Aquí puedes agregar la lógica para ejecutar el poder de la carta

  } else {
    // Si no, añade la carta a player.special_cards
    const specialCardsText = player.special_cards;
    const specialCards = JSON.parse(specialCardsText);
    specialCards.push(card);
    player.special_cards = JSON.stringify(specialCards);
    await player.save();
  }
}

async function robarCarta(ctx) {
  console.log("Robando carta");
  const game_id = ctx.request.body.game_id;
  const player_id = ctx.request.body.player_id;
  const turnoValido = await validarTurno(ctx, game_id, player_id);
  console.log(ctx.request.body);

  if (!turnoValido) {
    ctx.throw(400, "No es tu turno");
  }
  const game = await ctx.orm.Game.findByPk(game_id);
  const player = await ctx.orm.Player.findByPk(player_id);
  const cardsText = await game.deck;

  const cards = JSON.parse(cardsText);

  const cardIndex = Math.floor(Math.random() * cards.length);
  const card = cards[cardIndex];
  console.log(card);

  console.log(`Carta robada: ${JSON.stringify(card)}`);

  try{
    if ("power" in card) {
      await procesarCartaEspecial(card, player);

    }
    else{
      const normalCards = player.normal_cards ? JSON.parse(player.normal_cards) : [];
      normalCards.push(card.id);
      player.normal_cards = JSON.stringify(normalCards);
      await player.save();

      cards.splice(cardIndex, 1);
      game.deck = JSON.stringify(cards);
      await game.save();
    }
  } catch (error) {
    console.error("Error al robar carta: ", error.message);
    throw error;
  }
  playerCardIds = JSON.parse(player.normal_cards || "[]");
  console.log(playerCardIds);
  const newCards = await ctx.orm.NormalCard.findAll({
    where: { id: playerCardIds }
  });
  const images = newCards.map(newCard => newCard.image);

  diccionario = {};

  for (let i = 0; i < newCards.length; i++) {
    diccionario[newCards[i].id] = images[i];
  }

  ctx.body = diccionario;
  ctx.status = 200;

  // await cambiarTurno(ctx, game_id);

}

async function crearMazo(ctx) {
  try {
    // Obtener todas las cartas
    const normalCards = await NormalCard.findAll({
      order: ctx.orm.sequelize.random(),
    });

    const specialCards = await SpecialCard.findAll({
      where: { power: "Magician"}
    });

    /*  Para añadir después al deck, no puede salir en la primera repartija
        const specialCards = await SpecialCard.findAll({
            where: { power: "Hands"}
        });
        */

    const cards = normalCards;

    let posicion = Math.floor(Math.random() * normalCards.length);
    let posicion2 = Math.floor(Math.random() * normalCards.length);

    // Se colocan 2 veces la carta mago en el mazo
    cards.splice(posicion, 0, specialCards[0]);
    cards.splice(posicion2, 0, specialCards[0]);

    // para probar respuesta
    //console.log(cards);
    ctx.body = cards;
    //console.log(`Game id: ${ctx.request.body.game_id}`)

    let game = await Game.findByPk(ctx.request.body.game_id);

    //console.log(JSON.stringify(cards))

    game.deck = JSON.stringify(cards);
    try {
      await game.save();
    } catch (error) {
      console.error("Error al guardar el juego:", error);
    }

    return cards;
    // return all cards, y usar en la función de repartir cartas
    // obtener todas y luego elegir 48 al azar

  } catch (error) {
    console.error("Error al obtener las cartas:", error);
  }
}

async function obtenerCartas(ctx, game_id) {
  try {
    // const game_id = ctx.request.body.game_id;
    const game = await Game.findByPk(game_id);
    const cards = JSON.parse(game.deck);

    // imprimir largo del deck
    console.log(`Deck length: ${cards.length}`);
    ctx.body = cards;
    return cards;
  }
  catch (error) {
    console.error("Error al obtener las cartas:", error);
  }
}

async function repartirCartas(ctx, game_id) {
  // const game_id = ctx.request.body.game_id;
  const game = await Game.findByPk(game_id);

  let cards;
  try {
    cards = await obtenerCartas(ctx, game_id); // ya revueltas
  } catch (error) {
    ctx.throw(500, "Error al obtener cartas");
  }

  let partida;
  try {
    partida = await ctx.orm.Game.findByPk(game_id);
    console.log(partida);
  } catch (error) {
    ctx.throw(404, "Partida no encontrada", { error });
  }

  // if (!partida) {
  //     ctx.throw(404, 'Partida no encontrada');
  // }

  // if (partida.status !== 1) { // 1 = en curso
  //     ctx.throw(400, 'Partida no disponible');
  // }

  let jugadores;
  try {
    jugadores = await ctx.orm.Player.findAll({
      where: { game_id: game_id }
    });
    console.log(jugadores);

  } catch (error) {
    ctx.throw(404, "Jugadores no encontrados");
  }

  if (jugadores.length !== 4) {
    ctx.throw(400, "Deben haber exactamente 4 jugadores para repartir las cartas");
  }

  // Repartir las cartas a los jugadores
  try {
    let cardIndex = 0;
    for (const jugador of jugadores) {
      //const playerCards = cards.slice(cardIndex, cardIndex + 12);
      const normalCards = [];
      const specialCards = [];
      console.log("Repartiendo cartas");
      for (let i = 0; i < 12; i++) {
        if (cards.length === 0) {
          console.error("No hay suficientes cartas para repartir");
          ctx.throw(500, "No hay suficientes cartas para repartir");
          return;
        }
        const currentCard = cards.shift();  // Obtiene y elimina la primera carta del arreglo

        if ("power" in currentCard) {
          console.log("Carta especial");
          specialCards.push(currentCard);
        } else {
          console.log("Carta normal");
          normalCards.push(currentCard);
        }
      }
      jugador.normal_cards = JSON.stringify(normalCards.map(card => card.id)); // Asumiendo que las cartas tienen propiedad 'id'
      jugador.special_cards = JSON.stringify(specialCards.map(card => card.id)); // Asumiendo que las cartas tienen propiedad 'id'
      console.log(jugador.normal_cards);
      console.log(jugador.special_cards);
      await jugador.save();

    }
    game.deck = JSON.stringify(cards);
    await game.save();
    ctx.status = 200;
    ctx.body = "Cartas repartidas correctamente a todos los jugadores";
  } catch (error) {
    ctx.throw(500, "Error al repartir cartas", { error });
  }
}

async function visualizarCartas(ctx) {
  const player_id = ctx.request.body.player_id; // Asumiendo que se envía desde el cliente

  try {
    // Obtener el jugador por su ID
    const player = await ctx.orm.Player.findByPk(player_id);
    if (!player) {
      ctx.throw(404, "Jugador no encontrado");
      return;
    }

    // Asumiendo que 'normal_cards' es un string JSON de IDs de cartas
    const cardIds = JSON.parse(player.normal_cards || "[]");

    if (cardIds.length === 0) {
      ctx.body = "El jugador no tiene cartas normales.";
      ctx.status = 200;
      return;
    }

    // Buscar las cartas correspondientes en la tabla NormalCards
    const cards = await ctx.orm.NormalCard.findAll({
      where: {
        id: cardIds  // Sequelize utiliza automáticamente la cláusula IN si pasas un arreglo
      }
    });

    // Preparar las cartas para enviar al cliente
    const cardDetails = cards.map(card => ({
      id: card.id,
      number: card.number,
      color: card.color,
      joker: card.joker
    }));

    // Envía las cartas al cliente
    ctx.body = {
      message: "Cartas normales del jugador:",
      cards: cardDetails
    };
    ctx.status = 200;

  } catch (error) {
    console.error("Error al visualizar cartas: ", error);
    ctx.throw(500, "Error interno al visualizar cartas", { error });
  }
}

async function bajarCarta(ctx) {
  const { player_id, card_ids, square_number, joker_card } = ctx.request.body;
  console.log(ctx.request.body);

  const cardIdsCopy = [...card_ids];
  try {
    const player = await ctx.orm.Player.findByPk(player_id);
    if (!player) {
      ctx.throw(404, "Jugador no encontrado");
      return;
    }
    const square = await ctx.orm.Square.findOne({
      where: {
        game_id: player.game_id,
        number: square_number
      }
    });

    const turnoValido = await validarTurno(ctx, player.game_id, player_id);
    if (!turnoValido) {
      ctx.throw(400, "No es tu turno");
    }

    const jokers = await ctx.orm.NormalCard.findAll({
      attributes: ["id"],  // Solo necesitamos los IDs
      where: { joker: true }
    });
    const jokerIds = jokers.map(joker => joker.id);

    const includesJoker = card_ids.some(id => jokerIds.includes(parseInt(id, 10)));
    if (includesJoker && (!joker_card || !joker_card.number || !joker_card.suit)) {
      ctx.throw(400, "Falta información sobre el joker");
      return;
    }

    if (!square) {
      ctx.throw(404, `La casilla con el número ${number} en el juego ${game_id} no fue encontrada`);
      return;
    }

    // Convertir el JSON de cartas del jugador a un array de IDs
    const playerCardIds = JSON.parse(player.normal_cards || "[]");

    // Verificar que todas las cartas que se intentan bajar están en posesión del jugador
    const hasAllCards = card_ids.every(id => playerCardIds.includes(id));
    if (!hasAllCards) {
      ctx.throw(403, "El jugador no posee una o más de las cartas que intenta bajar");
      return;
    }

    // Manejo de jokers si es necesario
    if (joker_card && joker_card.number && joker_card.suit) {
      const { number: jokerNumber, suit: jokerColor } = joker_card;
      const jokerSimulatedCard = await ctx.orm.NormalCard.findOne({
        where: {
          number: jokerNumber,
          color: jokerColor
        }
      });

      if (!jokerSimulatedCard) {
        ctx.throw(400, "No se encontró una carta correspondiente para representar al joker.");
        return;
      }

      card_ids.push(jokerSimulatedCard.id);  // Considerar el joker como la carta que simula
    }

    const cardsTotal = await ctx.orm.NormalCard.findAll({
      where: { id: card_ids }
    });

    const cards = cardsTotal.filter(card => card.joker === false);
    if (!player.has_played && (cards.length !== 3 || (square.cards && JSON.parse(square.cards).length !== 0))) {
      ctx.throw(400, "La primera bajada debe ser exactamente de tres cartas en una casilla vacía");
      return;
    }

    // Extraer solo los IDs de los objetos de joker

    const new_card_ids = card_ids.filter(id => !jokerIds.includes(id));

    const moveValidations = await Promise.all([
      esMovimientoValido(cards),
      isValidSquareMove(ctx, square, cards)
    ]);

    if (!moveValidations[0] || !moveValidations[1]) {
      ctx.throw(400, "Movimiento no válido para la casilla seleccionada");
      return;
    }

    const updatedCardIds = square.cards ? JSON.parse(square.cards).concat(new_card_ids) : new_card_ids;
    square.cards = JSON.stringify(updatedCardIds);
    await square.save();

    player.points += cards.length * 1000;

    const updatedPlayerCardIds = playerCardIds.filter(id => !cardIdsCopy.includes(id));
    player.normal_cards = JSON.stringify(updatedPlayerCardIds);

    if (!player.has_played) {
      player.has_played = true;
    }
    await player.save();

    const newPlayerCardIds = JSON.parse(player.normal_cards || "[]");
    const newCards = await ctx.orm.NormalCard.findAll({
      where: { id: newPlayerCardIds }
    });
    const images = newCards.map(newCards => newCards.image);
    diccionario = {};

    for (let i = 0; i < newCards.length; i++) {
      diccionario[newCards[i].id] = images[i];
    }

    ctx.body = {
        dicc: diccionario,
        points: player.points} ;
    ctx.status = 200;

    if (newPlayerCardIds.length === 0) {
      console.log("El jugador ha bajado todas sus cartas, este es el ganador");
      try {

        const game_id = player.game_id;
        const game = await ctx.orm.Game.findByPk(game_id);
        await game.update({ status: 2 });
        ctx.status = 200;
        ctx.body = {
          message: "Partida terminada exitosamente",
          winner_id: player_id
        };
      } catch (error) {
        console.error("Error al terminar la partida:", error);
        ctx.throw(500, "Error interno al terminar la partida");
      }

    }

  } catch (error) {
    console.error("Error al bajar cartas: ", error);
    ctx.throw(500, "Error interno al bajar cartas");
  }
}

function esMovimientoValido(cards) {
  // Comprobar si todas las cartas tienen el mismo número (trío)
  console.log(cards);
  const mismoNumero = cards.every(card => card.number === cards[0].number);
  if (mismoNumero) {
    console.log("Es un trío valido");
    return true;
  };

  // Comprobar si las cartas forman una escala (misma pinta, números consecutivos)
  const mismaPinta = cards.every(card => card.color === cards[0].color);
  if (mismaPinta) {
    console.log("Son la misma pinta");
    let numerosOrdenados = cards.map(card => card.number).sort((a, b) => a - b);
    console.log("los numeros ordenados son:", numerosOrdenados);

    // Agregar lógica para manejar el wrap-around de 13 a 1
    if (numerosOrdenados.includes(13) && numerosOrdenados.includes(1)) {
      // Extraer y mover el 1 después del 13 para considerar la continuidad
      numerosOrdenados = numerosOrdenados.filter(num => num !== 1).concat([14]);  // Tratamos 1 como 14 temporalmente
    }

    // Verificar si los números forman una secuencia consecutiva
    const esEscala = numerosOrdenados.every((num, index, arr) => {
      return index === 0 || num === arr[index - 1] + 1;
    });

    if (esEscala) {
      console.log("Es una escala valida");
      return true;
    }
  }
  console.log("Movimiento no válido");
  return false;
}
async function isValidSquareMove(ctx, square, cards) {
  console.log("Las nuevas cartas son:", cards);
  const cardsArray = JSON.parse(square.cards || "[]");
  console.log("En la casilla hay estas cartas:", square.cards, "es decir", cardsArray.length, "cartas", "y se quieren poner", cards.length, "cartas");
  if (cardsArray.length === 0 && cards.length != 3) {
    console.log("No hay cartas en la casilla y se quieren poner menos de 3 cartas");
    return false;
  }
  if (!cardsArray.cards && cards.length === 3) return true;

  const existingCardIds = JSON.parse(square.cards);
  if (existingCardIds.length === 0) return true;

  // Obtener detalles de las cartas existentes
  const existingCards = await ctx.orm.NormalCard.findAll({
    where: { id: existingCardIds }
  });
  console.log("Cartas existentes en la casilla:", existingCards);

  // Verificar trío (mismo número)
  console.log("Verificar trio");
  const firstCardNumber = existingCards[0].number;
  const isTriplet = existingCards.every(card => card.number === firstCardNumber) &&
                      cards.every(card => card.number === firstCardNumber);
  if (isTriplet) {
    console.log("Es un trío válido");
    return true;
  }

  // Verificar escala (misma pinta, números consecutivos)
  // const allCards = existingCards.concat(cards);
  // const sameColor = allCards.every(card => card.color === allCards[0].color);
  // if (sameColor) {
  //     const sortedNumbers = allCards.map(card => card.number).sort((a, b) => a - b);
  //     const isScale = sortedNumbers.every((num, index, arr) => index === 0 || num === arr[index - 1] + 1);
  //     if (isScale) {
  //         console.log("Es una escala válida");
  //         return true;
  //     }
  // }

  // console.log("Movimiento no válido");
  // return false;

  const allCards = existingCards.concat(cards);
  const sortedCards = cards.sort((a, b) => a.number - b.number);
  const sameColor = allCards.every(card => card.color === allCards[0].color);
  if (sameColor) {
    for (let i = 1; i < sortedCards.length; i++) {
      if (sortedCards[i - 1].number === 13 && sortedCards[i].number === 1) {
        if (i !== sortedCards.length - 1 || sortedCards[0].number !== 1 || sortedCards[1].number === 2) {
          return false;
        }
      } else if (sortedCards[i].number !== sortedCards[i - 1].number + 1) {
        // Si los números no son consecutivos, no es una escala válida
        return false;
      }
    }
    return true;
  }
}

async function usarCartaEspecial(ctx, player_id, special_card_power) {
  player_id = ctx.request.body.player_id;
  special_card_power = ctx.request.body.special_card_power;
  const test_special_card_power = special_card_power[0];

  const player = await ctx.orm.Player.findByPk(player_id);
  const game = await ctx.orm.Game.findByPk(player.game_id);
  if (!player) {
    ctx.throw(404, "Jugador no encontrado");
    return;
  }
  const turnoValido = await validarTurno(ctx, player.game_id, player_id);
  if (!turnoValido) {
    ctx.throw(400, "No es tu turno");
  }
  playerSpecialCards = JSON.parse(player.special_cards || "[]");

  console.log(playerSpecialCards);
  if (playerSpecialCards.includes(test_special_card_power)) {
    console.log(`La carta especial con ID ${test_special_card_power} está disponible y puede ser usada.`);
    if (test_special_card_power === "Dog") {
      console.log("Usando la carta especial 'Dog'");
      const allPlayers = await ctx.orm.Player.findAll({
        where: {
          game_id: player.game_id,
          id: { [ctx.orm.Sequelize.Op.not]: player_id }
        }
      });
      if (allPlayers.length > 0) {
        const randomIndex = Math.floor(Math.random() * allPlayers.length);
        const targetPlayer = allPlayers[randomIndex];
        console.log("Usando la carta especial 'Dog' en el jugador", targetPlayer.id);
        const cardsText = await game.deck;
        const cards = JSON.parse(cardsText);
        const normalCards = targetPlayer.normal_cards ? JSON.parse(targetPlayer.normal_cards) : [];

        if (cards.length < 4) {
          ctx.throw(400, "No hay suficientes cartas en el mazo para realizar esta acción");
          return;
        }
        let selectedCards = [];
        for (let i = 0; i < 4; i++) {
          const cardIndex = Math.floor(Math.random() * cards.length);
          const card = cards.splice(cardIndex, 1)[0];
          selectedCards.push(card);
          normalCards.push(card.id);

        };
        console.log("Cartas seleccionadas:", selectedCards);
        game.deck = JSON.stringify(cards);
        targetPlayer.normal_cards = JSON.stringify(normalCards);
        const index = playerSpecialCards.indexOf(test_special_card_power);
        if (index !== -1) {
          playerSpecialCards.splice(index, 1);
        }
        player.special_cards = JSON.stringify(playerSpecialCards);

        await player.save();
        await game.save();
        await targetPlayer.save();

        diccionario_special = {};
        diccionario_normal = {};
        console.log("Cartas especiales del jugador:", player.special_cards);
        const specialPowers = JSON.parse(player.special_cards);
        const newCards = await ctx.orm.SpecialCard.findAll({
          where: { power: specialPowers }
        });
        const images = newCards.map(card => card.image);
        for (let i = 0; i < newCards.length; i++) {
          diccionario_special[newCards[i].power] = images[i];
        }
        ctx.body = {
          dicc_special: diccionario_special,
          dicc_normal: diccionario_normal
        };
        ctx.status = 200;
      }
    } else if (test_special_card_power === "Magician") {

      console.log("Usando la carta especial 'Magician'");
      const normalCards = JSON.parse(player.normal_cards || "[]");

      const jokerCard = await ctx.orm.NormalCard.findOne({
        where: {
          joker: true,
          id: { [ctx.orm.Sequelize.Op.notIn]: normalCards }
        }
      });

      if (!jokerCard) {
        ctx.throw(404, "No se encontró ninguna carta Joker disponible.");
        return;
      }

      normalCards.push(jokerCard.id);
      player.normal_cards = JSON.stringify(normalCards);
      const index = playerSpecialCards.indexOf(test_special_card_power);
      if (index !== -1) {
        playerSpecialCards.splice(index, 1);
      }
      player.special_cards = JSON.stringify(playerSpecialCards);

      await player.save();
      dicc = {};
      diccionario_special = {};
      diccionario_normal = {};
      const specialPowers = JSON.parse(player.special_cards);
      const cards = await ctx.orm.SpecialCard.findAll({
        where: { power: specialPowers }
      });
      const images = cards.map(card => card.image);
      for (let i = 0; i < cards.length; i++) {
        diccionario[cards[i].power] = images[i];
      }
      const cards_normal = await ctx.orm.NormalCard.findAll({
        where: { id: normalCards }
      });
      const images_normal = cards_normal.map(card => card.image);
      for (let i = 0; i < cards_normal.length; i++) {
        diccionario_normal[cards_normal[i].id] = images_normal[i];
      }
      ctx.body = {
        dicc_special: diccionario_special,
        dicc_normal: diccionario_normal
      };
      ctx.status = 200;

    }
  } else {
    ctx.throw(404, `La carta especial con ID ${test_special_card_power} no se encuentra en las cartas del jugador.`);
    return;
  }
}

// Imagenes para el front
async function imagenesCartas(ctx) {
  const player_id = ctx.request.body.playerId;
  console.log("El id del jugador es:", player_id);
  const player = await ctx.orm.Player.findByPk(player_id);
  const playerCardIds = JSON.parse(player.normal_cards || "[]");
  console.log("Las cartas del player son", playerCardIds);
  const cards = await ctx.orm.NormalCard.findAll({
    where: { id: playerCardIds }
  });
  const images = cards.map(card => card.image);

  diccionario = {};

  for (let i = 0; i < cards.length; i++) {
    diccionario[cards[i].id] = images[i];
  }

  ctx.body = diccionario;
  ctx.status = 200;
}

async function imagenesStoreCards(ctx) {
  const cards = await ctx.orm.SpecialCard.findAll({
    where: {
      image: {
        [ctx.orm.Sequelize.Op.ne]: null
      }
    }
  });
  const images = cards.map(card => card.image);
  diccionario = {};
  for (let i = 0; i < cards.length; i++) {
    diccionario[cards[i].power] = images[i];
  }
  ctx.body = diccionario;
  ctx.status = 200;
}

async function imagenesCartasEspeciales(ctx) {
  const player_id = ctx.request.body.playerId;
  const player = await ctx.orm.Player.findByPk(player_id);
  const specialPowers = JSON.parse(player.special_cards);
  const cards = await ctx.orm.SpecialCard.findAll({
    where: { power: specialPowers }
  });
  const images = cards.map(card => card.image);
  diccionario = {};
  for (let i = 0; i < cards.length; i++) {
    diccionario[cards[i].power] = images[i];
  }

  ctx.body = diccionario;
  ctx.status = 200;
}

async function cartasEnCasilla(ctx) {
    const game_id = ctx.request.body.gameId;
    const square_number = ctx.request.body.square_number;
    const square = await ctx.orm.Square.findOne({
        where: {game_id: game_id, number: square_number}
    });
    const cardIds = JSON.parse(square.cards || "[]");   
    const cards = await ctx.orm.NormalCard.findAll({
        where: { id: cardIds }
    });
    const images = cards.map(card => card.image);
    diccionario = {};
    for (let i = 0; i < cards.length; i++) {
        diccionario[cards[i].id] = images[i];
    }
    console.log("Las cartas en la casilla son:", diccionario)
    ctx.body = diccionario;
    ctx.status = 200;
}


router.post("cartas.repartir", "/repartir", async (ctx) => repartirCartas(ctx));
router.post("cartas.obtener", "/obtener", async (ctx) => obtenerCartas(ctx));
router.post("cartas.crearMazo", "/crearMazo", async (ctx) => crearMazo(ctx));
router.post("cartas.robar", "/robar", async (ctx) => robarCarta(ctx));
router.post("cartas.comprar", "/comprar", async (ctx) => comprarCartaEspecial(ctx));
router.post("cartas.visualizar", "/visualizar", async (ctx) => visualizarCartas(ctx));
router.post("cartas.bajar", "/bajar", async (ctx) => bajarCarta(ctx));
router.post("cartas.usar", "/usarpoder", async (ctx) => usarCartaEspecial(ctx));
router.get("cartas.imagenesStore", "/imagenesstore", async (ctx) => imagenesStoreCards(ctx));
router.post("cartas.casilla", "/cartascasilla", async (ctx) => cartasEnCasilla(ctx));

// Imagenes
router.post("cartas.imagenes", "/imagenes", async (ctx) => imagenesCartas(ctx));
router.post("cartas.imagenesespeciales", "/imagenesespeciales", async (ctx) => imagenesCartasEspeciales(ctx));

module.exports = {
  router,
  repartirCartas,
  obtenerCartas,
  crearMazo
};