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

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>帐目录入</title>

        </!-- Framework CSS -->
    <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="bootstrap/css/bootstrap.css" type="text/css" >
    <link rel="stylesheet" href="bootstrap/css/bootstrap-responsive.css" type="text/css" > 
        <link href="css/jquery-ui.css" rel="stylesheet" type="text/css">
    <link href="css/common.css" rel="stylesheet" type="text/css">
        <script src="js/jquery-1.4.2.min.js"></script>
        <script src="js/jquery-ui.min.js"></script>
        <script src="js/accounting.js"></script>
        <script src="js/common.js"></script>
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
    <?php echo $user->getNav('accounting_input',$userInfo['username']);?>
    <div class="row">
        <div class="span9">
            <form action="accounting_input.php" class="well form-horizontal" method="post" onsubmit="return submitCheck('check1')">
            <fieldset>
            <legend>帐目录入</legend>
            <?php echo(isset($uploadRet)) ? ("<div class='control-group'><label class='control-label'></label><span class='label label-success'>" . $uploadRet['tips'] . "</span></div>") : ""; ?>
            <div class="control-group">
                <label class="control-label" for="datepicker">消费时间</label>
                <div class="controls">
                    <input type="text" class="span2" id="datepicker" name="datepicker" class="uneditable-input">
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="category">请选择消费类别:</label>
                <div class="controls">
                    <select name="category" class="span2" id="category" ></select>
                <div class="help-inline"><font color="red"> *消费类别</font>
                </div>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="money">请输入金额:</label>
                <div class="controls">
                    <input type="text" id="money" class="span2" error_id="money_error" check_name="check1" check_id="1" name="money">
                    <div class="help-inline"><font color="red"> *金额</font>
                    </div>
                    <p class="help-block error alert alert-error" id="money_error" style="display:none" ><strong>金额必须是数字</strong></p>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="other_information">其他描述信息:</label>
                <div class="controls">
                    <input type="text" name="other_information" class="span3">
                </div>
            </div>
            <div class="form-actions">
                <input type="submit" class="btn btn-info" value="提交" name="uploadDetail">
            </div>
            </fieldset>
            </form>
        </div>
    </div>
        <?php echo $user->getFooter();?>
    </body>
</html>
