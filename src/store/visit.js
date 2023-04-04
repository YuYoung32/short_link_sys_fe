/**
 * Created by YuYoung on 2023/3/22
 * Description: 访问量信息
 */

import { defineStore } from 'pinia';
import axios from '@/service/net';
import { unixTimeToString } from '@/service/utils';

const state = () => {
    return {
        // 过去一段时间的访问时段列表
        visitAmountLastBetween: [],

        // 某段时间的总访问量, 比getters的visitAmountLastBetweenTotal少请求细节
        visitAmountTotal: '-',

        /**
         * visitIPLast7D每一项结构
         {
            region: Code,
            amount: Number,
         }
         */
        // 过去一段时间的访问IP-数量 列表
        visitIPLastBetween: [],

        /** _visitDetails每一项结构
          {
             shortLink: String,
             longLink: String,
             comment: String,
             ip: String,
             region: String,
             visitTime: String(UnixTimestamp),
          }
         */
        _visitDetails: [],
        // 因为最多返回1000条, 所以总数需要单独获取
        visitDetailsAmount: []
    };
};

const getters = {
    visitAmountLastBetweenTotal: (state) => {
        return state.visitAmountLastBetween.reduce((a, b) => a + b, 0);
    },
    visitDetails: (state) => {
        for (let i = 0; i < state._visitDetails.length; i++) {
            state._visitDetails[i].visitTime = unixTimeToString(state._visitDetails[i].visitTime);
        }
        return state._visitDetails;
    }
};

const actions = {
    async fetchVisitAmountLastBetween(begin, end) {
        axios
            .get(`/visit/amount?begin=${begin}&end=${end}`)
            .then((response) => {
                if (response.status === 200) {
                    this.visitAmountLastBetween = response.data.amount;
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

    // 与fetchVisitAmountLastBetween相比, 不需要获取具体列表, 直接获取总数
    async fetchVisitAmountTotal(begin = '', end = '') {
        axios
            .get(`/visit/amountTotal?begin=${begin}&end=${end}`)
            .then((response) => {
                if (response.status === 200) {
                    this.visitAmountTotal = response.data.amount;
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

    async fetchVisitIpXhr(x) {
        axios
            .get(`/visit/ipXhr?x=${x}`)
            .then((response) => {
                if (response.status === 200) {
                    this.visitIPLastBetween = response.data.visitIPLastBetween;
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

    async fetchVisitDetails(options = {}) {
        /**
         * options结构
         {
            shortLink: Array[String],
            longLink: Array[String],
            comment: Array[String],
            ip: Array[String],
            region: Array[String],
            rangeTime: Array[2][String],
         }
         */
        return axios
            .post('/visit/details', options)
            .then((response) => {
                if (response.status === 200) {
                    this._visitDetails = response.data.visitDetails;
                    this.visitDetailsAmount = response.data.visitDetailsAmount;
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

export const useVisitStore = defineStore('visit', {
    state,
    getters,
    actions
});
