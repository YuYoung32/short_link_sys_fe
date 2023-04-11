/**
 * Created by YuYoung on 2023/4/11
 * Description: Monitor页面相关颜色
 */

const color = {
    cpu: 'rgba(255, 0, 0, 0.72)',
    mem: 'rgba(0, 106, 255, 0.72)',
    disk: 'rgba(0, 181, 181, 0.72)',
    net: 'rgba(163, 0, 181, 0.71)',
    transparent: 'rgba(0, 0, 0, 0)'
};

function changeRgbaAlpha(color, alpha) {
    const rgba = color.match(/(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)/);
    return rgba ? `rgba(${rgba[1]}, ${rgba[2]}, ${rgba[3]}, ${alpha})` : color;
}

export { color, changeRgbaAlpha };
