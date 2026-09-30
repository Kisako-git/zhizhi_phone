/**
 * 🐭 吱吱小手机
 * GitHub: Kisako-git/zhizhi_phone
 * Version: 0b2bf61
 */


console.log("🐭 吱吱小手机启动");


(function () {


    // 防重复加载

    if (window.ZhizhiPhoneLoaded) {

        console.log(
            "🐭 吱吱小手机已经加载"
        );

        return;

    }


    window.ZhizhiPhoneLoaded = true;



    /*
        创建挂载容器
    */


    let root =
        document.querySelector(
            "#zhizhi-phone-root"
        );


    if (!root) {


        root =
            document.createElement(
                "div"
            );


        root.id =
            "zhizhi-phone-root";


        root.style.position =
            "relative";


        document.body.appendChild(
            root
        );


        console.log(
            "🐭 创建手机挂载容器"
        );


    }



    /*
        固定 GitHub commit
    */


    const BASE_URL =

    "https://cdn.jsdelivr.net/gh/Kisako-git/zhizhi_phone@0b2bf61/";




    /*
        加载 CSS
    */


    function loadCSS(url){


        const old =
            document.querySelector(
                'link[data-zhizhi-css]'
            );


        if(old){

            return;

        }



        const link =
            document.createElement(
                "link"
            );


        link.rel =
            "stylesheet";


        link.dataset.zhizhiCss =
            "true";


        link.href =
            url +
            "?t=" +
            Date.now();



        document.head.appendChild(
            link
        );


        console.log(
            "🐭 CSS加载完成"
        );


    }




    /*
        加载 Vue 主程序
    */


    async function loadCore(){


        try{


            loadCSS(

                BASE_URL +

                "dist/assets/index-BkuzUcB6.css"

            );



            await import(

                BASE_URL +

                "dist/assets/index-DCCUo-0z.js?t=" +

                Date.now()

            );



            console.log(

                "🐭 吱吱核心加载完成"

            );



        }

        catch(err){


            console.error(

                "🐭 吱吱核心加载失败:",

                err

            );



            if(window.toastr){

                toastr.error(

                    "吱吱手机核心加载失败"

                );

            }


        }


    }




    loadCore();



})();
