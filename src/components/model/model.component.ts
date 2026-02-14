import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelComponent {
  networkModelPoints = [
    {
      icon: 'fa-solid fa-network-wired',
      title: 'Curated & Dynamic Network',
      description: 'Our network is not a static list; it\'s a living ecosystem of pre-vetted, performance-monitored partners. We continuously evaluate and onboard specialists to ensure a best-in-class capability matrix.'
    },
    {
      icon: 'fa-solid fa-puzzle-piece',
      title: 'Capability-First Matching',
      description: 'We go beyond simple capacity. Our intelligence matches your product\'s technical needs—fabric type, construction complexity, certifications—to the proven expertise of the ideal partner.'
    },
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Risk Diversification',
      description: 'Our model inherently insulates you from single-source dependency. We mitigate geopolitical, operational, and logistical risks by distributing programs across multiple qualified partners.'
    },
    {
      icon: 'fa-solid fa-layer-group',
      title: 'Agile Capacity Allocation',
      description: 'Seamlessly scale production volumes up or down. Our model allows for agile capacity management, enabling you to respond to market demand shifts without the constraints of a captive supply chain.'
    },
    {
      icon: 'fa-solid fa-brain',
      title: 'Data-Driven Intelligence',
      description: 'At the core of our model is a proprietary data engine. We leverage network-wide analytics to power a smarter, more predictive sourcing ecosystem.',
      details: [
        {
          title: 'Performance Benchmarking',
          text: 'We continuously evaluate partners on quality, timeliness, and compliance to inform our capability-first matching.'
        },
        {
          title: 'Market Intelligence',
          text: 'We translate real-time data on capacity, materials, and trends into a strategic advantage for your programs.'
        }
      ]
    },
    {
      icon: 'fa-solid fa-magnifying-glass-chart',
      title: 'Predictive Sourcing Advantage',
      description: 'We transform raw network data into actionable, predictive intelligence, allowing you to move from reactive sourcing to proactive, strategic decision-making that anticipates market shifts.',
      details: [
        {
          title: 'Price Volatility Forecasting',
          text: 'By analyzing historic and real-time data on raw material costs, we advise on optimal times to lock in program pricing, protecting your margins.'
        },
        {
          title: 'Capacity Trend Analysis',
          text: 'Our dashboard identifies emerging capacity constraints or surpluses within specific hubs, allowing you to secure production lines before they become scarce.'
        }
      ]
    }
  ];
}
