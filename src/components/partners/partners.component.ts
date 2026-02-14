import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  imports: [RouterLink, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnersComponent {
  // For Brands & Retailers Section
  brandBenefits = [
    { 
      icon: 'fa-solid fa-bolt',
      title: 'Strategic Market Access',
      description: 'Instantly connect with a pre-vetted, capability-mapped network in India, bypassing months of high-risk, trial-and-error sourcing.' 
    },
    { 
      icon: 'fa-solid fa-brain',
      title: 'Intelligence-Driven Matching',
      description: 'Leverage our proprietary data model to match your program’s unique technical and compliance DNA with the perfect manufacturing partner.' 
    },
    { 
      icon: 'fa-solid fa-gears',
      title: 'Managed Execution Framework',
      description: 'Operate with an on-the-ground strategic coordinator. We manage the entire process, from sampling to delivery, ensuring seamless execution.' 
    },
    { 
      icon: 'fa-solid fa-shield-halved',
      title: 'Systemic Resilience & Agility',
      description: 'Eliminate single-source dependency. Our network model provides the flexibility to scale, diversify, and build a truly resilient supply chain.' 
    }
  ];

  // For Manufacturing Partners Section
  manufacturingBenefits = [
    { 
      icon: 'fa-solid fa-bullseye',
      title: 'Access to Quality Programs',
      description: 'Connect with curated domestic and export programs that value capability and align with your manufacturing strengths.' 
    },
    { 
      icon: 'fa-solid fa-handshake-angle',
      title: 'Strategic Partnership',
      description: 'Function as a core production node within a managed ecosystem, not just another vendor on a list.' 
    },
    { 
      icon: 'fa-solid fa-chart-line',
      title: 'Sustainable Growth',
      description: 'Leverage our network to fill capacity, diversify your client base, and build long-term, strategic client relationships.' 
    },
    { 
      icon: 'fa-solid fa-circle-nodes',
      title: 'Operational Excellence',
      description: 'Benefit from streamlined, professionally managed communication flows, reducing friction and improving efficiency.' 
    },
  ];

  idealPartnerProfile = [
      { title: 'Technical Specialization', description: 'Proven expertise in specific knit or woven product categories.' },
      { title: 'Compliance & Ethics', description: 'A non-negotiable commitment to our Code of Conduct and global standards.' },
      { title: 'Quality Mindset', description: 'A culture of precision and a track record of delivering consistent quality.' },
      { title: 'Collaborative Spirit', description: 'A willingness to operate transparently within a managed network ecosystem.' },
  ];

  // For Sourcing & Channel Partners Section
  sourcingPartnerBenefits = [
    { 
      icon: 'fa-solid fa-globe', 
      title: 'Global Reach, Local Execution', 
      description: 'Leverage our deep execution network in India for your clients. Offer them reliable, on-the-ground capabilities without the overhead.' 
    },
    { 
      icon: 'fa-solid fa-handshake', 
      title: 'Reciprocal Opportunities', 
      description: 'Gain access to projects that require expertise in your region. We believe in a collaborative, two-way partnership model.' 
    },
    { 
      icon: 'fa-solid fa-brain', 
      title: 'Shared Intelligence', 
      description: 'Tap into a shared ecosystem of market insights, supplier data, and risk analysis to make smarter decisions for your clients.' 
    },
    { 
      icon: 'fa-solid fa-arrow-up-right-dots', 
      title: 'Expand Your Service Offerings', 
      description: 'Confidently take on larger, multi-regional sourcing programs by partnering with a trusted execution node in the Indian subcontinent.' 
    }
  ];

  allianceModel = [
      { title: 'We Execute for You in India', description: 'You bring the client requirement; we provide the end-to-end, on-the-ground execution through our vetted network, acting as your trusted Indian operations arm.' },
      { title: 'You Execute for Us Globally', description: 'We bring the program requirement; you provide the local market access and execution in your region of expertise, acting as our strategic international partner.' }
  ];

  // Helper function for scrolling
  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
