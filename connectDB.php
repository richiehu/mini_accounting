<?php
function &open_pgdb()
{
    $host =  '***';
    $port = ***;
    $dbname = '***';
    $user = '***';
    $password = '***';
    $dsn = "pgsql:host=$host port=$port dbname=$dbname";

	try {
		$pgdbh = new PDO($dsn, $user, $password);
		return $pgdbh;
	} catch (PDOException $e) {
		error_log('PG Connection failed: '.$e->getMessage()."\n");
	}

}

function dbFetchAll(&$dbh, $sql)
{
  //echo $sql, '<hr>';
	//global $dbh;
	try{
		if($dbh != null){
			$sth = $dbh->prepare($sql);
			$sth->execute();
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
