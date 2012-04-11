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
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>登录系统</title>

    <!-- Framework CSS -->
    <link rel="stylesheet" href="css/blueprint/screen.css" type="text/css" media="screen, projection">
    <link rel="stylesheet" href="css/blueprint/print.css" type="text/css" media="print">
    <!--[if lt IE 8]><link rel="stylesheet" href="../blueprint/ie.css" type="text/css" media="screen, projection"><![endif]-->
    <style type="text/css" media="screen">
      p, table, hr, .box { margin-bottom:25px; }
      .box p { margin-bottom:10px; }
    </style>
  </head>
<body>
<div class="span-12">
<form id="login" action="login.php" method="post" >
<fieldset>
<legend>用户登录</legend>
<?php echo ($user_id == -1)? "<div class='error'>用户名或者密码错误</div>": "" ?>
<p>
    <label for="username">请输入用户名</label><br>
     <input type="text" class="title" name="username" id="username">
</p>
<p>
    <label for="password">请输入密码</label><br>
     <input type="password" class="title" name="password" id="password">
</p>
<?php echo (isset($_GET['url']) ? "<input id='url' type='hidden' name='url' value='" . $_GET['url'] . "'>" : "") ?>
<p>
     <input type="submit" value="提交">
     <input type="reset" value="重置">
</p>
</fieldset>
</form>
</div>
</body>
</html>
