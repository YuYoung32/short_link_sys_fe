/**
 * Created by YuYoung on 2023/3/22
 * Description: 访问量信息
 */

import { defineStore } from 'pinia';
import axios from '@/service/net';
import { extractProvince, unixTimeToString } from '@/service/utils';

const state = () => {
    return {
        // 过去一段时间的访问次数列表 Array[String]
        visitAmount: [],
        // 过去一段时间的访问IP数量列表 Array[String]
        visitIPAmount: [],

        visitIPRegion: [],
        visitIPRegionAmount: [],

        // 某段时间的总访问量, 比getters的visitAmountLastBetweenTotal少请求细节
        visitAmountBetween: '-',

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
        // 因为details最多返回1000条, 所以总数需要单独获取
        visitDetailsAmount: '-'
    };
};

const getters = {
    visitAmountTotal: (state) => {
        return state.visitAmount.reduce((a, b) => a + b, 0);
    },
    // 将里面的时间戳转换为日期
    visitDetails: (state) => {
        for (let i = 0; i < state._visitDetails.length; i++) {
            state._visitDetails[i].visitTime = unixTimeToString(state._visitDetails[i].visitTime);
        }
        return state._visitDetails;
    },
    // 把xx省xx市归纳为为xx省
    visitIPRegionAndAMountWithProvince: (state) => {
        let province = [];
        let provinceAmount = [];
        if (!state.visitIPRegion || state.visitIPRegion.length === 0) {
            return [province, provinceAmount];
        }
        for (let i = 0; i < state.visitIPRegion.length; i++) {
            let provinceName = extractProvince(state.visitIPRegion[i]);
            let idx = province.indexOf(provinceName);
            if (idx !== -1) {
                provinceAmount[idx] += state.visitIPRegionAmount[i];
            } else {
                province.push(provinceName);
                provinceAmount.push(state.visitIPRegionAmount[i]);
            }
        }
        return [province, provinceAmount];
    }
};

const actions = {
    async fetchVisitStatics(begin = '', end = '', shortLink = '') {
        axios
            .get(`/visit/statics?begin=${begin}&end=${end}&shortLink=${shortLink}`)
            .then((response) => {
                if (response.status === 200) {
                    this.visitAmount = response.data.visitAmount;
                    this.visitIPAmount = response.data.ipAmount;
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
    async fetchVisitIPRegion(begin = '', end = '', shortLink = '') {
        axios
            .get(`/visit/ip?begin=${begin}&end=${end}&shortLink=${shortLink}`)
            .then((response) => {
                if (response.status === 200) {
                    this.visitIPRegion = response.data.region;
                    this.visitIPRegionAmount = response.data.amount;
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
    async fetchVisitAmount(begin = '', end = '') {
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
