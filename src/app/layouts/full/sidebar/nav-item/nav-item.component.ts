import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { NavItem } from './nav-item';
import {Router, RouterModule} from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconComponent, TablerIconsModule } from 'angular-tabler-icons';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule,RouterModule ],
  templateUrl: './nav-item.component.html',
  styles: [`
    .arrow-icon {
      transition: transform 0.3s ease;
    }
    .rotate {
      transform: rotate(180deg);
    }
    .sub-menu {
      margin-left: 20px;
    }
    .menu-list-item {
      padding: 8px 16px;
    }
    .mat-list-item {
      border-radius: 8px;
      margin: 4px 0;
    }
    .mat-list-item:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class AppNavItemComponent implements OnChanges {
  @Output() toggleMobileLink: any = new EventEmitter<void>();
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() item: NavItem | any;
  @Input() depth: any;
  expanded = false;

  constructor(
    public navService: NavService, 
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnChanges() {
    this.navService.currentUrl.subscribe((url: string) => { });
  }

  onItemSelected(item: NavItem) {
    if (item.children && !item.route) {
      this.expanded = !this.expanded;
      this.cdr.detectChanges();
    } else {
      this.router.navigate([item.route]);
      //scroll
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  onSubItemSelected(item: NavItem) {
    this.router.navigate([item.route]);
  }

  onExpansionChange(event: boolean) {
    this.expanded = event;
    this.cdr.detectChanges();
  }
}
