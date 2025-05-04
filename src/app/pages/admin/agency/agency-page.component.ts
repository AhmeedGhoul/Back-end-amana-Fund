import { Component, Input } from '@angular/core';
import { AgencyComponent } from './agency/agency.component';
import { RequestComponent } from './request/request.component';
import { Agency } from './agency/agency.model';  // Update with your correct path
import { Request } from './request/request.model';
import {JsonPipe, NgIf} from "@angular/common";  // Update with your correct path

@Component({
  selector: 'app-agency-page',
  templateUrl: './agency-page.component.html',
  standalone: true,
  imports: [
    AgencyComponent,
    RequestComponent,
    JsonPipe,
    NgIf,
  ],
})
export class AgencyPageComponent {
  selectedAgency: Agency | null = null;
  selectedRequest: Request | null = null;

  onAgencySelectionChanged(agency: Agency) {
    this.selectedAgency = agency;
  }

  onRequestSelectionChanged(request: Request) {
    this.selectedRequest = request;
  }
}
