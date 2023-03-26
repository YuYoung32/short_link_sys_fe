/**
 * Created by YuYoung on 2023/3/22
 * Description: 访问量信息
 */

import {defineStore} from "pinia";
import axios from "@/service/net";

const state = () => {
    return {
        visitAmountLastBetween: [],

        /**
         * visitIPLast7D每一项结构
         {
            region: Code,
            amount: Number,
         }
         */
        visitIPLastBetween: [],

        visitDetails: [],
    };
};

const getters = {
    visitAmountLastTotal: function () {
        return this.visitAmountLastBetween.reduce((a, b) => a + b, 0);
    },
};

const actions = {
    async fetchVisitAmountLastBetween(begin, end) {
        try {
            const response = await axios.get(`/visit/amount?begin=${begin}&end=${end}`);
            this.visitAmountLastBetween = response.data.amount;
            return response.data.amount;
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
