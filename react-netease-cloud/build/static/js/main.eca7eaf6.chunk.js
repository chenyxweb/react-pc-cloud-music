(this["webpackJsonpreact-template"]=this["webpackJsonpreact-template"]||[]).push([[1],{0:function(t,e){t.exports=React},14:function(t,e){t.exports=ReactDOM},179:function(t,e,n){},187:function(t,e,n){"use strict";n.r(e);var r=n(7),i=n(0),a=n(14),c=n.n(a),o=(n(103),n(86)),s=n.n(o),l=n(26),d=(n(105),n(84)),p=n.n(d),u=n(48),m=n.n(u),f=n(192),h=function(t){var e=t.indicator,n=t.text,i=t.textStyle;return Object(r.jsx)("div",{className:m.a.LoadingPage,children:Object(r.jsxs)("div",{className:m.a.loading,children:[Object(r.jsx)(p.a,{indicator:e}),Object(r.jsx)("div",{style:i,children:n})]})})};h.defaultProps={indicator:Object(r.jsx)(f.a,{style:{fontWeight:700,fontSize:32}}),text:"\u9875\u9762\u52a0\u8f7d\u4e2d...",textStyle:{fontWeight:700,fontSize:14}};var g=h,b=function(t){return Object(i.useEffect)((function(){var t;null===(t=document.querySelector("#root > .app"))||void 0===t||t.scrollTo(0,0)}),[t.location.pathname]),t.children};b.defaultProps={};var v=Object(l.withRouter)(b),y=Object(i.lazy)((function(){return n.e(13).then(n.bind(null,317))})),j=function(){return Object(r.jsxs)("div",{className:"app",children:[Object(r.jsx)(i.Suspense,{fallback:Object(r.jsx)(g,{text:"\u52aa\u529b\u52a0\u8f7d\u4e2d..."}),children:Object(r.jsx)(l.HashRouter,{children:Object(r.jsx)(v,{children:Object(r.jsx)(l.Route,{path:"/",component:y})})})}),Object(r.jsx)(s.a,{visibilityHeight:200,style:{bottom:100},target:function(){return document.querySelector(".app")},children:Object(r.jsx)("div",{className:"back-to-top",children:"UP"})})]})},O=(n(179),n(24)),S=(n(180),n(87)),_=n(88),x=n(49),I=n(90),N=n(28),T=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1?arguments[1]:void 0;switch(e.type){case N.a:return[].concat(Object(I.a)(t),[e.payload]);case N.c:return t.filter((function(t){return t.id!==e.payload}));case N.b:return[];case N.d:return e.payload;default:return t}},R=n(66),L=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0;switch(e.type){case R.a:return e.payload;default:return t}},U=n(29),C=n(47),z=n(67),E=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0;switch(e.type){case z.a:return Object(C.a)(Object(C.a)({},t),{},{isPlay:!t.isPlay});default:return t}},P=Object(O.applyMiddleware)(S.a),G=function(){var t=Object(O.combineReducers)({songList:T,currentSongInfo:L,playBarState:E}),e=JSON.parse(localStorage.getItem(U.a.SONG_LIST)||"[]"),n=JSON.parse(localStorage.getItem(U.a.CURRENT_SONG_INFO)||"{}"),r=Object(O.createStore)(t,{songList:e.length>0?e:x.songList,currentSongInfo:n.name?n:x.currentSongInfo,playBarState:{isPlay:!1}},Object(_.composeWithDevTools)(P));return r.subscribe((function(){var t=r.getState(),e=t.songList,n=t.currentSongInfo;localStorage.setItem(U.a.SONG_LIST,JSON.stringify(e)),localStorage.setItem(U.a.CURRENT_SONG_INFO,JSON.stringify(n))})),r},A=n(61),w=G();c.a.render(Object(r.jsx)(A.a,{store:w,children:Object(r.jsx)(j,{})}),document.getElementById("root"))},189:function(t,e){t.exports=axios},190:function(t,e){t.exports=dayjs},24:function(t,e){t.exports=Redux},26:function(t,e){t.exports=ReactRouterDOM},28:function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"c",(function(){return i})),n.d(e,"b",(function(){return a})),n.d(e,"d",(function(){return c}));var r="ADD_SONG_LIST_ITEM",i="DEL_SONG_LIST_ITEM",a="CLEAR_SONG_LIST",c="REPLACE_SONG_LIST"},29:function(t,e,n){"use strict";e.a={topMenu:[{name:"\u53d1\u73b0\u97f3\u4e50",path:"/"},{name:"\u6211\u7684\u97f3\u4e50",path:"/my"},{name:"\u670b\u53cb",path:"/friend"},{name:"\u5546\u57ce",path:"/mall"},{name:"\u97f3\u4e50\u4eba",path:"/musician"},{name:"\u4e0b\u8f7d\u5ba2\u6237\u7aef",path:"/download"}],subMenu:[{name:"\u63a8\u8350",path:"/discover"},{name:"\u6392\u884c\u699c",path:"/discover/toplist"},{name:"\u6b4c\u5355",path:"/discover/playlist"},{name:"\u4e3b\u64ad\u7535\u53f0",path:"/discover/djradio"},{name:"\u6b4c\u624b",path:"/discover/artist"},{name:"\u65b0\u789f\u4e0a\u67b6",path:"/discover/album"}],SONG_LIST:"songList",CURRENT_SONG_INFO:"currentSongInfo"}},48:function(t,e,n){t.exports={LoadingPage:"LoadingPage_LoadingPage__2RlLE",loading:"LoadingPage_loading__12QsP"}},49:function(t){t.exports=JSON.parse('{"songList":[{"name":"\u832b","id":1495058484,"pst":0,"t":0,"ar":[{"id":12929031,"name":"\u674e\u6da6\u797a","tns":[],"alias":[]}],"alia":[],"pop":100,"st":0,"rt":"","fee":8,"v":3,"crbt":null,"cf":"","al":{"id":98268708,"name":"\u832b","picUrl":"http://p3.music.126.net/qgyYbmmhKqr5A8UqwDk_4A==/109951165465934812.jpg","tns":[],"pic_str":"109951165465934812","pic":109951165465934820},"dt":227213,"h":{"br":320000,"fid":0,"size":9091245,"vd":-45068},"m":{"br":192000,"fid":0,"size":5454765,"vd":-42517},"l":{"br":128000,"fid":0,"size":3636525,"vd":-40956},"a":null,"cd":"01","no":0,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":0,"s_id":0,"mark":8192,"originCoverType":0,"noCopyrightRcmd":null,"rtype":0,"rurl":null,"mst":9,"cp":729013,"mv":0,"publishTime":0},{"name":"\u91ce\u5fc3","id":1803349526,"pst":0,"t":0,"ar":[{"id":5781,"name":"\u859b\u4e4b\u8c26","tns":[],"alias":[]}],"alia":["\u7535\u5f71\u300a\u7f09\u9b42\u300b\u63a8\u5e7f\u66f2"],"pop":100,"st":0,"rt":"","fee":0,"v":3,"crbt":null,"cf":"","al":{"id":120279205,"name":"\u91ce\u5fc3","picUrl":"http://p4.music.126.net/wRWdpTaB7tCKS1TQTLv8BA==/109951165531747155.jpg","tns":[],"pic_str":"109951165531747155","pic":109951165531747150},"dt":220014,"h":{"br":320002,"fid":0,"size":8803309,"vd":-64756},"m":{"br":192002,"fid":0,"size":5282003,"vd":-62280},"l":{"br":128002,"fid":0,"size":3521350,"vd":-60966},"a":null,"cd":"01","no":1,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":1,"s_id":0,"mark":128,"originCoverType":0,"noCopyrightRcmd":null,"rtype":0,"rurl":null,"mst":9,"cp":22036,"mv":0,"publishTime":1607616000000},{"name":"\u8017\u5c3d","id":1498342485,"pst":0,"t":0,"ar":[{"id":5781,"name":"\u859b\u4e4b\u8c26","tns":[],"alias":[]},{"id":12479356,"name":"\u90ed\u806a\u660e","tns":[],"alias":[]}],"alia":[],"pop":100,"st":0,"rt":"","fee":0,"v":3,"crbt":null,"cf":"","al":{"id":98799011,"name":"\u8017\u5c3d","picUrl":"http://p4.music.126.net/yITtaf5rX2hOXQSBn60opA==/109951165498613448.jpg","tns":[],"pic_str":"109951165498613448","pic":109951165498613440},"dt":259199,"h":{"br":320000,"fid":0,"size":10370656,"vd":-54329},"m":{"br":192000,"fid":0,"size":6222411,"vd":-51790},"l":{"br":128000,"fid":0,"size":4148288,"vd":-50175},"a":null,"cd":"01","no":1,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":1,"s_id":0,"mark":0,"originCoverType":0,"noCopyrightRcmd":null,"rtype":0,"rurl":null,"mst":9,"cp":22036,"mv":0,"publishTime":1606406400000}],"currentSongInfo":{"name":"\u832b","id":1495058484,"pst":0,"t":0,"ar":[{"id":12929031,"name":"\u674e\u6da6\u797a","tns":[],"alias":[]}],"alia":[],"pop":100,"st":0,"rt":"","fee":8,"v":3,"crbt":null,"cf":"","al":{"id":98268708,"name":"\u832b","picUrl":"http://p3.music.126.net/qgyYbmmhKqr5A8UqwDk_4A==/109951165465934812.jpg","tns":[],"pic_str":"109951165465934812","pic":109951165465934820},"dt":227213,"h":{"br":320000,"fid":0,"size":9091245,"vd":-45068},"m":{"br":192000,"fid":0,"size":5454765,"vd":-42517},"l":{"br":128000,"fid":0,"size":3636525,"vd":-40956},"a":null,"cd":"01","no":0,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":0,"s_id":0,"mark":8192,"originCoverType":0,"noCopyrightRcmd":null,"rtype":0,"rurl":null,"mst":9,"cp":729013,"mv":0,"publishTime":0}}')},66:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));var r="CHANGE_CURRENT_SONG_INFO"},67:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));var r="CHANGE_IS_PLAY"}},[[187,2,3]]]);