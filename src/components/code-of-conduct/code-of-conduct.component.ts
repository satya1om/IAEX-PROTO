import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ConductPoint {
  title: string;
  content: string;
}

interface ConductSection {
  icon: string;
  title: string;
  points: ConductPoint[];
}

@Component({
  selector: 'app-code-of-conduct',
  templateUrl: './code-of-conduct.component.html',
  imports: [RouterLink, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeOfConductComponent {
  openSection = signal<number | null>(0);

  toggleSection(index: number): void {
    this.openSection.update(current => (current === index ? null : index));
  }

  sections: ConductSection[] = [
    {
      icon: 'fa-solid fa-scale-balanced',
      title: 'Legal and Ethical Framework',
      points: [
        {
          title: '1.1. Compliance with Laws',
          content: 'Partners must operate in full compliance with all applicable national, state, and local laws and regulations of the jurisdictions in which they operate. This includes, but is not limited to, laws related to labor, environmental protection, health and safety, and taxation. Where there is a difference between the provisions of this Code and local law, the stricter standard shall apply.'
        },
        {
          title: '1.2. Anti-Corruption and Bribery',
          content: 'Partners must conduct their business with the highest level of integrity. Any and all forms of bribery, corruption, extortion, and embezzlement are strictly prohibited. This includes offering, paying, soliciting, or accepting bribes or other improper advantages to or from any person, including public officials, clients, or other business partners. Partners must maintain transparent and accurate books and records that reflect all business transactions.'
        },
        {
          title: '1.3. Transparency and Business Integrity',
          content: 'Partners must be transparent in their business practices. They must not falsify records or misrepresent information regarding their operations, compliance, or performance to IAEX, its clients, or auditors. Full cooperation and access to facilities, records, and workers for announced and unannounced monitoring activities are required.'
        }
      ]
    },
    {
      icon: 'fa-solid fa-users',
      title: 'Labour Standards and Human Rights',
      points: [
        {
          title: '2.1. No Forced, Bonded, or Involuntary Labour',
          content: 'The use of forced, bonded, indentured, or involuntary prison labor is strictly prohibited. All work must be voluntary, and workers shall be free to leave work at any time or terminate their employment with reasonable notice. Partners must not retain workers\' government-issued identification, passports, or work permits as a condition of employment. All recruitment fees and related costs must be borne by the Partner, not the worker.'
        },
        {
          title: '2.2. No Child Labour',
          content: 'Partners shall not employ any person under the age of 15, or under the age for completion of compulsory education, or under the minimum age for employment in the country, whichever is greatest. Robust age-verification procedures must be in place. If a child worker is found, the Partner must immediately implement a remediation plan that prioritizes the child\'s best interests, including providing for their education.'
        },
        {
          title: '2.3. No Discrimination',
          content: 'Partners must ensure that all employment-related decisions—including hiring, compensation, access to training, promotion, termination, and retirement—are based on an individual\'s skills, performance, and ability to do the job. No person shall be subject to any discrimination in employment based on race, color, nationality, religion, age, gender, gender identity, sexual orientation, marital status, disability, political opinion, or social or ethnic origin.'
        },
        {
          title: '2.4. No Harassment, Abuse, or Inhumane Treatment',
          content: 'Every worker shall be treated with respect and dignity. Partners must have a zero-tolerance policy for any form of physical, sexual, psychological, or verbal harassment or abuse. Corporal punishment or any form of coercion is strictly prohibited. Disciplinary procedures must be clearly defined, communicated to all workers, and must not violate workers\' fundamental rights.'
        },
        {
          title: '2.5. Freedom of Association and Collective Bargaining',
          content: 'Partners must respect the right of workers to form and join trade unions of their own choosing and to bargain collectively, in accordance with local laws. Where the right to freedom of association and collective bargaining is restricted under law, Partners must facilitate, and not hinder, the development of parallel means for independent and free association and bargaining. Workers\' representatives must not be discriminated against and must have access to carry out their representative functions in the workplace.'
        }
      ]
    },
    {
      icon: 'fa-solid fa-money-bill-wave',
      title: 'Wages, Benefits, and Working Hours',
      points: [
        {
          title: '3.1. Fair Wages and Benefits',
          content: 'Partners must ensure that wages paid for a standard working week meet at least the legal minimum wage or the prevailing industry wage, whichever is higher. All legally mandated benefits, such as social insurance, paid leave, and other allowances, must be provided to all workers. Wages must be paid in a timely manner, and all workers must be provided with a clear and understandable wage slip for each pay period. Deductions from wages not provided for by national law shall not be permitted without the express permission of the worker concerned.'
        },
        {
          title: '3.2. Regular Working Hours',
          content: 'A standard work week, exclusive of overtime, shall be defined by local law but shall not exceed 48 hours. Workers must be provided with at least one day off in every seven-day period. All working hours must be accurately recorded using a reliable time-keeping system.'
        },
        {
          title: '3.3. Overtime Compensation and Limits',
          content: 'Overtime work must be voluntary, infrequent, and compensated at a premium rate as required by law, and not less than 125% of the regular rate. The total hours worked in any seven-day period shall not exceed 60 hours, except in exceptional circumstances where allowed by national law. In such cases, it must be consensual and must not compromise worker safety.'
        }
      ]
    },
    {
      icon: 'fa-solid fa-helmet-safety',
      title: 'Occupational Health and Safety (OHS)',
      points: [
        {
          title: '4.1. Safe and Healthy Working Environment',
          content: 'Partners must provide a safe, clean, and hygienic working environment. Adequate steps shall be taken to prevent accidents and injury to health arising out of, associated with, or occurring in the course of work, by minimizing, so far as is reasonably practicable, the causes of hazards inherent in the working environment. This includes providing access to clean toilet facilities and to potable water.'
        },
        {
          title: '4.2. Emergency Preparedness',
          content: 'Partners must have effective plans and systems in place to respond to emergencies. This includes clearly marked and unobstructed emergency exits, fire extinguishers, first-aid kits, and trained first-aid personnel. Regular fire and evacuation drills must be conducted for all workers on all shifts.'
        },
        {
          title: '4.3. Building and Fire Safety',
          content: 'All facilities must be structurally sound and comply with all applicable building and fire safety codes. Valid structural, fire, and electrical safety certificates must be available for inspection. Aisles, exits, and stairways must be kept clear of obstructions at all times.'
        },
        {
          title: '4.4. Machinery and Electrical Safety',
          content: 'All machinery must be regularly maintained and fitted with appropriate safety devices, such as belt guards and needle guards. Electrical systems must be properly installed and maintained by qualified personnel to prevent hazards. Workers must receive adequate training on the safe operation of all machinery they use.'
        },
        {
          title: '4.5. Use of Personal Protective Equipment (PPE)',
          content: 'Workers must be provided with appropriate and effective PPE free of charge wherever required (e.g., gloves, masks, eye protection). Workers must be trained on the correct use and maintenance of their PPE.'
        },
        {
          title: '4.6. Worker Accommodation',
          content: 'If a Partner provides housing for workers, such facilities must be clean, safe, and meet the basic needs of the workers. This includes providing a separate bed for each worker, adequate sanitation and bathing facilities, and ensuring dormitories are not overcrowded and have adequate ventilation and fire safety measures.'
        }
      ]
    },
    {
      icon: 'fa-solid fa-leaf',
      title: 'Environmental Responsibility',
      points: [
        {
          title: '5.1. Environmental Permits and Compliance',
          content: 'Partners must have all necessary environmental permits, licenses, and registrations required for their operations. They must comply with all applicable environmental laws and regulations, including those related to emissions, effluents, and waste disposal.'
        },
        {
          title: '5.2. Waste Management',
          content: 'Partners must have a systematic approach to managing waste. This includes minimizing waste generation at the source, segregating waste for recycling, and ensuring that all waste, especially hazardous waste, is stored and disposed of responsibly and in accordance with legal requirements.'
        },
        {
          title: '5.3. Water Management',
          content: 'Partners are expected to manage their water consumption efficiently. All wastewater must be treated in a functional Effluent Treatment Plant (ETP) to meet legal standards before being discharged. A commitment to water-saving technologies and processes is strongly encouraged.'
        },
        {
          title: '5.4. Energy Consumption and GHG Emissions',
          content: 'Partners must monitor and take steps to reduce their energy consumption. We encourage partners to measure their greenhouse gas (GHG) emissions and set targets for reduction. Investment in energy efficiency and renewable energy sources is a key indicator of a forward-thinking, sustainable partner.'
        },
        {
          title: '5.5. Chemical Management',
          content: 'Partners must have a robust system for managing chemicals safely. This includes proper labeling, safe storage with secondary containment, maintaining a chemical inventory, and ensuring workers are trained on safe handling. A Manufacturer\'s Restricted Substances List (MRSL) must be in place to prevent hazardous chemicals from entering the production process, in line with global standards such as ZDHC.'
        }
      ]
    },
    {
      icon: 'fa-solid fa-sitemap',
      title: 'Supply Chain Management and Transparency',
      points: [
        {
          title: '6.1. Subcontracting',
          content: 'Any use of subcontractors for manufacturing processes must be declared to IAEX and the client brand in advance. All subcontractors must also adhere to this Code of Conduct, and the primary Partner is responsible for ensuring their compliance.'
        },
        {
          title: '6.2. Raw Material Sourcing',
          content: 'Partners are encouraged to source raw materials from suppliers who share a commitment to social and environmental responsibility. Policies must be in place to ensure that no materials are sourced from regions associated with conflict or severe human rights abuses.'
        },
        {
          title: '6.3. Traceability',
          content: 'Partners must be able to demonstrate traceability of their products and raw materials. This requires maintaining accurate records that allow for the verification of the origin of key materials and the production history of a given order.'
        }
      ]
    },
    {
      icon: 'fa-solid fa-paw',
      title: 'Animal Welfare',
      points: [
        {
          title: '7.1. Humane Treatment of Animals',
          content: 'Where animal-derived materials (e.g., wool, leather, down) are used, Partners must ensure they originate from sources that adhere to recognized animal welfare standards regarding the humane treatment, transport, and slaughter of animals.'
        }
      ]
    },
    {
      icon: 'fa-solid fa-chart-line',
      title: 'Monitoring and Continuous Improvement',
      points: [
        {
          title: '8.1. Access for Monitoring',
          content: 'Partners must grant IAEX representatives and our client brands\' representatives (or their designated third-party auditors) full access to all facilities, records, and workers for the purpose of monitoring compliance with this Code. Both announced and unannounced visits may be conducted.'
        },
        {
          title: '8.2. Corrective Action Plans',
          content: 'In the event of non-compliance, the Partner will be required to develop and implement a time-bound Corrective Action Plan (CAP). IAEX is committed to working with Partners who demonstrate a genuine commitment to remediation and improvement.'
        },
        {
          title: '8.3. Record Keeping',
          content: 'Partners must maintain accurate and complete records to demonstrate compliance with this Code and applicable laws. This includes, but is not limited to, records of worker ages, wages paid, hours worked, and environmental permits.'
        },
        {
          title: '8.4. Continuous Improvement',
          content: 'Compliance with this Code is the minimum standard. We seek partners who view these principles not as a ceiling, but as a foundation upon which to build a culture of continuous improvement in social, environmental, and ethical performance.'
        }
      ]
    }
  ];
}
