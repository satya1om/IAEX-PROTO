import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CaseStudy {
  client: string;
  category: string;
  problem: string;
  solution: string;
  outcome: string;
}

@Component({
  selector: 'app-case-studies',
  templateUrl: './case-studies.component.html',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudiesComponent {
  caseStudies: CaseStudy[] = [
    {
      client: 'A growing D2C brand',
      category: 'Women\'s Fashion',
      problem: 'Their samples from a new factory were perfect, but the quality of the bulk production was noticeably lower. This is a classic "quality fade" issue that was damaging their brand reputation.',
      solution: 'We placed the program with a network partner known for consistency. IAEX coordinated the creation of a "gold seal" sample that was signed by both the brand and the factory director, becoming the non-negotiable standard for the entire production run.',
      outcome: 'The brand’s rejection rate dropped from 15% to under 2%. They could finally promise and deliver consistent quality to their customers.'
    },
    {
      client: 'An established export house',
      category: 'Multi-Product Order',
      problem: 'Their European buyer placed an order for woven shirts and knit t-shirts. Their go-to factory was great at shirts but secretly subcontracted the knits to a cheap, non-compliant unit, creating a huge risk.',
      solution: 'IAEX split the order between two specialized partners from our network: a woven expert in NCR and a knit powerhouse in Tirupur. We managed the coordination to ensure consistent branding and a single delivery schedule.',
      outcome: 'Both parts of the order were executed to a high standard. The export house protected its reputation with the buyer and avoided a major compliance issue.'
    },
    {
      client: 'A first-time founder',
      category: 'Sustainable Kids-wear',
      problem: 'She wanted to use GOTS-certified organic cotton but couldn\'t get clear documentation from suppliers. She was worried her sustainability claims wouldn\'t be verifiable.',
      solution: 'We connected her with a vertically-integrated partner in our network who provides GOTS transaction certificates at every stage, from the yarn to the final garment. We managed the entire documentation flow.',
      outcome: 'She launched her brand with a 100% transparent and certified supply chain, giving her a powerful and authentic story to tell her customers.'
    },
    {
      client: 'A mid-sized US retailer',
      category: 'Men\'s Basics',
      problem: 'Their long-term supplier started getting complacent. Communication was poor, lab dip approvals took weeks, and delivery dates kept slipping, causing stockouts on their best-selling items.',
      solution: 'We introduced them to two highly-responsive network partners. We ran a small trial order with both to prove their reliability and communication before the brand felt comfortable shifting the main volume.',
      outcome: 'The brand moved its program to a more proactive partner without disrupting their supply. They now get daily updates and have reduced their lead times by three weeks.'
    },
    {
      client: 'A high-end boutique brand',
      category: 'Premium Dresses',
      problem: 'They needed to produce a complex, small-batch order of 300 dresses. Most large factories refused the order or quoted an extremely high price because the quantity was too low.',
      solution: 'We matched the brand with a smaller, specialized partner in our network that focuses on high-skill, low-volume production. This factory values craftsmanship over massive volume.',
      outcome: 'The brand produced their collection at a viable cost and with exceptional quality, allowing them to serve their niche market profitably.'
    },
    {
      client: 'An online fast-fashion seller',
      category: 'Printed T-Shirts',
      problem: 'Their supplier in Ludhiana delivered a 5,000-piece order where the print color was a completely different shade than the approved sample, making the entire shipment unsellable.',
      solution: 'We moved the re-order to a partner with in-house digital color matching. IAEX implemented a clear, multi-stage approval process: digital, lab dip, and a pre-production sample.',
      outcome: 'The color was matched perfectly. The brand salvaged its season and now has a reliable process to prevent costly color mistakes in the future.'
    },
    {
      client: 'A corporate merchandising company',
      category: 'Promotional Apparel',
      problem: 'Their client needed branded polo shirts and jackets. The factory they used was sourcing fabric from different mills, resulting in polos with varying textures and color fastness.',
      solution: 'IAEX nominated a single, reliable fabric mill for the entire program and coordinated with the garment factory to ensure only this pre-approved fabric was used.',
      outcome: 'All 10,000 polos were perfectly consistent. The merchandising company impressed their corporate client and secured a long-term contract.'
    },
    {
      client: 'An Australian swimwear brand',
      category: 'Swim & Resort Wear',
      problem: 'The brand was struggling with high import duties on specialty recycled nylon fabrics from China, which made their final product too expensive.',
      solution: 'Our network intelligence identified an Indian mill that had recently started producing a comparable high-quality, GRS-certified recycled nylon fabric.',
      outcome: 'By shifting to a domestic fabric source, the brand cut its material costs by 22% and reduced shipping times, making them more competitive.'
    },
    {
      client: 'A workwear supplier',
      category: 'Industrial Uniforms',
      problem: 'Their uniforms needed to meet specific functional standards (e.g., colorfastness to light, tear strength). Their supplier did not have in-house testing and provided unreliable lab reports.',
      solution: 'We connected them to a partner with a fully-equipped in-house testing lab. IAEX helped create a Quality Assurance plan where batch tests were conducted and reports shared weekly.',
      outcome: 'The workwear now consistently meets the required safety and durability standards, protecting the brand from liability and quality claims.'
    },
    {
      client: 'An Amazon FBA seller',
      category: 'Loungewear',
      problem: 'Their manufacturer was not experienced with Amazon\'s strict packaging and labeling requirements, leading to shipments being rejected by FBA warehouses, costing them time and money.',
      solution: 'IAEX provided the factory with a clear, visual guide to the latest FBA requirements and supervised the packing of the first shipment to ensure 100% compliance.',
      outcome: 'Their shipments are now consistently accepted by Amazon without issues, improving their seller rating and ensuring their products are always in stock.'
    }
  ];
}
