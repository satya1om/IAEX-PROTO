import { Component, ChangeDetectionStrategy, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { InsightService, Article } from '../../services/insight.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsightsComponent implements OnInit, OnDestroy {
  private routeSub!: Subscription;
  private allArticles = signal<Article[]>([]);
  
  currentPage = signal(1);
  itemsPerPage = 6;
  
  totalPages = computed(() => {
    return Math.ceil(this.allArticles().length / this.itemsPerPage);
  });

  paginatedArticles = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.allArticles().slice(startIndex, endIndex);
  });

  constructor(
    private insightService: InsightService,
    private router: Router,
    private route: ActivatedRoute
    ) {
    this.allArticles.set(this.insightService.getArticles());
  }

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      const page = Number(params.get('page'));
      this.currentPage.set(page > 0 ? page : 1);
    });

    this.insightService.fetchArticlesFromCms().then((articles) => {
      this.allArticles.set(articles);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  changePage(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages() && newPage !== this.currentPage()) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: newPage },
        queryParamsHandling: 'merge',
      });
      window.scrollTo(0, 0);
    }
  }

  getPageNumbers(): (number | string)[] {
      const total = this.totalPages();
      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      
      const currentPage = this.currentPage();
      if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, '...', total];
      }
      if (currentPage >= total - 3) {
        return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
      }
      return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', total];
  }
}
