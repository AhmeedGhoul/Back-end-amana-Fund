import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-object',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
