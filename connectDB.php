<?php
function &open_db()
{
	$user = ysecure_get_key("sds.portal.dbuser");
	$pass = ysecure_get_key("sds.portal.dbpwd");
//	echo $user,',',$pass;
//	open_pgdb();
	try{
		$db_oci = new PDO('oci:dbname=dw3;charset=AL32UTF8', $user, $pass);
		return $db_oci;
	} catch (PDOException $e)
	{
        
        echo "oci:dbname=dw3_db1;charset=AL32UTF8,$user, $pass";
		error_log("Error : " . $e->getMessage() . "\n" );
	}
}
function &open_pgdb()
{
//  if(DATABASE_HOST == 'local')
//  {
    $host =  'myna5.sds.cnb';
    $port = 5432;
    $dbname = 'dod';
    $user = 'dod';
    $password = 'dod';
    $dsn = "pgsql:host=$host port=$port dbname=$dbname";
//  }
//  else
//  {
//    //$host = yfor_gethostbyname(ysecure_get_key("dd.dod.yforName"));
//    $host = 'dod1.sds.cnb';
//    $port = ysecure_get_key("dd.dod.port");
//    $dbname = ysecure_get_key("dd.dod.dbname");
//    $user = ysecure_get_key("dd.dod.dbuser");
//    $password = ysecure_get_key("dd.dod.dbpwd");
//    $dsn = "pgsql:host=$host port=$port dbname=$dbname";
//  }

  /*$dsn = "pgsql:host=pi1.sds.cnb.yahoo.com port=5432 dbname=kryptos";
	$user = 'ylj';
	$password = 'ylj';*/

//	echo $dsn,$user,$password;

	try {
		$pgdbh = new PDO($dsn, $user, $password);
		return $pgdbh;
	} catch (PDOException $e) {
		error_log('PG Connection failed: '.$e->getMessage()."\n");
	}

}
function &open_pgdb_dev()
{
	$host = ysecure_get_key("dd.dod.host");
	$port = ysecure_get_key("dd.dod.port");
	$dbname = ysecure_get_key("dd.dod.dbname");
	$user = ysecure_get_key("dd.dod.dbuser");
	$password = ysecure_get_key("dd.dod.dbpwd");
	$dsn = "pgsql:host=$host port=$port dbname=$dbname";

	$dsn = "pgsql:host=myna5.sds.cnb.yahoo.com port=5432 dbname=dod";
	$user = 'dod';
	$password = 'dod';

//	echo $dsn,$user,$password;

	try {
		$pgdbh = new PDO($dsn, $user, $password);
		return $pgdbh;
	} catch (PDOException $e) {
		error_log('PG Connection failed: '.$e->getMessage()."\n");
	}

}

function &open_dod_master()
{
	$host = ysecure_get_key("dd.dod.host");
	$port = ysecure_get_key("dd.dod.port");
	$dbname = ysecure_get_key("dd.dod.dbname");
	$user = ysecure_get_key("dd.dod.dbuser");
	$password = ysecure_get_key("dd.dod.dbpwd");
	$dsn = "pgsql:host=$host port=$port dbname=$dbname";

	/*
	$user = 'ylj';
	$password = 'ylj';
	$dsn = "pgsql:host=pi1.sds.cnb.yahoo.com port=5432 dbname=dod";
	 */
	try {
		$pgdbh = new PDO($dsn, $user, $password);
		return $pgdbh;
	} catch (PDOException $e) {
		error_log('PG Connection failed: '.$e->getMessage()."\n");
	}
}
function close_db(&$db_oci)
{
	$db_oci=null;
}
function db_fetch_all(&$db_oci, $sql)
{
	try{
		$sth = $db_oci->prepare($sql);
		$sth->execute();
		$result = $sth->fetchAll();
	} catch (PDOException $e)
	{
		error_log("Error : " . $e->getMessage() . "\n" );
		return null;
	}
	return $result;
}
function db_fetch_all_assoc(&$db_oci, $sql)
{
	try{
		$sth = $db_oci->prepare($sql);
		$sth->setFetchMode(PDO::FETCH_ASSOC);
		$sth->execute();
		$result = $sth->fetchAll();
	} catch (PDOException $e)
	{
		error_log("Error : " . $e->getMessage() . "\n" );
		return null;
	}
	return $result;
}
function db_fetch_one(&$db_oci, $sql)
{
	try{
		$sth = $db_oci->prepare($sql);
		$sth->execute();
		$result = $sth->fetch();
		//$sth->setFetchMode(PDO::FETCH_ASSOC);
		$result = $result[0];
		return $result;
	} catch (PDOException $e)
	{
		error_log("Error : " . $e->getMessage() . "\n" );
		return null;
	}
}
function dbFetchOne(&$dbh, $sql)
{
  //echo $sql, '<hr>';
	try{
		if($dbh != null){
  $time_start = microtime(1);
			$sth = $dbh->prepare($sql);
			$sth->execute();
  //echo $sql, '<br>', microtime(1) - $time_start, '<hr>';
			$result = $sth->fetch();
			$result = $result[0];
			return $result;
		}else{
			return null;
		}
	} catch (PDOException $e){
		error_log("DBError : " . $e->getMessage() . "\n" );
		return null;
	}
}

function dbFetchAll(&$dbh, $sql)
{
  //echo $sql, '<hr>';
	//global $dbh;
	try{
		if($dbh != null){
  $time_start = microtime(1);
			$sth = $dbh->prepare($sql);
			$sth->execute();
  //echo $sql, '<br>', microtime(1) - $time_start, '<hr>';
			$sth->setFetchMode(PDO::FETCH_ASSOC);
			$result = $sth->fetchAll();
			return $result;
		}else{
			return null;
		}
	} catch (PDOException $e){
		error_log("DBError : " . $e->getMessage() . "\n" );
		return null;
	}
}
?>
