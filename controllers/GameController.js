import GameService from "../services/GameService.js";
import Hero from "../Classes/Hero.js";
import Villain from "../Classes/Villain.js";
import Dice from "../Classes/Dices.js"
import Erudite from "../Classes/Erudite.js";


// GAME START
const StartNormalGame = async () => {
  try {
    const allSuperPeople = await GameService.getData();
    if (allSuperPeople.length === 0) {
      return { message: 'No existen superPersonas' };
    }

	const hero = new Hero(getHero(allSuperPeople));
	const villain = new Villain(getVillain(allSuperPeople))

	// Crear una instancia de la clase Erudito
	const erudite = new Erudite();

	startCombat(hero, villain, erudite)


  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
};

// ============================
// 			FUNCTIONS
// ============================

//Funcion que selecciona al villano de todos los heroes
const getVillain =(allSuperPeople) => { return allSuperPeople.filter((superPerson) => superPerson.name === "Junkpile"); }

// Funcion que elige un heroe aleatorio (No puede elegir a Junkpile)
const getHero = (allSuperPeople) => {

	const hero = allSuperPeople[randomSuperHeroesNumber(allSuperPeople)];

	if (hero.name == "Junkpile")
	{ hero = allSuperPeople[randomSuperHeroesNumber(allSuperPeople)] }

	return hero;
}

const randomSuperHeroesNumber = (allSuperPeople) => { return Math.floor(Math.random() * allSuperPeople.length) }


// ============================
// 			COMBAT
// ============================

const startCombat = (hero, villain) => {

	console.log("THE BATTLE BETWEEN " + hero.name + " & " + villain.name + " BEGGINS!")
	
	whoStarts(hero, villain)

	figth(hero, villain);

} 

const whoStarts = (hero, villain) => {

	const heroPowerStart = hero.intelligence + hero.combat
	const villainPowerStart = villain.intelligence + villain.combat

	if (heroPowerStart > villainPowerStart){
		hero.starts = true
		
	} else if(heroPowerStart < villainPowerStart) {
		villain.starts = true
	} else {
		console.log("ambos tienen el mismo poder, por lo que empezara el heroe al ser el heroe de la historia")
		hero.starts = true
	}

	return whoStarts;
}

const figth = (hero, villain) => {

	console.log("===========================================")
	// Variable que para la batalla
	let stopFigth = false
	let turn = "none"
	let turnCounter = 0;

	// Inicializamos los objetos de dados
	const d100 = new Dice(100);

	turn = startTurnSelection(turn, hero, villain)

	while( !stopFigth ){

		// Turno del heroe
		if(turn === "hero"){

			Phase1(d100, hero, villain);

			console.log("Cambio de turno al villano");
			turn = "villain"

			if (turnCounter >= 5){
				turnCounter = 0;
			}

		} 
		
		// Turno del Villano
		if (turn === "villain"){

			Phase1(d100, villain, hero);

			console.log("Cambio de turno al heroe");
			turn = "hero"

			if (turnCounter >= 5){
				turnCounter = 0;
			}

		} 
		
		
		if (turn === "erudite") {
			// El erudito se muestra
			console.log("******************************")
			console.log("El erudito se muestra asombrado por los dos guerreros, pero se mofa de ellos")
			console.log("******************************")

			turnCounter = 0;
			turn = "hero"
		}


		// Para la batalla
		if(hero.hitPoints <= 0 || villain.hitPoints <= 0){
			if (hero.hitPoints <=0 ) {
				console.log("EL HEROE " + hero.name + " A PERECIDO")
			} if( villain.hitPoints <= 0){
				console.log("EL VILLANO " + villain.name + " A PERECIDO")
			}
			
			stopFigth = true
			turnCounter = 0;
		}

		// Verificar si el turno actual está entre 3 y 5 (inclusive) de manera aleatoria y con una aleatoriedad entre las mismos
		if (turnCounter >= 3 && turnCounter <= 5 && Math.random() > 0.5) {
			turn = "erudite"
			turnCounter = 0;
		}

		turnCounter++
	}
}

const startTurnSelection = (turn, hero, villain) => {
	// Empeiza el heroe
	if(hero.starts === true){
		console.log("El héroe tiene más poder. Por lo que empieza él")
		console.log("--------------------")
		turn = "hero"
	} 

	// Empieza el villano
	else if( villain.starts === true) {
		console.log("El villano tiene más poder. Por lo que empieza él")
		console.log("--------------------")
		turn = "villain"
	}

	return turn;
}

const showStats = (fighter) => {
	console.log("")
	console.log("STATS:")
	console.log("-----------------------")
	console.log(fighter)
	console.log("-----------------------")
}

const Phase1 = (d100, fighter, target) => {
	const d20 	= new Dice(20);
	const resultadoD20 	= d20.rollD20();
	const resultadoD100 = d100.rollD100();

	if (resultadoD100 <= fighter.combat){
		console.log("")
		Pahse2(resultadoD20, fighter, target)

		// Muestra las estadisticas
		showStats(fighter)
		showStats(target)

	} else{ console.log(fighter.name + " Ha fallado!") }
}

const Pahse2 = (resultadoD20, fighter, target) => {
	console.log("El ataque de " + fighter.name + " Es exitoso");
	DiceD20Phase(resultadoD20, fighter, target);
}

const DiceD20Phase = (resultadoD20, fighter, target) => {
	console.log( fighter.name + " obtiene un: " + resultadoD20 + " y");
	const d3 = new Dice(3);
	const resultadoD3x1 = d3.rollD3();
	const resultadoD3x2 = d3.rollD3() + d3.rollD3();
	const resultadoD3x3 = d3.rollD3() + d3.rollD3() + d3.rollD3();
	const resultadoD3x4 = d3.rollD3() + d3.rollD3() + d3.rollD3() + d3.rollD3();

	// Bungle
	if (resultadoD20 >= 1 && resultadoD20 <= 2) {
		let damage = 0;
		if (resultadoD20 === 1) {
			damage = Math.ceil(fighter.speed / resultadoD3x1);
			fighter.hitPoints -= damage;
		} else if (resultadoD20 === 2) {
			damage = Math.ceil(fighter.speed / resultadoD3x4);
			fighter.hitPoints -= damage;
		}
		console.log("El ataque de " + fighter.name + " es desastroso y se ejerce un daño de: " + damage + " puntos")
	}

	// Normal Damage
	if (resultadoD20 >= 3 && resultadoD20 <= 17) {
		let damage = Math.ceil(((fighter.power + fighter.strength) * resultadoD20) / 100);
		target.hitPoints -= damage;
		console.log( fighter.name + " Ha atacado con un ataque normal a " + target.name + " Haciendole: " + damage + " Puntos de daño"
		);
	}

	// Critical Damage
	if (resultadoD20 >= 18 && resultadoD20 <= 20) {
		let damage = 0;
		if (resultadoD20 === 18) {
			damage = Math.ceil((fighter.intelligence * fighter.durability) / 100 * resultadoD3x1);
			target.hitPoints -= damage;
		} else if (resultadoD20 === 19) {
			damage = Math.ceil((fighter.intelligence * fighter.durability) / 100 * resultadoD3x2);
			target.hitPoints -= damage;
		} else {
			damage = Math.ceil((fighter.intelligence * fighter.durability) / 100 * resultadoD3x3);
			target.hitPoints -= damage;
		}

		console.log( fighter.name + " Ha atacado con un ataque CRITICO a " + target.name + " Haciendole: " + damage + " Puntos de daño"
		);
	}

	console.log("-----------------------")
};




export { StartNormalGame };
