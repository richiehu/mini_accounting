<?php
    require_once("user.php");
    
    session_start();
    $user = new user();
    $userInfo = $user->getUserInfo();

    if(empty($userInfo['username'])){
        header("Location: login.php?url=" . urlencode($_SERVER['REQUEST_URI']));
    }
?>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>帐目汇总</title>

        <!-- Framework CSS -->
        <link rel="stylesheet" href="css/blueprint/screen.css" type="text/css" media="screen, projection">
        <link rel="stylesheet" href="css/blueprint/print.css" type="text/css" media="print">
        <!--[if lt IE 8]><link rel="stylesheet" href="../blueprint/ie.css" type="text/css" media="screen, projection"><![endif]-->
        <link href="css/jquery-ui.css" rel="stylesheet" type="text/css">
        <link href="css/pagination.css" rel="stylesheet" type="text/css">
        <script src="js/jquery-1.4.2.min.js"></script>
        <script src="js/jquery-ui.min.js"></script>
        <script src="js/jquery.pagination.js"></script>
        <script src="js/floatdialog.js"></script>
        <script src="js/accounting.js"></script>
        <script src="js/common.js"></script>
        <style type="text/css" media="screen">
          p, table, hr, .box { margin-top:10px;margin-bottom:0px;padding:0px; }
          table {border-spacing:1px;}
          .box p { margin-bottom:10px; }
          .error,.alert,.notice,.success,.info{padding: 0.4em;margin-left:10px;} 
        .disable_masking {
          background-color: #FFFFFF;
        border: 2px solid #D6CDDE;
        padding: 20px;
        position: absolute;
        width: 600px;
               z-index: 6001;
        }
        .closebutton {
            float: right;
            text-decoration: none;
        }
        </style>
        <script>
            function makeTable(data) {
               var content = "" 
               var firstCategoryDetail = true;
               var firstCategory = true;
               var totalRow = 0;
               var totalMoney = 0;
               content += "<table align='center' width='100%' border='0' cellspacing='1'  bgcolor='#AAAAAA' style='clear:both;'>";
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
                var param = {};
                param['start_date'] = $('#datepicker1').val();
                param['end_date'] = $('#datepicker2').val();
                $.get("getAccountingCategory.php",param,function(ret){
                    var retTrim = eval('(' + getResText(ret) + ')');
                    if(retTrim['status'] == 200) {
                        makeTable(retTrim['data']);            
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
                makeAccountingAgg();

            }
            );
        </script>
    </head>
    <body>
        <div class="box">
            <span style="padding-left:8px; font-size:15px;"> <a href="accounting_input.php">帐目录入</a>&nbsp;|&nbsp;<a href="accounting_detail.php">帐目明细</a>&nbsp;|&nbsp;账面汇总 </span>
        </div>
        <div style="height:30px;margin-top:5px;border-bottom: 1px solid #CCCCCC;" class="border_bottom">
            <div style="float:left;margin-left:500px;"><b style="font-size:15px;">帐目汇总</b></div>
            <div style="float:right; padding:5px;">
            <span>Hi,&nbsp;<b><?php echo $userInfo['username']?></b>&nbsp;[<a href="login.php?logout=1">登出</a>]
            </div>
        </div>
        <div style="height:10px"></div>
        <div style="width:650px;margin-left:auto;margin-right:auto">
            
            <div >
            <span style="float:left;margin-top:7px;">起始时间</span>
            <span style="float:left;margin-left: 5px;"><input class="rd_input"  type="text" id="datepicker1" name="datepicker1" readonly="true"></span>
            <span style="float:left;margin-left:20px;margin-top:7px;">结束时间</span>
            <span style="float:left;margin-left: 5px;"><input class="rd_input"  type="text" id="datepicker2" name="datepicker2" readonly="true"></span>
            </div>
            <div style="clear:both;height:20px;"></div>
            <div id="accounting_content"></div>
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
    </body>
</html>
