import { Component, OnInit } from '@angular/core';
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

  onWindowScroll = (): void => {
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
    // Map section names to target angles (in degrees)
    const angleMap: { [key: string]: number } = {
      hero: 45,
      about: 135,
      projects: 225,
      contact: 315
    };
    const root = document.documentElement;
    const currentValue = getComputedStyle(root).getPropertyValue('--gradient-angle').trim();
    const startAngle = parseFloat(currentValue) || 0;
    const targetAngle = angleMap[section] ?? startAngle;
    const duration = 1000; // ms
    const startTime = performance.now();
    const animateAngle = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const current = startAngle + (targetAngle - startAngle) * t;
      root.style.setProperty('--gradient-angle', `${current}deg`);
      if (t < 1) {
        requestAnimationFrame(animateAngle);
      }
    };
    requestAnimationFrame(animateAngle);
  }
}