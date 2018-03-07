define(['jquery', "wangEditor"], function($, E) {



    function ReportItem(report_item_num, item_dom) {
        this.report_item_num = report_item_num;
        this.item_dom = item_dom;
        this.level = [" ", " ", " "];
        this.editor_outcome = "";
        this.editor_problem = "";
        this.editor_plan = "";

        this.menu_list = [
            'bold',
            'italic',
            'underline',
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'list', // 列表
        ];

        this.init = function() {
           
            this.editor_outcome = new E(".panel [item='" + this.report_item_num + "']  .report_menu_outcome",
                ".panel [item='" + this.report_item_num + "'] .report_outcome")
            this.editor_problem = new E(".panel [item='" + this.report_item_num + "']  .report_menu_problem",
                ".panel [item='" + this.report_item_num + "'] .report_problem")
            this.editor_plan = new E(".panel [item='" + this.report_item_num + "']  .report_menu_plan",
                ".panel [item='" + this.report_item_num + "'] .report_plan")
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
        this.init();
    }

    function ReportController() {
        this.item_record_dic = {};
        this.report_item_num = 1;
        this.report_item_html = $("#report_item_demo").html();
        this.submit_dom = $(".report_submit"); //提交的，每次添加或删除item都会判断是否显示该按键
        this.add_dom = $("#add_report");


        this.entry_menu_dic = [{
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
        }];


        this.submitAbility = function() { //是否显示submit按钮以及是否能够提交
            var ifNull = false;
            for (var key in this.item_record_dic) {
                ifNull = true;
                break;
            }
            if (ifNull) {
                this.submit_dom.show();
                return true;
            } else {
                this.submit_dom.hide();
                return false;
            }
        }
        this.submit = function() {
            for (var key in this.item_record_dic) {
                var report_item = this.item_record_dic[key];
                var outcome = report_item.editor_outcome.txt.html();
                var problem = report_item.editor_problem.txt.html();
                var plan = report_item.editor_plan.txt.html();
                console.log(outcome);
            }
        }

        this.selectCatagory = function(item_key, level, id) {

            var level_n = parseInt(level);
            if (this.item_record_dic[item_key].level[level_n] != id) { //检查有无变化，没变化就不进行操作
                this.item_record_dic[item_key].level[level_n] = id;

                for (var i = level_n + 1; i < this.item_record_dic[item_key].level.length; i++) {
                    this.item_record_dic[item_key].level[i] = " ";

                    this.item_record_dic[item_key].item_dom.find("[level=l" + i + "]").prevAll(".report_category_dropdown").html("请选择");
                }
                this.setCatagory(item_key);
            }
            //console.log(this.item_record_dic[item_key].level)

        }
        this.setCatagory = function(item_key) {

            var item = this.item_record_dic[item_key];
            var dom = item.item_dom;
            dom.find("[level='l0'] [role='presentation']").remove();
            dom.find("[level='l1'] [role='presentation']").remove();
            dom.find("[level='l2'] [role='presentation']").remove();
            //dom.find("[level='l2']").find(" [role='presentation']").remove();
            for (var c1 of this.entry_menu_dic) {
                var id = c1["id"];
                var name = c1["name"];
                var txt = '<li role="presentation"><a catagory_id=' + id + ' role="menuitem" tabindex="-1" href="javascript:void(0)">' + name + '</a></li>';
                dom.find("[level='l0']").append(txt);
                if (item.level[0] == c1.id) {
                    for (var c2 of c1["sub"]) {
                        var id = c2["id"];
                        var name = c2["name"];
                        var txt = '<li role="presentation"><a catagory_id=' + id + ' role="menuitem" tabindex="-1" href="javascript:void(0)">' + name + '</a></li>';
                        dom.find("[level='l1']").append(txt);
                        if (item.level[1] == c2.id) {
                            for (var c3 of c2["sub"]) {
                                var id = c3["id"];
                                var name = c3["name"];
                                var txt = '<li role="presentation"><a catagory_id=' + id + ' role="menuitem" tabindex="-1" href="javascript:void(0)">' + name + '</a></li>';
                                dom.find("[level='l2']").append(txt);
                            }
                        }

                    }
                }

            }
            // dom.find("[level='l2'] [role='presentation']").hide();
            // dom.find("[level='l3'] [role='presentation']").hide();
        }

        this.removeReportItem = function(item_key) {
            this.item_record_dic[item_key].item_dom.remove();
            delete this.item_record_dic[item_key];
            this.submitAbility(); //是否还能显示提交按钮

        }
        this.addReportItem = function() {
            this.report_item_num = this.report_item_num + 1
            var new_item_dom = $(this.report_item_html).attr("item", this.report_item_num)
            $("#add_report").before(new_item_dom);

            var report_item = new ReportItem(this.report_item_num, new_item_dom);
            
            this.item_record_dic[this.report_item_num] = report_item;

            //this.installCatagory(this.report_item_num);
            this.setCatagory(this.report_item_num);
            this.submitAbility(); //是否还能显示提交按钮


            //---------------------------------------------



        }
        this.change = function() {
            this.item_record_dic.html("ahahahahhh")
        }
        this.init = function() { //放最后
            var t = this;


        }
        this.init(); //类的初始化函数放最后
    }
    var menu_list = [
        'bold',
        'italic',
        'underline',
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'list', // 列表
    ]
    // var E = window.wangEditor
    // var editor_outcome = new E(".report_menu_outcome", ".report_outcome")
    // var editor_problem = new E(".report_menu_problem", ".report_problem")
    // var editor_plan = new E(".report_menu_plan", ".report_plan")

    // editor_outcome.customConfig.menus = menu_list
    // editor_problem.customConfig.menus = menu_list
    // editor_plan.customConfig.menus = menu_list

    // editor_outcome.customConfig.zIndex = 0
    // editor_problem.customConfig.zIndex = 0
    // editor_plan.customConfig.zIndex = 0

    // editor_outcome.create()
    // editor_problem.create()
    // editor_plan.create()
    // var json = editor.txt.getJSON()  // 获取 JSON 格式的内容
    // var jsonStr = JSON.stringify(json)
    // console.log(json)
    // console.log(jsonStr)
    $(".report_menu").hide()


    var report_entry_inter_code_arr = [];
    $(document).on("focus", ".report_entry div", function() { //不编辑时把menu隐藏

        if (!$(this).hasClass("report_menu")) {
            //先把所有的inter清了
            for (var code of report_entry_inter_code_arr) {
                window.clearInterval(code)
            }
            var entry = $(this).parents(".report_entry") //.is(":focus");$(':focus')
            $('.report_menu').hide();
            entry.find(".report_menu").show()
            var inter_code = self.setInterval(function() {
                var l = entry.find(":focus").length

                if (l < 1) {
                    entry.find(".report_menu").hide()
                    window.clearInterval(inter_code)
                }
            }, 2000)
            report_entry_inter_code_arr.push(inter_code)
        }
    })

    $(document).ready(function() {

        var report_controller = new ReportController();
        // report_controller.init()
        report_controller.add_dom.click(function() {
            report_controller.addReportItem();
        })
        report_controller.submit_dom.click(function() {
            report_controller.submit();
        })
        $(document).on('click', "[name='report_item_remove']", function() {

            var item = $(this).closest(".report_item").attr("item");
            report_controller.removeReportItem(item);
            //$(this).before(report_item) ;
        })

        $(document).on("click", "[level^=l] [role=menuitem]", function() {
            //点击周报项目选择项目选项
            var text = $(this).text();
            var level = $(this).closest("[level^=l]").attr("level").substring(1, 2)
            var id = $(this).attr("catagory_id");
            var item_key = $(this).closest(".report_item").attr("item");
            $(this).closest("[level^=l]").prevAll(".report_category_dropdown").html(text);

            report_controller.selectCatagory(item_key, level, id)
        })

        $(document).on("click", ".report_item .glyphicon-minus", function() {
            $(this).parents(".report_category").siblings(".report_entry").slideUp()
            $(this).removeClass("glyphicon-minus")
            $(this).addClass("glyphicon-plus")
        })
        $(document).on("click", ".report_item .glyphicon-plus", function() {
            $(this).parents(".report_category").siblings(".report_entry").slideDown()
            $(this).removeClass("glyphicon-plus")
            $(this).addClass("glyphicon-minus")
        })
    })
})




// function ReportItem(report_item_num, item_dom) {
//         this.report_item_num = report_item_num;
//         this.item_dom = item_dom;
//         this.level = [" ", " ", " "];
//         this.editor_outcome = "";
//         this.editor_problem = "";
//         this.editor_plan = "";

//         this.menu_list = [
//             'bold',
//             'italic',
//             'underline',
//             'foreColor', // 文字颜色
//             'backColor', // 背景颜色
//             'list', // 列表
//         ];

//         this.init = function() {
//            	var E = window.wangEditor
//             this.editor_outcome = new E(".panel [item='" + this.report_item_num + "']  .report_menu_outcome",
//                 ".panel [item='" + this.report_item_num + "'] .report_outcome")
//             this.editor_problem = new E(".panel [item='" + this.report_item_num + "']  .report_menu_problem",
//                 ".panel [item='" + this.report_item_num + "'] .report_problem")
//             this.editor_plan = new E(".panel [item='" + this.report_item_num + "']  .report_menu_plan",
//                 ".panel [item='" + this.report_item_num + "'] .report_plan")
//             this.editor_outcome.customConfig.menus = this.menu_list;
//             this.editor_problem.customConfig.menus = this.menu_list;
//             this.editor_plan.customConfig.menus = this.menu_list;

//             this.editor_outcome.customConfig.zIndex = 0;
//             this.editor_problem.customConfig.zIndex = 0;
//             this.editor_plan.customConfig.zIndex = 0;

//             this.editor_outcome.create();
//             this.editor_problem.create();
//             this.editor_plan.create();
//         }
//         this.init();
//     }

//     function ReportController() {
//         this.item_record_dic = {};
//         this.report_item_num = 1;
//         this.report_item_html = $("#report_item_demo").html();
//         this.submit_dom = $(".report_submit"); //提交的，每次添加或删除item都会判断是否显示该按键
//         this.add_dom = $("#add_report");


//         this.entry_menu_dic = [{
//             "id": "1",
//             "name": "经分组",
//             "sub": [{
//                     "name": "经分五期建设",
//                     "id": "2",
//                     "sub": [{
//                             "name": "接口改造",
//                             "id": "3"
//                         },
//                         {
//                             "name": "hadoop移植",
//                             "id": "4"
//                         }
//                     ]
//                 },
//                 {
//                     "name": "经分四期维护",
//                     "id": "5",
//                     "sub": [{
//                             "name": "日常维护",
//                             "id": "6"
//                         },
//                         {
//                             "name": "gbase扩容",
//                             "id": "7"
//                         }
//                     ]
//                 }
//             ]
//         }];


//         this.submitAbility = function() { //是否显示submit按钮以及是否能够提交
//             var ifNull = false;
//             for (var key in this.item_record_dic) {
//                 ifNull = true;
//                 break;
//             }
//             if (ifNull) {
//                 this.submit_dom.show();
//                 return true;
//             } else {
//                 this.submit_dom.hide();
//                 return false;
//             }
//         }
//         this.submit = function() {
//             for (var key in this.item_record_dic) {
//                 var report_item = this.item_record_dic[key];
//                 var outcome = report_item.editor_outcome.txt.html();
//                 var problem = report_item.editor_problem.txt.html();
//                 var plan = report_item.editor_plan.txt.html();
//                 console.log(outcome);
//             }
//         }

//         this.selectCatagory = function(item_key, level, id) {

//             var level_n = parseInt(level);
//             if (this.item_record_dic[item_key].level[level_n] != id) { //检查有无变化，没变化就不进行操作
//                 this.item_record_dic[item_key].level[level_n] = id;

//                 for (var i = level_n + 1; i < this.item_record_dic[item_key].level.length; i++) {
//                     this.item_record_dic[item_key].level[i] = " ";

//                     this.item_record_dic[item_key].item_dom.find("[level=l" + i + "]").prevAll(".report_category_dropdown").html("请选择");
//                 }
//                 this.setCatagory(item_key);
//             }
//             //console.log(this.item_record_dic[item_key].level)

//         }
//         this.setCatagory = function(item_key) {

//             var item = this.item_record_dic[item_key];
//             var dom = item.item_dom;
//             dom.find("[level='l0'] [role='presentation']").remove();
//             dom.find("[level='l1'] [role='presentation']").remove();
//             dom.find("[level='l2'] [role='presentation']").remove();
//             //dom.find("[level='l2']").find(" [role='presentation']").remove();
//             for (var c1 of this.entry_menu_dic) {
//                 var id = c1["id"];
//                 var name = c1["name"];
//                 var txt = '<li role="presentation"><a catagory_id=' + id + ' role="menuitem" tabindex="-1" href="javascript:void(0)">' + name + '</a></li>';
//                 dom.find("[level='l0']").append(txt);
//                 if (item.level[0] == c1.id) {
//                     for (var c2 of c1["sub"]) {
//                         var id = c2["id"];
//                         var name = c2["name"];
//                         var txt = '<li role="presentation"><a catagory_id=' + id + ' role="menuitem" tabindex="-1" href="javascript:void(0)">' + name + '</a></li>';
//                         dom.find("[level='l1']").append(txt);
//                         if (item.level[1] == c2.id) {
//                             for (var c3 of c2["sub"]) {
//                                 var id = c3["id"];
//                                 var name = c3["name"];
//                                 var txt = '<li role="presentation"><a catagory_id=' + id + ' role="menuitem" tabindex="-1" href="javascript:void(0)">' + name + '</a></li>';
//                                 dom.find("[level='l2']").append(txt);
//                             }
//                         }

//                     }
//                 }

//             }
//             // dom.find("[level='l2'] [role='presentation']").hide();
//             // dom.find("[level='l3'] [role='presentation']").hide();
//         }

//         this.removeReportItem = function(item_key) {
//             this.item_record_dic[item_key].item_dom.remove();
//             delete this.item_record_dic[item_key];
//             this.submitAbility(); //是否还能显示提交按钮

//         }
//         this.addReportItem = function() {
//             this.report_item_num = this.report_item_num + 1
//             var new_item_dom = $(this.report_item_html).attr("item", this.report_item_num)
//             $("#add_report").before(new_item_dom);

//             var report_item = new ReportItem(this.report_item_num, new_item_dom);

//             this.item_record_dic[this.report_item_num] = report_item;

//             //this.installCatagory(this.report_item_num);
//             this.setCatagory(this.report_item_num);
//             this.submitAbility(); //是否还能显示提交按钮


//             //---------------------------------------------



//         }
//         this.change = function() {
//             this.item_record_dic.html("ahahahahhh")
//         }
//         this.init = function() { //放最后
//             var t = this;


//         }
//         this.init(); //类的初始化函数放最后
//     }
//     var menu_list = [
//         'bold',
//         'italic',
//         'underline',
//         'foreColor', // 文字颜色
//         'backColor', // 背景颜色
//         'list', // 列表
//     ]
//     // var E = window.wangEditor
//     // var editor_outcome = new E(".panel [item='1']  .report_menu_outcome", ".panel [item='1'] .report_outcome")
//     // var editor_problem = new E(".panel [item='1']  .report_menu_problem", ".panel [item='1'] .report_problem")
//     // var editor_plan = new E(".panel [item='1']  .report_menu_plan", ".panel [item='1'] .report_plan")

//     // editor_outcome.customConfig.menus = menu_list
//     // editor_problem.customConfig.menus = menu_list
//     // editor_plan.customConfig.menus = menu_list

//     // editor_outcome.customConfig.zIndex = 0
//     // editor_problem.customConfig.zIndex = 0
//     // editor_plan.customConfig.zIndex = 0

//     // editor_outcome.create()
//     // editor_problem.create()
//     // editor_plan.create()
//     // var json = editor.txt.getJSON()  // 获取 JSON 格式的内容
//     // var jsonStr = JSON.stringify(json)
//     // console.log(json)
//     // console.log(jsonStr)
//     $(".report_menu").hide()


//     var report_entry_inter_code_arr = [];
//     $(document).on("focus", ".reoport_entry div", function() { //不编辑时把menu隐藏

//         if (!$(this).hasClass("report_menu")) {
//             //先把所有的inter清了
//             for (var code of report_entry_inter_code_arr) {
//                 window.clearInterval(code)
//             }
//             var entry = $(this).parents(".reoport_entry") //.is(":focus");$(':focus')
//             $('.report_menu').hide();
//             entry.find(".report_menu").show()
//             var inter_code = self.setInterval(function() {
//                 var l = entry.find(":focus").length

//                 if (l < 1) {
//                     entry.find(".report_menu").hide()
//                     window.clearInterval(inter_code)
//                 }
//             }, 2000)
//             report_entry_inter_code_arr.push(inter_code)
//         }
//     })

//     $(document).ready(function() {

//         var report_controller = new ReportController();
//         // report_controller.init()
//         report_controller.add_dom.click(function() {
//             report_controller.addReportItem();
//         })
//         report_controller.submit_dom.click(function() {
//             report_controller.submit();
//         })
//         $(document).on('click', "[name='report_item_remove']", function() {

//             var item = $(this).closest(".report_item").attr("item");
//             report_controller.removeReportItem(item);
//             //$(this).before(report_item) ;
//         })

//         $(document).on("click", "[level^=l] [role=menuitem]", function() {
//             //点击周报项目选择项目选项
//             var text = $(this).text();
//             var level = $(this).closest("[level^=l]").attr("level").substring(1, 2)
//             var id = $(this).attr("catagory_id");
//             var item_key = $(this).closest(".report_item").attr("item");
//             $(this).closest("[level^=l]").prevAll(".report_category_dropdown").html(text);

//             report_controller.selectCatagory(item_key, level, id)
//         })

//         $(document).on("click", ".report_item .glyphicon-minus", function() {
//             $(this).parents(".report_category").siblings(".reoport_entry").slideUp()
//             $(this).removeClass("glyphicon-minus")
//             $(this).addClass("glyphicon-plus")
//         })
//         $(document).on("click", ".report_item .glyphicon-plus", function() {
//             $(this).parents(".report_category").siblings(".reoport_entry").slideDown()
//             $(this).removeClass("glyphicon-plus")
//             $(this).addClass("glyphicon-minus")
//         })
//     })