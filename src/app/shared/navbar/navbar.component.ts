import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isDarkTheme = true;
  isMenuOpen = false;

  constructor(private themeService: ThemeService) {}
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
    
  ngOnInit(): void {
    this.checkFragmentAndScroll();

    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkTheme = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  scrollToSection(sectionId: string, event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${sectionId}`);
    }
  }
  
  private checkFragmentAndScroll(): void {
    const fragment = window.location.hash.replace('#', '');
    if (fragment) {
      setTimeout(() => {
        this.scrollToSection(fragment);
      }, 100);
    }
  }
  
}
