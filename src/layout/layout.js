import {toRefs, reactive, computed} from "vue";

// 配合css确定主页面的动画效果、页面显示等
const layoutConfig = reactive({
    ripple: false,                  // 动画
    darkTheme: false,               // 暗黑模式
    inputStyle: "outlined",         // 输入框样式: filled, outlined
    menuMode: "static",             // 菜单模式: overlay, static
    theme: "lara-light-indigo",     // 主题
});

// 当前页面的状态
const layoutState = reactive({
    staticMenuDesktopInactive: false, // 静态菜单模式下，桌面端是否隐藏
    overlayMenuActive: false,         // 菜单是否显示
    profileSidebarVisible: false,     // 个人信息侧边栏是否显示
    configSidebarVisible: false,      // 配置侧边栏是否显示
    staticMenuMobileActive: false,    // 静态菜单模式下，移动端是否显示
    menuHoverActive: false            // 鼠标悬停在菜单上是否显示激活
});

// 组件使用该函数 得到和改变 配置和状态信息
export function useLayout() {

    // 菜单隐藏与显示
    const onMenuToggle = () => {
        if (layoutConfig.menuMode === "overlay") {
            // 菜单模式为overlay时，点击菜单按钮，菜单禁止显示
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    return {
        layoutConfig: toRefs(layoutConfig),
        layoutState: toRefs(layoutState),
        onMenuToggle,
        isSidebarActive,
    };
}
