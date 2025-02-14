export interface ISize {
  height: number;
  width: number;
}

interface ILayerProperties {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  size: ISize;
  updateSize: (width: number, height: number) => void;
  draw: () => void;
  reset: () => void;
}

abstract class Layer implements ILayerProperties {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  size: ISize;
  constructor() {
    this.size = {
      width: 0,
      height: 0,
    };
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  abstract draw(): void;

  reset() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateSize(width: number, height: number) {
    window.requestAnimationFrame(() => {
      this.size.width = width;
      this.size.height = height;
      this.canvas.width = this.size.width;
      this.canvas.height = this.size.height;
      this.draw();
    });
  }
}

export default Layer;
