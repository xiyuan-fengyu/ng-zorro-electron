import { Component, OnInit } from '@angular/core';
import {ElectronService} from "../../service/electron.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private electronService: ElectronService
  ) {

  }

  async ngOnInit() {
    console.log("test");
    const res0 = await this.electronService.ipcCall("test", "hi");
    console.log(res0);

    console.log("test with notify");
    // the notify callback must be the last parameter of ipcCall
    const res1 = await this.electronService.ipcCall("test", "hello", progress => {
      console.log("progress: " + progress);
    });
    console.log(res1);
  }

}
