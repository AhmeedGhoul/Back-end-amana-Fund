import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

// This module is used to organize and re-export standalone components
@NgModule({
  imports: [
    CommonModule,
    // Import standalone components
    TimeAgoPipe
  ],
  exports: [
    // Re-export standalone components
    TimeAgoPipe
  ]
})
export class SharedModule { }
