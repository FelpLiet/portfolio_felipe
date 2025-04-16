import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  ngOnInit(): void {
    this.checkFragmentAndScroll();
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
