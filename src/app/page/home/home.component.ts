import {Component, OnInit, ViewChild} from '@angular/core';
import {ElectronService} from "../../service/electron.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzProgressComponent} from "ng-zorro-antd/progress";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public progressInfo = {
    percent: 0,
    status: "active"
  };

  @ViewChild("theProgress") set theProgress(ele: NzProgressComponent) {
    if (!ele["_forceRefresh"]) {
      ele["_forceRefresh"] = setInterval(() => {
        // 触发progress强制更新（NzProgressComponent有bug，很可能不会刷新）
        ele.nzPercent = this.progressInfo.percent;
        ele.nzStatus = this.progressInfo.status as ("active" | "success");
      }, 100);
      ele.ngOnDestroy = () => {
        clearInterval(ele["_forceRefresh"]);
      };
    }
  }

  constructor(
    private electronService: ElectronService,
    private messageService: NzMessageService
  ) {

  }

  async test(msg: string, notifyProgress?: boolean) {
    if (notifyProgress) {
      this.progressInfo.percent = 0;
      this.progressInfo.status = "active";
    }
    const res = await this.electronService.ipcCall("test", msg, notifyProgress ? progress => {
      this.progressInfo.percent = progress;
    } : null);
    this.progressInfo.status = "success";
    this.messageService.create("success", res);
  }

  async ngOnInit() {
  }

}
