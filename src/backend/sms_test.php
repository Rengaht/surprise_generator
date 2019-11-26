<?php
$url = 'https://imsp.emome.net:4443/imsp/sms/servlet/SubmitSM';
$data = array('acount' => '89869165', 'password' => 'f6397ec2','to_addr'=>'0988091341','msg'=>'test post!');

// use key 'http' even if you send the request to https://...
$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* Handle error */ }

var_dump($result);
?>