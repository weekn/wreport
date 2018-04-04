define(['jquery', "wangEditor","jqueryui","jsviews","jquery.bootstrap"], function($, E) {
    var get_data_path="/report/team";
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
        this.ifsubmit=false;
        this.menulist=[
            'bold',
            'italic',
            'underline',
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'list' // 列表
        ];
        this.divformat=function(){
            var that=this;
            $("#teamReportDetail_alert_panel").show();//放前面才能获取正确宽度。高度
            $(document.body).css({//先取消滚动条

                "overflow-y":"hidden"
            });
            if(that.editor=="null"){//判断是不是第一次启动，也放前面
                $( "#tabs" ).tabs({
                    create: function( event, ui ) {
                        console.log($(ui.tab).parent())
                        $(ui.tab).parent().css({"background":"rgb(247,247,247) url() no-repeat fixed top","border":"none"})
                        $(ui.tab).parent().find("li").css({"width":"80px","font-size":"13px"})
                    }
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


        };
        this.open=function(report_id,title){
            var that=this;

            this.divformat();

            $.observable(that).setProperty("title",title);
            console.log("-------------")
            console.log(editor_record_dic[report_id]["outcome"].txt.html())
            console.log(editor_record_dic[report_id]["problem"].txt.html())
            that.editor["outcome"].txt.html(editor_record_dic[report_id]["outcome"].txt.html());
            that.editor["problem"].txt.html(editor_record_dic[report_id]["problem"].txt.html());
            that.editor["plan"].txt.html(editor_record_dic[report_id]["plan"].txt.html());


        };
        this.openWithTxt=function(title,outcome,problem,plan){
            var that=this;
            this.divformat();
            $.observable(that).setProperty("title",title);

            that.editor["outcome"].txt.html(outcome);
            that.editor["problem"].txt.html(problem);
            that.editor["plan"].txt.html(plan);
        };
        this.close=function(){
            $("#teamReportDetail_alert_panel").hide();
            //启用滚动条
            $(document.body).css({

                "overflow-y":"auto"
            });
            $.observable(this).setProperty("ifsubmit",false);
        }
    }
    function BrowseTeamReport_m(){
        this.reports=[];
        this.reportDetail=new ReportDetail();
        this.getReport=function(){

            var that=this;
            gc.ajax(get_data_path,"GET","","",function(rsp){
                var json=rsp["response"];
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
            });

        };


        this.fresh=function(){
            this.getReport();
        };
        this.init=function(tmpl){
            var that=this;

            var app = {
                allreport:this.reports,
                reportDetail:this.reportDetail,


            };
            var helpers = {
                getUserReport: function(ev) {

                    var report=ev.data;
                    var username=report.user_name;
                    var outcome=report.outcome;
                    var problem=report.problem;
                    var plan=report.plan;
                    var title=$(ev.currentTarget).closest("[title]").attr("title").split("-");
                    title=title[title.length-1];
                    that.reportDetail.openWithTxt("“"+username+"”的"+title+"项目周报",outcome,problem,plan);

                },
                editGenenalReport:function(ev){
                    var user_id=gc.user.id;
                    var roles=ev.data.roles;

                    var ifA=false;
                    for(var i in roles){
                        var role=roles[i];
                        if(user_id==role["user_id"] && role["role"]==0){
                            ifA=true;
                            break;
                        }
                    }
                    if(ifA){
                        var report=ev.data.report;
                        var username=report.user_name;
                        var outcome=report.outcome;
                        var problem=report.problem;
                        var plan=report.plan;
                        that.reportDetail.project_id=report.project_id;

                        var title=$(ev.currentTarget).closest("[title]").attr("title").split("-");
                        title=title[title.length-1];
                        that.reportDetail.openWithTxt(title+"项目周报汇总",outcome,problem,plan);
                        $.observable(that.reportDetail).setProperty("ifsubmit",true);
                    }else{
                        gc.goDialog("您没有汇总周报的权限哦！");
                    }
                }
            };
            var myTemplate = $.templates(tmpl);

            myTemplate.link("[moudule=m_browseTeamReport]", app,helpers)
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
                .on("click","[name=team_report_clk2]",function(){
                    var tar=$(this).closest(".teamReport_2_top");

                    if( tar.next().is(':hidden')){　　//如果node是隐藏的则显示node元素，否则隐藏
                        tar.removeClass("teamReport_0_top_hide");
                    }else{

                        tar.addClass("teamReport_0_top_hide");

                    }
                    tar.next().slideToggle();

                })
                .on("dblclick",".teamReport_content_content",function(){//打开详情浏览
                    var title=$(this).closest("[pro_id]").find("[title]").attr("title");
                    var report_id=$(this).closest("[report_id]").attr("report_id");

                    that.reportDetail.open(report_id,title);


                })
                .on("click",".teamReportDetail_back",function(){
                    that.reportDetail.close();

                })
                .on("click","#teamReportDetail_submit",function(){
                    var outcome=that.reportDetail.editor["outcome"].txt.html();
                    var plan=that.reportDetail.editor["plan"].txt.html();
                    var problem=that.reportDetail.editor["problem"].txt.html();
                    data={
                        outcome:outcome,
                        problem:problem,
                        plan:plan
                    };

                    gc.ajax("/report/sumarize/project/"+that.reportDetail.project_id,"POST",data,"",function(){
                        that.getReport();
                        that.reportDetail.close();
                    })


                })

            //初始化编辑器

            this.getReport();
        }
    }
    return BrowseTeamReport_m;
});