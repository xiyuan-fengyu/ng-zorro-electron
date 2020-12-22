import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';

// NG Translate
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// ng-zorro
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzMessageModule} from "ng-zorro-antd/message";
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzProgressModule} from "ng-zorro-antd/progress";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IndexComponent} from './page/index/index.component';
import {HomeComponent} from './page/home/home.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, IndexComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    NzLayoutModule,
    NzGridModule,
    NzMenuModule,
    NzFormModule,
    NzMessageModule,
    NzButtonModule,
    NzCheckboxModule,
    NzInputModule,
    NzIconModule,
    NzUploadModule,
    NzCardModule,
    NzListModule,
    NzPaginationModule,
    NzStepsModule,
    NzProgressModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
