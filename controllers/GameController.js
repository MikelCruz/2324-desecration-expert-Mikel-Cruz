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

const startCombat = (hero, villain, erudite) => {

	console.log("THE BATTLE BETWEEN " + hero.name + " & " + villain.name + " BEGGINS!")
	
	whoStarts(hero, villain)

	figth(hero, villain, erudite);

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

const figth = (hero, villain, erudite) => {

	console.log("===========================================")
	// Variable que para la batalla
	let stopFigth = false
	let turn = "none"
	let turnCounter = 0;
	let turnNumber = 1;

	// Inicializamos los objetos de dados
	const d100 = new Dice(100);

	turn = startTurnSelection(turn, hero, villain)

	while( !stopFigth ){

		// Turno del heroe
		if(turn === "hero"){

			Phase1(d100, hero, villain, erudite);
			armChecker(hero);

			console.log("Cambio de turno al villano");
			turn = "villain"
			turnNumber++;
			console.log("Turno: " + turnNumber)
		} 

		
		// Turno del Villano
		if (turn === "villain"){

			Phase1(d100, villain, hero, erudite);
			armChecker(villain);

			console.log("Cambio de turno al heroe");
			turn = "hero"
			turnNumber++;
			console.log("Turno: " + turnNumber)

		} 
		
		if (turnCounter >= 5){
			turnCounter = 0;
		}
		
		if (turn === "erudite") {
			// El erudito se muestra
			console.log("******************************")
			console.log("El erudito se muestra asombrado por los dos guerreros, pero se mofa de ellos")
			
			// Funcion que añade estadisticas de anger al Erudito
			angerSelection(erudite)

			// Si el erudito a perdido las gafas las tendra el atacante
			if(!erudite.glassesOn){
				
				// Asignanamiento aleatorio del atacante que recoje las gafas
				const randomNumber = Math.random();
				randomNumber < 0.5 ? hero.glassesOn = true : villain.glassesOn = true;
				turn = randomNumber < 0.5 ? "hero" : "villain";

				console.log("El " + turn + " Ha recogido las gafas del erudito!")
			}

			if (erudite.glassesOn) {
				console.log("El erudito tiene las gafas, por lo que desaparecerá de la ronda")

				// Cambio de turno
				const randomNumber = Math.random();
				randomNumber < 0.5 ? hero.glassesOn = true : villain.glassesOn = true;
				turn = randomNumber < 0.5 ? "hero" : "villain";
			}

			console.log("******************************")

			// Reinicia la aparicion de turno del Erudito
			turnCounter = 0;
		}


		

		// Verificar si el turno actual está entre 3 y 5 (inclusive) de manera aleatoria y con una aleatoriedad entre las mismos
		if(erudite.HPW > 0){
			if (turnCounter >= 3 && turnCounter <= 5 && Math.random() > 0.5) {
				turn = "erudite"
				turnCounter = 0;
			}
		} else {
			console.log("El erudito a perecido y no aparecera esta ronda ")
		}
			
	
		// Para la batalla
		stopFigth = checkIfBattleEnded(hero, villain)

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

const Phase1 = (d100, fighter, target, erudite) => {
	const d20 	= new Dice(20);
	const resultadoD20 	= d20.rollD20();
	const resultadoD100 = d100.rollD100();

	if (resultadoD100 <= fighter.combat){
		console.log("")
		Phase2(resultadoD20, fighter, target, erudite)

		// Muestra las estadisticas
		showStats(fighter)
		showStats(target)

	} else{ console.log(fighter.name + " Ha fallado!") }
}

const Phase2 = (resultadoD20, fighter, target, erudite) => {
	console.log("El ataque de " + fighter.name + " Es exitoso");

	if (!fighter.glassesOn){
		DiceD20Phase(resultadoD20, fighter, target);
	} else if (fighter.glassesOn){
		DiceD20PhaseWG(resultadoD20, fighter, target, erudite);
	}
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

const DiceD20PhaseWG = (resultadoD20, fighter, target, erudite) => {
	const d20 	= new Dice(20);
	const newResultD20 	= d20.rollD20();

	const d10 	= new Dice(10);
	const resultD10 	= d10.rollD10();


	let damage = 0;

	// Pifia 1 - 3 - DONE
	if (resultadoD20 >= 1 && resultadoD20 <= 3) {
		damage = Math.ceil(newResultD20);
		fighter.hitPoints -= damage;

		// No se puede quitar el brazo sino lo tiene por lo que no pierde la mitad de la fuerza de nuevo
		if(fighter.hasLeftArm){
			fighter.strength = fighter.strength/2 
			fighter.hasLeftArm = false
			console.log("Pifia. El atacante se lesionará el brazo izquierdo, quedando su atributo STR dañado")
		}
	
		console.log("El ataque de " + fighter.name + " es desastroso y se ejerce un daño de: " + damage + " puntos")
	}

	// Pifia 4 - 6 - DONE
	if (resultadoD20 >= 4 && resultadoD20 <= 6) {
		damage = Math.ceil(newResultD20);
		fighter.hitPoints -= damage;

		if(fighter.hasRightArm){
			fighter.strength = fighter.strength/2 
			fighter.hasRightArm = false
			console.log("Pifia. El atacante se lesionará el brazo derecho, quedando su atributo STR dañado")
		}	

		console.log("El ataque de " + fighter.name + " es desastroso y se ejerce un daño de: " + damage + " puntos")
	}

	// Caos 7 - 9 - DONE
	if (resultadoD20 >= 7 && resultadoD20 <= 9) { console.log("Caos. El atacante pierde la memoria y no ataca") }

	// Aullido 10 - 13 - DONE
	if (resultadoD20 >= 10 && resultadoD20 <= 13) {
		damage = Math.ceil(resultD10);
		erudite.HPW -= damage
		console.log("Aullido. El Erudito grita: *tú eres tonto* y " + fighter.name + " descubrirá dónde se encuentra, momento que aprovechará para atacarle.")
		console.log("El ataque de " + fighter.name + " es exitoso y ejerce un daño de: " + damage + " puntos al Erudito")
		console.log("Erudite STATS");
		showStats(erudite)
	}

	// Granuja 14 - 16 - DONE
	if (resultadoD20 >= 14 && resultadoD20 <= 16) {
		console.log("el atacante aprovechara el despiste del enemigo para colocarle las gafas ");
		// El atacante le coloca las gafas a su enemigo
		fighter.glassesOn = false
		target.glassesOn = true 
	}

	// Perspicaz 17 - 18 - DONE
	if (resultadoD20 >= 17 && resultadoD20 <= 18) {
		console.log("El erudito detecta al atacante y le atrea con su famoso grito * tu eres tonto *, momento en el que aprovecha para recuperar sus gafas")
		console.log("Sin embargo, al furia caótica del atacante se desata y embiste a El Erudito");
		console.log("El erudito recibiría un daño de " + resultD10 + " puntos, pero el erudito nunca sufrio daño alguno, debido a sus gafas protectoras")
		erudite.glassesOn = true 
	}
	
	// Endemonido 19 - 20 - DONE
	if (resultadoD20 >= 19 && resultadoD20 <= 20) {
		console.log("El atacante desata todo el caos de El Erudito, persiguiendole y cortandole la baveza")
		console.log("El erudito a perecido");
		erudite.HPW = 0
	}


	// Las gafas se las quitaran aun estando el Erudito muerto ya que se sentiran mareados de todas formas
	console.log("El atacante " + fighter.name + " se siente mareado y se quita las gafas,")

	fighter.glassesOn = false
	target.glassesOn 	= false

	if(erudite.HPW > 0){
		console.log("El erudito aprovechando este desliz recupera sus gafas")
		erudite.glassesOn = true
	} else if( erudite.HPW < 0) {
		console.log("EL ERUDITO A PERECIDO NO APARECERA MÁS");
		console.log("Los guerreros asombrados por la muerte del erudito corren para recoger las gafas")
		console.log("pero estas desaparecen desintegrandose al igual que el cuerpo del erudito, como si de arte de magia se tratase.")
	}
	
	

}

const angerSelection = (erudite) => {

	// Creamos un D20
	const d20 	= new Dice(20);
	const resultadoD20 	= d20.rollD20();

	console.log("El erudito tira un D20 y saca: " + resultadoD20 + " aumentando su enfado")

	// Otorgamos Resultado del D20
	erudite.ANG = resultadoD20
}

const armChecker = (fighter) => {

	// Sino tienen ninguno de los dos brazos su fuerza se reducira a la cuarta parte
	if(!fighter.hasLeftArm && !fighter.hasRightArm ){
		fighter.strength = fighter.strength / 4
	}
}

const checkIfBattleEnded = (hero, villain, stopFigth) => {
	if(hero.hitPoints <= 0 || villain.hitPoints <= 0){
		if (hero.hitPoints <=0 ) {
			console.log("EL HEROE " + hero.name + " A PERECIDO")
		} if( villain.hitPoints <= 0){
			console.log("EL VILLANO " + villain.name + " A PERECIDO")
		}
		return stopFigth = true
	}

	else return stopFigth = false
}




export { StartNormalGame };
