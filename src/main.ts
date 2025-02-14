import BackgroundLayer from "./lib/components/layer/backgroundLayer";
import DynamicLayer from "./lib/components/layer/dynamicLayer";
import Game from "./lib/components/game/game";
import "./style.css";
import Score from "./lib/components/score/score";

const appDiv = document.getElementById("app");
if (appDiv) {
  const game = new Game({
    container: appDiv as HTMLDivElement,
    backgroundLayer: new BackgroundLayer(),
    dynamicLayer: new DynamicLayer(),
    score: new Score(),
  });
  game.init();
  game.start();
}
