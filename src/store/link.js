/**
 * Created by YuYoung on 2023/3/22
 * Description: 短链信息
 */

import {defineStore} from 'pinia';
import axios from "@/service/net";

const state = () => {
    return {
        /** 短链信息 单个结构
         {
            shortLink: "http://localhost:8080/1",
            longLink: "https://www.baidu.com",
            createTime: "2021-03-22 15:00:00",
         }
         */
        links: [],
        amountTotal: '-',
    };
};

const getters = {};

const actions = {
    async fetchLinksAmountTotal() {
        axios.get('/link/amountTotal').then(response => {
            this.amountTotal = response.data.amountTotal;
        });
    },

    async fetchLinks(amount) {
        axios.get(`/link/details?amount=${amount}`).then(response => {
            this.links = response.data.links;
        });
    },

    async deleteLink(short_link) {
        axios.get(`/link/del?shortLink=${short_link}`).then(response => {
            if (response.data.code === '200') {
                return true;
            } else {
                throw response.data.msg;
            }
        }).catch((msg) => {
            return msg;
        });
    },

    async addLink(long_link) {
        axios.post('/link', {"longLink": long_link}).then(response => {
            if (response.data.code === '200') {
                return true;
            } else {
                throw response.data.msg;
            }
        }).catch((msg) => {
            return msg;
        });
    }
};

export const useLinkStore = defineStore('link', {
    state,
    getters,
    actions
});
