/**
 * Created by YuYoung on 2023/3/22
 * Description: 访问量信息
 */

import {defineStore} from "pinia";
import axios from "axios";

const state = () => {
    return {
        visitAmountLastXHour: [],
        visitIPLastXHour: [],
        visitAmountLastXHourTotal: 0,
        /**
         * 单个visitDetail结构
         {
            longUrl: "http://example.com/long-url",
            shortUrl: "http://example.com/short-url",
            IP: "192.168.0.1",
            region: "US",
            OS: "Windows 10",
            timestamp: "2023-03-22T08:50:14.349Z"
         }
         */
        visitDetails: [],
    };
};

const getters = {};

const actions = {
    async fetchVisitAmountXhr(x) {
        axios.get(`/visit/amount_xhr?x=${x}`)
            .then(response => {
                this.visitAmountLastXHour = response.data;
            });
    },
    async fetchVisitIpXhr(x) {
        axios.get(`/visit/ip_xhr?x=${x}`)
            .then(response => {
                this.visitIPLastXHour = response.data;
            });
    },
    async fetchVisitAmountXHourTotal(x) {
        axios.get(`/visit/amount_xhr_total?x=${x}`)
            .then(response => {
                this.visitAmountLastXHourTotal = response.data;
            });
    },
    async fetchVisitDetails(amount) {
        axios.get(`/visit/details?amount=${amount}`)
            .then(response => {
                this.visitDetails = response.data;
            });
    }
};

export const useVisitStore = defineStore('visit', {
    state,
    getters,
    actions
});
