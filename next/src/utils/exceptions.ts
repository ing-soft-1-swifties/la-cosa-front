export class GameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameError";
  }
}

export class NotInGameError extends GameError { 
  constructor(message: string) { 
    super(message); 
    this.name = "NotInGameError";
  }
}
