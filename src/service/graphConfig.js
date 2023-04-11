/**
 * Created by YuYoung on 2023/4/10
 * Description: 无坐标, 无边框的折线图, 图线和数据选项
 */

import { changeRgbaAlpha } from '@/components/Monitor/color';

class RealTimeLineChartData {
    constructor() {
        this.labels = new Array(60).fill('');
        this.datasets = [];
    }

    setData(data, borderColor) {
        const datasetsItem = {
            fill: true,
            borderColor: borderColor,
            borderWidth: 1,
            pointRadius: 1,
            tension: 0.1,
            hitRadius: 10
        };
        datasetsItem.backgroundColor = changeRgbaAlpha(borderColor, 0.36);
        datasetsItem.data = data;
        this.datasets.push(datasetsItem);
    }
}
class RealTimeLineChartOption {
    constructor() {
        const borderWidth = 2;
        this.animation = false;
        this.maintainAspectRatio = false;
        this.plugins = {
            legend: {
                display: false
            }
        };
        this.scales = {
            y: {
                position: 'left',
                grid: {
                    drawTicks: false
                },
                ticks: {
                    display: false
                },
                border: {
                    display: true,
                    width: borderWidth
                }
            },
            y2: {
                position: 'right',
                grid: {
                    display: false,
                    drawTicks: false
                },
                ticks: {
                    display: false
                },
                border: {
                    display: true,
                    width: borderWidth
                }
            },
            x: {
                position: 'bottom',
                grid: {
                    drawTicks: false
                },
                ticks: {
                    display: false,
                    maxTicksLimit: 6
                },
                border: {
                    display: true,
                    width: borderWidth
                }
            },
            x2: {
                position: 'top',
                grid: {
                    display: false,
                    drawTicks: false
                },
                ticks: {
                    display: false
                },
                border: {
                    display: true,
                    width: borderWidth
                }
            }
        };
        this.layout = {
            autoPadding: false,
            padding: {
                bottom: 2
            }
        };
    }
}

export { RealTimeLineChartData, RealTimeLineChartOption };
