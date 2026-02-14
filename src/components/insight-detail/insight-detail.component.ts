import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { InsightService, Article } from '../../services/insight.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-insight-detail',
  templateUrl: './insight-detail.component.html',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsightDetailComponent implements OnInit, OnDestroy {
  private routeSub!: Subscription;

  article = signal<Article | undefined>(undefined);
  insightsPage = signal<number | null>(null);
  
  constructor(
    private route: ActivatedRoute,
    private insightService: InsightService,
    private titleService: Title
  ) {
    effect(() => {
      const currentArticle = this.article();
      if (currentArticle) {
        this.titleService.setTitle(`IAEX | ${currentArticle.title}`);
      } else {
        this.titleService.setTitle('IAEX | Insight Not Found');
      }
    });
  }

  ngOnInit(): void {
    this.routeSub = combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ]).subscribe(([params, queryParams]) => {
      const slug = params.get('slug');
      if (slug) {
        const foundArticle = this.insightService.getArticleBySlug(slug);
        this.article.set(foundArticle);
      }

      const page = queryParams.get('page');
      if (page) {
        this.insightsPage.set(Number(page));
      } else {
        this.insightsPage.set(null);
      }
      
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
