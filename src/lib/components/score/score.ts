import "./score.css";

interface IScoreProperties {
  reset: () => void;
  init: (parentNode: HTMLDivElement) => void;
}
class Score implements IScoreProperties {
  parentNode: HTMLDivElement | undefined;
  scoreNode = document.createElement("div");
  resultNode = document.createElement("div");
  timeNode = document.createElement("div");
  timeInterval = 0;

  init(parentNode: HTMLDivElement) {
    this.parentNode = parentNode;
    this.scoreNode.className = "score-root";
    this.resultNode.innerText = 0 + " - " + 0;
    this.scoreNode.append(this.timeNode, this.resultNode);
    this.parentNode.appendChild(this.scoreNode);
    this.timeNode.innerText = "00:00";
    this.timeInterval = window.setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  /**
   * Add one second to time value
   */
  updateTime() {
    const parseText = this.timeNode.innerText.split(":");
    const minutes = parseText[0];
    const seconds = parseText[1];
    let newText = "";
    if (seconds === "59") {
      newText = `${parseInt(minutes) + 1}:00`;
    } else {
      const secondsInt = parseInt(seconds) + 1;
      const secondToText = secondsInt < 10 ? `0${secondsInt}` : `${secondsInt}`;
      newText = `${minutes}:${secondToText}`;
    }
    this.timeNode.innerText = newText;
  }

  /**
   * Reset to time value
   */
  reset() {
    window.clearInterval(this.timeInterval);
    this.timeNode.innerText = "00:00";
  }

  /**
   * Add one second to time value
   */
  updateScore(player: boolean) {
    const txt = this.resultNode.innerText.split(" - ");
    let score = "";
    if (player) {
      score = `${parseInt(txt[0]) + 1} - ${txt[1]}`;
    } else {
      score = `${txt[0]} - ${parseInt(txt[1]) + 1}`;
    }
    this.resultNode.innerText = score;
  }
}
export default Score;
