<?php
    require_once("user.php");

    session_start();
    $user = new user();
    $userInfo = $user->getUserInfo();

    if(empty($userInfo['username'])){
        echo array("status" => 201);
        exit;
    }
    echo json_encode($user->getAccountingCategory(array("userid" => $userInfo['userid'],
                        "start_date" => (isset($_GET['start_date'])?$_GET['start_date']:date('Y-m-01')),
                        "end_date" => (isset($_GET['end_date'])?$_GET['end_date']:date('Y-m-d')),
                        )));
?>
