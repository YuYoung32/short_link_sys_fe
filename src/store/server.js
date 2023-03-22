/**
 * Created by YuYoung on 2023/3/22
 * Description: 服务器监控信息
 */

import axios from "@/service/net";
import {defineStore} from "pinia";

const state = () => {
    return {
        isOnline: false,
        memTotalSize: 0,
        diskTotalSize: 0,

        cpuUsageRatioLastSec: 0,
        cpuUsageRatioLastMin: [], //首次获取后，以后从cpuUsageRatioLastSec叠加
        cpuUsageRatioLastXHour: [],
        cpuUsageRatioLastXDay: [],

        memUsageRatioLastSec: 0,
        memUsageRatioLastMin: [], //首次获取后，以后从memUsageRatioLastSec叠加
        memUsageRatioLastXHour: [],
        memUsageRatioLastXDay: [],

        diskUsageRatioLastSec: 0,
        diskUsageRatioLastMin: [], //首次获取后，以后从diskUsageRatioLastSec叠加
        diskUsageRatioLastXHour: [],
        diskUsageRatioLastXDay: [],

        ttlLastXHour: [],
        ttlLastXDay: []
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
        axios.get('/server/static_info')
            .then(response => {
                console.log(response.data);
                this.memTotalSize = response.data.memTotalSize;
                this.diskTotalSize = response.data.diskTotalSize;
                console.log(this.memTotalSize);
                console.log(this.diskTotalSize);
                console.log(this.cpuUsageRatioLastSec);
            });
    },
    async fetchRealTimeServerInfo() {
        const socket = new WebSocket('ws://localhost:8081/server/info_1s');

        let failCount = 0;
        let isChecked = false;
        console.log(this.cpuUsageRatioLastSec);
        const objThis = this;

        function wsConnect() {
            //debug
            socket.addEventListener('open', () => {
                console.log('WebSocket connection established');
            });


            socket.addEventListener('message', (event) => {
                const info = JSON.parse(event.data);
                console.log(info);
                failCount = 0;
                objThis.cpuUsageRatioLastSec = info.cpuUsageRatioLastSec;
                objThis.memUsageRatioLastSec = info.memUsageRatioLastSec;
                objThis.diskUsageRatioLastSec = info.diskUsageRatioLastSec;
            });

            // 不允许server主动关闭连接
            socket.addEventListener('close', () => {
                console.log('WebSocket connection closed');
                // 若server主动关闭连接, 则0.5秒后尝试重连, 最终在setInterval控制下超时结束
                if (!isChecked) {
                    setTimeout(wsConnect, 500);
                }
            });

            // 每秒积累failCount, 若消息收到则failCount清零, 若5秒内未收到消息则认为server已离线
            const interval = setInterval(() => {
                failCount++;
                if (failCount >= 5) {
                    console.log('Server is offline');
                    isChecked = true;
                    socket.close();
                    clearInterval(interval);
                }
            }, 1000);
        }

        wsConnect();

        // debug
        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });
    },

    // CPU
    async fetchCpuUsageRatioLastXHour(x) {
        axios.get(`/server/cpu_xhr?x=${x}`)
            .then(response => {
                this.cpuUsageRatioLastXHour = response.data.ratios;
            });
    },
    async fetchCpuUsageRatioLastXDay(x) {
        axios.get(`/server/cpu_xhr?x=${x * 24}`)
            .then(response => {
                this.cpuUsageRatioLastXDay = response.data.ratios;
            });
    },

    // MEM
    async fetchMemUsageRatioLastXHour(x) {
        axios.get(`/server/mem_xhr?x=${x}`)
            .then(response => {
                this.memUsageRatioLastXHour = response.data.ratios;
            });
    },
    async fetchMemUsageRatioLastXDay(x) {
        axios.get(`/server/mem_xhr?x=${x * 24}`)
            .then(response => {
                this.memUsageRatioLastXDay = response.data.ratios;
            });
    },

    // DISK
    async fetchDiskUsageRatioLastXHour(x) {
        axios.get(`/server/disk_xhr?x=${x}`)
            .then(response => {
                this.diskUsageRatioLastXHour = response.data.ratios;
            });
    },
    async fetchDiskUsageRatioLastXDay(x) {
        axios.get(`/server/disk_xhr?x=${x * 24}`)
            .then(response => {
                this.diskUsageRatioLastXDay = response.data.ratios;
            });
    },

    async fetchTtlLastXHour(x) {
        axios.get(`/server/ttl_xhr?x=${x}`)
            .then(response => {
                this.ttlLastXHour = response.data.ttls;
            });
    },
    async fetchTtlLastXDay(x) {
        axios.get(`/server/ttl_xhr?x=${x * 24}`)
            .then(response => {
                this.ttlLastDay = response.data.ttls;
            });
    }
};

export const useServerStore = defineStore('server', {
    state,
    getters,
    actions
});
