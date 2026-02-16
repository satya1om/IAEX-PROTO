import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit, OnDestroy {
  private readonly fb: FormBuilder;
  private readonly route = inject(ActivatedRoute);
  private routeSub!: Subscription;

  activePathway = signal<'brands' | 'partners' | 'direct' | null>(null);

  brandForm!: FormGroup;
  partnerForm!: FormGroup;
  directForm!: FormGroup;

  captchaNum1 = signal(0);
  captchaNum2 = signal(0);
  submissionStatus = signal<'idle' | 'generating' | 'success' | 'error' | 'invalidCaptcha'>('idle');
  aiResponse = signal<string | null>(null);

  productCategories = ['Technical/Performance Wear', 'Knitwear (T-shirts, Fleece)', 'Woven (Shirts, Trousers)', 'Denim & Washed Goods', 'Kids Wear', 'Other'];
  annualVolumes = ['Under 100k units', '100k - 500k units', '500k - 1M units', 'Over 1M units'];
  partnershipTypes = ['Manufacturing Partner', 'Sourcing Alliance Partner'];
  directInquiryPurposes = ['Media Inquiry', 'Investment Inquiry', 'Strategic Inquiry', 'Other'];

  physicalPresence = {
    address: 'Plot No. 26, First Floor, BLS, Block A-1,<br>Mohan Garden, New Delhi, 110059 | India'
  };

  constructor() {
    this.fb = inject(FormBuilder);
  }

  ngOnInit(): void {
    this.initForms();
    this.generateCaptcha();

    this.routeSub = this.route.queryParamMap.subscribe(params => {
      const pathway = params.get('pathway');
      if (pathway === 'brands' || pathway === 'partners' || pathway === 'direct') {
        this.setPathway(pathway as 'brands' | 'partners' | 'direct');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  initForms(): void {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      productCategory: ['', Validators.required],
      annualVolume: ['', Validators.required],
      message: ['', Validators.required],
      captcha: ['', Validators.required],
    });

    this.partnerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: ['', Validators.required],
      partnershipType: ['', Validators.required],
      specialization: ['', Validators.required],
      website: [''],
      captcha: ['', Validators.required],
    });

    this.directForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      purpose: ['', Validators.required],
      message: ['', Validators.required],
      captcha: ['', Validators.required],
    });
  }

  setPathway(pathway: 'brands' | 'partners' | 'direct' | null): void {
    this.activePathway.set(pathway);
    this.submissionStatus.set('idle');
    this.aiResponse.set(null);
    if (pathway) {
      this.generateCaptcha();
    }
  }

  getCurrentForm(): FormGroup {
    const pathway = this.activePathway();
    if (pathway === 'brands') return this.brandForm;
    if (pathway === 'partners') return this.partnerForm;
    if (pathway === 'direct') return this.directForm;
    return new FormGroup({});
  }

  generateCaptcha(): void {
    this.captchaNum1.set(Math.floor(Math.random() * 10) + 1);
    this.captchaNum2.set(Math.floor(Math.random() * 10) + 1);
  }

  async onSubmit(): Promise<void> {
    const form = this.getCurrentForm();
    form.markAllAsTouched();
    this.submissionStatus.set('idle');

    if (form.invalid) {
      this.submissionStatus.set('error');
      return;
    }

    const captchaAnswer = form.get('captcha')?.value;
    const correctAnswer = this.captchaNum1() + this.captchaNum2();

    if (parseInt(captchaAnswer, 10) !== correctAnswer) {
      this.submissionStatus.set('invalidCaptcha');
      form.get('captcha')?.reset();
      this.generateCaptcha();
      return;
    }

    this.submissionStatus.set('generating');

    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `IAEX-${month}${day}-${randomDigits}`;
    const prompt = this.buildAIPrompt(form.value, referenceNumber);

    try {
      const response = await fetch('/api.php?action=ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const output = (payload.output || 'Request received. Our team will get back to you shortly.') as string;
      const formattedResponse = output
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

      this.aiResponse.set(formattedResponse);
      this.submissionStatus.set('success');
    } catch (e) {
      console.error('Error generating response:', e);
      this.submissionStatus.set('error');
      this.aiResponse.set('There was an issue processing your request. Please try again later.');
    }
  }

  buildAIPrompt(formData: any, referenceNumber: string): string {
    const pathway = this.activePathway();
    let inquiryDetails = '';

    if (pathway === 'brands') {
      inquiryDetails = `
- **Inquiry Type:** Brand Sourcing Program
- **Product Category:** ${formData.productCategory}
- **Annual Volume:** ${formData.annualVolume}
- **Message:** ${formData.message}`;
    } else if (pathway === 'partners') {
      inquiryDetails = `
- **Inquiry Type:** Partnership Application
- **Partnership Type:** ${formData.partnershipType}
- **Core Specialization:** ${formData.specialization}
- **Website:** ${formData.website || 'Not specified'}`;
    } else {
      inquiryDetails = `
- **Inquiry Type:** Direct Dialogue
- **Purpose:** ${formData.purpose}
- **Message:** ${formData.message}`;
    }

    return `You are the assistant for IAEX Network. A user has submitted an inquiry.

**User Details:**
- **Name:** ${formData.name}
- **Company:** ${formData.company || 'Not specified'}
- **Reference Number:** ${referenceNumber}

**Inquiry Specifics:**${inquiryDetails}

Generate a concise professional acknowledgement confirming receipt and expected response within one business day.`;
  }

  isInvalid(controlName: string): boolean {
    const control = this.getCurrentForm().get(controlName);
    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.getCurrentForm().get(controlName);
    if (control?.hasError('required')) return 'This field is required.';
    if (control?.hasError('email')) return 'Please enter a valid email address.';
    return '';
  }

  resetForm(): void {
    this.activePathway.set(null);
    this.submissionStatus.set('idle');
    this.aiResponse.set(null);
    this.brandForm.reset();
    this.partnerForm.reset();
    this.directForm.reset();
  }
}
