import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeService } from '../services/three.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  
  constructor(private threeService: ThreeService) {}
  
  ngAfterViewInit(): void {
    if (this.canvasRef) {
      this.threeService.initialize(this.canvasRef.nativeElement);
      this.threeService.buildHeroScene();
    }
  }

  ngOnDestroy(): void {
    this.threeService.dispose();
  }

  scrollToSection(sectionId: string, event: MouseEvent): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
