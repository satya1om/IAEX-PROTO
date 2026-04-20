import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ContactPayload {
  pathway: 'brands' | 'partners' | 'direct';
  referenceNumber: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  details: Record<string, string>;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  referenceNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  async getCsrfToken(): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<{ token: string }>('./api.php?action=csrf')
    );

    return response.token;
  }

  async submitContact(payload: ContactPayload, csrfToken: string): Promise<ContactResponse> {
    return firstValueFrom(
      this.http.post<ContactResponse>('./api.php?action=contact', {
        ...payload,
        csrf_token: csrfToken
      })
    );
  }
}
