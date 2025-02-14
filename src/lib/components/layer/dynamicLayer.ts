import Layer from "./layer";
import {
  calculateOppositeAngle,
  generateRandomNumber,
  getCoordinates,
  numberInInterval,
} from "../../utils/mathUtils";
export type Direction = "toward" | "forward";

interface ICoordinates {
  x: number;
  y: number;
  direction: Direction;
  speed: number;
}

interface IBallProperties extends ICoordinates {
  bearing: number;
}

interface IPlayerProperties extends ICoordinates {
  ratioX: number;
  ratioY: number;
  color: string;
}

interface IResult {
  continue: boolean;
  target: "computer" | "player" | null;
}

interface IDynamicLayerProperties {
  ball: IBallProperties | undefined;
  player: IPlayerProperties | undefined;
  computer: IPlayerProperties | undefined;
  draw: () => void;
  animate: () => IResult;
  updatePlayer: (direction: Direction) => void;
  increaseLevel: () => void;
  resetElements: () => void;
  result: IResult;
}

class DynamicLayer extends Layer implements IDynamicLayerProperties {
  ball: IBallProperties | undefined;
  player: IPlayerProperties | undefined;
  computer: IPlayerProperties | undefined;
  borderLimit = 5;
  result: IResult = {
    continue: true,
    target: null,
  };
  levelRatio = 0;
  levelSpeedComputer = 5;
  levelSpeedBall = 0;

  /**
   * Draw each element : player and computer racket, ball
   * @returns
   */
  draw(): void {
    if (!this.size.width || !this.size.height) return;
    this.reset();
    this.drawPlayer();
    this.drawComputer();
    this.drawBall();
  }

  /**
   * Draw computer racket
   */
  drawComputer(): void {
    if (!this.computer) {
      this.computer = {
        x: this.size.width - this.borderLimit,
        y: this.borderLimit,
        direction: "forward",
        ratioX: 0.01,
        ratioY: 0.25 + this.levelRatio,
        speed: 1 + this.levelSpeedComputer,
        color: "red",
      };
    }
    this.computer.x =
      this.size.width -
      this.borderLimit -
      Math.round(this.size.width * this.computer.ratioX);
    this.drawRacket(this.computer);
  }

  /**
   * Draw racket player
   */
  drawPlayer(): void {
    if (!this.player) {
      this.player = {
        x: this.borderLimit,
        y: this.borderLimit,
        direction: "forward",
        ratioX: 0.01,
        ratioY: 0.25,
        speed: 50,
        color: "blue",
      };
    }
    this.drawRacket(this.player);
  }
  /**
   * Draw racket
   * @param target player properties: computer or player
   */
  drawRacket(target: IPlayerProperties) {
    this.context.fillStyle = target.color;
    const xMax = Math.round(this.size.width * target.ratioX);
    const yMax = Math.round(this.size.height * target.ratioY);
    this.context.fillRect(target.x, target.y, xMax, yMax);
  }

  /**
   * Draw ball
   */
  drawBall(): void {
    if (!this.ball) {
      this.ball = {
        x: this.size.width / 2,
        y: this.size.height / 2,
        direction: "toward",
        bearing: generateRandomNumber(45, 135),
        speed: 5 + this.levelSpeedBall,
      };
    }
    this.context.beginPath();
    this.context.fillStyle = "green";
    this.context.arc(
      this.ball.x,
      this.ball.y,
      Math.round(this.size.width * 0.01),
      0,
      2 * Math.PI,
    );
    this.context.fill();
  }

  /**
   * Anime ball and computer racket
   */
  animate(): IResult {
    this.result = {
      target: "player",
      continue: true,
    };
    this.updateComputer();
    this.updateBall();
    this.draw();
    return this.result;
  }

  /**
   * Update computer racket
   * @returns
   */
  updateComputer(): void {
    if (!this.computer) return;
    this.updateRacket(this.computer);
  }

  /**
   * Update player racket
   * @param direction forward or toward
   * @returns
   */
  updatePlayer(direction: Direction) {
    if (!this.player) return;
    this.player.direction = direction;
    this.updateRacket(this.player);
  }

  /**
   * Update racket for players
   * @param target player properties
   */
  updateRacket(target: IPlayerProperties) {
    const { y } = target;
    const maxY = Math.round(y + this.size.height * target.ratioY);
    if (maxY + this.borderLimit >= this.size.height) {
      target.direction = "toward";
    } else if (y <= this.borderLimit) {
      target.direction = "forward";
    }
    target.y =
      target.direction === "forward" ? y + target.speed : y - target.speed;
  }

  /**
   * Update ball position
   * @returns
   */
  updateBall(): void {
    if (!this.ball || !this.computer || !this.player) return;
    const { x, y, bearing, direction, speed } = this.ball;
    const { x: newX, y: newY } = getCoordinates(
      x,
      y,
      bearing,
      direction,
      speed,
    );
    let xUpdated = newX,
      yUpdated = newY,
      directionUpdated = direction,
      bearingUpdated = bearing;

    // check x collision
    if (newX >= this.size.width - this.borderLimit) {
      const computerTouches = numberInInterval(
        this.computer.y,
        Math.round(this.size.height * this.computer.ratioY) + this.computer.y,
        newY,
      );
      if (computerTouches) {
        xUpdated = x - this.borderLimit;
        directionUpdated = "forward";
        bearingUpdated = calculateOppositeAngle(bearing);
      }
      this.result = {
        target: "computer",
        continue: computerTouches,
      };
    } else if (newX <= this.borderLimit) {
      const playerTouches = numberInInterval(
        this.player.y,
        Math.round(this.size.height * this.player.ratioY) + this.player.y,
        newY,
      );
      if (playerTouches) {
        bearingUpdated = calculateOppositeAngle(bearing);
        xUpdated = this.borderLimit;
        directionUpdated = "toward";
      }
      this.result = {
        target: "player",
        continue: playerTouches,
      };
    }

    //check y collision
    if (newY >= this.size.height - this.borderLimit) {
      yUpdated = y - this.borderLimit;
      bearingUpdated = calculateOppositeAngle(bearing);
    } else if (newY <= this.borderLimit) {
      bearingUpdated = calculateOppositeAngle(bearing);
      yUpdated = this.borderLimit;
    }
    this.ball.bearing = bearingUpdated;
    this.ball.x = xUpdated;
    this.ball.y = yUpdated;
    this.ball.direction = directionUpdated;
    this.ball.speed = speed;
  }

  /**
   * Reset all elements of the canvas
   */
  resetElements() {
    this.ball = undefined;
    this.computer = undefined;
    this.player = undefined;
  }
  /**
   * Increase level
   */
  increaseLevel() {
    this.levelRatio =
      this.levelRatio < 0.8 ? this.levelRatio + 0.05 : this.levelRatio;
    this.levelSpeedBall++;
    this.levelSpeedComputer =
      this.levelSpeedComputer < 30
        ? this.levelSpeedComputer + 1
        : this.levelSpeedComputer;
  }
}

export default DynamicLayer;
