import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Pangoloons';
  env = environment;
  navClass = environment.production ? 'app-toolbar' : 'app-preprod-toolbar';
  version = environment.version;
  isProduction = environment.production;
  backendServer = environment.backendServer;
}
