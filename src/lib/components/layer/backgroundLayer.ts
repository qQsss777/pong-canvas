import Layer from "./layer";

class BackgroundLayer extends Layer {
  draw(): void {
    this.reset();
    this.context.strokeStyle = "white";
    this.context.lineWidth = 5;
    this.context.fillRect(0, 0, this.size.width, this.size.height);
    this.context.strokeRect(0, 0, this.size.width, this.size.height);
    this.context.beginPath();
    this.context.lineWidth = 10;
    this.context.moveTo(this.size.width / 2, 0);
    this.context.lineTo(this.size.width / 2, this.size.height);
    this.context.stroke();
  }
}

export default BackgroundLayer;
