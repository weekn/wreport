define(['jquery', "wangEditor", "jsviews", "jquery.bootstrap"], function ($, E) {
    var get_report_path="data/user_report.json";


    function ReportItem(report_item_num, pro_option_dic) {
        this.report_item_num = report_item_num;
        // this.item_dom = item_dom;
        this.select_0 = {};
        this.select_1 = {};
        this.select_2 = {};
        this.option_0 = [];
        this.option_1 = [];
        this.option_2 = [];
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
        }
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

        };
        this.setCatagory()

    }

    function ReportController() {
        this.items = {};
        this.report_item_num = 1;

        this.submitAbility = false

        this.pro_option_dic = [{
            "id": "1",
            "name": "经分组",
            "sub": [{
                "name": "经分五期建设",
                "id": "2",
                "sub": [{
                    "name": "接口改造",
                    "id": "3"
                },
                    {
                        "name": "hadoop移植",
                        "id": "4"
                    }
                ]
            },
                {
                    "name": "经分四期维护",
                    "id": "5",
                    "sub": [{
                        "name": "日常维护",
                        "id": "6"
                    },
                        {
                            "name": "gbase扩容",
                            "id": "7"
                        }
                    ]
                }
            ]
        }, {
            "id": "8",
            "name": "安全组",
            "sub": [{
                "name": "扫描",
                "id": "9",
                "sub": [{
                    "name": "dos漏洞",
                    "id": "13"
                },
                    {
                        "name": "系统错误",
                        "id": "14"
                    }
                ]
            },
                {
                    "name": "平台",
                    "id": "15",
                    "sub": [{
                        "name": "安全大数据",
                        "id": "16"
                    },
                        {
                            "name": "安全平台建设",
                            "id": "17"
                        }
                    ]
                }
            ]
        }];


        this.SetSubmitAbility = function () { //是否显示submit按钮以及是否能够提交
            var ifNull = false;
            for (var key in this.items) {
                ifNull = true;
                break;
            }
            $.observable(this).setProperty("submitAbility", ifNull);

            return ifNull;
        };
        this.submit = function () {
            for (var key in this.items) {
                var report_item = this.items[key];
                var outcome = report_item.editor_outcome.txt.html();
                var problem = report_item.editor_problem.txt.html();
                var plan = report_item.editor_plan.txt.html();

            }
        };

        this.selectCatagory = function (item_key, level, id) {

            var level_n = parseInt(level);


            if (this.items[item_key]["select_" + level_n]["id"] != id) {
                //检查有无变化，没变化就不进行操作

                //this.items[item_key]["select_"+level_n]={name:"tmp",id:id};

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
            $.observable(this.items).removeProperty(item_key + "");
            this.SetSubmitAbility()
        };
        this.addReportItem = function () {

            this.report_item_num = this.report_item_num + 1;
            // var new_item_dom = $(this.report_item_html).attr("item", this.report_item_num)
            // $("#add_report").before(new_item_dom);

            var report_item = new ReportItem(this.report_item_num, this.pro_option_dic);
            $.observable(this.items).setProperty(this.report_item_num + "", report_item);
            this.items[this.report_item_num + ""].init();
            this.SetSubmitAbility()

        };
        this.getReport=function(){

            var that=this;
            function buildItem(select,report){
                that.report_item_num = that.report_item_num + 1;
                // var new_item_dom = $(this.report_item_html).attr("item", this.report_item_num)
                // $("#add_report").before(new_item_dom);

                var report_item = new ReportItem(that.report_item_num, that.pro_option_dic);
                report_item.select_0 = select[0];
                report_item.select_1 = select[1];
                report_item.select_2 = select[2];
                $.observable(that.items).setProperty(that.report_item_num + "", report_item);
                that.items[that.report_item_num + ""].init();
                that.SetSubmitAbility()
            }
            $.get(get_report_path,function(json){
                $.observable(that).setProperty("items",{});
                that.report_item_num=0;
                for(var i_0 in json){
                    var c_0=json[i_0];

                    for(var i_1 in c_0["sub"]){
                        var c_1=c_0["sub"][i_1];
                        for(var i_2 in c_1["sub"]){
                            var c_2=c_1["sub"][i_2];
                            var report=c_2["report"];
                            var select=[{name:c_0["name"],id:c_0["id"]},{name:c_1["name"],id:c_1["id"]},{name:c_2["name"],id:c_2["id"]}];
                            buildItem(select,report);
                        }
                    }
                }



            });
        };
        this.init = function (templ) {
            var that=this;
            var app = {
                controller: this
            };
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


        }

    }

    $(".report_menu").hide();


    var report_entry_inter_code_arr = [];
    $(document).on("focus", ".report_entry div", function () { //不编辑时把menu隐藏

        if (!$(this).hasClass("report_menu")) {
            //先把所有的inter清了
            for (var i in report_entry_inter_code_arr) {
                window.clearInterval(report_entry_inter_code_arr[i])
            }
            var entry = $(this).parents(".report_entry"); //.is(":focus");$(':focus')
            $('.report_menu').hide();
            entry.find(".report_menu").show();
            var inter_code = self.setInterval(function () {
                var l = entry.find(":focus").length;

                if (l < 1) {
                    entry.find(".report_menu").hide();
                    window.clearInterval(inter_code)
                }
            }, 2000);
            report_entry_inter_code_arr.push(inter_code)
        }
    });

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

