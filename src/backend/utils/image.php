<?php
    function createImage($text){
    	$base_image = imagecreatefrompng('./asset/share-17.png');
    	$image_width = imagesx($base_image);

		$color = imagecolorallocate($base_image,187,26,40);
	    
	    // Set Path to Font File
	    $font_path='./asset/Adobe Garamond Pro Semibold.otf';
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
	    imagepng($base_image,'./output/'.$text.'.png',0);

	    imagedestroy($base_image);
    }
    //createImage('TTTTTT');
    // createImage('1234AA');
    // createImage('1WWW1W');
?>