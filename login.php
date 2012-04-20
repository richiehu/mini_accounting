<?php
require_once("user.php");
require_once("connectDB.php");

session_start();
$user = new user();
if($_GET['logout']) {
    $user->logout();
}
$userInfo = $user->getUserInfo();
if(isset($userInfo['username']))
     header("Location: " . (isset($_POST['url']) ? $_POST['url'] : "accounting_input.php"));
if(isset($_POST['username'])) {
    $user_id = $user->checkUser($_POST['username'],$_POST['password']);
    if($user_id != -1) {
        $user->setUserInfo(array('username' => $_POST['username'],'password' => $_POST['password'],'userid' => $user_id));
       /* $_SESSION['username'] = $_POST['username'];
       $_SESSION['userid'] = $user_id; */
        header("Location: " . (isset($_POST['url']) ? $_POST['url'] : "accounting_input.php"));
    }
}

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>登录系统</title>
    <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Framework CSS -->
    <link rel="stylesheet" href="bootstrap/css/bootstrap.css" type="text/css" >
    <link rel="stylesheet" href="bootstrap/css/bootstrap-responsive.css" type="text/css" > 
    <link rel="stylesheet" href="css/Font-Awesome/css/font-awesome.css" type="text/css" > 
    <style>
        .form-actions
        {
            background-color:#F5F5F5;
            border-top:0px;
        }
    </style>
  </head>
<body>
<div class="span6">
<form id="login" class="well form-horizontal" action="login.php" method="post" >
<fieldset>
<legend>用户登录</legend>
<?php echo ($user_id == -1)? "<div class='control-group'><label class='control-label'></label><span class='label label-important'>用户名或者密码错误</span></div>": "" ?>

<div class="control-group">
    <label class="control-label" for="username">请输入用户名</label>
<div class="controls">
     <div class="input-prepend"><span class="add-on"><i class="icon-user"></i></span><input type="text" class="span3" name="username" id="username" placeholder="请输入用户名"></div>
    <span class="help-inline "> <font color="red">*</font></span>
</div>
</div>
<div class="control-group">
    <label for="password" class="control-label">请输入密码</label>
<div class="controls">
     <div class="input-prepend"><span class="add-on"><i class="icon-key"></i></span><input type="password" class="span3" name="password" id="password"></div>
</div>
</div>
<?php echo (isset($_GET['url']) ? "<input id='url' type='hidden' name='url' value='" . $_GET['url'] . "'>" : "") ?>
<div class="form-actions">
     <button type="submit" class="btn btn-primary" >登录</button>
</div>
</fieldset>
</form>
</div>
</body>
</html>
