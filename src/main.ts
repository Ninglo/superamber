import { APP_TITLE } from './appMeta';
import './style.css';
import { initApp } from './app';
import { appTemplate } from './template';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('App root not found');
}

document.title = APP_TITLE;
app.innerHTML = appTemplate;
initApp();
