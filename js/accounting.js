 Date.prototype.format = function(format) {
    var o =
    {
        "m+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "M+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format))
        format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
};

var datepicker_option = {showOn: 'both',dateFormat: 'yy-mm-dd',autoSize: true, buttonImage: 'images/calendar.gif',buttonImageOnly: true, currentText: '今日',buttonText: 'Choose Date',dayNames:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],dayNamesMin: ['日','一','二','三','四','五','六'], monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],showAnim: 'fold',showOtherMonths: true,selectOtherMonths: true,showWeek: true,weekHeader: '周数',changeMonth: false,changeYear: false,showMonthAfterYear: true,prevText: '上一月',nextText: '下一月',maxDate: (new Date()).format('yyyy-mm-dd')};
var datepicker1_option = {showOn: 'both',dateFormat: 'yy-mm-dd',autoSize: true, buttonImage: 'images/calendar.gif',buttonImageOnly: true, currentText: '今日',buttonText: 'Choose Date',dayNames:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],dayNamesMin: ['日','一','二','三','四','五','六'], monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],showAnim: 'fold',showOtherMonths: true,selectOtherMonths: true,showWeek: true,weekHeader: '周数',changeMonth: true,changeYear: true,showMonthAfterYear: true,prevText: '上一月',nextText: '下一月',maxDate:$('#datepicker2').val(),onSelect:function(dateText,inst){$('#datepicker2').datepicker('option','minDate',$('#datepicker1').val());genPaging();}};

var datepicker2_option = {showOn: 'both',dateFormat: 'yy-mm-dd',autoSize: true, buttonImage: 'images/calendar.gif',buttonImageOnly: true, currentText: '今日',buttonText: 'Choose Date',dayNames:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],dayNamesMin: ['日','一','二','三','四','五','六'], monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],showAnim: 'fold',showOtherMonths: true,selectOtherMonths: true,showWeek: true,weekHeader: '周数',changeMonth: true,changeYear: true,showMonthAfterYear: true,prevText: '上一月',nextText: '下一月',maxDate: (new Date()).format('yyyy-mm-dd'),minDate:$('#datepicker1').val(),onSelect:function(dateText,inst){$('#datepicker1').datepicker('option','maxDate',$('#datepicker2').val());genPaging();}};

function checkNum(target) {
    var regNum = /^-?\d+(.\d+)?$/;
    if(regNum.test($(target).val()))
        return 1;
    else
        return 0;
}
function submitCheck(check_name) {
    $('.error').css('display','none');
   /* for(var i = 0;i <  $('.error').length;i++) {
        $($('.error')[i]).css('display','none');
}*/
    var errorCnt = 0;
    var targets = $("\"[check_name='" + check_name + "']\"");
    for(var i = 0;i < targets.length; i++) {
        switch($(targets[i]).attr('check_id'))
        {
            case '1':
                if(!checkNum(targets[i])){
                    $('#' + ($(targets[i]).attr('error_id'))).css('display','inline');
                    errorCnt += 1;
                }
                break;
            default:
                break;
        }
    }
    return errorCnt == 0 ? true : false;   
}

function makeCategory(categoryList,checked_id) {
    var htmlCategory = '';
    for(var category_name in categoryList) {
        htmlCategory += "<optgroup label='" + category_name + "'>";
        for(var category_detail_id in categoryList[category_name]) {
            htmlCategory += "<option value='" + category_detail_id + "'" + (checked_id == category_detail_id ? "selected='true'" : "") + ">" + categoryList[category_name][category_detail_id] + "</option>";
        }
    }
    $('#category').html(htmlCategory);

}

function fillCategory(checked_id) {
    if(!globalCategoryList) {
        $.get("getCategory.php",function(ret){
        var retTrim =  eval('(' + getResText(ret) + ')');
        if(retTrim['status'] == 200){
            globalCategoryList = retTrim['data'];
            makeCategory(globalCategoryList,checked_id);
        }
        });
    } else {
        makeCategory(globalCategoryList,checked_id);
    }

}
