<?php
	
	//set_time_limit(0);
	

	header("Access-Control-Allow-Origin: *");
	header('Content-Type: text/html; charset=utf-8');

	date_default_timezone_set("Asia/Taipei");

	//Return as json file
	header('Content-Type: application/json');


	require_once('utils/datetime.helper.php');
	require_once('utils/uuid.generator.php');
	//require_once('utils/image.php');
	function createImage($text){
    	$base_image = imagecreatefrompng('asset/share-17.png');
    	$image_width = imagesx($base_image);

		$color = imagecolorallocate($base_image,187,26,40);
	    
	    // Set Path to Font File
	    $font_path='asset/Adobe Garamond Pro Semibold.otf';
	    $font_size=48;

	    // Get Bounding Box Size
		$text_box = imagettfbbox($font_size,0,$font_path,$text);

		// Get your Text Width and Height
		$text_width = $text_box[2]-$text_box[0];
		// $text_height = $text_box[7]-$text_box[1];

		// Calculate coordinates of the text
		$x = ($image_width/2) - ($text_width/2);
		// $y = ($image_height/2) - ($text_height/2);

	    // Print Text On Image
	    imagefttext($base_image, $font_size, 0, $x, 578, $color, $font_path, $text);

	    // Send Image to Browser
	    imagepng($base_image,'output/'.$text.'.png',0);

	    imagedestroy($base_image);
    }
	
	$share_url='https://mmlab.com.tw/project/surprisegenerator/backend/direct.php?id=';
	$video_url='https://mmlab.com.tw/project/surprisegenerator/backend/video/';

	$server="localhost";
	$user="surprise_user";
	$pass="kMX1UbjtZHk0xjpS";
	$dbname="db_surprise_generator";
	$idlength=6;
	$video_type=".webm";

	$conn=new mysqli($server,$user,$pass,$dbname);
	if($conn->connect_error){
		die("Connection failed: ".$conn->connect_error);
	}

	try{
		
		$get_action=isset($_POST['action']) ? $_POST['action'] : NULL;
		switch($get_action){
			case 'upload':
				if($_FILES['file']['error']>0){
					$json['result']='fail: file error';
				}else{
					
					$guid=random_strings($idlength);					
					// TODO: check unique!!!
					//$path=$video_folder.$guid.$video_type;					
					move_uploaded_file($_FILES['file']['tmp_name'],'./video/'.$guid.$video_type);					


					// write to db!!!
					$cmd='INSERT INTO user_data (id,send_name,send_number,store) VALUES ("'.$guid.'" , "'.$_POST['send_name'].'","'.$_POST['send_number'].'","'.$_POST['store_id'].'")';
					if($conn->query($cmd)===TRUE){
						$json['result']='success';

						createImage($guid);

					}else{
						//echo $cmd.' error: '.$conn->error;
						$json['cmd']=$cmd;
						$json['result']='error: '.$conn->error;
					}
					$json['path']=$guid.$video_type;
					$json['action']=$get_action;
					$json['guid']=$guid;			
					$json['size']=$_FILES['file']['size'];
					// TODO: generate share image!!!
				
					$json['share_url']=$share_url.$guid;
				}
				echo json_encode($json);
				break;
			case 'loadVideo':
			
				$cmd='SELECT * from user_data WHERE id="'.strtoupper($_POST['guid']).'"';
				$result=$conn->query($cmd);
		
				if($result->num_rows>0){

					if($row = $result->fetch_assoc()){
						$json['celebrity']=$row['celebrity'];
					}
					
					if(file_exists('./video/'.strtoupper($_POST['guid']).$video_type)){
						$json['result']='success';
						$json['video_url']=$video_url.strtoupper($_POST['guid']).$video_type;
						$json['share_url']=$share_url.strtoupper($_POST['guid']);						

						$log='INSERT INTO video_record (video_id,store) VALUES ("'.$_POST['guid'].'","'.$_POST['store_id'].'")';
						if($conn->query($log)===TRUE){
							$json['log']='success';
						}else{
							$json['log']='something wrong';
						}

					}else{
						$json['result']='file not exists! '.$video_folder.$_POST['guid'].$video_type;	
					} 
				}else{
					$json['result']='error: '.$conn->error;
				}
				echo json_encode($json);
				break;
			case 'ticketInfo':
				
				$cmd='UPDATE user_data SET name="'.$_POST['name'].'",ticket_number="'.$_POST['ticket_number'].'",ticket_price="'.$_POST['ticket_price'].'",email="'.$_POST['email'].'",phone="'.$_POST['phone'].'",watched_video="'.$_POST['watched_video'].'" WHERE id="'.$_POST['guid'].'"';				
				if($conn->query($cmd)===TRUE){
					$json['result']='success';	
				}else{
					$json['result']='error: '.$conn->error;
				}
				echo json_encode($json);
				break;
			default:
				echo 'invalid action: '.$get_action;						
				break;
		}
	}catch(Exception $e){
		echo 'Error: '.$e->getMessage();

	}
	$conn->close();
?>