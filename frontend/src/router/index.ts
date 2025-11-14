import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SessionView from '../views/SessionView.vue';
import ReliefPrototype from '../views/ReliefPrototype.vue';
import ThankYouView from '../views/ThankYouView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: 'session' }
    },
    {
      path: '/home',
      name: 'home-preview',
      component: HomeView
    },
    {
      path: '/session',
      name: 'session',
      component: SessionView
    },
    {
      path: '/relief-prototype',
      name: 'relief-prototype',
      component: ReliefPrototype
    },
    {
      path: '/thank-you',
      name: 'thank-you',
      component: ThankYouView
    }
  ]
});
