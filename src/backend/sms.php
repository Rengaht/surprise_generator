<?php

/* 名稱：hiAir Send Text For PHP範例程式
 * 撰寫者 : HiNet - hiAir , Chih-Ming Liao
 * 撰寫日期 : 2006/06/27
 * 修改者 : HiNet - hiAir , Mike
 * 修改日期 : 2019/09/26
 * (重要) 如欲傳送多筆簡訊，連線成功後使用迴圈執行$mysms->send_text()即可
 */

include_once("sms2.inc");

error_reporting (E_ALL);

echo "<h2> hiAir 傳送文字簡訊 </h2>\n";

//static encoding number
$ENCODING_BIG5=1;
$ENCODING_UCS2=3;
$ENCODING_UTF8=4;

/* Socket to Air Server IP ,Port */
$server_ip = '202.39.54.130';
$server_port = 8000;
$TimeOut=20;

$user_acc  = "89869165";
$user_pwd  = "f6397ec2";
$mobile_number= "0988-091-341";//$_POST['phone'];

$origin_message='surprise generator test!';
// $_POST['name'].'你好，你的朋友於誠品生活【驚喜生成器】製作了一個驚喜送給你，領取序號是'.$_POST['guid'].'。快去看看是什麼驚喜!
// //// 誠品生活 驚喜物所 期間限定 ////
// 時間：2019.12.01 - 2020.01.02
// 據點：信義店 1F｜松菸店 1F｜西門店 B1';

echo $origin_message;

$message = mb_convert_encoding($origin_message, "big5", "utf-8"); //big5 utf-8 ucs-2
//mb_convert_encoding(message,encodeTo,encodeFrom), encodeTo:使用哪種編碼傳送, encodeFrom:系統環境編碼

echo $message;


/*建立連線*/
$encoding = $ENCODING_BIG5;
$mysms = new sms2($encoding);


$ret_code = $mysms->create_conn($server_ip, $server_port, $TimeOut, $user_acc, $user_pwd);

$ret_msg = $mysms->get_ret_msg();


if($ret_code==0){ 
      echo "連線成功"."<br>\n";
      /*如欲傳送多筆簡訊，連線成功後使用迴圈執行$mysms->send_text()即可*/
      $ret_code = $mysms->send_text($mobile_number, $message);
      $ret_msg = $mysms->get_ret_msg();
      if($ret_code==0){
      	 echo "簡訊傳送成功"."<br>";
         echo "ret_code=".$ret_code."<br>\n";
         echo "ret_msg=".$ret_msg."<br>\n";
      }else{
      	 echo "簡訊傳送失敗"."<br>\n";
         echo "ret_code=".$ret_code."<br>\n";
         echo "ret_msg=".$ret_msg."<br>\n";
      }
} else {  
      echo "連線失敗"."<br>\n";
      echo "ret_code=".$ret_code."<br>\n";
      echo "ret_msg=".$ret_msg."<br>\n";
}

/*關閉連線*/
$mysms->close_conn();

?>