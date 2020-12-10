import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  curModule = "mainBrief";

  modules: {
    icon: string,
    label: string,
    url: string
  }[] = [
    {
      icon: "home",
      label: "Home",
      url: "home"
    }
  ];

  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router
  ) {
    this.subscription.add(this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.curModule = event.urlAfterRedirects.split('?')[0].split("/").pop();
      }
    }));
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
