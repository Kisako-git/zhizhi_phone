// ============================================================
// 🐭 吱吱小手机 - 自动加载器
// 自动读取 dist/index.html
// 自动获取 Vite 最新生成的 JS / CSS
// 不需要手动修改 hash
// ============================================================

(function () {
    "use strict";

    const USER = "Kisako-git";
    const REPO = "zhizhi_phone";
    const BRANCH = "main";

    const BASE_URL =
        `https://cdn.jsdelivr.net/gh/${USER}/${REPO}@${BRANCH}/`;

    console.log("🐭 吱吱小手机启动");
    console.log("🐭 CDN:", BASE_URL);


    // ============================================================
    // 创建手机挂载容器
    // ============================================================

    function createRoot() {

        let root = document.querySelector("#zhizhi-phone-root");

        if (!root) {

            root = document.createElement("div");

            root.id = "zhizhi-phone-root";

            root.style.position = "fixed";
            root.style.zIndex = "999999";
            root.style.pointerEvents = "none";

            document.body.appendChild(root);

            console.log("🐭 #zhizhi-phone-root 创建完成");
        }

        return root;
    }


    // ============================================================
    // 加载 CSS
    // ============================================================

    function loadCSS(url) {

        return new Promise((resolve, reject) => {

            // 防止重复加载
            const old = document.querySelector(
                `link[data-zhizhi-phone-css="${url}"]`
            );

            if (old) {

                console.log("🐭 CSS 已经加载过");

                resolve();

                return;
            }


            const link = document.createElement("link");

            link.rel = "stylesheet";

            link.href =
                url +
                (url.includes("?") ? "&" : "?") +
                "zhizhi=" +
                Date.now();

            link.dataset.zhizhiPhoneCss = url;


            link.onload = () => {

                console.log("🐭 CSS加载完成");

                resolve();

            };


            link.onerror = () => {

                console.error(
                    "❌ CSS加载失败:",
                    link.href
                );

                reject(
                    new Error(
                        "CSS加载失败: " +
                        link.href
                    )
                );

            };


            document.head.appendChild(link);

        });

    }


    // ============================================================
    // 获取 Vite 的 dist/index.html
    // ============================================================

    async function getDistHTML() {

        const url =
            BASE_URL +
            "dist/index.html?zhizhi=" +
            Date.now();


        console.log(
            "🐭 正在读取:",
            url
        );


        const response = await fetch(
            url,
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                `无法读取 dist/index.html (${response.status})`
            );

        }


        const html = await response.text();


        console.log(
            "🐭 dist/index.html 读取成功"
        );


        return html;

    }


    // ============================================================
    // 从 Vite index.html 自动找 JS / CSS
    // ============================================================

    function findEntryFiles(html) {

        console.log(
            "🐭 正在分析 Vite index.html"
        );


        // --------------------------------------------------------
        // JS
        // --------------------------------------------------------

        const jsMatches = [
            ...html.matchAll(
                /(?:src=["'])([^"']+\.js)(?:["'])/gi
            )
        ];


        // --------------------------------------------------------
        // CSS
        // --------------------------------------------------------

        const cssMatches = [
            ...html.matchAll(
                /(?:href=["'])([^"']+\.css)(?:["'])/gi
            )
        ];


        console.log(
            "🐭 HTML中的JS:",
            jsMatches.map(x => x[1])
        );


        console.log(
            "🐭 HTML中的CSS:",
            cssMatches.map(x => x[1])
        );


        // ========================================================
        // 找 Vite 的 index-xxxxx.js
        // ========================================================

        let jsFile = null;

        for (const match of jsMatches) {

            const file = match[1];

            if (
                /(?:^|\/)index-[^/]+\.js$/i.test(file)
            ) {

                jsFile = file;

                break;
            }

        }


        // ========================================================
        // 找 Vite 的 index-xxxxx.css
        // ========================================================

        let cssFile = null;

        for (const match of cssMatches) {

            const file = match[1];

            if (
                /(?:^|\/)index-[^/]+\.css$/i.test(file)
            ) {

                cssFile = file;

                break;
            }

        }


        if (!jsFile) {

            throw new Error(
                "dist/index.html 中没有找到 Vite index-*.js"
            );

        }


        console.log(
            "🐭 找到 JS:",
            jsFile
        );


        console.log(
            "🐭 找到 CSS:",
            cssFile
        );


        return {
            jsFile,
            cssFile
        };

    }


    // ============================================================
    // 规范化路径
    // ============================================================

    function normalizeDistPath(file) {

        file = file.replace(/^\/+/, "");

        // Vite 默认可能生成：
        //
        // /assets/index-xxx.js
        //
        // 我们实际需要：
        //
        // dist/assets/index-xxx.js

        if (file.startsWith("assets/")) {

            return "dist/" + file;

        }


        if (file.startsWith("dist/")) {

            return file;

        }


        return "dist/" + file;

    }


    // ============================================================
    // 加载核心
    // ============================================================

    async function loadCore() {

        try {

            createRoot();


            // ----------------------------------------------------
            // 读取 dist/index.html
            // ----------------------------------------------------

            const html =
                await getDistHTML();


            // ----------------------------------------------------
            // 找当前 Vite hash
            // ----------------------------------------------------

            const files =
                findEntryFiles(html);


            const jsPath =
                normalizeDistPath(
                    files.jsFile
                );


            const cssPath =
                files.cssFile
                    ? normalizeDistPath(
                        files.cssFile
                    )
                    : null;


            const jsURL =
                BASE_URL +
                jsPath;


            const cssURL =
                cssPath
                    ? BASE_URL +
                      cssPath
                    : null;


            console.log(
                "🐭 最终 JS:",
                jsURL
            );


            console.log(
                "🐭 最终 CSS:",
                cssURL
            );


            // ----------------------------------------------------
            // CSS
            // ----------------------------------------------------

            if (cssURL) {

                await loadCSS(cssURL);

            }


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
