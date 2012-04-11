<?php
require_once("connectDB.php");
class user
{
    var $DB;
    var $table = array('consumeDetail' => 'accounting.consume_detail');
    function __construct($DB = null) {
        if(!is_object($DB)) {
            $DB = &open_pgdb();
        }
        $this->DB = $DB;
    }
    function checkUser($user,$password) {
        $sql = "Select uid from accounting.user where username = '$user' and password = md5('$password')";
        $ret = dbFetchAll($this->DB,$sql);
        return isset($ret[0]['uid'])? ($ret[0]['uid']):-1;
    }
    function setUserInfo($userInfo) {
        $_SESSION['username'] = $userInfo['username'];
        $_SESSION['password'] = MD5($userInfo['password']);
        $_SESSION['userid'] = $userInfo['userid'];
    }
    function logout() {
        unset($_SESSION['username']);
        unset($_SESSION['password']);
        unset($_SESSION['userid']);
    }
    function getUserInfo() {
        return array('username' => $_SESSION['username'],'userid' => $_SESSION['userid']);
    }
    function getCategoryInfo() {
        $sql = "Select category_detail_id,category_name,category_detail_name From accounting.consume_category_detail a, accounting.consume_category b where a.category_id = b.category_id";
        $retDB = dbFetchAll($this->DB,$sql);
        $ret = array();
        foreach($retDB as $v) {
            $ret[$v['category_name']][$v['category_detail_id']] = $v['category_detail_name'];
        }
        return array('status' => 200,'data' => $ret);
    }
    function uploadDetail($consumeInfo) {
        $sql = "Insert into " . $this->table['consumeDetail'] . "(uid,category_detail_id,consume_date,other_information,money) values(:uid,:category_detail_id,:consume_date,:other_information,:money)";
        try {
            $stmt = $this->DB->prepare($sql);
            $stmt->execute($consumeInfo);
            return array('retCode' => 1,'tips' => '操作成功');
        } catch(PDOException $e) {
            return array('retCode' => 0,'tips' =>  "操作失败" . $e->getMessage());
        }
    }
    function getAccountingNum($selInfo) {
        $sql = "Select count(*) as cnt from " . $this->table['consumeDetail'] . " Where uid = " . $selInfo['userid'] . " and consume_date >= '" . $selInfo['start_date'] . "' and consume_date <= '" . $selInfo['end_date'] . "'";
        try {
            $ret = dbFetchAll($this->DB,$sql);
            return array("status" => 200,"data" => $ret[0]['cnt']);
        } catch(PDOException $e) {
            return array("status" => 202);
        }
    }
    function getAccountingDetail($selInfo) {
        $sql = "Select detail_id,consume_date,a.category_detail_id,b.category_detail_name,c.category_name,other_information,money from " . $this->table['consumeDetail'] . " a,accounting.consume_category_detail b,accounting.consume_category c Where uid = " . $selInfo['userid'] 
                . " and consume_date >= '" . $selInfo['start_date'] . "' and consume_date <= '" . $selInfo['end_date'] . "'"
                . " and a.category_detail_id = b.category_detail_id and b.category_id = c.category_id order by consume_date desc,detail_id desc limit " . $selInfo['items_per_page'] . " offset " . $selInfo['items_per_page'] * $selInfo['page_index'];
        try {
            return array("status" => 200,'data' => dbFetchAll($this->DB,$sql));
        } catch(PDOException $e) {
            return array("status" => 202);
        }

    }
    function getAccountingCategory($selInfo) {
        $sql = "Select c.category_id,category_name,b.category_detail_id,b.category_detail_name,sum(money) as money from " . $this->table['consumeDetail'] . " a,accounting.consume_category_detail b,accounting.consume_category c Where uid = " . $selInfo['userid']
                . " and consume_date >= '" . $selInfo['start_date'] . "' and consume_date <= '" . $selInfo['end_date'] . "'"
                . " and a.category_detail_id = b.category_detail_id and b.category_id = c.category_id group by c.category_id,category_name,b.category_detail_id,b.category_detail_name Order by money desc";
        try {
            $categoryRet = dbFetchAll($this->DB,$sql);
            foreach($categoryRet as $v){
                $categoryMoney[$v['category_id']]['category_name'] = $v['category_name'];
                $categoryMoney[$v['category_id']]['category_id'] = $v['category_id'];
                if(!isset($categoryMoney[$v['category_id']]['category_detail'])) $categoryMoney[$v['category_id']]['category_detail'] = array();
                array_push($categoryMoney[$v['category_id']]['category_detail'],array('category_detail_name'=> $v['category_detail_name'],'category_detail_id' => $v['category_detail_id'],'money' => $v['money']));//[$v['category_detail_id']]['money'] = $v['money'];
               // $categoryMoney[$v['category_id']]['category_detail'][$v['category_detail_id']]['category_detail_name'] = $v['category_detail_name'];
                $categoryMoney[$v['category_id']]['money'] += $v['money'];
            }

        } catch(PDOException $e) {

        }
        foreach($categoryMoney as $category_id => $v){$money[$category_id] = $v['money'];}
        array_multisort($money,SORT_DESC,$categoryMoney);
        return array('status'=>200,'data'=>$categoryMoney);
    }
    function delAccountingDetail($delInfo) {
        $sql = "Delete from " . $this->table['consumeDetail'] . " Where uid = '" . $delInfo['userid'] . "' and detail_id = " . $delInfo['detail_id'];
        try {
            $cnt = $this->DB->exec($sql);
            return $cnt > 0 ? array("status" => 200): array("status" => 202);
        } catch(PDOException $e) {
            return array("status" => 203);
        }
    }
    function updateAccountingDetail($updateInfo) {
        $sql = "update " . $this->table['consumeDetail'] . " set money = :money,category_detail_id = :category_detail_id,consume_date = :date,other_information = :other_information Where uid = :userid and detail_id = :detail_id";
        try {
            $stmt = $this->DB->prepare($sql);
            $cnt = $stmt->execute($updateInfo);
            return $cnt > 0 ? array("status" => 200): array("status" => 202);
        } catch(PDOException $e) {
            return array("status" => 203);
        }
    }
}
?>
