define(['jquery', "wangEditor","jqueryui","jsviews","jquery.bootstrap"], function($, E) {
    var get_data_path="data/user_report.json";
    var editor_record_dic={};

    function ReportItem(name,id,report){
        this.name="";
        this.id="";
        this.report="";
        this.cata="";
        this.title="ddd";
        this.editor_outcome="";
        this.editor_problem="";
        this.editor_plan="";

    }
    function ReportDetail(){
        this.top="11px";
        this.editor="null";
        this.menulist=[
            'bold',
            'italic',
            'underline',
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'list' // 列表
        ];
        this.open=function(report_id,title){
            var that=this;


            function divformat(){
                $("#teamReportDetail_alert_panel").show();//放前面才能获取正确宽度。高度
                $(document.body).css({//先取消滚动条

                    "overflow-y":"hidden"
                });
                if(that.editor=="null"){//判断是不是第一次启动，也放前面
                    $( "#tabs" ).tabs({
                        // collapsible: true
                    });
                    that.editor={}
                    that.editor["outcome"]=new E("#teamReportDetail_outcome_menu",
                        "#teamReportDetail_outcome_editor");
                    that.editor["problem"]=new E("#teamReportDetail_problem_menu",
                        "#teamReportDetail_problem_editor");
                    that.editor["plan"]=new E("#teamReportDetail_plan_menu",
                        "#teamReportDetail_plan_editor");
                    that.editor["outcome"].customConfig.menus=that.menulist;
                    that.editor["problem"].customConfig.menus=that.menulist;
                    that.editor["plan"].customConfig.menus=that.menulist;
                    that.editor["outcome"].create();
                    that.editor["problem"].create();
                    that.editor["plan"].create();

                }
                if($(window).width()<970){
                    $(".teamReportDetail").width($(window).width()-8);
                    $(".teamReportDetail").height($(window).height()-8);
                    $(".teamReportDetail_editor").height($(window).height()-165);
                }

                var window_height = $(window).height();
                var height=$(".teamReportDetail").height();

                $("#teamReportDetail_alert_panel").width($(window).width());
                $("#teamReportDetail_alert_panel").height($(document).height());

                var res_height=(window_height-height)/2;
                if(res_height<0){
                    res_height=0;
                }


                // console.log($(window).width(),$(".teamReportDetail").width())
                $.observable(that).setProperty("top",res_height+$(document).scrollTop());


            }

            divformat();
            console.log(title)
            $.observable(that).setProperty("title",title);

            that.editor["outcome"].txt.html(editor_record_dic[report_id]["outcome"].txt.html())
            that.editor["problem"].txt.html(editor_record_dic[report_id]["problem"].txt.html())
            that.editor["plan"].txt.html(editor_record_dic[report_id]["plan"].txt.html())





        };
        this.close=function(){
            $("#teamReportDetail_alert_panel").hide();
            //启用滚动条
            $(document.body).css({

                "overflow-y":"auto"
            });
        }
    }
    function BrowseTeamReport_m(){
        this.reports=[];
        this.reportDetail=new ReportDetail();
        this.getReport=function(){

            var that=this;
            $.get(get_data_path,function(json){

                // for(var i0 in json){
                //     var c0=json[i0];
                //     for(var i1 in c0["sub"]){
                //         var c1=c0["sub"][i1];
                //         for (var i2 in c1["sub"]){
                //             var c2=c1["sub"][i2];
                //             var item=new ReportItem(c0,c1,c2);
                //         }
                //     }
                // }


                $.observable(that.reports).refresh(json);
                editor_record_dic={};//clean
                $(".teamReport_content_content").each(function(i){
                    //遍历建立所有editor
                    var report_id=$(this).closest("[report_id]").attr("report_id");

                    var cata=$(this).closest("[report_cata]").attr("report_cata");

                    if(!editor_record_dic.hasOwnProperty(report_id)){
                        editor_record_dic[report_id]={};
                    }
                    editor_record_dic[report_id][cata]= new E("",this);
                    editor_record_dic[report_id][cata].customConfig.zIndex = 0;
                    editor_record_dic[report_id][cata].create();
                    editor_record_dic[report_id][cata].$textElem.attr('contenteditable', false);
                });
                $("html,body").animate({scrollTop:0},0);//回顶端
                // document.querySelector("html").classList.add("lock");
                // window.addEventListener("mousewheel", this.forbidScroll);
                // window.addEventListener("touchmove", this.forbidScroll, { passive: false });

            });
        };



        this.init=function(tmpl){
            var that=this;

            var app = {
                allreport:this.reports,
                reportDetail:this.reportDetail
            };
            var myTemplate = $.templates(tmpl);

            myTemplate.link("[moudule=m_browseTeamReport]", app)
                .on("click",".teamReport_0_top",function(){
                    if( $(this).next().is(':hidden')){　　//如果node是隐藏的则显示node元素，否则隐藏
                        $(this).removeClass("teamReport_0_top_hide");
                    }else{

                        $(this).addClass("teamReport_0_top_hide");

                    }
                    $(this).next().slideToggle();

                })//
                .on("click",".teamReport_1_top",function(){
                    if( $(this).next().is(':hidden')){　　//如果node是隐藏的则显示node元素，否则隐藏
                        $(this).removeClass("teamReport_0_top_hide");
                    }else{

                        $(this).addClass("teamReport_0_top_hide");

                    }
                    $(this).next().slideToggle();

                })
                .on("click",".teamReport_2_top",function(){
                    if( $(this).next().is(':hidden')){　　//如果node是隐藏的则显示node元素，否则隐藏
                        $(this).removeClass("teamReport_0_top_hide");
                    }else{

                        $(this).addClass("teamReport_0_top_hide");

                    }
                    $(this).next().slideToggle();

                })
                .on("dblclick",".teamReport_content_content",function(){
                    var title=$(this).closest("[pro_id]").find("[title]").attr("title");
                    var report_id=$(this).closest("[report_id]").attr("report_id");

                    that.reportDetail.open(report_id,title);


                })
                .on("click",".teamReportDetail_back",function(){
                    that.reportDetail.close();
                });

            //初始化编辑器

            this.getReport();
        }
    }
    return BrowseTeamReport_m;
});