import {toRefs, reactive, computed} from "vue";

// 配合css确定动画效果、页面显示等
const layoutConfig = reactive({
    ripple: false,                  // 动画
    darkTheme: false,               // 暗黑模式
    inputStyle: "outlined",         // 输入框样式
    menuMode: "static",             // 菜单模式
    theme: "lara-light-indigo",     // 主题
    scale: 14,                      // 缩放
    activeMenuItem: null            // 当前激活的菜单项
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
    // 暗黑模式
    const changeThemeSettings = (theme, darkTheme) => {
        layoutConfig.darkTheme = darkTheme;
        layoutConfig.theme = theme;
    };

    // 设置缩放
    const setScale = (scale) => {
        layoutConfig.scale = scale;
    };

    // 设置当前激活的菜单项
    const setActiveMenuItem = (item) => {
        layoutConfig.activeMenuItem = item.value || item;
    };

    // 自适应菜单
    const onMenuToggle = () => {
        if (layoutConfig.menuMode === "overlay") {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    return {
        layoutConfig: toRefs(layoutConfig),
        layoutState: toRefs(layoutState),
        changeThemeSettings,
        setScale,
        onMenuToggle,
        isSidebarActive,
        isDarkTheme,
        setActiveMenuItem
    };
}
