import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/App Component/app';
import { config } from './app/Config/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
