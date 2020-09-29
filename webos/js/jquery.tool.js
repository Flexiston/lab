/*
	ie6 png透明修正
	DD_belatedPNG.fix('.png_bg');
	DD_belatedPNG.fixPng( someNode );
*/
if($.browser.msie&&($.browser.version=="6.0")&&!$.support.style){
    var DD_belatedPNG={
        ns:"DD_belatedPNG",
        imgSize:{},
        delay:10,
        nodesFixed:0,
        createVmlNameSpace:function(){
            if(document.namespaces&&!document.namespaces[this.ns]){
                document.namespaces.add(this.ns,"urn:schemas-microsoft-com:vml")
            }
        },
        createVmlStyleSheet:function(){
            var b,a;
            b=document.createElement("style");
            b.setAttribute("media","screen");
            document.documentElement.firstChild.insertBefore(b,document.documentElement.firstChild.firstChild);
            if(b.styleSheet){
                b=b.styleSheet;
                b.addRule(this.ns+"\\:*","{behavior:url(#default#VML)}");
                b.addRule(this.ns+"\\:shape","position:absolute;");
                b.addRule("img."+this.ns+"_sizeFinder","behavior:none; border:none; position:absolute; z-index:-1; top:-10000px; visibility:hidden;");
                this.screenStyleSheet=b;
                a=document.createElement("style");
                a.setAttribute("media","print");
                document.documentElement.firstChild.insertBefore(a,document.documentElement.firstChild.firstChild);
                a=a.styleSheet;
                a.addRule(this.ns+"\\:*","{display: none !important;}");
                a.addRule("img."+this.ns+"_sizeFinder","{display: none !important;}")
            }
        },
        readPropertyChange:function(){
            var b,c,a;
            b=event.srcElement;
            if(!b.vmlInitiated){
                return
            }
            if(event.propertyName.search("background")!=-1||event.propertyName.search("border")!=-1){
                DD_belatedPNG.applyVML(b)
            }
            if(event.propertyName=="style.display"){
                c=(b.currentStyle.display=="none")?"none":"block";
                for(a in b.vml){
                    if(b.vml.hasOwnProperty(a)){
                        b.vml[a].shape.style.display=c
                    }
                }
            }
            if(event.propertyName.search("filter")!=-1){
                DD_belatedPNG.vmlOpacity(b)
            }
        },
        vmlOpacity:function(b){
            if(b.currentStyle.filter.search("lpha")!=-1){
                var a=b.currentStyle.filter;
                a=parseInt(a.substring(a.lastIndexOf("=")+1,a.lastIndexOf(")")),10)/100;
                b.vml.color.shape.style.filter=b.currentStyle.filter;
                b.vml.image.fill.opacity=a
            }
        },
        handlePseudoHover:function(a){
            setTimeout(function(){
                DD_belatedPNG.applyVML(a)
            },1)
        },
        fix:function(a){
            if(this.screenStyleSheet){
                var c,b;
                c=a.split(",");
                for(b=0;b<c.length;b++){
                    this.screenStyleSheet.addRule(c[b],"behavior:expression(DD_belatedPNG.fixPng(this))")
                }
            }
        },
        applyVML:function(a){
            a.runtimeStyle.cssText="";
            this.vmlFill(a);
            this.vmlOffsets(a);
            this.vmlOpacity(a);
            if(a.isImg){
                this.copyImageBorders(a)
            }
        },
        attachHandlers:function(i){
            var d,c,g,e,b,f;
            d=this;
            c={
                resize:"vmlOffsets",
                move:"vmlOffsets"
            };
    
            if(i.nodeName=="A"){
                e={
                    mouseleave:"handlePseudoHover",
                    mouseenter:"handlePseudoHover",
                    focus:"handlePseudoHover",
                    blur:"handlePseudoHover"
                };
        
                for(b in e){
                    if(e.hasOwnProperty(b)){
                        c[b]=e[b]
                    }
                }
            }
            for(f in c){
                if(c.hasOwnProperty(f)){
                    g=function(){
                        d[c[f]](i)
                    };
            
                    i.attachEvent("on"+f,g)
                }
            }
            i.attachEvent("onpropertychange",this.readPropertyChange)
        },
        giveLayout:function(a){
            a.style.zoom=1;
            if(a.currentStyle.position=="static"){
                a.style.position="relative"
            }
        },
        copyImageBorders:function(b){
            var c,a;
            c={
                borderStyle:true,
                borderWidth:true,
                borderColor:true
            };
    
            for(a in c){
                if(c.hasOwnProperty(a)){
                    b.vml.color.shape.style[a]=b.currentStyle[a]
                }
            }
        },
        vmlFill:function(e){
            if(!e.currentStyle){
                return
            }else{
                var d,f,g,b,a,c;
                d=e.currentStyle
            }
            for(b in e.vml){
                if(e.vml.hasOwnProperty(b)){
                    e.vml[b].shape.style.zIndex=d.zIndex
                }
            }
            e.runtimeStyle.backgroundColor="";
            e.runtimeStyle.backgroundImage="";
            f=true;
            if(d.backgroundImage!="none"||e.isImg){
                if(!e.isImg){
                    e.vmlBg=d.backgroundImage;
                    e.vmlBg=e.vmlBg.substr(5,e.vmlBg.lastIndexOf('")')-5)
                }else{
                    e.vmlBg=e.src
                }
                g=this;
                if(!g.imgSize[e.vmlBg]){
                    a=document.createElement("img");
                    g.imgSize[e.vmlBg]=a;
                    a.className=g.ns+"_sizeFinder";
                    a.runtimeStyle.cssText="behavior:none; position:absolute; left:-10000px; top:-10000px; border:none; margin:0; padding:0;";
                    c=function(){
                        this.width=this.offsetWidth;
                        this.height=this.offsetHeight;
                        g.vmlOffsets(e)
                    };
            
                    a.attachEvent("onload",c);
                    a.src=e.vmlBg;
                    a.removeAttribute("width");
                    a.removeAttribute("height");
                    document.body.insertBefore(a,document.body.firstChild)
                }
                e.vml.image.fill.src=e.vmlBg;
                f=false
            }
            e.vml.image.fill.on=!f;
            e.vml.image.fill.color="none";
            e.vml.color.shape.style.backgroundColor=d.backgroundColor;
            e.runtimeStyle.backgroundImage="none";
            e.runtimeStyle.backgroundColor="transparent"
        },
        vmlOffsets:function(d){
            var h,n,a,e,g,m,f,l,j,i,k;
            h=d.currentStyle;
            n={
                W:d.clientWidth+1,
                H:d.clientHeight+1,
                w:this.imgSize[d.vmlBg].width,
                h:this.imgSize[d.vmlBg].height,
                L:d.offsetLeft,
                T:d.offsetTop,
                bLW:d.clientLeft,
                bTW:d.clientTop
            };
        
            a=(n.L+n.bLW==1)?1:0;
            e=function(b,p,q,c,s,u){
                b.coordsize=c+","+s;
                b.coordorigin=u+","+u;
                b.path="m0,0l"+c+",0l"+c+","+s+"l0,"+s+" xe";
                b.style.width=c+"px";
                b.style.height=s+"px";
                b.style.left=p+"px";
                b.style.top=q+"px"
            };
        
            e(d.vml.color.shape,(n.L+(d.isImg?0:n.bLW)),(n.T+(d.isImg?0:n.bTW)),(n.W-1),(n.H-1),0);
            e(d.vml.image.shape,(n.L+n.bLW),(n.T+n.bTW),(n.W),(n.H),1);
            g={
                X:0,
                Y:0
            };
    
            if(d.isImg){
                g.X=parseInt(h.paddingLeft,10)+1;
                g.Y=parseInt(h.paddingTop,10)+1
            }else{
                for(j in g){
                    if(g.hasOwnProperty(j)){
                        this.figurePercentage(g,n,j,h["backgroundPosition"+j])
                    }
                }
            }
            d.vml.image.fill.position=(g.X/n.W)+","+(g.Y/n.H);
            m=h.backgroundRepeat;
            f={
                T:1,
                R:n.W+a,
                B:n.H,
                L:1+a
            };
    
            l={
                X:{
                    b1:"L",
                    b2:"R",
                    d:"W"
                },
                Y:{
                    b1:"T",
                    b2:"B",
                    d:"H"
                }
            };

            if(m!="repeat"||d.isImg){
                i={
                    T:(g.Y),
                    R:(g.X+n.w),
                    B:(g.Y+n.h),
                    L:(g.X)
                };
        
                if(m.search("repeat-")!=-1){
                    k=m.split("repeat-")[1].toUpperCase();
                    i[l[k].b1]=1;
                    i[l[k].b2]=n[l[k].d]
                }
                if(i.B>n.H){
                    i.B=n.H
                }
                d.vml.image.shape.style.clip="rect("+i.T+"px "+(i.R+a)+"px "+i.B+"px "+(i.L+a)+"px)"
            }else{
                d.vml.image.shape.style.clip="rect("+f.T+"px "+f.R+"px "+f.B+"px "+f.L+"px)"
            }
        },
        figurePercentage:function(d,c,f,a){
            var b,e;
            e=true;
            b=(f=="X");
            switch(a){
                case"left":case"top":
                    d[f]=0;
                    break;
                case"center":
                    d[f]=0.5;
                    break;
                case"right":case"bottom":
                    d[f]=1;
                    break;
                default:
                    if(a.search("%")!=-1){
                        d[f]=parseInt(a,10)/100
                    }else{
                        e=false
                    }
            }
            d[f]=Math.ceil(e?((c[b?"W":"H"]*d[f])-(c[b?"w":"h"]*d[f])):parseInt(a,10));
            if(d[f]%2===0){
                d[f]++
            }
            return d[f]
        },
        fixPng:function(c){
            c.style.behavior="none";
            var g,b,f,a,d;
            if(c.nodeName=="BODY"||c.nodeName=="TD"||c.nodeName=="TR"){
                return
            }
            c.isImg=false;
            if(c.nodeName=="IMG"){
                if(c.src.toLowerCase().search(/\.png$/)!=-1){
                    c.isImg=true;
                    c.style.visibility="hidden"
                }else{
                    return
                }
            }else{
                if(c.currentStyle.backgroundImage.toLowerCase().search(".png")==-1){
                    return
                }
            }
            g=DD_belatedPNG;
            c.vml={
                color:{},
                image:{}
            };

            b={
                shape:{},
                fill:{}
            };

            for(a in c.vml){
                if(c.vml.hasOwnProperty(a)){
                    for(d in b){
                        if(b.hasOwnProperty(d)){
                            f=g.ns+":"+d;
                            c.vml[a][d]=document.createElement(f)
                        }
                    }
                    c.vml[a].shape.stroked=false;
                    c.vml[a].shape.appendChild(c.vml[a].fill);
                    c.parentNode.insertBefore(c.vml[a].shape,c)
                }
            }
            c.vml.image.shape.fillcolor="none";
            c.vml.image.fill.type="tile";
            c.vml.color.fill.on=false;
            g.attachHandlers(c);
            g.giveLayout(c);
            g.giveLayout(c.offsetParent);
            c.vmlInitiated=true;
            g.applyVML(c)
        }
    };

    try{
        document.execCommand("BackgroundImageCache",false,true)
    }catch(r){}
    DD_belatedPNG.createVmlNameSpace();
    DD_belatedPNG.createVmlStyleSheet();
}


/*
	腾讯UED提示信息
	ZENG.msgbox.show("设置成功！", 4, 2000);
	ZENG.msgbox.show("服务器繁忙，请稍后再试。", 1, 2000);
	ZENG.msgbox.show("数据拉取失败", 5, 2000);
	ZENG.msgbox.show("正在加载中，请稍后...", 6,8000);
*/
window.ZENG=window.ZENG||{};
    
ZENG.dom={
    getById:function(a){
        return document.getElementById(a)
    },
    get:function(a){
        return(typeof(a)=="string")?document.getElementById(a):a
    },
    createElementIn:function(d,f,e,c){
        var a=(f=ZENG.dom.get(f)||document.body).ownerDocument.createElement(d||"div"),b;
        if(typeof(c)=="object"){
            for(b in c){
                if(b=="class"){
                    a.className=c[b]
                }else{
                    if(b=="style"){
                        a.style.cssText=c[b]
                    }else{
                        a[b]=c[b]
                    }
                }
            }
        }
        e?f.insertBefore(a,f.firstChild):f.appendChild(a);
        return a
    },
    getStyle:function(b,f){
        b=ZENG.dom.get(b);
        if(!b||b.nodeType==9){
            return null
        }
        var a=document.defaultView&&document.defaultView.getComputedStyle,c=!a?null:document.defaultView.getComputedStyle(b,""),d="";
        switch(f){
            case"float":
                f=a?"cssFloat":"styleFloat";
                break;
            case"opacity":
                if(!a){
                    var h=100;
                    try{
                        h=b.filters["DXImageTransform.Microsoft.Alpha"].opacity
                    }catch(g){
                        try{
                            h=b.filters("alpha").opacity
                        }catch(g){}
                    }
                    return h/100
                }else{
                    return parseFloat((c||b.style)[f])
                }
                break;
            case"backgroundPositionX":
                if(a){
                    f="backgroundPosition";
                    return((c||b.style)[f]).split(" ")[0]
                }
                break;
            case"backgroundPositionY":
                if(a){
                    f="backgroundPosition";
                    return((c||b.style)[f]).split(" ")[1]
                }
                break
        }
        if(a){
            return(c||b.style)[f]
        }else{
            return(b.currentStyle[f]||b.style[f])
        }
    },
    setStyle:function(c,g,h){
        if(!(c=ZENG.dom.get(c))||c.nodeType!=1){
            return false
        }
        var e,b=true,d=(e=document.defaultView)&&e.getComputedStyle,f=/z-?index|font-?weight|opacity|zoom|line-?height/i;
        if(typeof(g)=="string"){
            e=g;
            g={};
        
            g[e]=h
        }
        for(var a in g){
            h=g[a];
            if(a=="float"){
                a=d?"cssFloat":"styleFloat"
            }else{
                if(a=="opacity"){
                    if(!d){
                        a="filter";
                        h=h>=1?"":("alpha(opacity="+Math.round(h*100)+")")
                    }
                }else{
                    if(a=="backgroundPositionX"||a=="backgroundPositionY"){
                        e=a.slice(-1)=="X"?"Y":"X";
                        if(d){
                            var i=ZENG.dom.getStyle(c,"backgroundPosition"+e);
                            a="backgroundPosition";
                            typeof(h)=="number"&&(h=h+"px");
                            h=e=="Y"?(h+" "+(i||"top")):((i||"left")+" "+h)
                        }
                    }
                }
            }
            if(typeof c.style[a]!="undefined"){
                c.style[a]=h+(typeof h==="number"&&!f.test(a)?"px":"");
                b=b&&true
            }else{
                b=b&&false
            }
        }
        return b
    },
    getScrollTop:function(a){
        var b=a||document;
        return Math.max(b.documentElement.scrollTop,b.body.scrollTop)
    },
    getClientHeight:function(a){
        var b=a||document;
        return b.compatMode=="CSS1Compat"?b.documentElement.clientHeight:b.body.clientHeight
    }
};

ZENG.string={
    RegExps:{
        trim:/^\s+|\s+$/g,
        ltrim:/^\s+/,
        rtrim:/\s+$/,
        nl2br:/\n/g,
        s2nb:/[\x20]{2}/g,
        URIencode:/[\x09\x0A\x0D\x20\x21-\x29\x2B\x2C\x2F\x3A-\x3F\x5B-\x5E\x60\x7B-\x7E]/g,
        escHTML:{
            re_amp:/&/g,
            re_lt:/</g,
            re_gt:/>/g,
            re_apos:/\x27/g,
            re_quot:/\x22/g
        },
        escString:{
            bsls:/\\/g,
            sls:/\//g,
            nl:/\n/g,
            rt:/\r/g,
            tab:/\t/g
        },
        restXHTML:{
            re_amp:/&amp;/g,
            re_lt:/&lt;/g,
            re_gt:/&gt;/g,
            re_apos:/&(?:apos|#0?39);/g,
            re_quot:/&quot;/g
        },
        write:/\{(\d{1,2})(?:\:([xodQqb]))?\}/g,
        isURL:/^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i,
        cut:/[\x00-\xFF]/,
        getRealLen:{
            r0:/[^\x00-\xFF]/g,
            r1:/[\x00-\xFF]/g
        },
        format:/\{([\d\w\.]+)\}/g
    },
    commonReplace:function(a,c,b){
        return a.replace(c,b)
    },
    format:function(c){
        var b=Array.prototype.slice.call(arguments),a;
        c=String(b.shift());
        if(b.length==1&&typeof(b[0])=="object"){
            b=b[0]
        }
        ZENG.string.RegExps.format.lastIndex=0;
        return c.replace(ZENG.string.RegExps.format,function(d,e){
            a=ZENG.object.route(b,e);
            return a===undefined?d:a
        })
    }
};

ZENG.object={
    routeRE:/([\d\w_]+)/g,
    route:function(d,c){
        d=d||{};
        
        c=String(c);
        var b=ZENG.object.routeRE,a;
        b.lastIndex=0;
        while((a=b.exec(c))!==null){
            d=d[a[0]];
            if(d===undefined||d===null){
                break
            }
        }
        return d
    }
};

var ua=ZENG.userAgent={},agent=navigator.userAgent;
ua.ie=9-((agent.indexOf("Trident/5.0")>-1)?0:1)-(window.XDomainRequest?0:1)-(window.XMLHttpRequest?0:1);
if(typeof(ZENG.msgbox)=="undefined"){
    ZENG.msgbox={}
}
ZENG.msgbox._timer=null;
ZENG.msgbox.loadingAnimationPath=ZENG.msgbox.loadingAnimationPath||("gb_tip_loading.gif");
ZENG.msgbox.show=function(c,g,h,a){
    if(typeof(a)=="number"){
        a={
            topPosition:a
        }
    }
    a=a||{};

    var j=ZENG.msgbox,i='<span class="zeng_msgbox_layer" style="display:none;z-index:10000;" id="mode_tips_v2"><span class="gtl_ico_{type}"></span>{loadIcon}{msgHtml}<span class="gtl_end"></span></span>',d='<span class="gtl_ico_loading"></span>',e=[0,0,0,0,"succ","fail","clear"],b,f;
    j._loadCss&&j._loadCss(a.cssPath);
    b=ZENG.dom.get("q_Msgbox")||ZENG.dom.createElementIn("div",document.body,false,{
        className:"zeng_msgbox_layer_wrap"
    });
    b.id="q_Msgbox";
    b.style.display="";
    b.innerHTML=ZENG.string.format(i,{
        type:e[g]||"hits",
        msgHtml:c||"",
        loadIcon:g==6?d:""
    });
    j._setPosition(b,h,a.topPosition)
};
    
ZENG.msgbox._setPosition=function(a,f,d){
    f=f||5000;
    var g=ZENG.msgbox,b=ZENG.dom.getScrollTop(),e=ZENG.dom.getClientHeight(),c=Math.floor(e/2)-40;
    ZENG.dom.setStyle(a,"top",((document.compatMode=="BackCompat"||ZENG.userAgent.ie<7)?b:0)+((typeof(d)=="number")?d:c)+"px");
    clearTimeout(g._timer);
    a.firstChild.style.display="";
    f&&(g._timer=setTimeout(g.hide,f))
};
    
ZENG.msgbox.hide=function(a){
    var b=ZENG.msgbox;
    if(a){
        clearTimeout(b._timer);
        b._timer=setTimeout(b._hide,a)
    }else{
        b._hide()
    }
};

ZENG.msgbox._hide=function(){
    var a=ZENG.dom.get("q_Msgbox"),b=ZENG.msgbox;
    clearTimeout(b._timer);
    if(a){
        var c=a.firstChild;
        ZENG.dom.setStyle(a,"display","none")
    }
};
	

/*
	无缝滚动 HRwfgd
	@DOM
		<div id="marquee">
			<ul>
				<li></li>
				<li></li>
			</ul>
		</div>
	@CSS
		#marquee{width:200px;height:50px;overflow:hidden}
	@Usage
		$('#marquee').HRwfgd(options);
	@options
		isEqual			:true,		//所有滚动的元素长宽是否相等,true,false
		loop			:0,			//循环滚动次数，0时无限
		direction		:'left',	//滚动方向，'left','right','up','down'
		scrollAmount	:1,			//步长
		scrollDelay		:20			//时长
*/
$.fn.HRwfgd = function(options) {
    var opts = $.extend({},{
        isEqual			:true,
        loop			:0,
        direction		:'left',
        scrollAmount	:1,
        scrollDelay		:20
    }, options);
    this.each(function() {
        var $marquee = $(this);
        var _scrollObj = $marquee.get(0);
        var scrollW = $marquee.width();
        var scrollH = $marquee.height();
        var $element = $marquee.children();
        var $kids = $element.children();
        var scrollSize = 0;
        var _type = (opts.direction == 'left' || opts.direction == 'right') ? 1: 0;
        $element.css(_type ? 'width': 'height', 10000);
        if (opts.isEqual) {
            scrollSize = $kids[_type ? 'outerWidth': 'outerHeight']() * $kids.length
        } else {
            //查询所有父容器，如果是隐藏的，将其显示
            $kids.parents().each(function(){
                if($(this).is(":hidden")){
                    $(this).addClass("hr_wfgd").show();
                }
            })
            $kids.each(function() {
                scrollSize += $(this)[_type ? 'outerWidth': 'outerHeight']()
            })
            //计算完毕后，还原父容器到初始状态
            $(document).find(".hr_wfgd").each(function(){
                if($(this).is(":visible")){
                    $(this).hide().removeClass("hr_wfgd");
                }
            });
        }
        if (scrollSize < (_type ? scrollW: scrollH)) return;
        $element.append($kids.clone()).css(_type ? 'width': 'height', scrollSize * 2);
        var numMoved = 0;
        function scrollFunc() {
            var _dir = (opts.direction == 'left' || opts.direction == 'right') ? 'scrollLeft': 'scrollTop';
            if (opts.loop > 0) {
                numMoved += opts.scrollAmount;
                if (numMoved > scrollSize * opts.loop) {
                    _scrollObj[_dir] = 0;
                    return clearInterval(moveId)
                }
            }
            if (opts.direction == 'left' || opts.direction == 'up') {
                _scrollObj[_dir] += opts.scrollAmount;
                if (_scrollObj[_dir] >= scrollSize) {
                    _scrollObj[_dir] = 0
                }
            } else {
                _scrollObj[_dir] -= opts.scrollAmount;
                if (_scrollObj[_dir] <= 0) {
                    _scrollObj[_dir] = scrollSize
                }
            }
        }
        var moveId = setInterval(scrollFunc, opts.scrollDelay);
        $marquee.hover(function() {
            clearInterval(moveId)
        },
        function() {
            clearInterval(moveId);
            moveId = setInterval(scrollFunc, opts.scrollDelay)
        })
    })
};

/*
	返回顶部 HRfhdb
	@DOM
		<a href="javascript:void(0)" id="fhdb1">返回顶部</a>
	@Usage
		$('#top').HRfhdb(options, fun);
	@options
		animation	:false,		//是否开启动画效果
		speed		:'normal'	//滚动速度，'slow','normal','fast'，也可以用数值代替，比如2000表示2000毫秒
	@fun
		在动画完成后执行的函数
*/
$.fn.HRfhdb = function(options, fun){
    var options = $.extend({}, {
        animation	:false,
        speed		:'slow'
    }, options, fun);
    this.each(function(){
        $(this).click(function(){
            if(options.animation == false){
                $.fx.off = true;
            }
            if(fun != null){
                $("html").animate({
                    scrollTop:"0"
                }, options.speed);
                $("body").animate({
                    scrollTop:"0"
                }, options.speed, fun);
            }else{
                $("html,body").animate({
                    scrollTop:"0"
                }, options.speed);
            }
            $.fx.off = false;
        });
    });
};

/*
	Tabs切换 HRtabs
	@DOM
		<div class="HRtabs">
			<ul>
				<li><a href="#tabs1">tabs1</a></li>
				<li><a href="#tabs2">tabs2</a></li>
				<li><a href="#tabs3">tabs3</a></li>
			</ul>
			<div id="tabs1">111</div>
			<div id="tabs2">222</div>
			<div id="tabs3">333</div>
		</div>
	@CSS
		#HRsfq li a.HRtabs-active{background:#7FD2FF;color:#fff}
	@Usage
		$('.HRtabs').HRtabs(options);
	@Options
		activeClass		:'HRsfq-active',	//tabs标题选中样式名
		showDiv			:'',				//显示哪个div，默认为空，显示第一个
		overOrClick		:'click',			//触发事件，可以有click、mouseover、dbclick
		animation		:false,				//是否开启动画效果
		speed			:'normal'			//渐隐渐现速度，'slow','normal','fast'，也可以用数值代替，比如2000表示2000毫秒
*/
$.fn.HRtabs = function(options){
    var options = $.extend({}, {
        activeClass		:'HRtabs-active',
        showDiv			:'',
        overOrClick		:'click',
        animation		:false,
        speed			:'normal'
    }, options);
    var box = $(this);
    $(this).each(function(){
        $(box).find("div").hide();
        if(options.showDiv == ""){
            $(box).find('ul li:eq(0) a').addClass(options.activeClass);
            $(box).find('div:eq(0)').show();
        }else{
            $(box).find('ul li').each(function(){
                if($(this).find("a").attr("href") == "#"+options.showDiv){
                    $(this).find("a").addClass(options.activeClass);
                }
            });
            $(box).find("#"+options.showDiv).show();
        }
        $(box).find("a").bind(options.overOrClick,function(){
            if(!$(this).hasClass(options.activeClass)){
                $(box).find("ul li a").removeClass(options.activeClass);
                $(this).addClass(options.activeClass);
                if(options.animation){
                    $(box).find("div").fadeOut(options.speed);
                    $(box).find($(this).attr("href")).fadeIn(options.speed);
                }else{
                    $(box).find("div").hide();
                    $(box).find($(this).attr("href")).show();
                }
            }
            return false;
        });
    });
};

/*
	锚点连接 HRmdlj
	@DOM
		<a href="#mdlj">锚点连接</a>
		...
		...
		<div id="mdlj"></div>
	@Usage
		$('a').HRmdlj(options);
	@options
		speed:'normal'			//滑动速度，'slow','normal','fast'，也可以用数值代替，比如2000表示2000毫秒
*/
$.fn.HRmdlj = function(options){
    var options = $.extend({}, {
        speed:'normal'
    }, options);
    this.each(function(){
        $(this).click(function() {
            var target = $(this).attr('href');
            var destination = $(target).offset().top;
            $('html,body').animate({
                scrollTop : destination
            }, options.speed);
            return false;			   
        });
    });
};

/*
	图片缩放 HRtpsf
	@CSS
		div{width:250px;height:150px;line-height:150px;overflow:hidden}
		div img{float:left}
	@DOM
		<div>
			<img src="MammaMia.jpg" />
		</div>
	@Usage
		$('div').HRtpsf(options);
	@options
		maxWidth	:100,	//最大宽度，和外层div同宽
		maxHeight	:100	//最大高度，和外层div同高
*/
$.fn.HRtpsf = function(options){
    var options = $.extend({}, {
        maxWidth	:100,
        maxHeight	:100
    }, options);
    this.each(function(){
        var img = $(this).find('img');
        var imgWidth = $(img).attr("width");
        var imgHeight = $(img).attr("height");
        if(imgWidth > options.maxWidth || imgHeight > options.maxHeight){
            if(imgWidth/imgHeight > options.maxWidth/options.maxHeight){
                $(img).attr("width",options.maxWidth);
                var realHeight = options.maxWidth/imgWidth*imgHeight;
                $(img).css("margin-top",parseInt((options.maxHeight-realHeight)/2));
            }else{
                $(img).attr("height",options.maxHeight);
                var realWidth = options.maxHeight/imgHeight*imgWidth;
                $(img).css("margin-left",parseInt((options.maxWidth-realWidth)/2));
            }
        }else{
            $(img).css("margin-top",parseInt((options.maxHeight-imgHeight)/2));
            $(img).css("margin-left",parseInt((options.maxWidth-imgWidth)/2));
        }
    });
};


/*
	分享工具 HRshare
	@DOM
		<div>
			<a class="hr-share-xiaoyou"></a>
			<a class="hr-share-115"></a>
			<a class="hr-share-tsina"></a>
			<a class="hr-share-tqq"></a>
			<a class="hr-share-more"></a>
		</div>
	@Usage
		$('div').HRshare(options);
	@options
		size		:16,	//图标尺寸，目前可选16和32
		hasText		:true	//是否显示文字
*/
$.fn.HRshare = function(options){
    var options = $.extend({}, {
        size	:16,
        hasText	:true
    }, options);
    var shareico = {
        "tqq"		:"http://v.t.qq.com/share/share.php?title={title}&url={url}&appkey=118cd1d635c44eab9a4840b2fbf8b0fb",
        "tsina"		:"http://service.weibo.com/share/share.php?title={title}&url={url}&source=bookmark&appkey=2992571369",
        "qzone"		:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}",
        "renren"	:"http://share.renren.com/share/buttonshare.do?link={url}&title={title}",
        "baidu"		:"http://cang.baidu.com/do/add?it={title}&iu={url}&fr=ien#nw=1",
        "115"		:"http://sc.115.com/add?url={url}&title={title}",
        "tsohu"		:"http://t.sohu.com/third/post.jsp?url={url}&title={title}&content=utf-8",
        "taobao"	:"http://share.jianghu.taobao.com/share/addShare.htm?url={url}",
        "xiaoyou"	:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou&url={url}",
        "hi"		:"http://apps.hi.baidu.com/share/?url={url}&title={title}",
        "fanfou"	:"http://fanfou.com/sharer?u={url}&t={title}",
        "sohubai"	:"http://bai.sohu.com/share/blank/add.do?link={url}",
        "feixin"	:"http://space3.feixin.10086.cn/api/share?title={title}&url={url}",
        "youshi"	:"http://www.ushi.cn/feedShare/feedShare!sharetomicroblog.jhtml?type=button&loginflag=share&title={title}&url={url}",
        "tianya"	:"http://share.tianya.cn/openapp/restpage/activity/appendDiv.jsp?app_id=jiathis&ccTitle={title}&ccUrl={url}&jtss=tianya&ccBody=",
        "msn"		:"http://profile.live.com/P.mvc#!/badge?url={url}&screenshot=",
        "douban"	:"http://shuo.douban.com/!service/share?image=&href={url}&name={title}",
        "twangyi"	:"http://t.163.com/article/user/checkLogin.do?source={title}&info={title}+{url}&images=",
        "mop"		:"http://tk.mop.com/api/post.htm?url={url}&title={title}"
    };
    var shareiconame = {
        "tqq"		:"腾讯微博",
        "tsina"		:"新浪微博",
        "qzone"		:"QQ空间",
        "renren"	:"人人网",
        "baidu"		:"百度收藏",
        "115"		:"115",
        "tsohu"		:"搜狐微博",
        "taobao"	:"淘江湖",
        "xiaoyou"	:"腾讯朋友",
        "hi"		:"百度空间",
        "fanfou"	:"饭否",
        "sohubai"	:"搜狐白社会",
        "feixin"	:"飞信",
        "tianya"	:"天涯社区",
        "youshi"	:"优士网",
        "msn"		:"MSN",
        "douban"	:"豆瓣",
        "twangyi"	:"网易微博",
        "mop"		:"猫扑推客"
    };
    this.each(function(){
        $(this).addClass("hr-share-"+options.size);
        var title = document.title;
        var url = window.location.href;
        function eFunction(str){
            return function(){
                window.open(formatmodel(shareico[str],{
                    title:title, 
                    url:url
                }));
            }
        }
        for(si in shareico){
            $(this).find(".hr-share-"+si).die('click').live('click',eFunction(si)).attr("title","分享到"+shareiconame[si]);
            if(options.hasText){
                $(this).find(".hr-share-"+si).text(shareiconame[si]);
            }
            $(this).find(".hr-share-more-panel-"+si).die('click').live('click',eFunction(si));
        }
		
        //更多
        $(".hr-share-more").live("click",function(){
            if(!$(".HRshare-bg").length){
                if($.browser.msie && $.browser.version == "6.0"){
                    //ie6无法遮住select，则只能将其隐藏
                    $("select:visible").addClass("hr-share-select-hidden");
                    //ie6不支持position:fixed
                    $("body").append("<div class='HRshare-bg' style='position:absolute;left:0;top:0;width:"+$(window).width()+"px;height:"+$(window).height()+"px;display:none;z-index:9998;background-color:#000;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=50);opacity:0.5;'></div>");
                }else{
                    $("body").append("<div class='HRshare-bg' style='position:fixed;top:0;left:0;width:100%;height:100%;display:none;z-index:9998;  background-color:#000;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=50);opacity:0.5;'></div>");
                }
            }
            $(".HRshare-bg").fadeIn('fast');
			
            if(!$(".hr-share-more-panel").length){
                var _left = ($(window).width()-270)/2;
                var _top = ($(window).height()-300)/3;
                if($.browser.msie && $.browser.version == "6.0"){
                    var _sharepanel = '<div class="hr-share-more-panel" style="position:absolute;z-index:9999;left:expression(eval(document.documentElement.scrollLeft)+'+_left+');top:expression(eval(document.documentElement.scrollTop)+'+_top+')">';
                }else{
                    var _sharepanel = '<div class="hr-share-more-panel" style="position:fixed;z-index:9999;top:'+_top+'px;left:'+_left+'px">';
                }
                _sharepanel += '<div class="hr-share-more-panel-title"><a href="#close" title="关闭">×</a><span>分享到各大网站</span></div><div class="hr-share-more-panel-list">';
                for(si in shareiconame){
                    _sharepanel += '<a class="hr-share-more-panel-'+si+'">'+shareiconame[si]+'</a>';
                }
                _sharepanel += '</div><div class="hr-share-more-panel-copyright"><a href="http://sc.chinaz.com" target="_blank">站长素材</a></div></div>';
                $("body").append(_sharepanel);
            }
            $(".hr-share-more-panel").fadeIn('fast');
        });
        $(".HRshare-bg").live("click",function(){
            $(".hr-share-more-panel").fadeOut('fast');
            $(".HRshare-bg").fadeOut('fast');
        });
        $(".hr-share-more-panel-title a").live("click",function(){
            $(".hr-share-more-panel").fadeOut('fast');
            $(".HRshare-bg").fadeOut('fast');
        });
        $(window).bind('resize',function(){
            var _left = ($(window).width()-270)/2;
            var _top = ($(window).height()-300)/3;
            $(".hr-share-more-panel").css({
                "left":_left,
                "top":_top
            });
        });
    });
};

function isMouseLeaveOrEnter(e, handler){
    if (e.type != 'mouseout' && e.type != 'mouseover') return false;
    var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
    while (reltg && reltg != handler)
        reltg = reltg.parentNode;
    return (reltg != handler);
}
function getEvent(){
    if(document.all)
        return window.event;
    func=getEvent.caller;
    while(func!=null){
        var arg0=func.arguments[0];
        if(arg0){
            if((arg0.constructor==Event || arg0.constructor==MouseEvent) || (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)){
                return arg0;
            }
        }
        func=func.caller;
    }
    return null;
}
function formatmodel(str,model){
    for(var k in model){
        var re = new RegExp("{"+k+"}","g");
        str = str.replace(re,model[k]);
    }
    return str;
}