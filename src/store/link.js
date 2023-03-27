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
            comment: "百度",
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
            this.links = response.data;
        });
    },

    async deleteLink(linkDataList) {
        const data = {
            'shortLinks': linkDataList.map((linkData) => {
                return linkData.shortLink;
            })
        };
        axios.post(`/link/del`, data).then(response => {
            if (response.data.code === '200') {
                return true;
            } else {
                throw response.data.msg;
            }
        }).catch((msg) => {
            console.error(msg);
            return msg;
        });
    },

    async addLink(linkData) {
        axios.post('/link/add', linkData).then(response => {
            if (response.data.code === '200') {
                return true;
            } else {
                throw response.data.msg;
            }
        }).catch((msg) => {
            return msg;
        });
    },

    async updateLink(linkData) {
        const sendData = {
            'shortLink': linkData.shortLink,
            'longLink': linkData.longLink,
            'comment': linkData.comment
        };
        axios.post('/link/update', sendData).then(response => {
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
