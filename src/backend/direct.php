<?php
	$host='https://mmlab.com.tw/project/surprisegenerator/backend/';
	$page_url=$host.'direct.php';	
	// echo $page_url;
	$img_url=$host.'output/'.$_GET['id'].'.png';	
	$share_url=$host.'index.php?id='.$_GET['id'];	
	$redirect_url=$host.'redirect.html';
	// echo $img_url;
?>

<html>
	<head>		
		<!-- Global site tag (gtag.js) - Google Analytics -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-80306203-9"></script>
		<script>
		  window.dataLayer = window.dataLayer || [];
		  function gtag(){dataLayer.push(arguments);}
		  gtag('js', new Date());

		  gtag('config', 'UA-80306203-9');
		</script>

		<title>// 驚喜產生器 SURPRISE GENERATOR //</title>
		<link href="https://fonts.googleapis.com/css?family=Noto+Serif+TC:700&display=swap" rel="stylesheet">
		<style type="text/css">
			body{
				background-color: #BB1A28;
				color:white;
				font-family: 'Noto Serif TC', serif;
				letter-spacing: 5px;
			}
			a{
				color:rgb(13,104,171);
			}
			.vertCenterWrapper{
				display: table;
				height:80%;
				width:100%;
			}
			.vertCenterChild{
				display:table-cell;
				vertical-align: middle;
			}
			.share_img{
				margin-top:20px;			
				height:50%;
				max-width: 90%;
				border:5px white solid;
				box-shadow: 12px 12px 7px rgba(0, 0, 0, 0.2);
			}
			.share_button{
				margin-top:20px;
				height:10%;
				cursor: pointer;
			}
			.center{
				display:block;
				text-align: center;
				margin-left: auto;
				margin-right: auto;
			}
			.shareText{
				font-size: 3em;
				margin-bottom: 50px;
				margin-top: 50px;
			}
		</style>
		<script type="text/javascript">
			// var _url=encodeURIComponent('<?php echo $share_url ?>');
			// //var _text=encodeURIComponent("quote_here!");
			// // var _tag=encodeURIComponent("#驚喜產生器");
			// var _reurl=encodeURIComponent('<?php echo $redirect_url ?>');	

			// var _share_url="https://www.facebook.com/dialog/share?"
			// 				+"app_id=1708013322662034"							
			// 				//+"&href="+_url
			// 				+"&hashtag="+_tag
			// 				+"&redirect_uri="+_reurl;
			// function onShareclick(){								
	  //   		console.log(_share_url);
			// 	window.location = _share_url;
			// }
		</script>
		
		
	</head>
	<body>		
		<div class="vertCenterWrapper">
			<div class="vertCenterChild RedirectText">
				<p class="center shareText">長按下載或分享序號圖片<br/> 讓更多朋友看到你的驚喜影片!</p>
				<?php 
					echo '<img class="share_img center" src="'.$img_url.'"/>';
				?>
			<!-- 	<img class="center share_button" onclick="onShareclick()" src="img/share.png"/> -->

			</div>
		</div>
	</body>
</html>