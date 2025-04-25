import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class GradientService {
  private currentGradient = new BehaviorSubject<string>('hero');
  currentGradient$ = this.currentGradient.asObservable();

  constructor(private themeService: ThemeService) { }
}
