<?php
    require_once("user.php");

    session_start();
    $user = new user();
    $userInfo = $user->getUserInfo();

    if(empty($userInfo['username'])){
        echo array("status" => 201);
        exit;
    }
    echo json_encode($user->getCategoryInfo());
?>
