import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isMenuOpen = signal(false);

  navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'Who We Are' },
    { path: '/execution', label: 'Execution' },
    { path: '/model', label: 'Model' },
    { path: '/process', label: 'Process' },
    { path: '/case-studies', label: 'Case Studies' },
    { path: '/insights', label: 'Insights' },
    { path: '/partners', label: 'Partners' },
    { path: '/contact', label: 'Contact' },
  ];

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }
}
