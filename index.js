/**
 * 吱吱小手机
 * Kisako-git/zhizhi_phone
 * commit: 6f88d76d2eaa204ee479e1d629515a01ff298507
 */

console.log("🐭 吱吱小手机启动");


(function(){

    // 防止重复加载
    if(window.ZhizhiPhoneLoaded){

        console.log(
            "🐭 吱吱小手机已经加载"
        );

        return;

    }


    window.ZhizhiPhoneLoaded=true;



    /*
        创建挂载容器
    */

    let root =
    document.querySelector(
        "#zhizhi-phone-root"
    );


    if(!root){

        root=document.createElement(
            "div"
        );


        root.id=
        "zhizhi-phone-root";


        document.body.appendChild(
            root
        );


        console.log(
            "🐭 创建手机挂载容器"
        );

    }



    /*
        CDN 地址
    */

    const BASE_URL =
    "https://cdn.jsdelivr.net/gh/Kisako-git/zhizhi_phone@6f88d76d2eaa204ee479e1d629515a01ff298507/";



    /*
        加载 CSS
    */

    function loadCSS(url){

        if(
            document.querySelector(
                `link[href="${url}"]`
            )
        ){

            return;

        }


        const link =
        document.createElement(
            "link"
        );


        link.rel =
        "stylesheet";


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
        加载 Vue bundle
    */

    async function loadCore(){


        try{


            loadCSS(
                BASE_URL+
                "dist/assets/index-BkuzUcB6.css"
            );



            await import(
                BASE_URL+
                "dist/assets/index-segi5e_G.js?t="
                +
                Date.now()
            );



            console.log(
                "🐭 吱吱核心加载完成"
            );



        }catch(e){


            console.error(
                "🐭 吱吱核心加载失败:",
                e
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
