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

        axios.get(`/visit/amount?begin=${begin}&end=${end}`).then(response => {
            if (response.status === 200) {
                this.visitAmountLastBetween = response.data.amount;
                return true;
            } else {
                throw response.data.msg;
            }
        }).catch(msg => {
            console.error(msg);
            return msg;
        });
    },

    async fetchVisitIpXhr(x) {
        axios.get(`/visit/ipXhr?x=${x}`)
            .then(response => {
                if (response.status === 200) {
                    this.visitIPLastBetween = response.data.visitIPLastBetween;
                    return true;
                } else {
                    throw response.data.msg;
                }
            }).catch(msg => {
            console.error(msg);
            return msg;
        });
    },

    async fetchVisitDetails(amount) {
        axios.get(`/visit/details?amount=${amount}`)
            .then(response => {
                if (response.status === 200) {
                    this.visitDetails = response.data.visitDetails;
                    return true;
                } else {
                    throw response.data.msg;
                }
            }).catch(msg => {
            console.error(msg);
            return msg;
        });
    }
};

export const useVisitStore = defineStore('visit', {
    state,
    getters,
    actions
});
