import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  executionFramework = [
    {
      title: 'Supplier & Program Mapping',
      description: 'Requirement-based identification of partners aligned with specific production needs, from fabric type to certifications.'
    },
    {
      title: 'Option Building',
      description: 'Capability-driven matching to ensure right-fit manufacturing for every style, providing multiple pre-vetted options.'
    },
    {
      title: 'Commercial Alignment',
      description: 'Strategic coordination of Price, MOQ, and Lead-times across multiple partners to meet your specific market demands.'
    },
    {
      title: 'Development Coordination',
      description: 'End-to-end management of the entire sampling and product development lifecycle for seamless execution.'
    },
    {
      title: 'Continuity Planning',
      description: 'Long-term capacity booking and supply chain stability management to ensure your production is always secure.'
    }
  ];

  expertiseAreas = [
    {
      icon: 'fa-solid fa-person-running',
      title: 'Technical & Performance Wear',
      description: 'Executing complex programs requiring specialized machinery, fabric bonding, and performance-enhancing finishes for athletic and functional apparel.'
    },
    {
      icon: 'fa-solid fa-shirt',
      title: 'Fine Gauge & Intricate Knits',
      description: 'Managing production for high-quality jersey, fleece, and intricate knit structures demanding precise tension control and finishing techniques.'
    },
    {
      icon: 'fa-solid fa-vest-patches',
      title: 'Structured & Tailored Wovens',
      description: 'Coordinating the production of tailored shirts, trousers, and outerwear that require a high degree of precision in cutting, stitching, and finishing.'
    },
    {
      icon: 'fa-solid fa-ruler-combined',
      title: 'Denim & Specialized Washes',
      description: 'Navigating the complexities of denim manufacturing, including specialized wash-downs, distressing, and sustainable water-usage practices.'
    }
  ];
}
