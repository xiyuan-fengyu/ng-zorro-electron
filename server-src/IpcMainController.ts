import {ipcMain} from 'electron';

/**
 * server-src 中要使用npm上的第三方依赖包，需要在 package.json 的 dependencies 下添加依赖，注意不是 devDependencies
 */
export class IpcMainController {

  private static inited = false;

  static init() {
    if (!this.inited) {
      this.inited = true;
      ipcMain.on("ipcInvoke", async (event, ...args) => {
        const invokeId = args[0];
        const methodName = args[1];
        const invokeArgs = args.slice(2);
        // console.log(`ipcInvoke: ${invokeId}, ${methodName}, ${invokeArgs}`);

        const method = IpcMainController[methodName];
        if (typeof method == "function") {
          try {
            const notify = invokeId.endsWith("_n") ? (...args) => {
              // console.log(`ipcInvokeNotify: ${invokeId}, ${args}`);
              event.reply("ipcInvokeNotify", invokeId, ...args);
            } : null;
            const res = await method.call(IpcMainController, ...invokeArgs, notify);
            event.reply("ipcInvokeRes", invokeId, true, res);
          }
          catch (e) {
            event.reply("ipcInvokeRes", invokeId, false, e.message);
          }
        }
        else {
          event.reply("ipcInvokeRes", invokeId, false, "bad ipc invoke, method not found");
        }
      });
    }
  }

  static async test(msg: string, notify?: (progress: number) => void) {
    for (let i = 1; i <= 100; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      notify && notify(i);
    }
    return `test${notify ? " with notify" : ""} finished, server received your message: ${msg}`;
  }

}
