/**
 * Created by YuYoung on 2023/3/22
 * Description: 访问量信息
 */

import {defineStore} from "pinia";
import axios from "axios";

const state = () => {
    return {
        xHourTimePoints: [],
        visitAmountLastXHour: [],

        visitIPLastXHour: [],

        visitAmountLastXHourTotal: 0,
        
        visitDetails: [],
    };
};

const getters = {};

const actions = {
    async fetchVisitAmountXhr(x) {
        axios.get(`/visit/amountXhr?x=${x}`)
            .then(response => {
                this.visitAmountLastXHour = response.data.visitAmountLastXHour;
            });
    },
    async fetchVisitIpXhr(x) {
        axios.get(`/visit/ipXhr?x=${x}`)
            .then(response => {
                this.visitIPLastXHour = response.data.visitIPLastXHour;
            });
    },
    async fetchVisitAmountXHourTotal(x) {
        axios.get(`/visit/amountXhrTotal?x=${x}`)
            .then(response => {
                this.visitAmountLastXHourTotal = response.data.visitAmountLastXHourTotal;
            });
    },
    async fetchVisitDetails(amount) {
        axios.get(`/visit/details?amount=${amount}`)
            .then(response => {
                this.visitDetails = response.data.visitDetails;
            });
    }
};

export const useVisitStore = defineStore('visit', {
    state,
    getters,
    actions
});
