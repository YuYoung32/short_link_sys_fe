/**
 * Created by YuYoung on 2023/3/22
 * Description: 短链信息
 */

import { defineStore } from 'pinia';
import axios from '@/service/net';

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
        linksTotal: '-',
        amountTotal: '-'
    };
};

const getters = {};

const actions = {
    async fetchLinksAmountTotal() {
        axios
            .get('/link/amountTotal')
            .then((response) => {
                if (response.status === 200) {
                    this.amountTotal = response.data.amountTotal;
                    return true;
                } else {
                    throw response.data.msg;
                }
            })
            .catch((msg) => {
                console.error(msg);
                return msg;
            });
    },

    // 获取短链信息, keyword是短链长链或备注, keyword为空时获取全部
    async fetchLinks(
        keyword = {
            shortLink: '',
            longLink: '',
            comment: ''
        },
        amount = 50
    ) {
        axios
            .get(
                `/link/details?shortLink=${keyword.shortLink}&longLink=${keyword.longLink}&comment=${keyword.comment}&amount=${amount}`
            )
            .then((response) => {
                this.fetchLinksAmountTotal();
                if (response.status === 200) {
                    this.links = response.data.links;
                    this.linksTotal = response.data.linksTotal;
                    return true;
                } else {
                    throw response.data.msg;
                }
            })
            .catch((msg) => {
                console.error(msg);
                return msg;
            });
    },

    async deleteLink(linkDataList) {
        const data = {
            shortLinks: linkDataList.map((linkData) => {
                return linkData.shortLink;
            })
        };
        return axios
            .post(`/link/del`, data)
            .then((response) => {
                if (response.status === 200) {
                    return true;
                } else {
                    throw response.data.msg;
                }
            })
            .catch((msg) => {
                console.error(msg);
                return msg;
            });
    },

    async addLink(linkDataList) {
        return axios
            .post('/link/add', linkDataList)
            .then((response) => {
                if (response.status === 200) {
                    return true;
                } else {
                    throw response.data.msg;
                }
            })
            .catch((msg) => {
                console.error(msg);
                return msg;
            });
    },

    async updateLink(linkData) {
        const sendData = {
            shortLink: linkData.shortLink,
            longLink: linkData.longLink,
            comment: linkData.comment
        };
        return axios
            .post('/link/update', sendData)
            .then((response) => {
                if (response.status === 200) {
                    return true;
                } else {
                    throw response.data.msg;
                }
            })
            .catch((msg) => {
                console.error(msg);
                return msg;
            });
    }
};

export const useLinkStore = defineStore('link', {
    state,
    getters,
    actions
});
