import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRouteModule } from './app-route.module';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataService } from './service/data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoComponent } from './info/info.component';
import { TanyaComponent } from './tanya/tanya.component';
import { SettingComponent } from './setting/setting.component';
import { SettingProfilComponent } from './setting-profil/setting-profil.component';
import { SettingListComponent } from './setting-list/setting-list.component';
import { SettingConfigComponent } from './setting-config/setting-config.component';
import { SettingFormComponent } from './setting-form/setting-form.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from './filter.pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { DetailComponent } from './detail/detail.component';
import { FormDaftarComponent } from './form-daftar/form-daftar.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { MapGoogleComponent } from './map-google/map-google.component';
import { AgmCoreModule } from '@agm/core';
import { AboutComponent } from './about/about.component';
import { DaftarUlangComponent } from './daftar-ulang/daftar-ulang.component';
import { SettingListUlangComponent } from './setting-list-ulang/setting-list-ulang.component';
import { SeleksiComponent } from './seleksi/seleksi.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InfoComponent,
    TanyaComponent,
    SettingComponent,
    SettingProfilComponent,
    SettingListComponent,
    SettingConfigComponent,
    SettingFormComponent,
    FilterPipe,
    DetailComponent,
    FormDaftarComponent,
    MapBoxComponent,
    MapGoogleComponent,
    AboutComponent,
    DaftarUlangComponent,
    SettingListUlangComponent,
    SeleksiComponent
  ],
  imports: [
    BrowserModule,
    AppRouteModule,
    // BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FilterPipeModule,
     AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA6yguXT9Axmq4YONkT7flSBv9kqKEv3wY'
      //'AIzaSyC28ORe_2whBFQfSaLB7Kxe4FCoAiCQc5g'
      //AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw
    }),

  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
