// ============================================================
// 🐭 吱吱小手机
// 简单稳定版
// 直接加载当前 Vite build 生成的 JS / CSS
// ============================================================

(function () {
    "use strict";

    console.log("🐭 吱吱小手机 Loader 启动");


    // ============================================================
    // CDN
    // ============================================================

    const BASE_URL =
        "https://cdn.jsdelivr.net/gh/Kisako-git/zhizhi_phone@main/";


    // ============================================================
    // 当前 Vite build 文件
    // ============================================================

    const JS_FILE =
        "dist/assets/index-DCCUo-0z.js";

    const CSS_FILE =
        "dist/assets/index-BkuzUcB6.css";


    // ============================================================
    // 创建挂载容器
    // ============================================================

    function createRoot() {

        let root =
            document.querySelector(
                "#zhizhi-phone-root"
            );


        if (!root) {

            root =
                document.createElement("div");

            root.id =
                "zhizhi-phone-root";


            root.style.position =
                "fixed";

            root.style.zIndex =
                "999999";

            root.style.pointerEvents =
                "none";


            document.body.appendChild(root);


            console.log(
                "🐭 #zhizhi-phone-root 创建完成"
            );
        }


        return root;
    }


    // ============================================================
    // 加载 CSS
    // ============================================================

    function loadCSS(url) {

        return new Promise(
            (resolve, reject) => {

                const link =
                    document.createElement("link");


                link.rel =
                    "stylesheet";


                link.href =
                    url +
                    "?zhizhi=" +
                    Date.now();


                link.onload =
                    () => {

                        console.log(
                            "🐭 CSS加载完成:",
                            url
                        );


                        resolve();
                    };


                link.onerror =
                    () => {

                        console.error(
                            "❌ CSS加载失败:",
                            url
                        );


                        reject(
                            new Error(
                                "CSS加载失败"
                            )
                        );
                    };


                document.head.appendChild(
                    link
                );
            }
        );
    }


    // ============================================================
    // 加载核心
    // ============================================================

    async function loadCore() {

        try {

            createRoot();


            const cssURL =
                BASE_URL +
                CSS_FILE;


            const jsURL =
                BASE_URL +
                JS_FILE;


            console.log(
                "🐭 CSS:",
                cssURL
            );


            console.log(
                "🐭 JS:",
                jsURL
            );


            // ----------------------------------------------------
            // CSS
            // ----------------------------------------------------

            await loadCSS(
                cssURL
            );


            // ----------------------------------------------------
            // JS
            // ----------------------------------------------------

            console.log(
                "🐭 开始加载核心 JS"
            );


            await import(
                jsURL +
                "?zhizhi=" +
                Date.now()
            );


            console.log(
                "✅ 吱吱小手机加载成功"
            );


        } catch (error) {

            console.error(
                "❌ 吱吱小手机加载失败:",
                error
            );


            if (
                typeof toastr !== "undefined" &&
                toastr.error
            ) {

                toastr.error(
                    "吱吱小手机加载失败，请查看控制台"
                );
            }
        }
    }


    // ============================================================
    // 启动
    // ============================================================

    loadCore();

})();
