import Score from "../score/score";
import type BackgroundLayer from "../layer/backgroundLayer";
import DynamicLayer from "../layer/dynamicLayer";
import "./game.css";
type GameStatus = "play" | "pause" | "stop";

interface IGameConstructor {
  container: HTMLDivElement;
  backgroundLayer: BackgroundLayer;
  dynamicLayer: DynamicLayer;
  score: Score;
}

interface IGameProperties extends IGameConstructor {
  scoreContainer: HTMLDivElement;
  rootContainer: HTMLDivElement;
  gameContainer: HTMLDivElement;
  init: () => void;
  start: () => void;
  pause: () => void;
  quit: () => void;
  resizeObservers: ResizeObserver[];
}

class Game implements IGameProperties {
  container: HTMLDivElement;
  rootContainer: HTMLDivElement;
  scoreContainer: HTMLDivElement;
  gameContainer: HTMLDivElement;
  backgroundLayer: BackgroundLayer;
  dynamicLayer: DynamicLayer;
  score: Score;
  resizeObservers: ResizeObserver[];
  abort: AbortController = new AbortController();
  gameStatus: GameStatus = "stop";

  constructor(props: IGameConstructor) {
    this.container = props.container;
    this.dynamicLayer = props.dynamicLayer;
    this.score = props.score;
    this.backgroundLayer = props.backgroundLayer;
    this.rootContainer = document.createElement("div");
    this.rootContainer.className = "game-root";
    this.gameContainer = document.createElement("div");
    this.gameContainer.className = "game-container";
    this.scoreContainer = document.createElement("div");
    this.scoreContainer.className = "game-score";
    this.rootContainer.append(this.scoreContainer, this.gameContainer);
    this.resizeObservers = [];
  }

  /**
   * Initialize properties, canvas layer and event listener
   */
  init() {
    [
      { node: this.gameContainer, layer: this.backgroundLayer },
      { node: this.gameContainer, layer: this.dynamicLayer },
    ].forEach((elements) => {
      const cvs = elements.layer.canvas;
      const { clientWidth, clientHeight } = elements.node;
      elements.layer.updateSize(clientWidth, clientHeight);
      elements.node.appendChild(cvs);
      const rs = new ResizeObserver((target) => {
        const { clientWidth, clientHeight } = target[0]
          .target as unknown as HTMLDivElement;
        elements.layer.updateSize(clientWidth, clientHeight);
      });
      rs.observe(elements.node);
      this.resizeObservers.push(rs);
    });
    this.container.appendChild(this.rootContainer);
  }

  /**
   * Start game : listen player key presss and animate ball and computer
   */
  start() {
    this.score.init(this.scoreContainer);
    this.gameStatus = "play";
    window.addEventListener(
      "keydown",
      (ev) => {
        if (ev.code === "ArrowUp") {
          this.dynamicLayer.updatePlayer("toward");
        } else if (ev.code === "ArrowDown") {
          this.dynamicLayer.updatePlayer("forward");
        }
      },
      { signal: this.abort.signal },
    );
    this.animate();
  }

  /**
   * Pause game
   */
  pause() {
    this.gameStatus = "pause";
  }

  /**
   * Quit game
   */
  quit() {
    this.gameStatus = "stop";
    this.abort.abort();
    this.backgroundLayer.reset();
    this.resizeObservers.forEach((rs) => rs.disconnect());
    window.close();
  }

  /**
   * Animate game
   */
  animate() {
    const result = this.dynamicLayer.animate();
    if (this.gameStatus === "play" && result.continue) {
      window.requestAnimationFrame(this.animate.bind(this));
    } else {
      setTimeout(() => {
        this.dynamicLayer.resetElements();
        if (result.target === "computer") {
          this.dynamicLayer.increaseLevel();
          this.score.updateScore(true);
        } else {
          this.score.updateScore(false);
        }
        window.requestAnimationFrame(this.animate.bind(this));
      }, 3000);
    }
  }
}

export default Game;
