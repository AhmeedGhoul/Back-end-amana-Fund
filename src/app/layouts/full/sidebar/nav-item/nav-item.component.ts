import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NavItem } from './nav-item';
import {Router, RouterModule} from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconComponent, TablerIconsModule } from 'angular-tabler-icons';
import { AuthService } from '../../../../pages/authentication/side-login/auth.service';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule,RouterModule ],
  templateUrl: './nav-item.component.html',
  styleUrls: [],
})
export class AppNavItemComponent implements OnChanges {
  @Output() toggleMobileLink: any = new EventEmitter<void>();
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  //@HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem | any;
  @Input() depth: any;

  constructor(private authService: AuthService,public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnChanges() {
    this.navService.currentUrl.subscribe((url: string) => { });
  }

  onItemSelected(item: NavItem) {
    this.router.navigate([item.route]);

    //scroll
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  canAccess(item: NavItem): boolean {
    const userRoles = this.authService.getCurrentUser()?.roles || [];
    const normalized = userRoles.map(r => r.replace('ROLE_', ''));
    return !item.roles || item.roles.some(role => normalized.includes(role));
  }


  onSubItemSelected(item: NavItem) {

  }
}
