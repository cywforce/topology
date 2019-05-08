import { Rect } from './models/rect';
import { Point } from './models/point';
import { Line } from './models/line';
import { Canvas } from './canvas';
import { Store } from './store/store';

export class HoverLayer extends Canvas {
  line: Line;
  dockAnchor: Rect;
  dragRect: Rect;
  constructor(parent: HTMLElement, options: any) {
    super(options);
    if (!this.options.hoverColor) {
      this.options.hoverColor = '#389e0d';
    }

    // The backgournd color of selecting nodes by draging.
    if (!this.options.dragColor) {
      this.options.dragColor = '#1890ff';
    }

    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    parent.appendChild(this.canvas);
  }

  setLine(from: Point, fromArrow?: string) {
    this.line = new Line(from);
    this.line.activeStrokeStyle = this.options.hoverColor;
    this.line.fromArrow = fromArrow;
    this.lines = [this.line];
    Store.get('lines').push(this.line);
  }

  lineTo(to: Point, toArrow: string = 'triangleSolid') {
    this.line.to = to;
    this.line.toArrow = toArrow;
  }

  clearLines() {
    this.line = null;
    this.lines = [];
  }

  render() {
    // clear
    this.canvas.height = this.canvas.height;

    this.renderLines();

    const ctx = this.canvas.getContext('2d');

    // dock anchor
    ctx.strokeStyle = this.options.hoverColor + '80';
    ctx.fillStyle = this.options.hoverColor + '80';
    ctx.translate(0, 0);
    if (this.dockAnchor) {
      ctx.beginPath();
      ctx.arc(
        this.dockAnchor.x + ((this.dockAnchor.width / 2 + 0.5) << 0),
        this.dockAnchor.y + ((this.dockAnchor.width / 2 + 0.5) << 0),
        (this.dockAnchor.width / 2 + 8) << 0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.fill();
    }

    // anchors
    ctx.strokeStyle = this.options.hoverColor;
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2;
    for (const item of this.nodes) {
      for (const node of item.anchors) {
        ctx.beginPath();
        ctx.arc(
          node.x + ((node.width / 2 + 0.5) << 0),
          node.y + ((node.width / 2 + 0.5) << 0),
          (node.width / 2 + 0.5) << 0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.fill();
      }
    }

    // Select nodes by drag.
    if (this.dragRect) {
      ctx.strokeStyle = this.options.dragColor;
      ctx.fillStyle = this.options.dragColor + '30';
      ctx.lineWidth = 1;
      ctx.translate(0.5, 0.5);
      ctx.beginPath();
      ctx.strokeRect(this.dragRect.x, this.dragRect.y, this.dragRect.width, this.dragRect.height);
      ctx.fillRect(this.dragRect.x, this.dragRect.y, this.dragRect.width, this.dragRect.height);
    }
  }
}