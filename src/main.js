import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";
import BadgeDirective from "primevue/badgedirective";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';


// import localization from "/src/localization";
import "./assets/styles.scss";

const app = createApp(App);
app.use(PrimeVue, {
    ripple: true,

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


app.use(store);
app.use(router);
app.mount('#app');
