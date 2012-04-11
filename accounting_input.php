<?php
require_once("user.php");

session_start();
$user = new user();
$userInfo = $user->getUserInfo();
if(empty($userInfo['username'])){
    header("Location: login.php?url=" . urlencode($_SERVER['REQUEST_URI']));
}
if($_POST['uploadDetail']){
    $uploadRet = $user->uploadDetail(array('uid' => $userInfo['userid'],'category_detail_id' => $_POST['category'],'consume_date' => $_POST['datepicker'],'other_information' => $_POST['other_information'],'money' => $_POST['money']));
}
?>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>帐目录入</title>

        <!-- Framework CSS -->
        <link rel="stylesheet" href="css/blueprint/screen.css" type="text/css" media="screen, projection">
        <link rel="stylesheet" href="css/blueprint/print.css" type="text/css" media="print">
        <!--[if lt IE 8]><link rel="stylesheet" href="../blueprint/ie.css" type="text/css" media="screen, projection"><![endif]-->
        <link href="css/jquery-ui.css" rel="stylesheet" type="text/css">
        <script src="js/jquery-1.4.2.min.js"></script>
        <script src="js/jquery-ui.min.js"></script>
        <script src="js/accounting.js"></script>
        <script src="js/common.js"></script>
        <style type="text/css" media="screen">
          p, table, hr, .box { margin-top:10px;margin-bottom:0px;padding:0px; }
          .box p { margin-bottom:10px; }
          .error,.alert,.notice,.success,.info{padding: 0.4em;margin-left:10px;} 
        </style>
        <script>
            var globalCategoryList;
    /*        var categoryList = [];
            <?php foreach($categoryInfo as $v) {
            ?>
            if(!categoryList['<?php echo $v['category_name']?>']) categoryList['<?php echo $v['category_name']?>'] = [];
            categoryList['<?php echo $v['category_name']?>'][<?php echo $v['category_detail_id']?>]  = '<?php echo $v['category_detail_name'] ?>';
            <?php } ?>
            
            function fillCategory() {
                var htmlCategory = '';
                for(var category_name in categoryList) {
                    htmlCategory += "<optgroup label='" + category_name + "'>";
                    for(var category_detail_id in categoryList[category_name]) {
                        htmlCategory += "<option value='" + category_detail_id + "'>" + categoryList[category_name][category_detail_id] + "</option>";
                    }
                }
                $('#category').html(htmlCategory);

            }
            function checkNum(target) {
                var regNum = /^-?\d+(.\d+)?$/;
                if(regNum.test($(target).val()))
                    return 1;
                else
                    return 0;
            }
            function submitCheck(check_name) {
                $('.error').css('display','none');
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
            } */
            $(function() {
                var date = new Date();
                $('#datepicker').val(date.format('yyyy-mm-dd'));
                $('#datepicker').datepicker(datepicker_option);
                fillCategory();
            });
        </script>
    </head>
    <body>
        <div class="box">
            <span style="padding-left:8px; font-size:15px;"> 帐目录入&nbsp;|&nbsp;<a href="accounting_detail.php">帐目明细</a>&nbsp;|&nbsp;<a href="accounting_agg.php">账面汇总</a> </span>
        </div>
        <div style="height:30px;margin-top:5px;border-bottom: 1px solid #CCCCCC;" class="border_bottom">
            <div style="float:left;margin-left:500px;"><b style="font-size:15px;">帐目录入</b></div>
            <div style="float:right; padding:5px;">
            <span>Hi,&nbsp;<b><?php echo $userInfo['username']?></b>&nbsp;[<a href="login.php?logout=1">登出</a>]
            </div>
        </div>
        <div style="height:10px"></div>
        <div style="width:650px;margin-left:auto;margin-right:auto">
            <?php echo(isset($uploadRet)) ? ("<div style='width:300px;margin-left:auto;margin-right:auto'><span class='success'>" . $uploadRet['tips'] . "</span></div>") : ""; ?>
            <form action="accounting_input.php" method="post" onsubmit="return submitCheck('check1')">
            <div >
            <span style="float:left;margin-top:7px;">消费时间</span>
            <span style="float:left;margin-left: 5px;"><input class="rd_input"  type="text" id="datepicker" name="datepicker" readonly="true"></span>
            </div>
            <div style="clear:both;float:left;">
                <span>请选择消费类别:</span><span style="margin-left:5px;"><select name="category" id="category" style="width:250px;"></select></span><span style="margin-left:10px;"><font color="red"> *消费类别</font></span>
            </div>
            <div style="clear:both;float:left;">
                <span>请输入金额：</span><span style="margin-left:5px;"><input type="text" id="money" error_id="money_error" check_name="check1" check_id="1" name="money"></span><span style="margin-left:10px;"><font color="red"> *金额</font></span><span id="money_error" style="display:none" class="error">金额必须是数字</span>
            </div>
            <div style="clear:both;float:left;">
                <span>其他描述信息：</span><span style="margin-left:5px;"><input type="text" name="other_information" size="30"></span></span>
            </div>
            <div style="clear:both;height:10px;">
            <div style="clear:both;margin-left:100px;"><input type="submit" value="提交" name="uploadDetail"></div>
            </form>
        </div>
    </body>
</html>
