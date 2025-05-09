import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {

  constructor(private location: Location) {}

  goHome(): void {
    // Navigate back to the previous page in the browser history
    this.location.back();
  }
}
