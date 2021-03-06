require.config({
	baseUrl: "plugins/",
    paths : {
        "jquery" : "js/jquery-3.3.1.min",
        "jquery.bootstrap":"bootstrap-3.3.7-dist/js/bootstrap.min",
        "jqueryui":"jquery-ui-1.12.1/jquery-ui.min",

        "director":"js/director.min",
        "jsviews":"jsview/jsviews.min",
        "index":"js/index",
        "wangEditor":"wangEditor-3.0.16/release/wangEditor.min",
        "m_login":"js/m_login",
        "m_browseTeamReport":"js/m_browseTeamReport",
        "m_writeReport":"js/m_writeReport",
        "m_setting":"js/m_setting"
        
    },
    shim: {

    	"jquery.bootstrap": {
            deps: ['jquery']
        },
        "director":{
            exports: 'Router'
        },
        'jqueryui': {
            deps: ['jquery']
        }
    }
});

// require(["jquery-ui-1.12.1/ui/widgets/autocomplete"],function(autocomplete ){
//     console.log(autocomplete )
// })


require(["jquery","director","index","jsviews","jqueryui"],function($,Router){


    console.log(gc)

     var myReport =function(){

         gc.moudule_point="m_writeReport";
        if(!gc.moudule_loaded.hasOwnProperty("m_writeReport")){
            console.log("myReport");
            $.get("m_writeReport.html", function(data) {
                require(["m_writeReport"],function(M){


                    var mouduel=new M(data);
                    mouduel.init(data);
                    gc.moudule_loaded["m_writeReport"]=mouduel;
                    //mouduel.getReport();


                })



            });

        }else{
            $("[moudule=m_writeReport]").show();
            gc.moudule_loaded["m_writeReport"].fresh();
        }

    };
    var login=function(){

    };
    var browseTeamReport=function (){
        gc.moudule_point="m_browseTeamReport";
        if(!gc.moudule_loaded.hasOwnProperty("m_browseTeamReport")){

            $.get("m_browseTeamReport2.html", function(tmpl) {

                require(["m_browseTeamReport"],function(B){


                    var b=new B();
                    b.init(tmpl);
                    gc.moudule_loaded["m_browseTeamReport"]=b;
                })

                //
            });

        }else{
            gc.moudule_loaded["m_browseTeamReport"].fresh();
            $("[moudule=m_browseTeamReport]").show(50);
        }

    };
    var routes = {
        "/login":{
            on:function(){

                $("[moudule=m_login]").show();
                if(gc.moudule_loaded["m_login"]!=true){

                    $.get("m_login.html", function(tmpl) {

                        require(["m_login"],function(B){


                            var b=new B();
                            b.init(tmpl);
                        })

                        //
                    });
                    gc.moudule_loaded["m_login"]=true;
                }
            },
            after:function(){
                $("[moudule=m_login]").hide();
            }
        },
        '/browseTeamReport': {
            on: browseTeamReport,
            after:function(){
                $(".panel").removeClass("panel_none");
                $("[moudule=m_browseTeamReport]").hide();
            },
            before:function(){
                $(".panel").addClass("panel_none");
                return true;
            }

        },
        "/myReport":{
            on:myReport,
            after:function(){

                $("[moudule=m_writeReport]").hide();
            }
        },
        "/setting":{
            "/team":{
                on:function(){
                    console.log("setting user");
                    gc.moudule_point="m_setting";
                    if(gc.moudule_loaded["m_setting"]!=true){
                        $.get("m_setting.html", function(tmpl) {

                            require(["m_setting"],function(B){


                                var b=new B();
                                b.init(tmpl);
                                gc.moudule_loaded["m_setting"]=true;
                            })

                            //
                        });
                    }else{
                        $("[moudule=m_setting]").show();
                    }


                },
                after:function(){
                    $("[moudule=m_setting]").hide();
                }
            },
            "/user":{
                on:function(){

                }
            }
        }
    };
    var router = Router(routes);
    router.init();





    
});
function GlobalControll(){
    this.base_url="http://localhost:8081";
    this.moudule_loaded={};
    this.moudule_point="";//用于指向当前的moudule,主要是选择日期变化时调用模块更新
    this.user={"token":""};
    this.chosenDate=new Date().getTime();
    this.ifThisWeek=true;
    this.changeDate=function(newdate){
        this.chosenDate=newdate;
        var moudule=this.moudule_loaded[this.moudule_point];
        moudule.fresh();
    };
    this.ajax = function(url,method,data,msg,func){
        var that =this;

        console.log("-----------gc-agax------------------");
        $("#ajax_loading").show();

        $.ajax({
            url: that.base_url+url,
            type:method,
            contentType:"application/json",
            data:JSON.stringify(data),
            beforeSend: function(xhr){
                console.log(that.user)
                if(that.user!=null){
                    xhr.setRequestHeader('token', that.user["token"]);
                }

            },
            success: function(rsp){

                if(rsp["status"]==-1){
                    window.location.href="index.html#/login";
                }else{
                    func(rsp);
                }
                $("#ajax_loading").hide();


            },
            error:function(err){

                console.log("ajax err--------------------");
                console.log(err)
                that.goDialog("请求出错，请稍后再试，或联系管理员哈");
            }
        });
    };
    this.goDialog=function(msg){//一个公共弹出框
        $("#gc_dialog").find("p").html(msg);
        $("#gc_dialog").dialog();
        setTimeout(function(){
            $("#gc_dialog").dialog( "destroy" );
        },3000)
    };
    this.setFlow=function(bool){
        if(bool){
            //启用滚动条
            $(document.body).css({

                "overflow-y":"auto"
            });
            //手机浏览器自由滚动
            $("body").off("touchmove");
        }else{
            $(document.body).css({//取消滚动条

                "overflow-y":"hidden"
            });
            $("body").on("touchmove",function(event){//禁止手机浏览器滚动
                event.preventDefault;
            }, false)

        }
    };
    this.init=function(){
        // var user=window.localStorage.setItem("key",{aa:134});
        var user=window.localStorage.getItem("wreport_user");
        console.log("323232")
        console.log(user)
        if(user==null ||typeof(user) == "undefined"){
            window.location.href="index.html#/login";
        }else{
            this.user=eval('(' + user + ')');
        }

    }


}
Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

var gc=new GlobalControll();
gc.init();


// require(["jquery","wangEditor","jquery.bootstrap","index","reportItem","jsviews"],function($,E){
//     $(function(){
//         // alert(E);  
//     })
// })

