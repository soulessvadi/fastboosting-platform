(window.webpackJsonp=window.webpackJsonp||[]).push([[75],{"1LZE":function(l,n,e){"use strict";e.d(n,"a",function(){return t});var t=function(){function l(l,n){this.el=l,this.router=n,this.colorbutton=!0,this.editbutton=!0,this.togglebutton=!0,this.deletebutton=!0,this.fullscreenbutton=!0,this.custombutton=!1,this.collapsed=!1,this.sortable=!0,this.hidden=!1,this.load=!1,this.refresh=!1}return l.prototype.ngOnInit=function(){var l=this;this.widgetId=this.genId();var n=this.el.nativeElement;n.className+=" jarviswidget",this.sortable&&(n.className+=" jarviswidget-sortable"),this.color&&(n.className+=" jarviswidget-color-"+this.color),["colorbutton","editbutton","togglebutton","deletebutton","fullscreenbutton","custombutton","sortable"].forEach(function(e){l[e]||n.setAttribute("data-widget-"+e,"false")}),["hidden","collapsed"].forEach(function(e){l[e]&&n.setAttribute("data-widget-"+e,"true")})},l.prototype.genId=function(){if(this.name)return this.name;var n=this.el.nativeElement.querySelector("header h2"),e=n?n.textContent.trim():"jarviswidget-"+l.counter++;return e=e.toLowerCase().replace(/\W+/gm,"-"),this.router.url.substr(1).replace(/\//g,"-")+"--"+e},l.prototype.ngAfterViewInit=function(){var l=$(this.el.nativeElement);this.editbutton&&l.find(".widget-body").prepend('<div class="jarviswidget-editbox"><input class="form-control" type="text"></div>')},l.counter=0,l}()},kHXp:function(l,n,e){"use strict";e.d(n,"a",function(){return a}),e.d(n,"b",function(){return o});var t=e("CcnG"),a=(e("1LZE"),e("ZYCi"),t["\u0275crt"]({encapsulation:2,styles:[],data:{}}));function o(l){return t["\u0275vid"](0,[t["\u0275ncd"](null,0)],null,null)}},"vbf+":function(l,n,e){"use strict";e.r(n);var t=e("CcnG"),a=function(){},o=e("pMnS"),u=e("ueff"),i=e("lOTE"),s=e("9TUW"),d=e("WmtN"),r=e("RChO"),c=e("7eBJ"),p=e("Ip0R"),m=e("OZrb"),f=e("DfBv"),h=e("18XJ"),g=e("KCXl"),v=e("49Xn"),y=e("RyNP"),b=e("kHXp"),w=e("1LZE"),C=e("ZYCi"),S="https://maps.googleapis.com/maps/api/js?key="+e("Tia3").a.GOOGLE_API_KEY+"&callback=__onGoogleLoaded",k=function(){function l(){var l=this;this.loadAPI=window.google?Promise.resolve(window.google):new Promise(function(n){window.__onGoogleLoaded=function(l){console.log("google.maps loaded"),n(window.google)},l.loadScript()})}return l.prototype.loadScript=function(){var l=document.createElement("script");l.src=S,l.type="text/javascript",document.getElementsByTagName("head")[0].appendChild(l)},l}(),E=(e("dJ3e"),function(){function l(l){this.jsonApiService=l}return l.prototype.fetchStyle=function(l){return this.jsonApiService.fetch(l.url)},l}()),I=function(){function l(l,n){this.apiService=l,this.styleService=n,this.styles=[{key:"colorful",name:"Colorful",url:"/maps/colorful.json"},{key:"greyscale",name:"Greyscale",url:"/maps/greyscale.json"},{key:"metro",name:"Metro",url:"/maps/metro.json"},{key:"mono-color",name:"Mono-color",url:"/maps/mono-color.json"},{key:"monochrome",name:"Monochrome",url:"/maps/monochrome.json"},{key:"nightvision",name:"Nightvision",url:"/maps/nightvision.json"},{key:"nightvision-highlight",name:"Nightvision Highlight",url:"/maps/nightvision-highlight.json"},{key:"old-paper",name:"Old Paper",url:"/maps/old-paper.json"}]}return l.prototype.ngOnInit=function(){var l=this;this.activeStyle=this.styles[0],this.apiService.loadAPI.then(function(n){l.map=new n.maps.Map(document.getElementById("map-canvas"),{center:{lat:-34.397,lng:150.644},zoom:8}),l.fetchStyle(l.activeStyle)})},l.prototype.ngOnDestroy=function(){},l.prototype.setStyle=function(l){this.activeStyle=l,this.fetchStyle(l)},l.prototype.fetchStyle=function(l){var n=this;this.styleService.fetchStyle(l).subscribe(function(e){n.map.mapTypes.set(l.key,new google.maps.StyledMapType(e,{name:l.name})),n.map.setMapTypeId(l.key)})},l}(),j=t["\u0275crt"]({encapsulation:2,styles:[],data:{}});function M(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,3,"button",[["class","btn btn-default"]],null,[[null,"click"]],function(l,n,e){var t=!0;return"click"===n&&(t=!1!==l.component.setStyle(l.context.$implicit)&&t),t},null,null)),t["\u0275did"](1,278528,null,0,p.NgClass,[t.IterableDiffers,t.KeyValueDiffers,t.ElementRef,t.Renderer2],{klass:[0,"klass"],ngClass:[1,"ngClass"]},null),t["\u0275pod"](2,{active:0}),(l()(),t["\u0275ted"](3,null,[""," "]))],function(l,n){l(n,1,0,"btn btn-default",l(n,2,0,n.component.activeStyle==n.context.$implicit))},function(l,n){l(n,3,0,n.context.$implicit.name)})}function R(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,25,"div",[["id","content"]],null,null,null,null,null)),(l()(),t["\u0275eld"](1,0,null,null,5,"div",[["class","row"]],null,null,null,null,null)),(l()(),t["\u0275eld"](2,0,null,null,2,"sa-big-breadcrumbs",[["class","col-xs-12 col-sm-7 col-md-7 col-lg-4"],["icon","map-marker"]],null,null,null,m.b,m.a)),t["\u0275did"](3,114688,null,0,f.a,[p.Location],{icon:[0,"icon"],items:[1,"items"]},null),t["\u0275pad"](4,2),(l()(),t["\u0275eld"](5,0,null,null,1,"sa-stats",[["class","hidden-3xs"]],null,null,null,h.b,h.a)),t["\u0275did"](6,114688,null,0,g.a,[],null,null),(l()(),t["\u0275eld"](7,0,null,null,4,"div",[["class","row"]],null,null,null,null,null)),(l()(),t["\u0275eld"](8,0,null,null,2,"div",[["class","col-xs-12"]],null,null,null,null,null)),(l()(),t["\u0275and"](16777216,null,null,1,null,M)),t["\u0275did"](10,802816,null,0,p.NgForOf,[t.ViewContainerRef,t.TemplateRef,t.IterableDiffers],{ngForOf:[0,"ngForOf"]},null),(l()(),t["\u0275eld"](11,0,null,null,0,"hr",[],null,null,null,null,null)),(l()(),t["\u0275eld"](12,0,null,null,13,"sa-widgets-grid",[],null,null,null,v.b,v.a)),t["\u0275did"](13,4243456,null,0,y.a,[t.ElementRef],null,null),(l()(),t["\u0275eld"](14,0,null,0,11,"div",[["class","row"]],null,null,null,null,null)),(l()(),t["\u0275eld"](15,0,null,null,10,"article",[["class","col-xs-12 col-sm-12 col-md-12 col-lg-12"]],null,null,null,null,null)),(l()(),t["\u0275eld"](16,0,null,null,9,"div",[["color","white"],["sa-widget",""]],[[1,"id",0]],null,null,b.b,b.a)),t["\u0275did"](17,4308992,null,0,w.a,[t.ElementRef,C.n],{editbutton:[0,"editbutton"],deletebutton:[1,"deletebutton"],fullscreenbutton:[2,"fullscreenbutton"],color:[3,"color"]},null),(l()(),t["\u0275eld"](18,0,null,0,4,"header",[],null,null,null,null,null)),(l()(),t["\u0275eld"](19,0,null,null,1,"span",[["class","widget-icon"]],null,null,null,null,null)),(l()(),t["\u0275eld"](20,0,null,null,0,"i",[["class","fa fa-map-marker"]],null,null,null,null,null)),(l()(),t["\u0275eld"](21,0,null,null,1,"h2",[],null,null,null,null,null)),(l()(),t["\u0275ted"](-1,null,["Map demo"])),(l()(),t["\u0275eld"](23,0,null,0,2,"div",[],null,null,null,null,null)),(l()(),t["\u0275eld"](24,0,null,null,1,"div",[["class","widget-body no-padding"]],null,null,null,null,null)),(l()(),t["\u0275eld"](25,0,null,null,0,"div",[["id","map-canvas"]],null,null,null,null,null))],function(l,n){var e=n.component;l(n,3,0,"map-marker",l(n,4,0,"Google Map","Custom Skins")),l(n,6,0),l(n,10,0,e.styles),l(n,17,0,!1,!1,!1,"white")},function(l,n){l(n,16,0,t["\u0275nov"](n,17).widgetId)})}var x=t["\u0275ccf"]("sa-maps",I,function(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,1,"sa-maps",[],null,null,null,R,j)),t["\u0275did"](1,245760,null,0,I,[k,E],null,null)],function(l,n){l(n,1,0)},null)},{},{},[]),N=e("gIcY"),O=e("aAiY"),A=e("tyBe"),L=e("1rfl"),P=e("S7LP"),F=e("6aHO"),_=e("008C"),T=e("T7CS"),Z=e("dArN"),G=e("H0gW"),V=e("kXiY"),X=e("OQnT"),Y=e("uihz"),q=e("Fq6B"),z=e("urxg"),B=e("6iS2"),D=e("qina"),J=e("MQax"),W=e("9Xeq"),H=e("xfRZ"),$=e("weob"),K=e("Xkvx"),Q=e("n2tS"),U=e("RtVY"),ll=e("Iu/P"),nl=e("Jg5P"),el=e("pV/B"),tl=e("zCE2"),al=e("jkFC"),ol=e("SxmI"),ul=e("z+jS"),il=e("aZVl"),sl=e("+1h7"),dl=e("9VEM"),rl=e("1EDf"),cl=e("MabY"),pl=e("U8F9"),ml=e("W9vo"),fl=e("1a3l"),hl=e("E5q3"),gl=e("ErdI"),vl=e("fWaz"),yl=e("PCNd"),bl=e("OsAV");e.d(n,"MapsModuleNgFactory",function(){return wl});var wl=t["\u0275cmf"](a,[],function(l){return t["\u0275mod"]([t["\u0275mpd"](512,t.ComponentFactoryResolver,t["\u0275CodegenComponentFactoryResolver"],[[8,[o.a,u.a,i.a,s.a,d.a,r.a,c.a,x]],[3,t.ComponentFactoryResolver],t.NgModuleRef]),t["\u0275mpd"](4608,p.NgLocalization,p.NgLocaleLocalization,[t.LOCALE_ID,[2,p["\u0275angular_packages_common_common_a"]]]),t["\u0275mpd"](4608,N.t,N.t,[]),t["\u0275mpd"](4608,O.a,O.a,[A.a,t.ApplicationRef]),t["\u0275mpd"](4608,L.a,L.a,[]),t["\u0275mpd"](4608,P.a,P.a,[]),t["\u0275mpd"](4608,F.a,F.a,[t.ComponentFactoryResolver,t.NgZone,t.Injector,P.a,t.ApplicationRef]),t["\u0275mpd"](4608,_.a,_.a,[t.RendererFactory2,F.a]),t["\u0275mpd"](4608,T.a,T.a,[]),t["\u0275mpd"](4608,Z.a,Z.a,[]),t["\u0275mpd"](4608,G.a,G.a,[]),t["\u0275mpd"](4608,V.a,V.a,[]),t["\u0275mpd"](4608,X.a,X.a,[]),t["\u0275mpd"](4608,Y.a,Y.a,[]),t["\u0275mpd"](4608,k,k,[]),t["\u0275mpd"](4608,E,E,[A.a]),t["\u0275mpd"](1073742336,C.r,C.r,[[2,C.x],[2,C.n]]),t["\u0275mpd"](1073742336,p.CommonModule,p.CommonModule,[]),t["\u0275mpd"](1073742336,N.q,N.q,[]),t["\u0275mpd"](1073742336,N.e,N.e,[]),t["\u0275mpd"](1073742336,q.a,q.a,[]),t["\u0275mpd"](1073742336,z.PopoverModule,z.PopoverModule,[]),t["\u0275mpd"](1073742336,B.a,B.a,[]),t["\u0275mpd"](1073742336,D.a,D.a,[]),t["\u0275mpd"](1073742336,J.a,J.a,[]),t["\u0275mpd"](1073742336,W.a,W.a,[]),t["\u0275mpd"](1073742336,H.a,H.a,[]),t["\u0275mpd"](1073742336,$.a,$.a,[]),t["\u0275mpd"](1073742336,K.a,K.a,[]),t["\u0275mpd"](1073742336,Q.a,Q.a,[]),t["\u0275mpd"](1073742336,U.a,U.a,[]),t["\u0275mpd"](1073742336,ll.a,ll.a,[]),t["\u0275mpd"](1073742336,nl.a,nl.a,[]),t["\u0275mpd"](1073742336,el.a,el.a,[]),t["\u0275mpd"](1073742336,tl.a,tl.a,[]),t["\u0275mpd"](1073742336,al.a,al.a,[]),t["\u0275mpd"](1073742336,ol.a,ol.a,[]),t["\u0275mpd"](1073742336,ul.a,ul.a,[]),t["\u0275mpd"](1073742336,il.a,il.a,[]),t["\u0275mpd"](1073742336,sl.a,sl.a,[]),t["\u0275mpd"](1073742336,dl.a,dl.a,[]),t["\u0275mpd"](1073742336,rl.a,rl.a,[]),t["\u0275mpd"](1073742336,cl.a,cl.a,[]),t["\u0275mpd"](1073742336,pl.a,pl.a,[]),t["\u0275mpd"](1073742336,ml.a,ml.a,[]),t["\u0275mpd"](1073742336,fl.a,fl.a,[]),t["\u0275mpd"](1073742336,hl.a,hl.a,[]),t["\u0275mpd"](1073742336,gl.a,gl.a,[]),t["\u0275mpd"](1073742336,vl.a,vl.a,[]),t["\u0275mpd"](1073742336,yl.a,yl.a,[]),t["\u0275mpd"](1073742336,a,a,[]),t["\u0275mpd"](256,bl.a,{autoClose:!0},[]),t["\u0275mpd"](1024,C.l,function(){return[[{path:"",component:I}]]},[])])})}}]);