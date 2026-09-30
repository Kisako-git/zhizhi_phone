/**
 * 🐭 吱吱小手机
 */

console.log("🐭 吱吱小手机启动");


if(window.ZhizhiPhoneLoaded){
    console.log("🐭 吱吱小手机已加载");
}
else{

window.ZhizhiPhoneLoaded=true;



// 创建独立挂载容器

let root=document.querySelector("#zhizhi-phone-root");


if(!root){

    root=document.createElement("div");

    root.id="zhizhi-phone-root";

    document.body.appendChild(root);


    console.log(
        "🐭 创建手机挂载容器"
    );

}



// CSS

const BASE_URL =
"https://cdn.jsdelivr.net/gh/Kisako-git/zhizhi_phone@70a90b7/";


const css=document.createElement("link");

css.rel="stylesheet";

css.href=
BASE_URL+
"dist/assets/index-BkuzUcB6.css";


document.head.appendChild(css);



// 加载 Vue

import(
BASE_URL+
"dist/assets/index-DCCUo-0z.js"
)
.then(()=>{

console.log(
"🐭 吱吱小手机 Vue 加载完成"
);


})
.catch(err=>{

console.error(
"🐭 Vue加载失败",
err
);


});

}
