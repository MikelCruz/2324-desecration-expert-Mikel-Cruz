export default class Villain {
  
  constructor(villainData) {
      this.name = villainData[0].name;
      this.intelligence = villainData[0].powerstats.intelligence;
      this.strength = villainData[0].powerstats.strength;
      this.speed = villainData[0].powerstats.speed;
      this.durability = villainData[0].powerstats.durability;
      this.power = villainData[0].powerstats.power;
      this.combat = villainData[0].powerstats.combat;
      this.starts = false
      this.hitPoints = this.strength * 10;
  }
}


