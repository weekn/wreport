require.config({
	baseUrl: "plugins/",
    paths : {
        "jquery" : "js/jquery-3.3.1.min",
        "jquery.bootstrap":"bootstrap-3.3.7-dist/js/bootstrap.min",
        "director":"js/director.min",
        "jsviews":"jsview/jsviews.min",
        "index":"js/index",
        "wangEditor":"wangEditor-3.0.16/release/wangEditor.min",
        "m_browseTeamReport":"js/m_browseTeamReport",
        "m_writeReport":"js/m_writeReport"
        
    },
    shim: {

    	"jquery.bootstrap": {
            deps: ['jquery']
        },
        "director":{
            exports: 'Router'
        }
    }
});




require(["jquery","director","index","jsviews"],function($,Router){


     var moudule_loaded={};

     var myReport =function(){

         console.log("myReport");
        if(moudule_loaded["m_writeReport"]!=true){
            console.log("myReport");
            $.get("m_writeReport.html", function(data) {
                require(["m_writeReport"],function(M){


                    var m=new M(data);
                    m.init(data);


                })



            });
            moudule_loaded["m_writeReport"]=true;
        }else{
            $("[moudule=m_writeReport]").show()
        }

    };
    var after=function(){

    };
    var browseTeamReport=function (){

        if(moudule_loaded["m_browseTeamReport"]!=true){

            $.get("m_browseTeamReport.html", function(data) {

                require(["m_browseTeamReport"],function(B){


                    var b=new B(data);
                    b.init();
                })

                //
            });
            moudule_loaded["m_browseTeamReport"]=true;
        }else{
            $("[moudule=m_browseTeamReport]").show(50);
        }

    };
    var routes = {
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
        }
    };
    var router = Router(routes);
    router.init();





    
})

// require(["jquery","wangEditor","jquery.bootstrap","index","reportItem","jsviews"],function($,E){
//     $(function(){
//         // alert(E);  
//     })
// })

