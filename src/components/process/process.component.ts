import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessComponent {
  processPhases = [
    {
      phase: '01',
      title: 'Strategic Briefing & Deconstruction',
      description: 'We begin by deconstructing your program requirements—technical specifications, compliance mandates, commercial targets, and strategic goals—to build a comprehensive project DNA.'
    },
    {
      phase: '02',
      title: 'Network Mapping & Partner Vetting',
      description: 'Our proprietary intelligence maps your project DNA against our network data. We identify a curated shortlist of partners whose technical capabilities, capacity, and compliance profile are a precise match.'
    },
    {
      phase: '03',
      title: 'Commercial Alignment & Program Launch',
      description: 'We facilitate a transparent alignment on pricing, lead times, and MOQs. Upon agreement, we coordinate the official program launch, managing all initial communication and documentation.'
    },
    {
      phase: '04',
      title: 'Execution & Lifecycle Management',
      description: 'Throughout the development and production lifecycle, IAEX acts as the central coordination hub, ensuring seamless information flow and proactive problem-solving to keep the program on track.'
    }
  ];

  valuePropositions = [
    {
      icon: 'fa-solid fa-bolt',
      title: 'Market Access & Speed',
      description: 'Instantly access a pre-vetted, capability-mapped network, bypassing months of research and risk. We reduce your time-to-market significantly.'
    },
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Systemic Resilience',
      description: 'Our model is designed to eliminate single-source dependency. We build resilient supply chains that can adapt to disruption and scale on demand.'
    },
    {
      icon: 'fa-solid fa-gears',
      title: 'Operational Excellence',
      description: 'Benefit from professionally managed sampling, development, and communication flows. We act as an extension of your team, ensuring precision and clarity.'
    },
    {
      icon: 'fa-solid fa-magnifying-glass-chart',
      title: 'Data-Driven Decision Making',
      description: 'Leverage our network intelligence for optimized pricing, lead-time negotiations, and strategic capacity planning. We turn market data into your competitive advantage.'
    }
  ];
}
