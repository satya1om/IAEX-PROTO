import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface PolicySection {
  id: string;
  title: string;
  content: string; // Content can be HTML
}

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  imports: [RouterLink, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyComponent {
  policySections: PolicySection[] = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: `
        <p>This Privacy Policy outlines the practices of IAEX Network ("we," "us," or "our") concerning the collection, use, and disclosure of personal information through our website and associated services (collectively, the "Service"). This policy is drafted to ensure compliance with major international data protection regulations, including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), China's Personal Information Protection Law (PIPL), and India's Digital Personal Data Protection Act (DPDP Act).</p>
        <p>Accessing or using the Service constitutes your agreement to the terms of this Privacy Policy. If you do not agree with these terms, you are prohibited from using or accessing the Service.</p>
      `
    },
    {
      id: 'information-we-collect',
      title: '2. Information We Collect',
      content: `
        <p>We collect personal information that you provide to us directly and information that is automatically generated through your use of the Service.</p>
        <h3>2.1. Information You Provide Voluntarily</h3>
        <p>We collect personally identifiable information when you voluntarily provide it, such as when you submit a contact form or otherwise communicate with us. This information may include:</p>
        <ul>
          <li>Full Name</li>
          <li>Email Address</li>
          <li>Telephone Number</li>
          <li>Company Name and Job Title</li>
          <li>Any other information you elect to provide.</li>
        </ul>
        <h3>2.2. Information Collected Automatically</h3>
        <p>When you access the Service, we may automatically collect certain information about your device and usage patterns. This information is primarily for the purposes of maintaining the security and operation of our Service, and for internal analytics. This information may include:</p>
        <ul>
          <li><strong>Log and Usage Data:</strong> Internet Protocol (IP) address, browser type and version, operating system, referring URLs, pages viewed, and access timestamps.</li>
          <li><strong>Device Data:</strong> Information about the device used to access the Service, such as its hardware model and operating system.</li>
        </ul>
      `
    },
    {
      id: 'data-controller',
      title: '3. Our Role as Data Controller',
      content: `
        <p>For the purposes of the General Data Protection Regulation (GDPR) and other applicable data protection laws, IAEX Network is the "Data Controller" of the personal information you provide to us through the Service. This means we are responsible for deciding how we hold and use personal information about you.</p>
      `
    },
    {
      id: 'how-we-use-information',
      title: '4. Use of Information and Lawful Basis for Processing',
      content: `
        <p>We process collected information for various business purposes, relying on several lawful bases for processing as stipulated by applicable regulations such as the GDPR.</p>
        <ul>
          <li><strong>To Provide and Maintain the Service:</strong> Processing is based on our legitimate interest to operate our website effectively.</li>
          <li><strong>To Respond to Inquiries:</strong> Processing is based on your consent when you contact us and our legitimate interest in providing customer service.</li>
          <li><strong>For Marketing Communications:</strong> Processing is based on your explicit consent. You retain the right to opt-out of such communications at any time.</li>
          <li><strong>To Improve the Service:</strong> Processing is based on our legitimate interest to develop our business by analyzing usage data to identify trends and improve user experience.</li>
          <li><strong>For Legal and Security Purposes:</strong> Processing is necessary for compliance with our legal obligations, the resolution of disputes, and the enforcement of our agreements.</li>
        </ul>
      `
    },
    {
      id: 'information-sharing',
      title: '5. Disclosure of Information',
      content: `
        <p>We do not sell personal information. We may disclose your information in the following situations:</p>
        <ul>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with trusted third-party vendors, consultants, and other service providers who perform services for us or on our behalf and require access to such information to do that work. These parties are contractually obligated to safeguard your data and are prohibited from using it for any other purpose.</li>
            <li><strong>By Law or to Protect Rights:</strong> We may disclose your information where we are legally required to do so to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.</li>
        </ul>
      `
    },
    {
      id: 'cookies',
      title: '6. Cookies and Tracking Technologies',
      content: `
        <p>We may use cookies and similar tracking technologies to access or store information. A cookie is a small data file stored on your device. We use cookies to operate our site and for analytics purposes. Our website may use:</p>
        <ul>
            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be deactivated in our systems.</li>
            <li><strong>Performance and Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources to measure and improve the performance of our site.</li>
        </ul>
        <p>You may control and manage cookies through your browser settings. Please be aware that removing or blocking cookies may adversely affect your user experience and the functionality of the Service.</p>
      `
    },
    {
      id: 'third-party-websites',
      title: '7. Third-Party Websites',
      content: `
        <p>The Service may contain links to third-party websites and applications of interest that are not affiliated with us. Once you have used these links to leave our Service, any information you provide to these third parties is not covered by this Privacy Policy. We are not responsible for the content or privacy and security practices and policies of any third parties, including other sites, services, or applications that may be linked to or from the Service.</p>
      `
    },
    {
      id: 'international-transfers',
      title: '8. International Data Transfers',
      content: `
        <p>Your information, including personal data, may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ from those in your jurisdiction. Our primary operations are based in India.</p>
        <p>If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, your data may be transferred outside these regions. We will take all necessary steps to ensure that your data is treated securely and in accordance with this Privacy Policy. Such transfers will be conducted using legally-provided mechanisms, such as adequacy decisions or Standard Contractual Clauses (SCCs).</p>
      `
    },
    {
      id: 'do-not-track',
      title: '9. "Do Not Track" Policy',
      content: `
        <p>Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this time, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.</p>
      `
    },
    {
      id: 'security-retention',
      title: '10. Data Security, Retention, and Breach Procedures',
      content: `
        <h3>10.1. Data Security</h3>
        <p>We employ administrative, technical, and physical security measures designed to protect your personal information. While we have taken reasonable steps to secure the personal information you provide, no security measures are infallible, and no method of data transmission can be guaranteed against interception or misuse.</p>
        <h3>10.2. Data Retention</h3>
        <p>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by law. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.</p>
        <h3>10.3. Data Breach Procedures</h3>
        <p>In the event of a data breach that is likely to result in a high risk to the rights and freedoms of individuals, we will take immediate steps to contain and investigate the breach. We will notify the appropriate supervisory authority without undue delay, and where feasible, within 72 hours of becoming aware of it. If the breach is likely to result in a high risk to your rights and freedoms, we will also communicate the breach to you without undue delay, outlining the nature of the breach, the likely consequences, and the measures we have taken to address it.</p>
      `
    },
    {
      id: 'your-rights',
      title: '11. Your Data Protection Rights',
      content: `
        <p>Depending on your geographical location and applicable law, you may have the following rights regarding your personal information:</p>
        <ul>
          <li><strong>The right to access</strong> – The right to request copies of your personal data.</li>
          <li><strong>The right to rectification</strong> – The right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
          <li><strong>The right to erasure (Right to be Forgotten)</strong> – The right to request the erasure of your personal data, under certain conditions.</li>
          <li><strong>The right to restrict processing</strong> – The right to request that we restrict the processing of your personal data, under certain conditions.</li>
          <li><strong>The right to object to processing</strong> – The right to object to our processing of your personal data, under certain conditions.</li>
          <li><strong>The right to data portability</strong> – The right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
        </ul>
        <p>To exercise any of these rights, please contact us using the information provided in Section 16.</p>
      `
    },
    {
      id: 'region-specific',
      title: '12. Region-Specific Disclosures',
      content: `
        <h3>12.1. For Residents of the EEA, UK, and Switzerland</h3>
        <p>If you are a resident of the European Economic Area (EEA), the United Kingdom, or Switzerland, you are afforded certain data protection rights under the General Data Protection Regulation (GDPR). The legal bases for collecting and using the personal information described in this Privacy Policy are detailed in Section 4. You have the right to lodge a complaint with a Data Protection Authority regarding our collection and use of your Personal Data.</p>
        <h3>12.2. For Residents of California (USA)</h3>
        <p>This section supplements the information in our Privacy Policy and applies solely to residents of California. We adopt this notice to comply with the California Consumer Privacy Act of 2018 (CCPA). You have the right to: (a) know what personal information is being collected about you; (b) know whether your personal information is sold or disclosed and to whom; (c) say no to the sale of personal information (opt-out); (d) access your personal information; (e) request deletion of your personal information; and (f) not be discriminated against for exercising your privacy rights. We do not "sell" personal information as defined by the CCPA. To exercise your rights, please contact us.</p>
        <h3>12.3. For Residents of India</h3>
        <p>If you are a resident of India, your data is processed in accordance with the Digital Personal Data Protection Act (DPDP Act). We act as a Data Fiduciary for the personal data we collect. You have the right to access, correct, and request erasure of your data as provided under the Act. You may exercise these rights by contacting our Grievance Officer as detailed in Section 16.</p>
        <h3>12.4. For Residents of China</h3>
        <p>If you are a resident of the People's Republic of China, we will process your data in accordance with the Personal Information Protection Law (PIPL). We will obtain your separate consent for processing sensitive personal information and for any cross-border data transfers. You have rights to access, copy, correct, and delete your personal information. To exercise these rights, please contact us.</p>
      `
    },
    {
      id: 'childrens-privacy',
      title: "13. Children's Privacy",
      content: `
        <p>Our Service is not directed to anyone under the age of 16 ("Children"). We do not knowingly collect personally identifiable information from Children. If you are a parent or guardian and are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from Children without verification of parental consent, we will take steps to remove that information from our servers.</p>
      `
    },
     {
      id: 'governing-law',
      title: '14. Governing Law and Jurisdiction',
      content: `
        <p>This Privacy Policy and any disputes related thereto shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts located in New Delhi, India for the resolution of any disputes arising out of or relating to this Privacy Policy or your use of the Service.</p>
      `
    },
    {
      id: 'policy-changes',
      title: '15. Amendments to This Policy',
      content: `
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
      `
    },
    {
      id: 'contact-us',
      title: '16. Contact Information',
      content: '' // Content is now handled directly in the template
    }
  ];
}
