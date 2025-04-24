import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ProjectsComponent,
    ContactComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  title = 'portfolio_felipe';
  sections = ['hero', 'about', 'projects', 'contact'];
  currentSection = 'hero';
  
  ngOnInit(): void {
    // Inicializa verificando qual seção está visível
    setTimeout(() => this.checkVisibleSection(), 100);
  }
  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.checkVisibleSection();
  }
  
  private checkVisibleSection(): void {
    const container = document.querySelector('.portfolio-container');
    if (!container) return;
    
    const scrollPosition = container.scrollTop;
    const windowHeight = window.innerHeight;
    
    for (const section of this.sections) {
      const element = document.getElementById(section);
      if (!element) continue;
      
      const sectionTop = element.offsetTop;
      const sectionHeight = element.offsetHeight;
      
      // Se a seção estiver visível (pelo menos 50% na tela)
      if (scrollPosition >= sectionTop - windowHeight/2 && 
          scrollPosition < sectionTop + sectionHeight - windowHeight/2) {
        if (section !== this.currentSection) {
          this.currentSection = section;
          this.updateGradientAngle(section);
        }
        break;
      }
    }
  }
  
  private updateGradientAngle(section: string): void {
    let angle;
    switch (section) {
      case 'hero':
        angle = '45deg';
        break;
      case 'about':
        angle = '135deg';
        break;
      case 'projects':
        angle = '225deg';
        break;
      case 'contact':
        angle = '315deg';
        break;
      default:
        angle = '45deg';
    }
    
    // Atualiza a variável CSS
    document.documentElement.style.setProperty('--gradient-angle', angle);
  }
}