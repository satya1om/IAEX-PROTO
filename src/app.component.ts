import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, RouterLink],
  host: {
    '(document:contextmenu)': 'preventContextMenu($event)',
    '(document:keydown)': 'preventCopy($event)',
  }
})
export class AppComponent {
  isHomePage = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage = (event.urlAfterRedirects === '/');
    });
  }

  preventContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }

  preventCopy(event: KeyboardEvent): void {
    if (event.ctrlKey && (event.key === 'c' || event.key === 'C' || event.key === 'x' || event.key === 'a') || (event.metaKey && (event.key === 'c' || event.key === 'C'))) {
      event.preventDefault();
    }
  }
}
