import { Component, HostListener, ViewChild, ElementRef, AfterViewInit, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrosel',
  templateUrl: './carrosel.component.html',
  styleUrl: './carrosel.component.scss',
  imports: [
    CommonModule,
  ],
})
export class CarroselComponent implements AfterViewInit, OnInit {
  @Input() projects: any[] = [];
  @ViewChild('carousel') carousel!: ElementRef;
  currentIndex: number = 0;
  itemWidth: number = 450;
  // Drag/swipe state
  private isDragging = false;
  private dragStartX = 0;
  private dragCurrentX = 0;
  private readonly dragThreshold = 50; // minimum px to trigger swipe

  ngOnInit() {
    this.adjustItemWidth();
  }

  ngAfterViewInit(): void {
    this.updateCarousel();
    this.adjustItemWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustItemWidth();
    this.updateCarousel();  
  }

  adjustItemWidth() {
    const containerWidth = window.innerWidth;

    // Ajustar a largura do item com base na largura da tela
    if (containerWidth < 768) {
      this.itemWidth = 350;
    } else if (containerWidth < 1024) {
      this.itemWidth = 400;
    } else {
      this.itemWidth = 450;
    }
  }

  scrollLeft() {
    this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
    this.updateCarousel();
  }

  scrollRight() {
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
    this.updateCarousel();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.updateCarousel();
  }

  updateCarousel() {
    const carouselElement = this.carousel.nativeElement;
    const itemWidth = carouselElement.querySelector('.carousel-item').clientWidth;
    const containerWidth = carouselElement.offsetWidth;

    // Calcula o deslocamento para centralizar o item ativo
    let offset = (containerWidth / 2) - (itemWidth / 2) - this.currentIndex * (itemWidth);

    carouselElement.style.transform = `translateX(${offset}px)`;

    // Aplica a classe 'active' no item atual para destacá-lo
    const items = carouselElement.querySelectorAll('.carousel-item');
    items.forEach((item: any, index: number) => {
      if (index === this.currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  onDragStart(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.dragStartX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  onDragging(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    this.dragCurrentX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  onDragEnd(): void {
    if (!this.isDragging) return;
    const delta = this.dragCurrentX - this.dragStartX;
    if (delta > this.dragThreshold) {
      this.scrollLeft();
    } else if (delta < -this.dragThreshold) {
      this.scrollRight();
    }
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragCurrentX = 0;
  }
}
