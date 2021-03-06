import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ComponentsModule } from './components/components.module';
import { ComponentService } from './components/components.service';
import { SocketService } from './components/socketio.service';
import { GlobalShare } from './global.share';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    ComponentsModule,
    GlobalShare,
  ],
  providers: [
    ComponentService,
    SocketService
  ],
  bootstrap: [
    AppComponent
   ]
})

export class AppModule { }
