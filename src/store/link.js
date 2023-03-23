/**
 * Created by YuYoung on 2023/3/22
 * Description: 短链信息
 */

import {defineStore} from 'pinia';
import axios from 'axios';

const state = () => {
    return {
        /**
         * 单个link结构
         {
            shortLink: '',
            longLink: '',
            createTime: '',
         }
         *
         */
        links: [],
        amountTotal: 0,
    };
};

const getters = {};

const actions = {
    async fetchLinksTotal() {
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

export const useLinksStore = defineStore('link', {
    state,
    getters,
    actions
});
