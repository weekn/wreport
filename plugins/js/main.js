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
        "m_writeReport":"js/m_writeReport"
        
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


     var moudule_loaded={};

     var myReport =function(){


        if(moudule_loaded["m_writeReport"]!=true){
            console.log("myReport");
            $.get("m_writeReport.html", function(data) {
                require(["m_writeReport"],function(M){


                    var mouduel=new M(data);
                    mouduel.init(data);
                    mouduel.getReport();


                })



            });
            moudule_loaded["m_writeReport"]=true;
        }else{
            $("[moudule=m_writeReport]").show()
        }

    };
    var login=function(){

    };
    var browseTeamReport=function (){

        if(moudule_loaded["m_browseTeamReport"]!=true){

            $.get("m_browseTeamReport2.html", function(tmpl) {

                require(["m_browseTeamReport"],function(B){


                    var b=new B();
                    b.init(tmpl);
                })

                //
            });
            moudule_loaded["m_browseTeamReport"]=true;
        }else{
            $("[moudule=m_browseTeamReport]").show(50);
        }

    };
    var routes = {
        "/login":{
            on:function(){

                $("[moudule=m_login]").show();
                if(moudule_loaded["m_login"]!=true){

                    $.get("m_login.html", function(tmpl) {

                        require(["m_login"],function(B){


                            var b=new B();
                            b.init(tmpl);
                        })

                        //
                    });
                    moudule_loaded["m_login"]=true;
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

