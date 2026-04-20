import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

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

  constructor(private router: Router, private meta: Meta, private title: Title) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage = (event.urlAfterRedirects === '/');
      this.applySeo(event.urlAfterRedirects);
    });
  }

  private routeToSlug(url: string): string {
    if (url === '/' || url === '') {
      return 'home';
    }

    const normalized = url.replace(/^\//, '').replace(/^#\//, '');
    if (normalized.startsWith('insights/')) {
      return normalized;
    }

    return normalized || 'home';
  }

  private async applySeo(url: string): Promise<void> {
    const slug = this.routeToSlug(url);

    try {
      const response = await fetch('./api.php?action=seo_get&slug=' + encodeURIComponent(slug));
      if (!response.ok) {
        return;
      }

      const payload = await response.json();
      const seo = payload.data;
      if (!seo) {
        return;
      }

      if (seo.meta_title) {
        this.title.setTitle(seo.meta_title);
      }
      this.meta.updateTag({ name: 'description', content: seo.meta_description || '' });
      this.meta.updateTag({ property: 'og:title', content: seo.og_title || seo.meta_title || '' });
      this.meta.updateTag({ property: 'og:description', content: seo.og_description || seo.meta_description || '' });
      if (seo.canonical_url) {
        let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', 'canonical');
          document.head.appendChild(link);
        }
        link.setAttribute('href', seo.canonical_url);
      }

      if (seo.schema_json) {
        let script = document.getElementById('iaex-schema-jsonld') as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement('script');
          script.type = 'application/ld+json';
          script.id = 'iaex-schema-jsonld';
          document.head.appendChild(script);
        }
        script.textContent = seo.schema_json;
      }
    } catch {
      return;
    }
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
