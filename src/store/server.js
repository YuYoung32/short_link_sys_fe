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

        xHourTimePoints: [],
        cpuUsageRatioLastXHour: [],
        memUsageRatioLastXHour: [],
        diskUsageRatioLastXHour: [],
        ttlLastXHour: [],

        cpuUsageRatioLastSec: 0,
        cpuUsageRatioLastMin: [], //首次获取后，以后从cpuUsageRatioLastSec叠加
        cpuUsageRatioLast48Hours: [],

        memUsageRatioLastSec: 0,
        memUsageRatioLastMin: [], //首次获取后，以后从memUsageRatioLastSec叠加
        memUsageRatioLast48Hours: [],

        diskUsageRatioLastSec: 0,
        diskUsageRatioLastMin: [], //首次获取后，以后从diskUsageRatioLastSec叠加
        diskUsageRatioLast48Hours: [],

        ttlLast48Hours: [],

        wsInvokeTimes: 0
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

    async fetchInfoLastXHour(x) {
        axios
            .get(`/server/InfoXhr?x=${x}`)
            .then((response) => {
                if (response.status === 200) {
                    this.cpuUsageRatioLastXHour = response.data.cpuUsageRatioLastXHour;
                    this.memUsageRatioLastXHour = response.data.memUsageRatioLastXHour;
                    this.diskUsageRatioLastXHour = response.data.diskUsageRatioLastXHour;
                    this.ttlLastXHour = response.data.ttlLastXHour;
                    this.xHourTimePoints = response.data.xHourTimePoints;
                    if (x === 48) {
                        this.cpuUsageRatioLast48Hours = response.data.cpuUsageRatioLastXHour;
                        this.memUsageRatioLast48Hours = response.data.memUsageRatioLastXHour;
                        this.diskUsageRatioLast48Hours = response.data.diskUsageRatioLastXHour;
                        this.ttlLast48Hours = response.data.ttlLastXHour;
                    }
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

    async fetchInfoLast1Min() {
        axios
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
