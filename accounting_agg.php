<?php
    require_once("user.php");
    
    session_start();
    $user = new user();
    $userInfo = $user->getUserInfo();

    if(empty($userInfo['username'])){
        header("Location: login.php?url=" . urlencode($_SERVER['REQUEST_URI']));
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>帐目汇总</title>

        <!-- Framework CSS -->
        <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" href="bootstrap/css/bootstrap.css" type="text/css" >
        <link rel="stylesheet" href="bootstrap/css/bootstrap-responsive.css" type="text/css" > 
        <link href="css/jquery-ui.css" rel="stylesheet" type="text/css">
        <link href="css/pagination.css" rel="stylesheet" type="text/css">
        <link href="css/common.css" rel="stylesheet" type="text/css">
        <script src="../bootstrap/docs/assets/js/jquery.js"></script>
        <script src="js/jquery-ui.min.js"></script>
        <script src="js/jquery.pagination.js"></script>
        <script src="js/floatdialog.js"></script>
        <script src="js/accounting.js"></script>
        <script src="js/common.js"></script>
        
        <script src="bootstrap/js/bootstrap.js"></script>
        <script src="js/amchart/amcharts.js"></script>
        <script src="js/amchart/raphael.js"></script>
        <script>
            function makePie(data) {
               $('#accounting_content').html('<div style="height:500px;" id="amchart"></div>'); 
                var chartData = [];
                for(var i in data) {
                    var tmp = {

                        'category_name': data[i]['category_name'],
                        'money': data[i]['money']
                    };
                    chartData.push(tmp);
                }
                var chart = new AmCharts.AmPieChart();
                chart.fontFamily = 'Arial';
                chart.fontSize = 12; 
                chart.pathToImages = '/images/amchart/';
                chart.dataProvider = chartData;
                chart.titleField = 'category_name';
                chart.valueField = 'money';
               /* chart.urlField = 'url';
                chart.urlTarget = '_target';
                chart.descriptionField = 'description'; */
                chart.colors = ['#FF9900', '#FF33CC', '#3300FF', '#00CCFF', '#00FF33', '#CCFF00', '#CCCC00', '#00CC00', '#CC0000'];
                chart.groupPercent = 1;
                chart.groupedTitle = '其它';
                chart.groupedDescription = '其它';
                chart.balloonText = '[[title]]\n[[percents]]% ([[value]])';
                chart.pullOutOnlyOne = true;
  
                var legend = new AmCharts.AmLegend();
                legend.align = 'center';
                legend.markerType = 'circle';
                chart.addLegend(legend);

                setTimeout(function(){chart.write('amchart');}, 200);
  
            }
            function makeTable(data) {
               var content = "" 
               var firstCategoryDetail = true;
               var firstCategory = true;
               var totalRow = 0;
               var totalMoney = 0;
               content += "<table width='100%' class='table table-striped table-bordered' align='center'>";
                content += "<tr bgcolor='#D6CDDE'>";
                content += "<td><b><div align='center'>消费大类</div></b></td>";
                content += "<td><b><div align='center'>消费明细类</div></b></td>";
                content += "<td><b><div align='center'>明细金额</div></b></td>";
                content += "<td><b><div align='center'>大类金额</div></b></td>";
                content += "<td><b><div align='center'>金额总计</div></b></td>";
                content += "</tr>"; 
                for(var i in data) {
                    totalRow += data[i]['category_detail'].length;
                    totalMoney = (data[i]['money'] * 100 + totalMoney  * 100)/100 ;
                }
                for(var i in data) {
                    firstCategoryDetail = true;
                    for(var j in data[i]['category_detail']) {
                        content += "<tr bgcolor='#ECF0E1'>";
                        if(firstCategoryDetail) {
                            content += "<td rowspan='" + data[i]['category_detail'].length + "'><b><div align='center'>" + data[i]['category_name'] + "</div></b></td>";
                        }
                        content += "<td><b><div align='center'>" + data[i]['category_detail'][j]['category_detail_name'] + "</div></b></td>";
                        content += "<td><b><div align='center'>" + data[i]['category_detail'][j]['money'] + "</div></b></td>";
                        if(firstCategoryDetail) {
                            content += "<td rowspan='" + data[i]['category_detail'].length + "'><b><div align='center'>" + data[i]['money'] + "</div></b></td>";
                            if(firstCategory) {
                                content += "<td rowspan='" + totalRow + "'><b><div align='center'>" + totalMoney + "</td>";
                                firstCategory = false;
                            }
                            firstCategoryDetail = false;
                        }
                        
                    }
                }
                $('#accounting_content').html(content);
            }
            function makeAccountingAgg() {
                var type = $('[data-toggle="buttons-radio"] > .active').attr('name');
                if (arguments.length >= 1) type = arguments[0];
                var param = {};
                param['start_date'] = $('#datepicker1').val();
                param['end_date'] = $('#datepicker2').val();
                $.get("getAccountingCategory.php",param,function(ret){
                    var retTrim = eval('(' + getResText(ret) + ')');
                    if(retTrim['status'] == 200) {
                        if(type == 'table')
                            makeTable(retTrim['data']);            
                        else if(type == 'pie') {
                            makePie(retTrim['data']);
                        }
                    } else {
                        alert("数据获取失败");
                    }
                });
            }
            $(function() {
                var date = new Date();
                datepicker1_option.onSelect = function(dateText,inst){$('#datepicker2').datepicker('option','minDate',$('#datepicker1').val());makeAccountingAgg();};
                datepicker2_option.onSelect = function(dateText,inst){$('#datepicker1').datepicker('option','maxDate',$('#datepicker2').val());makeAccountingAgg();};
                $('#datepicker2').val(date.format('yyyy-mm-dd'));
                $('#datepicker1').datepicker(datepicker1_option);
                $('#datepicker2').datepicker(datepicker2_option);
                $('#datepicker1').val(date.format('yyyy-mm-01'));
                $('#datepicker1').datepicker("option","maxDate",$('#datepicker2').val());
                $('#datepicker2').datepicker("option","minDate",$('#datepicker1').val());
                $('[data-toggle="buttons-radio"] button').bind('click', function() {makeAccountingAgg($(this).attr('name'));});
                makeAccountingAgg();

            }
            );
        </script>
    </head>
    <body>
    <div class="row">
        <?php echo $user->getNav('accounting_agg',$userInfo['username']);?>
        <div class="span7 offset3">
            
            <div class="row">
            <span style="float:left;margin-top:7px;">起始时间</span>
            <span style="float:left;margin-left: 5px;"><input  class="span2" type="text" id="datepicker1" name="datepicker1" readonly="true"></span>
            <span style="float:left;margin-left:20px;margin-top:7px;">结束时间</span>
            <span style="float:left;margin-left: 5px;"><input class="span2" type="text" id="datepicker2" name="datepicker2" readonly="true"></span>
            </div>
            <div class="row">
                <div class="pull-right btn-group" data-toggle="buttons-radio">
                    <button name="table" class="btn active">表格</button>
                    <button name="pie" class="btn ">饼图</button>
                </div>
            </div>
            <div style="height:10px;"></div>
            <div id="accounting_content" class="row"></div>
            <div id="detailUpdateDialog" style="display:none">
                <center id="trend_title" style="font-family:courier new; font-size:18px;">修改消费明细</center>
                <div><a href="javascript:void(0);" class="closebutton">[关闭]</a></div>
                <div id="modifyTable" style="clear:both;">
                            <input type="hidden" id="detail_id" name="detail_id">
                    <table align='center' width='100%' cellspacing='1' bgcolor='#AAAAAA' style='clear:both;'>
                        <tr  bgcolor='#D6CDDE'>
                            <td><b><div align='center'>消费日期</div></b></td>
                            <td colspan="2"><input type="text" id="datepicker" name="datepicker" readonly="true"></td>
                        </tr>
                        <tr  bgcolor='#D6CDDE'>
                            <td><b><div align='center'>消费类别</div></b></td>
                            <td colspan="2"><span style="margin-left:5px;"><select name="category" id="category" ></select></span><span style="margin-left:10px;"><font color="red"> *消费类别</font></span></td>
                        </tr>
                        <tr  bgcolor='#D6CDDE'>
                            <td><b><div align='center'>金额</div></b></td>
                            <td colspan="2"><span style="margin-left:5px;"><input type="text" id="money" error_id="money_error" check_name="check1" check_id="1" name="money"></span><span style="margin-left:10px;"><font color="red"> *消费类别</font></span><span id="money_error" style="display:none" class="error">金额必须是数字</span></td>
                        </tr>
                        <tr  bgcolor='#D6CDDE'>
                            <td><b><div align='center'>备注</div></b></td>
                            <td><span style="margin-left:5px;"><input type="text" id="other_information" name="other_information" size="30"></span></td>
                            <td><input type="button" onclick="updateDetail()" value="更新信息"></td>
                        </tr>
                    </table>
                    
                </div>
            </div>
        </div>
    </div>
    <?php echo $user->getFooter();?>
    </body>
</html>
