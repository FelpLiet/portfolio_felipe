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

  ngOnInit() {
    this.adjustItemWidth();
  }

  ngAfterViewInit(): void {
    this.updateCarousel();
    //this.startAutoplay();
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

  /*startAutoplay() {
    setInterval(() => {
      this.scrollRight();
    }, 8000);
  }*/

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

}
