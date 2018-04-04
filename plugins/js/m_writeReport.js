define(['jquery', "wangEditor", "jsviews", "jquery.bootstrap"], function ($, E) {
    var get_report_path="data/user_report.json";




    function ReportItem(report_item_num, pro_option_dic) {
        this.report_item_num = report_item_num;
        this.report = {};
        this.project_level=-1;
        this.select_0 = {};
        this.select_1 = {};
        this.select_2 = {};
        this.option_0 = [];
        this.option_1 = [];
        this.option_2 = [];
        this.option_1_visiable=false;
        this.option_2_visiable=false;
        this.pro_option_dic = pro_option_dic;
        this.editor_outcome = "";
        this.editor_problem = "";
        this.editor_plan = "";

        this.menu_list = [
            'bold',
            'italic',
            'underline',
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'list' // 列表
        ];

        this.init = function () {

            this.editor_outcome = new E("[item='" + this.report_item_num + "']  .report_menu_outcome",
                ".panel [item='" + this.report_item_num + "'] .report_outcome");
            this.editor_problem = new E("[item='" + this.report_item_num + "']  .report_menu_problem",
                ".panel [item='" + this.report_item_num + "'] .report_problem");
            this.editor_plan = new E("[item='" + this.report_item_num + "']  .report_menu_plan",
                ".panel [item='" + this.report_item_num + "'] .report_plan");
            this.editor_outcome.customConfig.menus = this.menu_list;
            this.editor_problem.customConfig.menus = this.menu_list;
            this.editor_plan.customConfig.menus = this.menu_list;

            this.editor_outcome.customConfig.zIndex = 0;
            this.editor_problem.customConfig.zIndex = 0;
            this.editor_plan.customConfig.zIndex = 0;

            this.editor_outcome.create();
            this.editor_problem.create();
            this.editor_plan.create();
            this.editor_outcome.txt.html(this.report["outcome"]);
            this.editor_problem.txt.html(this.report["problem"]);
            this.editor_plan.txt.html(this.report["plan"]);
            this.setCatagory();
        };
        this.setCatagory = function (item_key) {
            option_0 = [];
            option_1 = [];
            option_2 = [];
            for (var i0 in this.pro_option_dic) {
                var c0 = this.pro_option_dic[i0];
                var id = c0["id"];
                var name = c0["name"];
                option_0.push({name: name, id: id});

                if (this.select_0["id"] == c0.id) {
                    $.observable(this.select_0).setProperty("name", name);
                    for (var i1 in c0["sub"]) {
                        var c1 = c0["sub"][i1];
                        var id = c1["id"];
                        var name = c1["name"];
                        option_1.push({name: name, id: id});
                        if (this.select_1["id"] == c1.id) {
                            $.observable(this.select_1).setProperty("name", name);
                            for (var i2 in c1["sub"]) {
                                var c2 = c1["sub"][i2];
                                var id = c2["id"];
                                var name = c2["name"];
                                option_2.push({name: name, id: id});
                                if (this.select_2["id"] == c2.id) {
                                    $.observable(this.select_2).setProperty("name", name);
                                }
                            }
                        }

                    }
                }

            }

            $.observable(this).setProperty("option_0", option_0);
            $.observable(this).setProperty("option_1", option_1);
            $.observable(this).setProperty("option_2", option_2);
            //下面判断菜单多级项目每一级是否显示
            var vb=[true,false,false];
            for(var i=0;i<=parseInt(this.project_level);i++){
                vb[i]=true;
            }
            var next_i=parseInt(this.project_level)+1;

            if(next_i<=2&&this["option_"+next_i].length>0){
                vb[next_i]=true;
            }

            $.observable(this).setProperty("option_1_visiable", vb[1]);
            $.observable(this).setProperty("option_2_visiable", vb[2]);
        };


    }

    function ReportController() {
        this.items = {};
        this.report_item_num = 1;

        this.selectCatagory = function (item_key, level, id) {

            var level_n = parseInt(level);


            if (this.items[item_key]["select_" + level_n]["id"] != id) {
                //检查有无变化，没变化就不进行操作

                for(var item_key in this.items){
                    var lvl=this.items[item_key].project_level;
                    if(lvl<0){
                        continue;
                    }

                    if(this.items[item_key]["select_"+lvl]["id"]==id){
                        console.log("selectCatagory  选择了相同的pro!!!");
                        gc.goDialog("您选择了相同的项目，请重新选择哦！")
                        return;
                    }
                }

                //this.items[item_key]["select_"+level_n]={name:"tmp",id:id};
                this.items[item_key].project_level=level_n
                $.observable(this.items[item_key]).setProperty("select_" + level + ".id", id);

                //修改了项目选择，因为依赖关系把后面子项的都清空
                for (var i = level_n + 1; i < 3; i++) {

                    $.observable(this.items[item_key]).setProperty("select_" + i + ".id", "");
                    $.observable(this.items[item_key]).setProperty("select_" + i + ".name", "");
                }


                this.items[item_key].setCatagory();

            }


        };


        this.removeReportItem = function (item_key) {
            // this.item_record_dic[item_key].item_dom.remove();
            // delete this.item_record_dic[item_key];
            // this.submitAbility(); //是否还能显示提交按钮
            var that=this;
            if(typeof(that.items[item_key]["report"]["outcome"]) == "undefined" ){//初始为undefine，说明是新建的日志，不用数据库delete
                $.observable(that.items).removeProperty(item_key + "");
            }else{
                var report_id=this.items[item_key].report["id"];
                var url="/report/"+report_id;
                gc.ajax(url,"DELETE","","",function(rsp){
                    $.observable(that.items).removeProperty(item_key + "");
                });
            }


        };
        this.addReportItem = function () {

            this.report_item_num = this.report_item_num + 1;
            // var new_item_dom = $(this.report_item_html).attr("item", this.report_item_num)
            // $("#add_report").before(new_item_dom);

            var report_item = new ReportItem(this.report_item_num, this.pro_option_dic);
            $.observable(this.items).setProperty(this.report_item_num + "", report_item);
            this.items[this.report_item_num + ""].init();


        };
        this.fresh=function(){
            var that=this;
            that.getProject(function(){
                that.getReport();
            });

            $.observable(this).setProperty("ifThisWeek",gc.ifThisWeek);

        };
        this.getProject=function(fuc){
            var that=this;
            var url="/project";
            gc.ajax(url,"GET","","",function(rsp){
                that.pro_option_dic=rsp["response"];
                fuc();
            })

        };
        this.getReport=function(){

            var that=this;
            function buildItem(select,report){
                that.report_item_num = that.report_item_num + 1;
                // var new_item_dom = $(this.report_item_html).attr("item", this.report_item_num)
                // $("#add_report").before(new_item_dom);

                var report_item = new ReportItem(that.report_item_num, that.pro_option_dic);
                report_item.report=report;
                report_item.select_0 = select[0];
                report_item.select_1 = select[1];
                report_item.select_2 = select[2];
                report_item.project_level=report["project_level"];
                $.observable(that.items).setProperty(that.report_item_num + "", report_item);
                that.items[that.report_item_num + ""].init();

            }
            var url="/report/user/"+gc.user["username"]+"?"+$.param({time:gc.chosenDate});
            gc.ajax(url,"GET","","",function(rsp){
                $.observable(that).setProperty("items",{});
                that.report_item_num=0;
                for(var i in rsp["response"]){
                    var report=rsp["response"][i];
                    var select=[{name:report["project_name_0"],id:report["project_id_0"]},
                        {name:report["project_name_1"],id:report["project_id_1"]},
                        {name:report["project_name_2"],id:report["project_id_2"]}];
                    buildItem(select,report);

                }
                $(".report_menu").hide();
            })

        };
        this.submitReport=function(item){
            var that = this;
            if(!that.ifThisWeek){
                return
            }

            var e_outcome=that.items[item].editor_outcome.txt.html();
            var e_problem=that.items[item].editor_problem.txt.html();
            var e_plan=that.items[item].editor_plan.txt.html();

            var ritem=that.items[item];
            if(typeof(ritem["select_"+ritem["project_level"]]) == "undefined" ){//必须有选择项目
                console.log("没哟选择")
                return;
            }
            if((typeof(ritem.select_1.id)== "undefined"||ritem.select_1.id=="")&&ritem.option_1.length>0){
                console.log("有未选项目 1")
                return;
            }
            if((typeof(ritem.select_2.id)== "undefined"||ritem.select_2.id=="")&&ritem.option_2.length>0){
                console.log("有未选项目 2")
                return;
            }
            if(typeof(ritem["report"]["outcome"]) == "undefined" ){//初始为undefine，说明是新建的日志，用post来insert

                // console.log("di1----------"+ritem["select_"+ritem["project_level"]]["id"])
                var pro_id=
                    report_data={
                        "project_id": ritem["select_"+ritem["project_level"]]["id"],
                        "general": 0,
                        "outcome": ritem.editor_outcome.txt.html(),
                        "problem": ritem.editor_problem.txt.html(),
                        "plan": ritem.editor_plan.txt.html(),
                        "rate": 0
                    };

                gc.ajax("/report","POST",report_data,"",function(rsp){

                    that.items[item].report["outcome"]=e_outcome;
                    that.items[item].report["problem"]=e_problem;
                    that.items[item].report["plan"]=e_plan;
                    that.items[item].report["id"]=rsp["response"]["id"];
                });

            }else if(e_outcome!=that.items[item].report["outcome"]||
                e_problem!=that.items[item].report["problem"]||
                e_plan!=that.items[item].report["plan"]){//确认有更新才提交到服务器,到这里说明不是新建的日志，用put来update

                if(typeof(ritem["select_"+ritem["project_level"]]) == "undefined" ){//必须有选择项目
                    return;
                }

                var report_data={
                    "outcome": ritem.editor_outcome.txt.html(),
                    "problem": ritem.editor_problem.txt.html(),
                    "plan": ritem.editor_plan.txt.html()
                };
                var r_id=ritem["report"]["id"];

                gc.ajax("/report/"+r_id,"PUT",report_data,"",function(){
                    console.log("in put ffffff")
                    that.items[item].report["outcome"]=e_outcome;
                    that.items[item].report["problem"]=e_problem;
                    that.items[item].report["plan"]=e_plan;
                });
            }


        };
        this.init = function (templ) {
            this.fresh();
            var that=this;
            var app = {
                controller: this
            };
            $.views.tags("mytag", {
                init: function(tagCtx) {
                    this.template = (tagCtx.props.mode === "a" ? "template A: <em>{{:}}</em> aaa<br/>" : "template B: <em>{{:}}</em> bbb<br/>");
                }
            });
            var myTemplate = $.templates(templ);


            $.views.converters("option_txt", function (val) {

                if (val == "" || typeof(val) == "undefined") {
                    return "请选择";
                } else {
                    return val;
                }

            });

            var helpers = {
                doSomething: function(e) {
                    console.log(e);
                }
            };
            myTemplate.link(".panel [moudule=m_writeReport]", app,helpers)
                .ready(function(){

                })
                .on("click", "#add_report", function () {
                    that.addReportItem();
                })
                .on("click", "[level^=l] [role=menuitem]", function () {
                    //点击周报项目选择项目选项
                    var text = $(this).text();
                    var level = $(this).closest("[level^=l]").attr("level").substring(1, 2)
                    var id = $(this).attr("catagory_id");

                    var item_key = $(this).closest(".report_item").attr("item");

                    that.selectCatagory(item_key, level, id)
                })
                .on('click', "[name='report_item_remove']", function () {
                    //删除项
                    var item = $(this).closest(".report_item").attr("item");
                    that.removeReportItem(item);
                    //$(this).before(report_item) ;
                })
                .on("focus", ".report_entry div", function () { //不编辑时把menu隐藏,如果不是本周周报，不显示menu
                    if(!that.ifThisWeek){//是否本周
                        return
                    }
                    if (!$(this).hasClass("report_menu")) {
                        //先把所有的inter清了
                        for (var i in report_entry_inter_code_arr) {
                            window.clearInterval(report_entry_inter_code_arr[i][0]);
                        }
                        report_entry_inter_code_arr=[];

                        $('.report_menu').hide();

                        var entry = $(this).parents(".report_entry"); //.is(":focus");$(':focus')
                        var item=$(this).closest("[item]").attr("item");
                        entry.find(".report_menu").show();

                        var inter_code = self.setInterval(function () {
                            var l = entry.find(":focus").length;

                            if (l < 1) {
                                entry.find(".report_menu").hide();

                                that.submitReport(item);
                                window.clearInterval(inter_code)
                            }
                        }, 2000);

                        report_entry_inter_code_arr.push([inter_code,item])
                    }
                })
                .on("focus",".report_item div",function(){//失焦到其他item时，提交修改
                    var item=$(this).closest("[item]").attr("item");

                    if(item!=report_last_focus_item&&report_last_focus_item!=-1){
                        if(that.items.hasOwnProperty(report_last_focus_item)){
                            that.submitReport(report_last_focus_item);
                        }

                    }
                    report_last_focus_item=item;
                })


        }

    }



    var report_entry_inter_code_dic = {};
    var report_entry_inter_code_arr = [];
    var report_last_focus_item=-1;

    $(document).ready(function () {
        $(document).on("click", ".report_item .glyphicon-minus", function () {

            $(this).parents(".report_category").siblings(".report_content").slideUp()
            $(this).removeClass("glyphicon-minus")
            $(this).addClass("glyphicon-plus")
        })
        $(document).on("click", ".report_item .glyphicon-plus", function () {

            $(this).parents(".report_category").siblings(".report_content").slideDown()
            $(this).removeClass("glyphicon-plus")
            $(this).addClass("glyphicon-minus")
        })

        //选择项目菜单


    })
    return ReportController;
    // return Moudule;
})

