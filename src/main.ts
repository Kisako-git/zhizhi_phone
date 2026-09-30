/**
 * main.ts — 吱吱小手机入口
 *
 * 支持：
 * 1. Vite 独立预览
 * 2. SillyTavern 扩展模式
 */


import { createApp } from 'vue';

import Phone from './components/Phone.vue';

import {
  phone
} from './core/phone-state';


import {
  scanText,
  installHooks,
  loadCachedState
} from './core/message-hook';



import './theme/milk.css';
import './theme/glass.css';
import './theme/dark.css';
import './theme/base.css';



loadCachedState();



/**
 * 创建手机挂载容器
 */
function createPhoneRoot(){

  let root =
    document.querySelector('#zhizhi-phone-root');


  if(!root){

    root =
      document.createElement('div');


    root.id =
      'zhizhi-phone-root';


    document.body.appendChild(root);


    console.log(
      '🐭 创建吱吱手机挂载容器'
    );

  }


  return root;

}




/**
 * 挂载 Vue 手机
 */
function mountPhone(){


  if(
    document.querySelector(
      '#zhizhi-phone-root'
    )?.children.length
  ){

    console.log(
      '🐭 吱吱手机已经挂载'
    );

    return;

  }



  const root =
    createPhoneRoot();



  const app =
    createApp(Phone);



  app.mount(root);



  phone.ownerName =
    '我';



  console.log(
    '🐭 吱吱手机 Vue挂载完成'
  );


}





/**
 * 判断是否本地预览
 */
const isStandalone =
!!document.querySelector(
  '#vite-preview'
);



if(isStandalone){


  console.log(
    '🐭 独立预览模式'
  );


  mountPhone();


  scanText(
    SAMPLE_PHONE
  );


}
else{


  console.log(
    '🐭 SillyTavern模式'
  );


  mountPhone();


  installHooks();


}



/**
 * 示例数据
 * 只用于 Vite 预览
 */
const SAMPLE_PHONE = `<手机>
<角色>吱吱</角色>
<时间>22:30</时间>
<日期>2026-09-30</日期>
<电量>78%</电量>
<网络>5G</网络>

<桌面>

<应用 编号="01" 未读="2">
微信
</应用>

<应用 编号="02" 未读="1">
QQ
</应用>

<应用 编号="03" 未读="0">
小红书
</应用>

</桌面>

</手机>`;