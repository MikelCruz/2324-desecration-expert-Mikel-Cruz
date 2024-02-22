export default class Dice {
  constructor(sides) {
    this.sides = sides;
  }

  roll() {
    return Math.floor(Math.random() * this.sides) + 1;
  }

  rollD100() {
    if (this.sides !== 100) {
      throw new Error('Este dado no tiene 100 caras.');
    }
    return this.roll();
  }

  rollD20() {
    if (this.sides !== 20) {
      throw new Error('Este dado no tiene 20 caras.');
    }
    return this.roll();
  }

  rollD10() {
    if (this.sides !== 10) {
      throw new Error('Este dado no tiene 10 caras.');
    }
    return this.roll();
  }

  rollD3() {
    if (this.sides !== 3) {
      throw new Error('Este dado no tiene 3 caras.');
    }
    return this.roll();
  }  
}