/**
 * Created by YuYoung on 2023/3/22
 * Description: 服务器监控信息
 */

import axios from "@/service/net";
import {defineStore} from "pinia";
import {Mutex} from "async-mutex";

const state = () => {
    return {
        isOnline: false,
        memTotalSize: 0,
        diskTotalSize: 0,

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

        wsInvokeTimes: 0,
    };
};

const getters = {
    mbToGb: (state) => {
        return {
            memTotalSize: (state.memTotalSize / 1024).toFixed(2),
            diskTotalSize: (state.diskTotalSize / 1024).toFixed(2)
        };
    }
};

const actions = {
    async fetchServerStaticInfo() {
        axios.get('/server/staticInfo')
            .then(response => {
                console.log(response.data);
                this.memTotalSize = response.data.memTotalSize;
                this.diskTotalSize = response.data.diskTotalSize;
                console.log(this.memTotalSize);
                console.log(this.diskTotalSize);
                console.log(this.cpuUsageRatioLastSec);
            });
    },

    async fetchRealtimeServerInfo() {
        // 确保全局只调用该函数一次, 否则多个websocket同时运行
        // if (this.wsInvokeTimes > 0) {
        //     return;
        // }
        this.wsInvokeTimes++;

        // 用于控制ws连接超时, 最多 maxReconnectCount*reconnectIntervalMS 毫秒后会确认断开, 不会重连
        const maxReconnectCount = 10;
        const reconnectIntervalMS = 1000;

        const objThis = this;

        function wsConnect() {
            const socket = new WebSocket('ws://localhost:8081/server/info1S');

            let failCount = 0;
            const failCountMutex = new Mutex();// failCount的互斥锁
            let isChecked = false;             // 用于标记是否已经检查过连接状态, 以便在close事件中判断是否需要重连

            //debug
            // socket.addEventListener('open', () => {
            //     console.log('WebSocket connection established');
            // });

            socket.addEventListener('error', (error) => {
                console.error('WebSocket error:', error);
            });

            socket.addEventListener('message', (event) => {
                const info = JSON.parse(event.data);

                failCountMutex.acquire().then((release) => {
                    console.log("0 in");
                    failCount = 0;
                    release();
                });

                console.log(info);
                objThis.isOnline = true;
                objThis.cpuUsageRatioLastSec = info.cpuUsageRatioLastSec;
                objThis.memUsageRatioLastSec = info.memUsageRatioLastSec;
                objThis.diskUsageRatioLastSec = info.diskUsageRatioLastSec;
            });

            // 不允许server主动关闭连接
            socket.addEventListener('close', () => {
                // 若server主动关闭连接, 则0.5秒后尝试重连, 最终在setInterval控制下超时结束
                if (!isChecked) {
                    setTimeout(wsConnect, reconnectIntervalMS);
                }
            });

            // 该函数永久执行, 每秒积累failCount, 若消息收到则failCount清零, 若5秒后未收到消息则认为server已离线
            const interval = setInterval(() => {
                // 互斥访问failCount
                failCountMutex.acquire().then((release) => {
                    console.log("add in");
                    failCount++;
                    if (failCount >= maxReconnectCount) {
                        isChecked = true; // 确认断开
                        socket.close();
                        clearInterval(interval);
                    }
                    release();
                });
            }, 1000);

        }

        wsConnect();
    },

    async fetchCInfoLastXHour(x) {
        axios.get(`/server/InfoXhr?x=${x}`)
            .then(response => {
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
            });
    },

    async fetchCInfoLastXMin() {
        axios.get('/server/info1Min')
            .then(response => {
                this.cpuUsageRatioLastMin = response.data.cpuUsageRatioLastMin;
                this.memUsageRatioLastMin = response.data.memUsageRatioLastMin;
                this.diskUsageRatioLastMin = response.data.diskUsageRatioLastMin;
            });

    }
};

export const useServerStore = defineStore('server', {
    state,
    getters,
    actions
});
