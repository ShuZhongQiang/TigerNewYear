var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var sound = new Howl({
  src: ['https://m10.music.126.net/20220117010555/6922592d63b2dc09843105800e75dffe/yyaac/545d/515a/5158/c73402da25f005001436f2e5a7c7b15c.m4a'],
  loop: true,
  html5: true
});
//获取元素
var gameBeginTime = new Date().getTime();
var showTime = document.getElementById("showTime")
var wx = window.innerWidth; //窗口宽度
var wy = window.innerHeight; //窗口高度
var stage = document.getElementById('stage');
stage.style.height= wy + 'px'
//stage.style.backgroundColor = "#F08080"
var monsterHpTxt = 0; //  福气值
var monster = document.getElementById('monster'); //年兽
var monsterHP = document.getElementById("monsterHP");
var monsterText = document.getElementById("monsterText");
var doubleHitObj = document.getElementById("doubleHit")
var monsterX = 100; // 移动距离
var monsterY = lastMonsterY; // 移动高度
var lastMonsterY = 30;
var monsterSpeed = 1; // 移动速度
var monsterDown = wy/2  * Math.random(); //落点
var mosterIsMove = true; //年兽是否移动
var Launcher = document.getElementById('Launcher'); //发射器
Launcher.style.left = wx/2 -Launcher.offsetWidth/2 + 'px';
var rect = Launcher.getBoundingClientRect();
var LauncherX = rect.left + (rect.right - rect.left) / 2;
var LauncherY =	rect.bottom;
var gameDuration = '00分00秒';
var x = 0;
var y = 0;
var l = 0;
var t = 0;
//获取x和y
var nx = LauncherX;
var ny;
var progress = 0;
var isDown = false; //鼠标是否在按下
var isPlay = false; //是否播放
var lastBulletTime = 0; // 上次发射子弹时间
var frequency = 1; // 发射子弹频率
var bulletSpeed = 10; // 子弹飞行速度
var createBulletInterval = null; // 创建子弹的定时器
var rotation = 0 ;// 发射角度
var doubleHit = 0;
var showProp = 1; // 1 为不展示 2 为展示 0 为展示没有消失
var blessingProp = document.getElementById("blessingProp");
var blessingY = 0;
var blessingNum = 0;
// 时间格式化为x分y秒z
function formatTime(time) {
  let minute = Math.floor(time / 60000)
  let second = Math.floor(time % 60000 / 1000)
  return `${minute} 分 ${second} 秒`
};
function startGame(){
	document.getElementById("menu").style.display = "none";
	animloop();
};
function animloop(){
		blessingMove();
		monsterMove();
		if(monsterHpTxt >= 365){
			window.cancelAnimationFrame(animloop)
			document.getElementById("blessingLayer").style.display="inline-block";
			document.getElementById("blessingText").innerHTML = formatTime(gameDuration);
		}else{
			window.requestAnimationFrame(animloop);
		}
	
};
function easeInOutExpo(x) {
	return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 8) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
};
function blessingMove(){
	if(showProp == 2){
		showProp = 0;
		//blessingProp.style.top = parseInt(Math.random()*((wy-200)-200+1)+200,10) + 'px';、
		blessingProp.style.left = parseInt(Math.random()*((wx-10)-10+1)+10,10) + 'px';
		//blessingProp.style.left = 100+"px"
		blessingProp.style.display = "block";
	}else if(showProp == 0){
		if(blessingY > wy){
			blessingY = 0;
			showProp = 1; 
			blessingNum = 0; 
			blessingProp.style.display = "none";
		}
		blessingY += 1;
		blessingProp.style.top = blessingY + "px"
	}
};
//年兽移动
function monsterMove(){
	// 更新游戏时间
	gameDuration = new Date().getTime() - gameBeginTime;
	showTime.innerText = "游戏时间: "+formatTime(gameDuration) + " 射速：" + frequency;
	if(mosterIsMove){
		monster.style.transform = "rotateY(180deg)"; 
		monsterText.style.transform = "rotateY(180deg)"
		monsterX += monsterSpeed;
		progress = parseInt((monsterX + 100)/wx * 100)
		if(progress>0 && progress<=30){
			monsterSpeed = 1
			monsterY = 130
		}
		if(progress>30 && progress<=70){
			monsterSpeed = easeInOutExpo(progress/100)*10
			monsterY = 130 + easeInOutExpo((progress-30)/40) * 100
		}
		
		if(monsterX + 100 >= wx){
			mosterIsMove = false;
		}
	}else{
		monster.style.transform = ""; 
		monsterText.style.transform = ""
		monsterX += -monsterSpeed;
		progress = parseInt((wx - monsterX)/(wx - 100) * 100)
		if(progress>0 && progress<=30){
			monsterY = 230
		}
		if(progress>30 && progress<=70){
			monsterSpeed = easeInOutExpo(progress/100)*10
			monsterY = 230 - easeInOutExpo((progress-30)/40) * 100
		}
		
		if(monsterX<30){
			mosterIsMove = true;
		}
	}
	
	monster.style.left= monsterX +'px'
	monster.style.top = monsterY +'px'
}
//鼠标按下事件
function down(e){
	
	 //获取x坐标和y坐标
	if(e.touches){
		let touch = e.touches[0];
		x = touch.clientX;
		y = touch.clientY;
	}else{
		x = e.clientX;
		y = e.clientY;
	}
	e.preventDefault();
	//获取左部和顶部的偏移量
	l = Launcher.offsetLeft;
	t = Launcher.offsetTop;
	//开关打开
	isDown = true;
	createBullet()
	//设置样式  
	Launcher.style.cursor = 'move';
}
//鼠标移动
function move(e){
	e.preventDefault();
	if (isDown == false) {
		return;
	}
	if(e.touches){
		let touch = e.touches[0];
		nx = touch.clientX;
		ny = touch.clientY;
	}else{
		nx = e.clientX;
		ny = e.clientY;
	}
	dx = nx-LauncherX;
	dy = ny-LauncherY; 
	rotation = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
	// 只能在 -75 ， 75 间移动
	if(rotation<=-75 || rotation >180){
		rotation = -75
	}else if(rotation >=75 && rotation <180){
		rotation = 75
	}
	//console.log(rotation)
	Launcher.style['transform'] = Launcher.style['-webkit-transform'] = 'rotate(' + rotation + 'deg)'
	//计算移动后的左偏移量和顶部的偏移量
	//var nl = nx - (x - l);
	//var nt = ny - (y - t);
	//Launcher.style.left = nl + 'px';
	//Launcher.style.top = nt + 'px';
}
//鼠标抬起事件
function up(){
	//开关关闭
	isDown = false;
	Launcher.style.cursor = 'default';
}

Launcher.onmousedown = function(e){
	down(e)
}

window.onmousemove = function(e){
	move(e)
}

window.onmouseup = function(){
	up()
}
Launcher.addEventListener('touchstart',function(e){
	down(e)
},{ passive: false });
window.addEventListener('touchmove',function(e){
	move(e)
},{ passive: false });
window.addEventListener('touchend',function(){
	up()
},{ passive: false });
function tooglePlay() {
	
	// window.backMusic = new Audio();
	// window.backMusic.src = "image/back.mp3";
	// window.backMusic.loop = true;
	// window.backMusic.load();
	//window.backMusic.currentTime = 127.2; // 背景音乐默认定位到舒缓片段
	
	if (!isPlay) {
		//window.backMusic.play()
		sound.play();
		document.getElementById("soundIcon").src = "https://bu.dusays.com/2022/01/17/ad7499aaeb2c8.png";
		isPlay = true
	} else {
		//window.backMusic.pause()
		sound.pause();
		document.getElementById("soundIcon").src = "https://bu.dusays.com/2022/01/17/46d3ff9dc2db8.png";
		isPlay = false
	}
};
var audio = new Howl({
	src:["image/pu.m4a"],
	html5: true,
	preload : true,
	volume: 1
});
var audio2 = new Howl({
	src:["image/boom.wav"],
	html5: true,
	preload : true,
	volume: 1
});
function playAudio() {
	if (isPlay) {
		if(isiOS){
			if(!audio.playing()){audio.play()}
		}else{
			audio.play()
		}
	}
};
function playAudio2() {
	if (isPlay) {
		if(isiOS){
			if(!audio2.playing()){audio2.play()}
		}else{
			audio2.play()
			}
		}
};
//生成小年兽
function boomMoster(){
	var bullet = document.createElement('div');
	bullet.className = 'boomMoster';
	bullet.style.left = parseInt(Math.random()*((wx-10)-10+1)+10,10) + 'px';
}
//生成子弹
function createBullet() {
		if(isDown == true){
			window.requestAnimationFrame(createBullet)
		}else{
			window.cancelAnimationFrame(createBullet)
		}
		// 子弹
		var now = new Date().getTime()
		if (now - lastBulletTime > (1000 / frequency)) {
			var bullet = document.createElement('div');
			bullet.className = 'bullet';
			//console.log(Launcher.offsetHeight)
			//console.log(Launcher.offsetHeight * Math.cos(rotation/180 * Math.PI))
			//console.log(Launcher.offsetHeight * Math.sin(rotation/180 * Math.PI))
			bullet.style['transform'] = bullet.style['-webkit-transform'] = 'rotate(' + rotation + 'deg)'
			bullet.style.left = LauncherX + Launcher.offsetHeight * Math.cos((90 - rotation)/180 * Math.PI) + 'px';//rotation == 0 ? LauncherX + 'px': rotation < 0 ? LauncherX - Math.sqrt(Math.pow(Launcher.offsetHeight * Math.sin(rotation/180 * Math.PI),2) + Math.pow(Launcher.offsetHeight,2) - 2 * Launcher.offsetHeight * Math.sin(rotation/180 * Math.PI) * Launcher.offsetHeight * Math.cos(rotation/180 * Math.PI)) + 'px':LauncherX + Math.sqrt(Math.pow(Launcher.offsetHeight * Math.sin(rotation/180 * Math.PI),2) + Math.pow(Launcher.offsetHeight,2) - 2 * Launcher.offsetHeight * Math.sin(rotation/180 * Math.PI) * Launcher.offsetHeight * Math.cos(rotation/180 * Math.PI)) + 'px';
			bullet.style.top =  rotation < 0? wy - Launcher.offsetHeight - (Launcher.offsetHeight - 56) * Math.sin(rotation/180 * Math.PI) + 'px' : wy - Launcher.offsetHeight + (Launcher.offsetHeight - 56) * Math.sin(rotation/180 * Math.PI) + 'px'; // 
			bullet.speen = rotation * .2
			stage.appendChild(bullet);
			playAudio();
		// 子弹移动
		function bulletMove(){
			bullet.style.top = bullet.offsetTop - bulletSpeed + 'px'
			if(rotation>=-75 && rotation <0){
				bullet.style.left = bullet.offsetLeft +  bullet.speen + 'px'
			}
			if(rotation == 0){
				bullet.style.left = bullet.offsetLeft + 'px'
			}
			if(rotation >0 && rotation <75){
				bullet.style.left = bullet.offsetLeft +  bullet.speen + 'px'
			}		
			//bullet.style.left = bullet.offsetLeft + 1 + 'px'
			// 如果子弹距离顶部的距离为年兽的高度时，判断子弹和年兽的水平位置是否重合
			if (bullet.offsetTop <= monster.offsetTop + monster.offsetHeight/2 && 
					bullet.offsetTop >= monster.offsetTop && bullet.offsetLeft >= monsterX  && 
					bullet.offsetLeft <= monsterX + monster.offsetWidth) 
			{
			// 年兽掉血
			playAudio2();
			// 子弹消失
			var imgF = document.createElement('div');
			imgF.className = 'imgF';
			imgF.style.left = bullet.offsetLeft + 'px';
			imgF.style.top = bullet.offsetTop + 'px';
			stage.appendChild(imgF);
			monsterHP.style.color = "#FFE395";
			doubleHit += 1;
			doubleHitObj.innerHTML = "连击："+doubleHit;
			doubleHit > 1 ? doubleHitObj.style.display = "inline-block" : doubleHitObj.style.display = "none";
			//doubleHit % 2 == 0 ? showProp > 0 ? showProp = 2 :showProp = 1;
			if(frequency <= 2){
				if(doubleHit % 2 == 0){
					if(showProp > 0){
						showProp = 2;
					}else{
						showProp = 0;
					}
				}
			} else if(frequency > 2 && frequency <= 5){
				if(doubleHit % 5 == 0){
					if(showProp > 0){
						showProp = 2;
					}else{
						showProp = 0;
					}
				}
			} else if(frequency > 5 && frequency <= 10){
				if(doubleHit % 10 == 0){
					if(showProp > 0){
						showProp = 2;
					}else{
						showProp = 0;
					}
				}
			}
			monsterHpTxt = monsterHpTxt >= 365 ? 365 : monsterHpTxt + 1;
			monsterHP.innerText="2022福气:"+monsterHpTxt+"天";
			monsterSpeed = .5;
			setTimeout(function(){
				doubleHitObj.style.display = "none";
				monsterHP.style.color = "#FFFFFF";
				monsterSpeed = 1;
				stage.removeChild(imgF)
			}, 650); 
			stage.removeChild(bullet)
			window.cancelAnimationFrame(bulletMove)
			} else if (bullet.offsetTop <= 0 || bullet.offsetLeft <= 0 || bullet.offsetLeft > wx) {
			doubleHit = 0
			stage.removeChild(bullet)
			window.cancelAnimationFrame(bulletMove)
			} else if(bullet.offsetTop <= blessingProp.offsetTop + blessingProp.offsetHeight/2 &&
				bullet.offsetTop >= blessingProp.offsetTop && bullet.offsetLeft >= blessingProp.offsetLeft  && 
				bullet.offsetLeft <= blessingProp.offsetLeft + monster.offsetWidth/2){
				var imgF = document.createElement('div');
				doubleHit += 1;
				blessingNum += 1;
				//console.log(blessingNum)
				if(blessingNum >= 3){
					//audio.rate(10)
					frequency <= 10 ? frequency += 1 : frequency = 10;
					blessingY = 0;
					blessingNum = 0; 
					showProp = 1;
					blessingProp.style.display = "none";
				}
				imgF.className = 'imgF';
				imgF.style.left = bullet.offsetLeft + 'px';
				imgF.style.top = bullet.offsetTop + 'px';
				stage.appendChild(imgF);
				stage.removeChild(bullet)
				setTimeout(function(){
					stage.removeChild(imgF)
				}, 650); 
			}else{
			window.requestAnimationFrame(bulletMove)
		  }
		}
		bulletMove()
		lastBulletTime = now
		//console.log(lastBulletTime)
		//setTimeout(function(){doubleHitObj.style.display = "none",doubleHit = 0},2000);
	  }
	};
	//createBullet();	
