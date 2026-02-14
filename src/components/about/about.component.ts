import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  philosophyPillars = [
    {
      icon: 'fa-solid fa-circle-nodes',
      title: 'Network over Hierarchy',
      description: 'We believe the future of sourcing is decentralized. Our model replaces rigid, slow-moving hierarchies with an agile, interconnected ecosystem of specialized partners.'
    },
    {
      icon: 'fa-solid fa-brain',
      title: 'Intelligence over Effort',
      description: 'Data is our foundation. We replace brute-force sourcing with a proprietary intelligence framework that maps capabilities to requirements with precision and foresight.'
    },
    {
      icon: 'fa-solid fa-handshake-angle',
      title: 'Partnership over Procurement',
      description: 'We are not transactional agents. We function as embedded strategic coordinators, fostering transparent, long-term partnerships that align brand and manufacturer goals.'
    }
  ];

  iaexArchitecture = [
    {
      title: 'Decentralized Strength',
      description: 'Single-source dependency is the greatest threat to modern supply chains. Our distributed network is the antidote, building inherent resilience against geopolitical, logistical, and operational disruptions.'
    },
    {
      title: 'Proprietary Intelligence',
      description: 'Our data model goes beyond capacity. We map over 50 data points per partner—from machinery to certifications—to match your program’s unique DNA with the perfect manufacturing fit.'
    },
    {
      title: 'Strategic Neutrality',
      description: 'We are commercially neutral and 100% brand-aligned. Our success is measured by your program\'s success, not factory margins, ensuring our recommendations are always objective and transparent.'
    },
    {
      title: 'Managed Ecosystem',
      description: 'Our network is a living entity. Every partner is onboarded through a rigorous vetting process and is continuously monitored for performance, ensuring a best-in-class capability matrix.'
    }
  ];
}
