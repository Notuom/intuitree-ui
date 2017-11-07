import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {NavItem} from './nav-item';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  navItems: NavItem[] = [
    new NavItem('execution-tree', 'Execution Tree'),
    new NavItem('data-management', 'Data Management')
  ];
  currentNavSlug = '';

  constructor(private router: Router) {
  }

  /**
   * When the Navbar is initiated, subscribe to the router changes so that the active item is kept up-to-date.
   */
  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => this.currentNavSlug = (<NavigationEnd>event).url.split('/')[1]);
  }

}
