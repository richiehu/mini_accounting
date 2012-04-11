<?php
    require_once("user.php");

    session_start();
    $user = new user();
    $userInfo = $user->getUserInfo();

    if(empty($userInfo['username'])){
        echo array("status" => 201);
        exit;
    }
    echo json_encode($user->updateAccountingDetail(array("userid" => $userInfo['userid'],
                        "detail_id" => $_POST['detail_id'],
                        "other_information" => $_POST['other_information'],
                        "category_detail_id" => $_POST['category_detail_id'],
                        "money" => $_POST['money'],
                        "date" => $_POST['date']
                    )));
?>
