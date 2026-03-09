import './style.css';
import { initApp } from './app';
import { appTemplate } from './template';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('App root not found');
}

app.innerHTML = appTemplate;
initApp();
