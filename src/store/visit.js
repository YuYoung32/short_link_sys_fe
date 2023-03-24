/**
 * Created by YuYoung on 2023/3/22
 * Description: 访问量信息
 */

import {defineStore} from "pinia";
import axios from "@/service/net";

const state = () => {
    return {
        xHourTimePoints: [],
        visitAmountLastXHour: [],

        visitIPLastXHour: [],

        visitAmountLast24HourTotal: '-',
        visitAmountLastXHourTotal: '-',

        visitDetails: [],
    };
};

const getters = {};

const actions = {
    async fetchVisitAmountXhr(x) {
        try {
            const response = await axios.get(`/visit/amountXhr?x=${x}`);
            this.visitAmountLastXHour = response.data.amount;
            this.xHourTimePoints = response.data.xHourTimePoints;
            // return response.data.amountTotal;
        } catch (e) {
            console.error(e);
        }
    },
    async fetchVisitIpXhr(x) {
        axios.get(`/visit/ipXhr?x=${x}`)
            .then(response => {
                this.visitIPLastXHour = response.data.visitIPLastXHour;
            });
    },
    async fetchVisitAmountXHourTotal(x) {
        try {
            const response = await axios.get(`/visit/amountXhrTotal?x=${x}`);
            if (x === 24) {
                this.visitAmountLast24HourTotal = response.data.amountTotal;
            }
            return response.data.amountTotal;
        } catch (e) {
            console.error(e);
        }
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
