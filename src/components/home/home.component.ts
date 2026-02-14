import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

class Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  
  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.x = Math.random() * this.canvasWidth;
    this.y = Math.random() * this.canvasHeight;

    if (this.x < this.canvasWidth * 0.5 && this.y < this.canvasHeight * 0.6) {
      this.x += this.canvasWidth * 0.4;
    }

    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 2 + 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = '#A0A0A0';
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('networkCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private nodes: Node[] = [];
  private animationFrameId?: number;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      this.ctx = context;
      this.resizeCanvas();
      this.initAnimation();
      window.addEventListener('resize', this.resizeCanvas);
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.resizeCanvas);
  }
  
  private resizeCanvas = (): void => {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.nodes = [];
    this.initNodes();
  }

  private initNodes(): void {
    const nodeCount = Math.floor((this.canvasRef.nativeElement.width * this.canvasRef.nativeElement.height) / 20000);
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push(new Node(this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height));
    }
  }

  private initAnimation(): void {
    this.initNodes();
    this.animate();
  }

  private animate = (): void => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    this.drawLines();
    this.nodes.forEach(node => {
      node.update();
      node.draw(this.ctx);
    });

    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  private drawLines(): void {
    const connectionDistance = 180;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(100, 100, 100, ${1 - distance / connectionDistance})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
}
