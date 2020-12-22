import {Injectable} from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer, remote, webFrame} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;

  get isElectron(): boolean {
    return !!(window && (window as any).process && (window as any).process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      const electron = (window as any).require('electron');
      this.ipcRenderer = electron.ipcRenderer;
      this.webFrame = electron.webFrame;
      // If you wan to use remote object, pleanse set enableRemoteModule to true in main.ts
      this.remote = electron.remote;
      this.childProcess = (window as any).require('child_process');
      this.fs = (window as any).require('fs');
      this.path = (window as any).require('path');

      this.initIpcRender();
    }
  }

  // {[invokeId: string]: [notify, resolve, reject]}
  private ipcInvokes: {[invokeId: string]: [any, any, any]} = {};

  private initIpcRender() {
    this.ipcRenderer.on("ipcInvokeRes", (event, ...args) => {
      const invokeId = args[0];
      const success = args[1];
      const resOrMsg = args[2];
      const notifyResolveReject = this.ipcInvokes[invokeId];
      if (notifyResolveReject) {
        delete this.ipcInvokes[invokeId];
        if (success) {
          notifyResolveReject[1](resOrMsg);
        }
        else {
          notifyResolveReject[2](new Error(resOrMsg));
        }
      }
    });
    this.ipcRenderer.on("ipcInvokeNotify", (event, ...args) => {
      // console.log(`ipcInvokeNotify: ${args}`);
      const invokeId = args[0];
      const notifyArgs = args.slice(1);
      const notifyResolveReject = this.ipcInvokes[invokeId];
      if (notifyResolveReject && typeof notifyResolveReject[0] == "function") {
        notifyResolveReject[0](...notifyArgs);
      }
    });
  }

  private ipcCallId = [0, 0];

  public async ipcCall(method: string, ...args) {
    if (!this.isElectron) {
      throw new Error("must call in electron model");
    }

    const now = new Date().getDate();
    if (this.ipcCallId[0] == now) {
      this.ipcCallId[1]++;
    }
    else {
      this.ipcCallId[0] = now;
      this.ipcCallId[1] = 0;
    }

    const notify = typeof args[args.length - 1] == "function" ? args.splice(args.length - 1, 1)[0] : null;
    const invokeId = this.ipcCallId[0] + "_" + this.ipcCallId[1] + (notify ? "_n" : "");
    const notifyResolveReject: any = [notify, null, null];
    this.ipcInvokes[invokeId] = notifyResolveReject;
    this.ipcRenderer.send("ipcInvoke", invokeId, method, ...args);
    return new Promise<any>((resolve, reject) => {
      notifyResolveReject[1] = resolve;
      notifyResolveReject[2] = reject;
    });
  }

}
