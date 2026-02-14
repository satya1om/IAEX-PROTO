import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ServicesComponent } from './components/services/services.component';
import { ModelComponent } from './components/model/model.component';
import { ProcessComponent } from './components/process/process.component';
import { ContactComponent } from './components/contact/contact.component';
import { CaseStudiesComponent } from './components/case-studies/case-studies.component';
import { InsightsComponent } from './components/insights/insights.component';
import { PartnersComponent } from './components/partners/partners.component';
import { InsightDetailComponent } from './components/insight-detail/insight-detail.component';
import { CodeOfConductComponent } from './components/code-of-conduct/code-of-conduct.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, title: 'IAEX Network | Home' },
  { path: 'about', component: AboutComponent, title: 'IAEX Network | Who We Are' },
  { path: 'execution', component: ServicesComponent, title: 'IAEX Network | Execution Framework' },
  { path: 'model', component: ModelComponent, title: 'IAEX Network | Our Model' },
  { path: 'process', component: ProcessComponent, title: 'IAEX Network | Process & Value' },
  { path: 'case-studies', component: CaseStudiesComponent, title: 'IAEX Network | Case Studies' },
  { path: 'insights', component: InsightsComponent, title: 'IAEX Network | Insights' },
  { path: 'insights/:slug', component: InsightDetailComponent }, // Dynamic title set in component
  { path: 'partners', component: PartnersComponent, title: 'IAEX Network | Partner With Us' },
  { path: 'code-of-conduct', component: CodeOfConductComponent, title: 'IAEX Network | Code of Conduct' },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, title: 'IAEX Network | Privacy Policy' },
  { path: 'contact', component: ContactComponent, title: 'IAEX Network | Contact' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
