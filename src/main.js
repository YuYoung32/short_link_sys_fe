import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { createPinia } from 'pinia';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import BadgeDirective from 'primevue/badgedirective';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import Chart from 'primevue/chart';
import Card from 'primevue/card';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import FileUpload from 'primevue/fileupload';
import Toolbar from 'primevue/toolbar';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import MultiSelect from 'primevue/multiselect';
import Fieldset from 'primevue/fieldset';
import Calendar from 'primevue/calendar';
import Chips from 'primevue/chips';

// import localization from "/src/localization";
import '@/assets/styles.scss';

const app = createApp(App);
app.use(PrimeVue, {
    ripple: false,
    locale: {
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        firstDayOfWeek: 1,
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六']
    }
});
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Chart', Chart);
app.component('Card', Card);
app.component('Toast', Toast);
app.component('FileUpload', FileUpload);
app.component('Toolbar', Toolbar);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('Textarea', Textarea);
app.component('Dropdown', Dropdown);
app.component('RadioButton', RadioButton);
app.component('InputNumber', InputNumber);
app.component('Dialog', Dialog);
app.component('MultiSelect', MultiSelect);
app.component('Fieldset', Fieldset);
app.component('Calendar', Calendar);
app.component('Chips', Chips);

app.use(createPinia());
app.use(router);

app.mount('#app');
