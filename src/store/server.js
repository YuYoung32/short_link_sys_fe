/**
 * Created by YuYoung on 2023/3/22
 * Description: 服务器监控信息
 */

import axios from '@/service/net';
import { defineStore } from 'pinia';
import { pushAndPop } from '@/service/utils';

const state = () => {
    return {
        isOnline: false,
        memTotalSize: '-',
        diskTotalSize: '-',

        cpuFreq: '-', //单位MHz
        cpuRunningTime: 0, //单位秒

        ttlLastXHour: [],

        cpuUsageRatioLastSec: 0,
        cpuUsageRatioLastMin: [], //首次获取后，以后从cpuUsageRatioLastSec叠加

        memUsageRatioLastSec: 0,
        memUsageRatioLastMin: [], //首次获取后，以后从memUsageRatioLastSec叠加

        diskUsageRatioLastSec: 0,
        diskUsageRatioLastMin: [], //首次获取后，以后从diskUsageRatioLastSec叠加

        ttlLast48Hours: [],

        wsInvokeTimes: 0,

        cpuStaticInfo: {
            name: '-',
            coreNum: '-',
            threadNum: '-',
            cacheSize: '-' //单位MB
        }
    };
};

const getters = {
    mbToGb: (state) => {
        return {
            memTotalSize: (state.memTotalSize / 1024).toFixed(2),
            diskTotalSize: (state.diskTotalSize / 1024).toFixed(2)
        };
    },
    avgCPURatioLastMin: (state) => {
        return (state.cpuUsageRatioLastMin.reduce((a, b) => a + b, 0) / state.cpuUsageRatioLastMin.length).toFixed(2);
    }
};

const actions = {
    async fetchServerStaticInfo() {
        axios
            .get('/server/staticInfo')
            .then((response) => {
                if (response.status === 200) {
                    this.memTotalSize = response.data.memTotalSize;
                    this.diskTotalSize = response.data.diskTotalSize;
                    this.cpuStaticInfo = response.data.cpuStaticInfo;
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

    async fetchRealtimeServerInfo() {
        // 确保全局只调用该函数一次, 否则多个websocket同时运行
        if (this.wsInvokeTimes > 0) {
            return;
        }
        this.wsInvokeTimes++;

        // 用于控制ws连接超时, 最多 maxReconnectCount*reconnectIntervalMS 毫秒后会确认断开, 不会重连
        const maxReconnectCount = 10;
        const reconnectIntervalMS = 1000;

        const objThis = this;

        let failCount = 0;

        function wsConnect() {
            const socket = new WebSocket('ws://localhost:8081/server/info1S');

            //debug
            // socket.addEventListener('open', () => {
            //     console.log('WebSocket connection established');
            // });

            socket.addEventListener('error', (error) => {
                console.error('WebSocket error:', error);
            });

            socket.addEventListener('message', (event) => {
                const info = JSON.parse(event.data);

                failCount = 0;
                objThis.isOnline = true;

                objThis.cpuUsageRatioLastSec = info.cpuUsageRatioLastSec;
                pushAndPop(objThis.cpuUsageRatioLastMin, info.cpuUsageRatioLastSec);
                objThis.memUsageRatioLastSec = info.memUsageRatioLastSec;
                pushAndPop(objThis.memUsageRatioLastMin, info.memUsageRatioLastSec);
                objThis.diskUsageRatioLastSec = info.diskUsageRatioLastSec;
                pushAndPop(objThis.diskUsageRatioLastMin, info.diskUsageRatioLastSec);
                objThis.cpuFreq = info.cpuFreqLastSec;
                objThis.cpuRunningTime = info.runningTime;
            });

            // 不允许server主动关闭连接
            socket.addEventListener('close', () => {
                // 若server主动关闭连接, 则0.5秒后尝试重连, 最终在setInterval控制下超时结束
                if (failCount < maxReconnectCount) {
                    failCount++;
                    objThis.isOnline = false;
                    setTimeout(wsConnect, reconnectIntervalMS);
                } else {
                    socket.close();
                }
            });
        }

        wsConnect();
    },

    async fetchInfoLast1Min() {
        return axios
            .get('/server/info1Min')
            .then((response) => {
                if (response.status === 200) {
                    this.cpuUsageRatioLastMin = response.data.cpuUsageRatioLastMin;
                    this.memUsageRatioLastMin = response.data.memUsageRatioLastMin;
                    this.diskUsageRatioLastMin = response.data.diskUsageRatioLastMin;
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

export const useServerStore = defineStore('server', {
    state,
    getters,
    actions
});
