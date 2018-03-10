define(['jquery', "wangEditor","jsviews","jquery.bootstrap"], function($, E) {





    var report={
        outcome:"1.睡觉",
        problem:"无",
        plan:"继续睡觉"
    };
    var allreport=[{
        "id": "1",
        "name": "经分组",
        "sub": [{
            "name": "经分五期建设",
            "id": "2",
            "sub": [{
                "name": "接口改造",
                "id": "3",
                "report":report
            },
                {
                    "name": "hadoop移植",
                    "id": "4",
                    "report":report
                }
            ]
        },
            {
                "name": "经分四期维护",
                "id": "5",
                "sub": [{
                    "name": "日常维护",
                    "id": "6",
                    "report":report
                },
                    {
                        "name": "gbase扩容",
                        "id": "7",
                        "report":report
                    }
                ]
            }
        ]
    },{
        "id": "8",
        "name": "安全组",
        "sub": [{
            "name": "扫描",
            "id": "9",
            "sub": [{
                "name": "dos漏洞",
                "id": "13",
                "report":report
            },
                {
                    "name": "系统错误",
                    "id": "14",
                    "report":report
                }
            ]
        },
            {
                "name": "平台",
                "id": "15",
                "sub": [{
                    "name": "安全大数据",
                    "id": "16",
                    "report":report
                },
                    {
                        "name": "安全平台建设",
                        "id": "17",
                        "report":report
                    }
                ]
            }
        ]
    }];
    function BrowseTeamReport_m(data){
        this.report=report;
        this.allreport=allreport;
        this.data=data;
        this.init=function(){

            var app = {
                allreport: allreport
            };
            var myTemplate = $.templates(this.data);

            myTemplate.link("[moudule=m_browseTeamReport]", app);

            //初始化编辑器
            $(".teamReport_content_content").each(function(e){
                var editor = new E("",e);
                editor.customConfig.zIndex = 0;
                editor.create();
                editor.$textElem.attr('contenteditable', false);
            })
        }
    }
    return BrowseTeamReport_m;
});