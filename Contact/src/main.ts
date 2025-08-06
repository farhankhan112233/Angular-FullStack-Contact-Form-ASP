import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/Config/app.config';
import { App } from './app/App Component/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
