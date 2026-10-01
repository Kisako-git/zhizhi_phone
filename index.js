/**
 * 🐭 吱吱小手机
 * GitHub: Kisako-git/zhizhi_phone
 *
 * 功能：
 * 1. 自动创建独立挂载容器
 * 2. 自动查询 dist/assets
 * 3. 自动寻找最新的 index-*.js
 * 4. 自动寻找最新的 index-*.css
 * 5. Vite 每次 build 后不需要手动修改文件名
 * 6. 自动添加时间戳，尽量避免 CDN 缓存
 */

(async function () {

    console.log("🐭 吱吱小手机启动");


    // =========================================================
    // 防止重复加载
    // =========================================================

    if (window.ZhizhiPhoneLoaded) {

        console.log("🐭 吱吱小手机已经加载");

        return;

    }

    window.ZhizhiPhoneLoaded = true;


    // =========================================================
    // 基础地址
    // =========================================================

    const USER = "Kisako-git";

    const REPO = "zhizhi_phone";

    const BRANCH = "main";


    const CDN_BASE =
        `https://cdn.jsdelivr.net/gh/${USER}/${REPO}@${BRANCH}/`;



    const API_URL =
        `https://data.jsdelivr.com/v1/packages/gh/${USER}/${REPO}@${BRANCH}?structure=flat`;



    // =========================================================
    // 创建独立挂载容器
    // =========================================================

    let root =
        document.querySelector("#zhizhi-phone-root");


    if (!root) {

        root =
            document.createElement("div");


        root.id =
            "zhizhi-phone-root";


        /*
         * 不使用 position: fixed
         * 避免干扰手机自身 CSS
         */

        root.style.position =
            "relative";

        root.style.zIndex =
            "999999";


        document.body.appendChild(root);


        console.log(
            "🐭 手机挂载容器创建完成"
        );

    }



    // =========================================================
    // 获取 dist/assets 文件列表
    // =========================================================

    async function getAssets() {

        console.log(
            "🐭 正在读取 dist/assets..."
        );


        const url =
            API_URL +
            "&t=" +
            Date.now();


        const response =
            await fetch(url, {
                cache: "no-store"
            });


        if (!response.ok) {

            throw new Error(
                `jsDelivr API 请求失败: HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        /*
         * jsDelivr API 的 files 可能是：
         *
         * [
         *   { name: "dist/assets/index-xxx.js" },
         *   ...
         * ]
         *
         * 也可能返回字符串路径。
         *
         * 这里两种都兼容。
         */

        let files = [];


        if (Array.isArray(data)) {

            files = data;

        }
        else if (Array.isArray(data.files)) {

            files = data.files;

        }
        else if (Array.isArray(data.files?.files)) {

            files = data.files.files;

        }


        files =
            files
                .map(item => {

                    if (typeof item === "string") {

                        return item;

                    }

                    if (item && typeof item.name === "string") {

                        return item.name;

                    }

                    return null;

                })
                .filter(Boolean);



        console.log(
            "🐭 jsDelivr 文件数量:",
            files.length
        );


        return files;

    }



    // =========================================================
    // 自动寻找 Vite 入口 JS / CSS
    // =========================================================

    function findEntryFiles(files) {


        const assetFiles =
            files.filter(file =>
                file.startsWith("dist/assets/")
            );


        console.log(
            "🐭 dist/assets:",
            assetFiles
        );


        /*
         * Vite 默认入口通常是：
         *
         * dist/assets/index-xxxxx.js
         *
         * dist/assets/index-xxxxx.css
         */


        const jsFiles =
            assetFiles.filter(file =>
                /^dist\/assets\/index-[^/]+\.js$/i.test(file)
            );


        const cssFiles =
            assetFiles.filter(file =>
                /^dist\/assets\/index-[^/]+\.css$/i.test(file)
            );


        if (!jsFiles.length) {

            throw new Error(
                "没有找到 dist/assets/index-*.js"
            );

        }


        if (!cssFiles.length) {

            throw new Error(
                "没有找到 dist/assets/index-*.css"
            );

        }


        /*
         * 正常情况下每次 build 只有一个 index-*.js
         * 和一个 index-*.css。
         *
         * 如果有多个，则取最后一个。
         */

        const jsFile =
            jsFiles[jsFiles.length - 1];


        const cssFile =
            cssFiles[cssFiles.length - 1];


        return {
            jsFile,
            cssFile
        };

    }



    // =========================================================
    // 加载 CSS
    // =========================================================

    function loadCSS(url) {


        /*
         * 防止重复插入
         */

        const old =
            document.querySelector(
                'link[data-zhizhi-phone-css="true"]'
            );


        if (old) {

            old.remove();

        }


        const link =
            document.createElement("link");


        link.rel =
            "stylesheet";


        link.dataset.zhizhiPhoneCss =
            "true";


        link.href =
            url +
            "?zhizhi=" +
            Date.now();


        document.head.appendChild(link);


        console.log(
            "🐭 CSS 加载完成:",
            link.href
        );

    }



    // =========================================================
    // 加载 Vue 主程序
    // =========================================================

    async function loadCore() {


        try {


            // -------------------------------------------------
            // 读取 GitHub / jsDelivr 文件列表
            // -------------------------------------------------

            const files =
                await getAssets();


            // -------------------------------------------------
            // 自动找到当前 Vite build 文件
            // -------------------------------------------------

            const {
                jsFile,
                cssFile
            } =
                findEntryFiles(files);


            console.log(
                "🐭 自动找到 CSS:",
                cssFile
            );


            console.log(
                "🐭 自动找到 JS:",
                jsFile
            );


            // -------------------------------------------------
            // 加载 CSS
            // -------------------------------------------------

            loadCSS(
                CDN_BASE +
                cssFile
            );


            // -------------------------------------------------
            // 加载 JS
            // -------------------------------------------------

            const jsURL =
                CDN_BASE +
                jsFile +
                "?zhizhi=" +
                Date.now();


            console.log(
                "🐭 正在加载核心:",
                jsURL
            );


            await import(jsURL);


            console.log(
                "✅ 吱吱小手机核心加载成功"
            );


            if (window.toastr) {

                toastr.success(
                    "吱吱小手机加载成功"
                );

            }


        }
        catch (error) {


            console.error(
                "❌ 吱吱小手机加载失败:",
                error
            );


            if (window.toastr) {

                toastr.error(
                    "吱吱小手机加载失败，请查看控制台"
                );

            }

        }

    }



    // =========================================================
    // 启动
    // =========================================================

    await loadCore();


})();
