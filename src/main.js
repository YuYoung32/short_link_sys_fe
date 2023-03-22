import {createApp} from 'vue';
import App from '@/App.vue';
import router from '@/router';
import {createPinia} from 'pinia';

import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";
import BadgeDirective from "primevue/badgedirective";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";
import Chart from 'primevue/chart';
import Card from 'primevue/card';


import Button from 'primevue/button';
import InputText from 'primevue/inputtext';


// import localization from "/src/localization";
import "@/assets/styles.scss";

const app = createApp(App);
app.use(PrimeVue, {
    ripple: false,

});
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

app.directive("tooltip", Tooltip);
app.directive("badge", BadgeDirective);
app.directive("ripple", Ripple);
app.directive("styleclass", StyleClass);

app.component("Button", Button);
app.component("InputText", InputText);
app.component("Chart", Chart);
app.component("Card", Card);

app.use(createPinia());
app.use(router);

app.mount('#app');
