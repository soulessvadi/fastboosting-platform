(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{"1LZE":function(n,e,l){"use strict";l.d(e,"a",function(){return t});var t=function(){function n(n,e){this.el=n,this.router=e,this.colorbutton=!0,this.editbutton=!0,this.togglebutton=!0,this.deletebutton=!0,this.fullscreenbutton=!0,this.custombutton=!1,this.collapsed=!1,this.sortable=!0,this.hidden=!1,this.load=!1,this.refresh=!1}return n.prototype.ngOnInit=function(){var n=this;this.widgetId=this.genId();var e=this.el.nativeElement;e.className+=" jarviswidget",this.sortable&&(e.className+=" jarviswidget-sortable"),this.color&&(e.className+=" jarviswidget-color-"+this.color),["colorbutton","editbutton","togglebutton","deletebutton","fullscreenbutton","custombutton","sortable"].forEach(function(l){n[l]||e.setAttribute("data-widget-"+l,"false")}),["hidden","collapsed"].forEach(function(l){n[l]&&e.setAttribute("data-widget-"+l,"true")})},n.prototype.genId=function(){if(this.name)return this.name;var e=this.el.nativeElement.querySelector("header h2"),l=e?e.textContent.trim():"jarviswidget-"+n.counter++;return l=l.toLowerCase().replace(/\W+/gm,"-"),this.router.url.substr(1).replace(/\//g,"-")+"--"+l},n.prototype.ngAfterViewInit=function(){var n=$(this.el.nativeElement);this.editbutton&&n.find(".widget-body").prepend('<div class="jarviswidget-editbox"><input class="form-control" type="text"></div>')},n.counter=0,n}()},"8rVx":function(n,e){n.exports=function(n){function e(n){"undefined"!=typeof console&&(console.error||console.log)("[Script Loader]",n)}try{"undefined"!=typeof execScript&&"undefined"!=typeof attachEvent&&"undefined"==typeof addEventListener?execScript(n):"undefined"!=typeof eval?eval.call(null,n):e("EvalError: No eval function available")}catch(n){e(n)}}},dGG8:function(n,e,l){"use strict";l.r(e);var t=l("CcnG"),s=function(){},i=l("pMnS"),o=l("ueff"),a=l("lOTE"),u=l("9TUW"),d=l("WmtN"),r=l("RChO"),p=l("7eBJ"),c=l("OZrb"),h=l("DfBv"),m=l("Ip0R"),f=l("18XJ"),g=l("KCXl"),v=l("49Xn"),E=l("RyNP"),b=l("kHXp"),w=l("/NlF"),N=l("joFS"),C=l("1LZE"),y=l("ZYCi"),x=(l("zi2X"),1),X=function(){function n(n,e){this.el=n,this.renderer=e,this.change=new t.EventEmitter}return n.prototype.ngOnInit=function(){this.render()},n.prototype.ngOnChanges=function(){this.render()},n.prototype.render=function(){var n=this;if(this.items){var e=this.el.nativeElement.getElementsByTagName("div")[0];e.appendChild(this.createBranch(this.items));var l=this.options||{};$(e).nestable(l),$(e).on("change",function(){n.change.emit($(e).nestable("serialize"))})}},n.prototype.createChild=function(n){var e=document.createElement("li");if(e.className="dd-item",e.dataset.id=n.id||"NestableListComponent"+x++,n.content){var l=document.createElement("div");l.className="dd-handle",l.innerHTML=n.content,e.appendChild(l)}if(n.children){var t=this.createBranch(n.children);e.appendChild(t)}return e},n.prototype.createBranch=function(n){var e=this,l=document.createElement("ol");return l.className="dd-list",n.forEach(function(n){l.appendChild(e.createChild(n))}),l},n}(),Y=t["\u0275crt"]({encapsulation:2,styles:[],data:{}});function R(n){return t["\u0275vid"](0,[(n()(),t["\u0275eld"](0,0,null,null,0,"div",[["class","dd"]],null,null,null,null,null))],null,null)}l("dJ3e");var D=function(){function n(n){this.jsonApiService=n}return n.prototype.ngOnInit=function(){var n=this;this.jsonApiService.fetch("/ui-examples/nestable-lists.json").subscribe(function(e){n.demo1=e.demo1,n.demo2=e.demo2,n.demo3=e.demo2})},n.prototype.onChange1=function(n){this.nestable1DemoOutput=n},n.prototype.onChange2=function(n){this.nestable2DemoOutput=n},n.prototype.onChange3=function(n){this.nestable1DemoOutput=n},n}(),A=l("tyBe"),I=t["\u0275crt"]({encapsulation:2,styles:[],data:{}});function L(n){return t["\u0275vid"](0,[(n()(),t["\u0275eld"](0,0,null,null,61,"div",[["id","content"]],null,null,null,null,null)),(n()(),t["\u0275eld"](1,0,null,null,5,"div",[["class","row"]],null,null,null,null,null)),(n()(),t["\u0275eld"](2,0,null,null,2,"sa-big-breadcrumbs",[["class","col-xs-12 col-sm-7 col-md-7 col-lg-4"],["icon","desktop"]],null,null,null,c.b,c.a)),t["\u0275did"](3,114688,null,0,h.a,[m.Location],{icon:[0,"icon"],items:[1,"items"]},null),t["\u0275pad"](4,2),(n()(),t["\u0275eld"](5,0,null,null,1,"sa-stats",[],null,null,null,f.b,f.a)),t["\u0275did"](6,114688,null,0,g.a,[],null,null),(n()(),t["\u0275eld"](7,0,null,null,54,"sa-widgets-grid",[],null,null,null,v.b,v.a)),t["\u0275did"](8,4243456,null,0,E.a,[t.ElementRef],null,null),(n()(),t["\u0275eld"](9,0,null,0,31,"div",[["class","row"]],null,null,null,null,null)),(n()(),t["\u0275eld"](10,0,null,null,30,"article",[["class","col-sm-12"]],null,null,null,null,null)),(n()(),t["\u0275eld"](11,0,null,null,29,"div",[["class","well"],["sa-widget",""],["saEasyPieChartContainer",""],["saSparklineContainer",""]],[[1,"id",0]],null,null,b.b,b.a)),t["\u0275did"](12,3162112,null,0,w.a,[t.ElementRef],null,null),t["\u0275did"](13,81920,null,0,N.a,[t.ElementRef],null,null),t["\u0275did"](14,4308992,null,0,C.a,[t.ElementRef,y.n],null,null),(n()(),t["\u0275eld"](15,0,null,0,4,"header",[],null,null,null,null,null)),(n()(),t["\u0275eld"](16,0,null,null,1,"span",[["class","widget-icon"]],null,null,null,null,null)),(n()(),t["\u0275eld"](17,0,null,null,0,"i",[["class","fa fa-comments"]],null,null,null,null,null)),(n()(),t["\u0275eld"](18,0,null,null,1,"h2",[],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,["My Data "])),(n()(),t["\u0275eld"](20,0,null,0,20,"div",[],null,null,null,null,null)),(n()(),t["\u0275eld"](21,0,null,null,19,"div",[["class","widget-body"]],null,null,null,null,null)),(n()(),t["\u0275eld"](22,0,null,null,18,"div",[["class","row"]],null,null,null,null,null)),(n()(),t["\u0275eld"](23,0,null,null,5,"div",[["class","col-sm-6 col-lg-4"]],null,null,null,null,null)),(n()(),t["\u0275eld"](24,0,null,null,1,"h6",[],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,["Nestable List #1"])),(n()(),t["\u0275eld"](26,0,null,null,2,"sa-nestable-list",[],null,[[null,"change"]],function(n,e,l){var t=!0;return"change"===e&&(t=!1!==n.component.onChange1(l)&&t),t},R,Y)),t["\u0275did"](27,638976,null,0,X,[t.ElementRef,t.Renderer],{items:[0,"items"],options:[1,"options"]},{change:"change"}),t["\u0275pod"](28,{group:0}),(n()(),t["\u0275eld"](29,0,null,null,5,"div",[["class","col-sm-6 col-lg-4"]],null,null,null,null,null)),(n()(),t["\u0275eld"](30,0,null,null,1,"h6",[],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,["Nestable List #2"])),(n()(),t["\u0275eld"](32,0,null,null,2,"sa-nestable-list",[],null,[[null,"change"]],function(n,e,l){var t=!0;return"change"===e&&(t=!1!==n.component.onChange2(l)&&t),t},R,Y)),t["\u0275did"](33,638976,null,0,X,[t.ElementRef,t.Renderer],{items:[0,"items"],options:[1,"options"]},{change:"change"}),t["\u0275pod"](34,{group:0}),(n()(),t["\u0275eld"](35,0,null,null,5,"div",[["class","col-sm-6 col-lg-4"]],null,null,null,null,null)),(n()(),t["\u0275eld"](36,0,null,null,1,"h6",[],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,["Nestable List #3 (with drag handle)"])),(n()(),t["\u0275eld"](38,0,null,null,2,"sa-nestable-list",[],null,[[null,"change"]],function(n,e,l){var t=!0;return"change"===e&&(t=!1!==n.component.onChange3(l)&&t),t},R,Y)),t["\u0275did"](39,638976,null,0,X,[t.ElementRef,t.Renderer],{items:[0,"items"],options:[1,"options"]},{change:"change"}),t["\u0275pod"](40,{group:0}),(n()(),t["\u0275eld"](41,0,null,0,20,"div",[["class","row"]],null,null,null,null,null)),(n()(),t["\u0275eld"](42,0,null,null,19,"div",[["class","col-sm-12"]],null,null,null,null,null)),(n()(),t["\u0275eld"](43,0,null,null,18,"div",[["class","well well-sm well-light"]],null,null,null,null,null)),(n()(),t["\u0275eld"](44,0,null,null,2,"p",[],null,null,null,null,null)),(n()(),t["\u0275eld"](45,0,null,null,1,"strong",[],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,["Serialised Output (per list)"])),(n()(),t["\u0275eld"](47,0,null,null,1,"p",[["class","alert alert-info"]],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,[" Preview of the lists update DB input. "])),(n()(),t["\u0275eld"](49,0,null,null,12,"div",[["class","row"]],null,null,null,null,null)),(n()(),t["\u0275eld"](50,0,null,null,3,"div",[["class","col-sm-4"]],null,null,null,null,null)),(n()(),t["\u0275eld"](51,0,null,null,2,"pre",[],null,null,null,null,null)),(n()(),t["\u0275ted"](52,null,["",""])),t["\u0275pid"](0,m.JsonPipe,[]),(n()(),t["\u0275eld"](54,0,null,null,3,"div",[["class","col-sm-4"]],null,null,null,null,null)),(n()(),t["\u0275eld"](55,0,null,null,2,"pre",[],null,null,null,null,null)),(n()(),t["\u0275ted"](56,null,["",""])),t["\u0275pid"](0,m.JsonPipe,[]),(n()(),t["\u0275eld"](58,0,null,null,3,"div",[["class","col-sm-4"]],null,null,null,null,null)),(n()(),t["\u0275eld"](59,0,null,null,2,"pre",[],null,null,null,null,null)),(n()(),t["\u0275ted"](60,null,["",""])),t["\u0275pid"](0,m.JsonPipe,[])],function(n,e){var l=e.component;n(e,3,0,"desktop",n(e,4,0,"UI Elements","Nestable Lists")),n(e,6,0),n(e,13,0),n(e,14,0),n(e,27,0,l.demo1,n(e,28,0,1)),n(e,33,0,l.demo2,n(e,34,0,1)),n(e,39,0,l.demo3,n(e,40,0,2))},function(n,e){var l=e.component;n(e,11,0,t["\u0275nov"](e,14).widgetId),n(e,52,0,t["\u0275unv"](e,52,0,t["\u0275nov"](e,53).transform(l.nestable1DemoOutput))),n(e,56,0,t["\u0275unv"](e,56,0,t["\u0275nov"](e,57).transform(l.nestable2DemoOutput))),n(e,60,0,t["\u0275unv"](e,60,0,t["\u0275nov"](e,61).transform(l.nestable3DemoOutput)))})}var S=t["\u0275ccf"]("sa-nestable-lists",D,function(n){return t["\u0275vid"](0,[(n()(),t["\u0275eld"](0,0,null,null,1,"sa-nestable-lists",[],null,null,null,L,I)),t["\u0275did"](1,114688,null,0,D,[A.a],null,null)],function(n,e){n(e,1,0)},null)},{},{},[]),M=l("gIcY"),P=l("aAiY"),T=l("1rfl"),O=l("S7LP"),k=l("6aHO"),B=l("008C"),j=l("T7CS"),z=l("dArN"),F=l("H0gW"),Z=l("kXiY"),H=l("OQnT"),J=l("uihz"),q=l("Fq6B"),V=l("urxg"),W=l("6iS2"),_=l("qina"),G=l("MQax"),Q=l("9Xeq"),U=l("xfRZ"),K=l("weob"),nn=l("Xkvx"),en=l("n2tS"),ln=l("RtVY"),tn=l("Iu/P"),sn=l("Jg5P"),on=l("pV/B"),an=l("zCE2"),un=l("jkFC"),dn=l("SxmI"),rn=l("z+jS"),pn=l("aZVl"),cn=l("+1h7"),hn=l("9VEM"),mn=l("1EDf"),fn=l("MabY"),gn=l("U8F9"),vn=l("W9vo"),En=l("1a3l"),bn=l("E5q3"),wn=l("ErdI"),Nn=l("fWaz"),Cn=l("PCNd"),yn=function(){},xn=l("OsAV");l.d(e,"NestableListsModuleNgFactory",function(){return Xn});var Xn=t["\u0275cmf"](s,[],function(n){return t["\u0275mod"]([t["\u0275mpd"](512,t.ComponentFactoryResolver,t["\u0275CodegenComponentFactoryResolver"],[[8,[i.a,o.a,a.a,u.a,d.a,r.a,p.a,S]],[3,t.ComponentFactoryResolver],t.NgModuleRef]),t["\u0275mpd"](4608,m.NgLocalization,m.NgLocaleLocalization,[t.LOCALE_ID,[2,m["\u0275angular_packages_common_common_a"]]]),t["\u0275mpd"](4608,M.t,M.t,[]),t["\u0275mpd"](4608,P.a,P.a,[A.a,t.ApplicationRef]),t["\u0275mpd"](4608,T.a,T.a,[]),t["\u0275mpd"](4608,O.a,O.a,[]),t["\u0275mpd"](4608,k.a,k.a,[t.ComponentFactoryResolver,t.NgZone,t.Injector,O.a,t.ApplicationRef]),t["\u0275mpd"](4608,B.a,B.a,[t.RendererFactory2,k.a]),t["\u0275mpd"](4608,j.a,j.a,[]),t["\u0275mpd"](4608,z.a,z.a,[]),t["\u0275mpd"](4608,F.a,F.a,[]),t["\u0275mpd"](4608,Z.a,Z.a,[]),t["\u0275mpd"](4608,H.a,H.a,[]),t["\u0275mpd"](4608,J.a,J.a,[]),t["\u0275mpd"](1073742336,m.CommonModule,m.CommonModule,[]),t["\u0275mpd"](1073742336,y.r,y.r,[[2,y.x],[2,y.n]]),t["\u0275mpd"](1073742336,M.q,M.q,[]),t["\u0275mpd"](1073742336,M.e,M.e,[]),t["\u0275mpd"](1073742336,q.a,q.a,[]),t["\u0275mpd"](1073742336,V.PopoverModule,V.PopoverModule,[]),t["\u0275mpd"](1073742336,W.a,W.a,[]),t["\u0275mpd"](1073742336,_.a,_.a,[]),t["\u0275mpd"](1073742336,G.a,G.a,[]),t["\u0275mpd"](1073742336,Q.a,Q.a,[]),t["\u0275mpd"](1073742336,U.a,U.a,[]),t["\u0275mpd"](1073742336,K.a,K.a,[]),t["\u0275mpd"](1073742336,nn.a,nn.a,[]),t["\u0275mpd"](1073742336,en.a,en.a,[]),t["\u0275mpd"](1073742336,ln.a,ln.a,[]),t["\u0275mpd"](1073742336,tn.a,tn.a,[]),t["\u0275mpd"](1073742336,sn.a,sn.a,[]),t["\u0275mpd"](1073742336,on.a,on.a,[]),t["\u0275mpd"](1073742336,an.a,an.a,[]),t["\u0275mpd"](1073742336,un.a,un.a,[]),t["\u0275mpd"](1073742336,dn.a,dn.a,[]),t["\u0275mpd"](1073742336,rn.a,rn.a,[]),t["\u0275mpd"](1073742336,pn.a,pn.a,[]),t["\u0275mpd"](1073742336,cn.a,cn.a,[]),t["\u0275mpd"](1073742336,hn.a,hn.a,[]),t["\u0275mpd"](1073742336,mn.a,mn.a,[]),t["\u0275mpd"](1073742336,fn.a,fn.a,[]),t["\u0275mpd"](1073742336,gn.a,gn.a,[]),t["\u0275mpd"](1073742336,vn.a,vn.a,[]),t["\u0275mpd"](1073742336,En.a,En.a,[]),t["\u0275mpd"](1073742336,bn.a,bn.a,[]),t["\u0275mpd"](1073742336,wn.a,wn.a,[]),t["\u0275mpd"](1073742336,Nn.a,Nn.a,[]),t["\u0275mpd"](1073742336,Cn.a,Cn.a,[]),t["\u0275mpd"](1073742336,yn,yn,[]),t["\u0275mpd"](1073742336,s,s,[]),t["\u0275mpd"](256,xn.a,{autoClose:!0},[]),t["\u0275mpd"](1024,y.l,function(){return[[{path:"",component:D}]]},[])])})},kHXp:function(n,e,l){"use strict";l.d(e,"a",function(){return s}),l.d(e,"b",function(){return i});var t=l("CcnG"),s=(l("1LZE"),l("ZYCi"),t["\u0275crt"]({encapsulation:2,styles:[],data:{}}));function i(n){return t["\u0275vid"](0,[t["\u0275ncd"](null,0)],null,null)}},kcv4:function(n,e){n.exports="/*!\n * Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/\n * Dual-licensed under the BSD or MIT licenses\n */\n;(function($, window, document, undefined)\n{\n    var hasTouch = 'ontouchstart' in document;\n\n    /**\n     * Detect CSS pointer-events property\n     * events are normally disabled on the dragging element to avoid conflicts\n     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js\n     */\n    var hasPointerEvents = (function()\n    {\n        var el    = document.createElement('div'),\n            docEl = document.documentElement;\n        if (!('pointerEvents' in el.style)) {\n            return false;\n        }\n        el.style.pointerEvents = 'auto';\n        el.style.pointerEvents = 'x';\n        docEl.appendChild(el);\n        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';\n        docEl.removeChild(el);\n        return !!supports;\n    })();\n\n    var defaults = {\n            listNodeName    : 'ol',\n            itemNodeName    : 'li',\n            rootClass       : 'dd',\n            listClass       : 'dd-list',\n            itemClass       : 'dd-item',\n            dragClass       : 'dd-dragel',\n            handleClass     : 'dd-handle',\n            collapsedClass  : 'dd-collapsed',\n            placeClass      : 'dd-placeholder',\n            noDragClass     : 'dd-nodrag',\n            emptyClass      : 'dd-empty',\n            expandBtnHTML   : '<button data-action=\"expand\" type=\"button\">Expand</button>',\n            collapseBtnHTML : '<button data-action=\"collapse\" type=\"button\">Collapse</button>',\n            group           : 0,\n            maxDepth        : 5,\n            threshold       : 20\n        };\n\n    function Plugin(element, options)\n    {\n        this.w  = $(document);\n        this.el = $(element);\n        this.options = $.extend({}, defaults, options);\n        this.init();\n    }\n\n    Plugin.prototype = {\n\n        init: function()\n        {\n            var list = this;\n\n            list.reset();\n\n            list.el.data('nestable-group', this.options.group);\n\n            list.placeEl = $('<div class=\"' + list.options.placeClass + '\"/>');\n\n            $.each(this.el.find(list.options.itemNodeName), function(k, el) {\n                list.setParent($(el));\n            });\n\n            list.el.on('click', 'button', function(e) {\n                if (list.dragEl) {\n                    return;\n                }\n                var target = $(e.currentTarget),\n                    action = target.data('action'),\n                    item   = target.parent(list.options.itemNodeName);\n                if (action === 'collapse') {\n                    list.collapseItem(item);\n                }\n                if (action === 'expand') {\n                    list.expandItem(item);\n                }\n            });\n\n            var onStartEvent = function(e)\n            {\n                var handle = $(e.target);\n                if (!handle.hasClass(list.options.handleClass)) {\n                    if (handle.closest('.' + list.options.noDragClass).length) {\n                        return;\n                    }\n                    handle = handle.closest('.' + list.options.handleClass);\n                }\n\n                if (!handle.length || list.dragEl) {\n                    return;\n                }\n\n                list.isTouch = /^touch/.test(e.type);\n                if (list.isTouch && e.touches.length !== 1) {\n                    return;\n                }\n\n                e.preventDefault();\n                list.dragStart(e.touches ? e.touches[0] : e);\n            };\n\n            var onMoveEvent = function(e)\n            {\n                if (list.dragEl) {\n                    e.preventDefault();\n                    list.dragMove(e.touches ? e.touches[0] : e);\n                }\n            };\n\n            var onEndEvent = function(e)\n            {\n                if (list.dragEl) {\n                    e.preventDefault();\n                    list.dragStop(e.touches ? e.touches[0] : e);\n                }\n            };\n\n            if (hasTouch) {\n                list.el[0].addEventListener('touchstart', onStartEvent, false);\n                window.addEventListener('touchmove', onMoveEvent, false);\n                window.addEventListener('touchend', onEndEvent, false);\n                window.addEventListener('touchcancel', onEndEvent, false);\n            }\n\n            list.el.on('mousedown', onStartEvent);\n            list.w.on('mousemove', onMoveEvent);\n            list.w.on('mouseup', onEndEvent);\n\n        },\n\n        serialize: function()\n        {\n            var data,\n                depth = 0,\n                list  = this;\n                step  = function(level, depth)\n                {\n                    var array = [ ],\n                        items = level.children(list.options.itemNodeName);\n                    items.each(function()\n                    {\n                        var li   = $(this),\n                            item = $.extend({}, li.data()),\n                            sub  = li.children(list.options.listNodeName);\n                        if (sub.length) {\n                            item.children = step(sub, depth + 1);\n                        }\n                        array.push(item);\n                    });\n                    return array;\n                };\n            data = step(list.el.find(list.options.listNodeName).first(), depth);\n            return data;\n        },\n\n        serialise: function()\n        {\n            return this.serialize();\n        },\n\n        reset: function()\n        {\n            this.mouse = {\n                offsetX   : 0,\n                offsetY   : 0,\n                startX    : 0,\n                startY    : 0,\n                lastX     : 0,\n                lastY     : 0,\n                nowX      : 0,\n                nowY      : 0,\n                distX     : 0,\n                distY     : 0,\n                dirAx     : 0,\n                dirX      : 0,\n                dirY      : 0,\n                lastDirX  : 0,\n                lastDirY  : 0,\n                distAxX   : 0,\n                distAxY   : 0\n            };\n            this.isTouch    = false;\n            this.moving     = false;\n            this.dragEl     = null;\n            this.dragRootEl = null;\n            this.dragDepth  = 0;\n            this.hasNewRoot = false;\n            this.pointEl    = null;\n        },\n\n        expandItem: function(li)\n        {\n            li.removeClass(this.options.collapsedClass);\n            li.children('[data-action=\"expand\"]').hide();\n            li.children('[data-action=\"collapse\"]').show();\n            li.children(this.options.listNodeName).show();\n        },\n\n        collapseItem: function(li)\n        {\n            var lists = li.children(this.options.listNodeName);\n            if (lists.length) {\n                li.addClass(this.options.collapsedClass);\n                li.children('[data-action=\"collapse\"]').hide();\n                li.children('[data-action=\"expand\"]').show();\n                li.children(this.options.listNodeName).hide();\n            }\n        },\n\n        expandAll: function()\n        {\n            var list = this;\n            list.el.find(list.options.itemNodeName).each(function() {\n                list.expandItem($(this));\n            });\n        },\n\n        collapseAll: function()\n        {\n            var list = this;\n            list.el.find(list.options.itemNodeName).each(function() {\n                list.collapseItem($(this));\n            });\n        },\n\n        setParent: function(li)\n        {\n            if (li.children(this.options.listNodeName).length) {\n                li.prepend($(this.options.expandBtnHTML));\n                li.prepend($(this.options.collapseBtnHTML));\n            }\n            li.children('[data-action=\"expand\"]').hide();\n        },\n\n        unsetParent: function(li)\n        {\n            li.removeClass(this.options.collapsedClass);\n            li.children('[data-action]').remove();\n            li.children(this.options.listNodeName).remove();\n        },\n\n        dragStart: function(e)\n        {\n            var mouse    = this.mouse,\n                target   = $(e.target),\n                dragItem = target.closest(this.options.itemNodeName);\n\n            this.placeEl.css('height', dragItem.height());\n\n            mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;\n            mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;\n            mouse.startX = mouse.lastX = e.pageX;\n            mouse.startY = mouse.lastY = e.pageY;\n\n            this.dragRootEl = this.el;\n\n            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);\n            this.dragEl.css('width', dragItem.width());\n\n            dragItem.after(this.placeEl);\n            dragItem[0].parentNode.removeChild(dragItem[0]);\n            dragItem.appendTo(this.dragEl);\n\n            $(document.body).append(this.dragEl);\n            this.dragEl.css({\n                'left' : e.pageX - mouse.offsetX,\n                'top'  : e.pageY - mouse.offsetY\n            });\n            // total depth of dragging item\n            var i, depth,\n                items = this.dragEl.find(this.options.itemNodeName);\n            for (i = 0; i < items.length; i++) {\n                depth = $(items[i]).parents(this.options.listNodeName).length;\n                if (depth > this.dragDepth) {\n                    this.dragDepth = depth;\n                }\n            }\n        },\n\n        dragStop: function(e)\n        {\n            var el = this.dragEl.children(this.options.itemNodeName).first();\n            el[0].parentNode.removeChild(el[0]);\n            this.placeEl.replaceWith(el);\n\n            this.dragEl.remove();\n            this.el.trigger('change');\n            if (this.hasNewRoot) {\n                this.dragRootEl.trigger('change');\n            }\n            this.reset();\n        },\n\n        dragMove: function(e)\n        {\n            var list, parent, prev, next, depth,\n                opt   = this.options,\n                mouse = this.mouse;\n\n            this.dragEl.css({\n                'left' : e.pageX - mouse.offsetX,\n                'top'  : e.pageY - mouse.offsetY\n            });\n\n            // mouse position last events\n            mouse.lastX = mouse.nowX;\n            mouse.lastY = mouse.nowY;\n            // mouse position this events\n            mouse.nowX  = e.pageX;\n            mouse.nowY  = e.pageY;\n            // distance mouse moved between events\n            mouse.distX = mouse.nowX - mouse.lastX;\n            mouse.distY = mouse.nowY - mouse.lastY;\n            // direction mouse was moving\n            mouse.lastDirX = mouse.dirX;\n            mouse.lastDirY = mouse.dirY;\n            // direction mouse is now moving (on both axis)\n            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;\n            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;\n            // axis mouse is now moving on\n            var newAx   = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;\n\n            // do nothing on first move\n            if (!mouse.moving) {\n                mouse.dirAx  = newAx;\n                mouse.moving = true;\n                return;\n            }\n\n            // calc distance moved on this axis (and direction)\n            if (mouse.dirAx !== newAx) {\n                mouse.distAxX = 0;\n                mouse.distAxY = 0;\n            } else {\n                mouse.distAxX += Math.abs(mouse.distX);\n                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {\n                    mouse.distAxX = 0;\n                }\n                mouse.distAxY += Math.abs(mouse.distY);\n                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {\n                    mouse.distAxY = 0;\n                }\n            }\n            mouse.dirAx = newAx;\n\n            /**\n             * move horizontal\n             */\n            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {\n                // reset move distance on x-axis for new phase\n                mouse.distAxX = 0;\n                prev = this.placeEl.prev(opt.itemNodeName);\n                // increase horizontal level if previous sibling exists and is not collapsed\n                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {\n                    // cannot increase level when item above is collapsed\n                    list = prev.find(opt.listNodeName).last();\n                    // check if depth limit has reached\n                    depth = this.placeEl.parents(opt.listNodeName).length;\n                    if (depth + this.dragDepth <= opt.maxDepth) {\n                        // create new sub-level if one doesn't exist\n                        if (!list.length) {\n                            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);\n                            list.append(this.placeEl);\n                            prev.append(list);\n                            this.setParent(prev);\n                        } else {\n                            // else append to next level up\n                            list = prev.children(opt.listNodeName).last();\n                            list.append(this.placeEl);\n                        }\n                    }\n                }\n                // decrease horizontal level\n                if (mouse.distX < 0) {\n                    // we can't decrease a level if an item preceeds the current one\n                    next = this.placeEl.next(opt.itemNodeName);\n                    if (!next.length) {\n                        parent = this.placeEl.parent();\n                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);\n                        if (!parent.children().length) {\n                            this.unsetParent(parent.parent());\n                        }\n                    }\n                }\n            }\n\n            var isEmpty = false;\n\n            // find list item under cursor\n            if (!hasPointerEvents) {\n                this.dragEl[0].style.visibility = 'hidden';\n            }\n            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));\n            if (!hasPointerEvents) {\n                this.dragEl[0].style.visibility = 'visible';\n            }\n            if (this.pointEl.hasClass(opt.handleClass)) {\n                this.pointEl = this.pointEl.parent(opt.itemNodeName);\n            }\n            if (this.pointEl.hasClass(opt.emptyClass)) {\n                isEmpty = true;\n            }\n            else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {\n                return;\n            }\n\n            // find parent list of item under cursor\n            var pointElRoot = this.pointEl.closest('.' + opt.rootClass),\n                isNewRoot   = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');\n\n            /**\n             * move vertical\n             */\n            if (!mouse.dirAx || isNewRoot || isEmpty) {\n                // check if groups match if dragging over new root\n                if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {\n                    return;\n                }\n                // check depth limit\n                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;\n                if (depth > opt.maxDepth) {\n                    return;\n                }\n                var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);\n                    parent = this.placeEl.parent();\n                // if empty create new list to replace empty placeholder\n                if (isEmpty) {\n                    list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);\n                    list.append(this.placeEl);\n                    this.pointEl.replaceWith(list);\n                }\n                else if (before) {\n                    this.pointEl.before(this.placeEl);\n                }\n                else {\n                    this.pointEl.after(this.placeEl);\n                }\n                if (!parent.children().length) {\n                    this.unsetParent(parent.parent());\n                }\n                if (!this.dragRootEl.find(opt.itemNodeName).length) {\n                    this.dragRootEl.append('<div class=\"' + opt.emptyClass + '\"/>');\n                }\n                // parent root list has changed\n                if (isNewRoot) {\n                    this.dragRootEl = pointElRoot;\n                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];\n                }\n            }\n        }\n\n    };\n\n    $.fn.nestable = function(params)\n    {\n        var lists  = this,\n            retval = this;\n\n        lists.each(function()\n        {\n            var plugin = $(this).data(\"nestable\");\n\n            if (!plugin) {\n                $(this).data(\"nestable\", new Plugin(this, params));\n                $(this).data(\"nestable-id\", new Date().getTime());\n            } else {\n                if (typeof params === 'string' && typeof plugin[params] === 'function') {\n                    retval = plugin[params]();\n                }\n            }\n        });\n\n        return retval || lists;\n    };\n\n})(window.jQuery || window.Zepto, window, document);\n"},zi2X:function(n,e,l){l("8rVx")(l("kcv4"))}}]);