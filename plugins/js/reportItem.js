define(['jquery', "wangEditor","jsviews","jquery.bootstrap"], function($, E) {



    function ReportItem(report_item_num,pro_option_dic) {
        this.report_item_num = report_item_num;
        // this.item_dom = item_dom;
        this.select_0 = {};
        this.select_1 = {};
        this.select_2 = {};
        this.option_0=[];
        this.option_1=[];
        this.option_2=[];
        this.pro_option_dic=pro_option_dic;
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
            
            this.editor_outcome = new E("[item='" + this.report_item_num + "']  .report_menu_outcome",
                ".panel [item='" + this.report_item_num + "'] .report_outcome")
            this.editor_problem = new E("[item='" + this.report_item_num + "']  .report_menu_problem",
                ".panel [item='" + this.report_item_num + "'] .report_problem")
            this.editor_plan = new E("[item='" + this.report_item_num + "']  .report_menu_plan",
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
        this.setCatagory = function(item_key) {
            option_0=[];
            option_1=[];
            option_2=[];
            for (var c0 of this.pro_option_dic) {
                var id = c0["id"];
                var name = c0["name"];
                option_0.push({name:name,id:id});
                
                if (this.select_0["id"] == c0.id) {
                    $.observable(this.select_0).setProperty("name",name);
                    for (var c1 of c0["sub"]) {
                        var id = c1["id"];
                        var name = c1["name"];
                        option_1.push({name:name,id:id});
                        if (this.select_1["id"] == c1.id) {
                            $.observable(this.select_1).setProperty("name",name);
                            for (var c2 of c1["sub"]) {
                                var id = c2["id"];
                                var name = c2["name"];
                                option_2.push({name:name,id:id});
                                if(this.select_2["id"] == c2.id){
                                    $.observable(this.select_2).setProperty("name",name);
                                }
                            }
                        }

                    }
                }

            }
            
            $.observable(this).setProperty("option_0",option_0);
            $.observable(this).setProperty("option_1",option_1);
            $.observable(this).setProperty("option_2",option_2);
           
        }
        this.setCatagory()
       
    }

    function ReportController() {
        this.items = {};
        this.report_item_num = 1;
        this.report_item_html = $("#report_item_demo").html();

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
                
            }
        }

        this.selectCatagory = function(item_key, level, id) {

            var level_n = parseInt(level);
            if (this.items[item_key]["select_"+level_n]["id"] != id) { 
                //检查有无变化，没变化就不进行操作
                
                //this.items[item_key]["select_"+level_n]={name:"tmp",id:id};

                $.observable(this.items[item_key]).setProperty("select_"+level+".id",id);
                
                //修改了项目选择，因为依赖关系把后面子项的都清空
                for(var i=level_n+1;i<3;i++){
                    
                    $.observable(this.items[item_key]).setProperty("select_"+i+".id","");
                    $.observable(this.items[item_key]).setProperty("select_"+i+".name","");
                }
                

                this.items[item_key].setCatagory();
                //observable 的重置必须不是原来的对象，否则会不生效，所以这里用拷贝
                // var o0=[]
                // var o1=[]
                // var o2=[]
                // $.extend(true,o0,this.items[item_key].option_0)
                // $.extend(true,o1,this.items[item_key].option_1)
                // $.extend(true,o2,this.items[item_key].option_2)
                // console.log(this.items[item_key].option_1)
                // $.observable(this.items[item_key]).setProperty("option_0",o0);
                // $.observable(this.items[item_key]).setProperty("option_1",o1);
                // $.observable(this.items[item_key]).setProperty("option_2",o2);
            }
            

             
             
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
                item.option_0.push({name:name,id:id});
                if (item.level[0] == c1.id) {
                    for (var c2 of c1["sub"]) {
                        var id = c2["id"];
                        var name = c2["name"];
                        var txt = '<li role="presentation"><a catagory_id=' + id + ' role="menuitem" tabindex="-1" href="javascript:void(0)">' + name + '</a></li>';
                        dom.find("[level='l1']").append(txt);
                        item.option_1.push({name:name,id:id});
                        if (item.level[1] == c2.id) {
                            for (var c3 of c2["sub"]) {
                                var id = c3["id"];
                                var name = c3["name"];
                                var txt = '<li role="presentation"><a catagory_id=' + id + ' role="menuitem" tabindex="-1" href="javascript:void(0)">' + name + '</a></li>';
                                dom.find("[level='l2']").append(txt);
                                item.option_2.push({name:name,id:id});
                            }
                        }

                    }
                }

            }
            // dom.find("[level='l2'] [role='presentation']").hide();
            // dom.find("[level='l3'] [role='presentation']").hide();
        }

        this.removeReportItem = function(item_key) {
            // this.item_record_dic[item_key].item_dom.remove();
            // delete this.item_record_dic[item_key];
            // this.submitAbility(); //是否还能显示提交按钮
            $.observable(this.items).removeProperty(item_key+"");
        }
        this.addReportItem = function() {
            console.log("add item")
            this.report_item_num = this.report_item_num + 1
            // var new_item_dom = $(this.report_item_html).attr("item", this.report_item_num)
            // $("#add_report").before(new_item_dom);

            var report_item = new ReportItem(this.report_item_num,this.pro_option_dic);
            
            console.log(report_item)
            $.observable(this.items).setProperty(this.report_item_num+"",report_item);
            this.items[this.report_item_num+""].init();


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
        $(document).on("click", ".report_item .glyphicon-minus", function() {
            console.log(11111111111)
            $(this).parents(".report_category").siblings(".report_content").slideUp()
            $(this).removeClass("glyphicon-minus")
            $(this).addClass("glyphicon-plus")
        })
        $(document).on("click", ".report_item .glyphicon-plus", function() {

            $(this).parents(".report_category").siblings(".report_content").slideDown()
            $(this).removeClass("glyphicon-plus")
            $(this).addClass("glyphicon-minus")
        })

        //选择项目菜单
        
        
    })
    return ReportController;
})

