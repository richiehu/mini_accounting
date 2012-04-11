<?php
    require_once("user.php");

    session_start();
    $user = new user();
    $userInfo = $user->getUserInfo();

    if(empty($userInfo['username'])){
        echo array("status" => 201);
        exit;
    }
    if(!isset($_GET['detail_id'])) {echo array("status" => 202);exit;}
    echo json_encode($user->delAccountingDetail(array("userid" => $userInfo['userid'],
                        "detail_id" => $_GET['detail_id'])));
?>
