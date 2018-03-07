require.config({
	baseUrl: "plugins/",
    paths : {
        "jquery" : "js/jquery-3.3.1.min",
        "jquery.bootstrap":"bootstrap-3.3.7-dist/js/bootstrap.min",
        "index":"js/index",
        
        "wangEditor":"js/wangEditor.min",
        "reportItem":"js/reportItem",
        "index":"js/index"
        
    },
    shim: {

    	"jquery.bootstrap": {
            deps: ['jquery']
        }
    }
})
require(["jquery","wangEditor","jquery.bootstrap","index","reportItem"],function($,E){
    $(function(){
        // alert(E);  
    })
})