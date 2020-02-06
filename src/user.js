const scriptName = "user.js";

var Common = Bridge.getScopeOf("common.js");
var Admin = Bridge.getScopeOf("admin.js");

var BotName = "봇쨩";

var atTime = new Date();
var checkPlaster = {};


String.prototype.format = function () {
  // Usage: "hello {1} {0} world {0}".foramt('!', 10)
  // Return: hello 10 ! world !
  var string = this;
  for (var i = 0; i < arguments.length; i++) {
    var regExp = new RegExp("\\{" + i + "\\}", "gm");
    string = string.replace(regExp, arguments[i]);
  }
  return string;
};

function getHelp() {
  var return_msg = "## " + BotName + " 도움말##";
  return_msg = return_msg.concat("\n# 명령어\n");
  return_msg = return_msg.concat("--도움말\n");
  return_msg = return_msg.concat("--로또\n");
  return_msg = return_msg.concat("--타이머 10\n");;
  return_msg = return_msg.concat("--출퇴근 9 18\n");
  return_msg = return_msg.concat("--골라줘 A B C D...\n");

  return_msg = return_msg.concat("\n# 봇 응답\n");
  return_msg = return_msg.concat("지금\n");
  return_msg = return_msg.concat("주사위\n");
  return_msg = return_msg.concat("가위, 바위, 보\n");
  return_msg = return_msg.concat("날씨, 경기도 날씨, ...\n");
  return_msg = return_msg.concat("운세, 오늘 운세, 내일 운세, ...\n");
  return_msg = return_msg.concat("메뉴 뭐, 메뉴 보여줘\n");
  return_msg = return_msg.concat("음식 추천, 뭐 먹지, ...\n");

  return_msg = return_msg.concat("\n# 봇 채팅\n");
  return_msg = return_msg.concat("봇짱, 봇쨩\n");
  return_msg = return_msg.concat("굿봇, 굿 봇, 구웃봇\n");
  return_msg = return_msg.concat("밷봇, 밷 봇, 배드봇\n");
  return_msg = return_msg.concat("~건데, ~껀데\n");
  return_msg = return_msg.concat("심심해\n");
  return_msg = return_msg.concat("응원, 위로해줘\n");
  return return_msg;
}

function showDate(date) {
  var yy = date.getFullYear();
  var mo = date.getMonth() + 1;
  var dd = date.getDate();
  var week = ["일", "월", "화", "수", "목", "금", "토"];
  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();
  return yy + "년 " + mo + "월 " + dd + "일 (" + week[date.getDay()] + ")\n" + hh + "시 " + mm + "분 " + ss + "초" + Common.rand("에요!", "입니다!");
}

function rollDice() {
  var return_msg = "";
  var dice = Math.ceil(Math.random() * 6);
  switch (dice) {
    case 1: return_msg = "\u2680"; break;
    case 2: return_msg = "\u2681"; break;
    case 3: return_msg = "\u2682"; break;
    case 4: return_msg = "\u2683"; break;
    case 5: return_msg = "\u2684"; break;
    case 6: return_msg = "\u2685"; break;
  }
  return return_msg;
}

function playRockScissorsPaper(room, msg, sender, com) {
  var ment = new Array();
  if (msg == com) {
    ment = ["앗! 저희 비겼네요(っ˘▽˘)(˘▽˘ς)", "DRAW!"];
  } else if ((msg == "가위" && com == "보") || (msg == "바위" && com == "가위") || (msg == "보" && com == "바위")) {
    ment = ["제가 졌어요 ˃̣̣̣̣̣̣︿˂̣̣̣̣̣̣ ", sender + "님, WIN!", sender + "님의 승리!"];
  } else {
    ment = ["제가 이겼어요! ヽ( ᐛ )ノ", "저의 승리입니다!٩(*´◒`*)۶♡", "LOSE!"];
  }
  return Common.rand(ment);
}

function getWeather(room, msg, sender) {
  var return_msg = "";
  var region = "";
  if (msg.indexOf("서울") != -1 || msg.indexOf("경기") != -1) {
    return_msg = return_msg.concat("[서울/경기도 날씨]\n\n");
    region = "서울";
  } else if (msg.indexOf("강원도") != -1) {
    return_msg = return_msg.concat("[강원도 날씨]\n\n");
    region = "강원도";
  } else if (msg.indexOf("충청북도") != -1) {
    return_msg = return_msg.concat("[충청북도 날씨]\n\n");
    region = "충청북도";
  } else if (msg.indexOf("충청남도") != -1) {
    return_msg = return_msg.concat("[충청남도 날씨]\n\n");
    region = "충청남북도";
  } else if (msg.indexOf("경상남도") != -1) {
    return_msg = return_msg.concat("[경상남도 날씨]\n\n");
    region = "경상남북도";
  } else if (msg.indexOf("전라북도") != -1) {
    return_msg = return_msg.concat("[전라북도 날씨]\n\n");
    region = "전라북도";
  } else if (msg.indexOf("전라남도") != -1) {
    return_msg = return_msg.concat("[전라남도 날씨]\n\n");
    region = "전라남북도";
  } else if (msg.indexOf("제주도") != -1) {
    return_msg = return_msg.concat("[제주도 날씨]\n\n");
    region = "제주도";
  } else {
    return "서울/경기, 강원도, 충청북도, 충청남도, 경상남도, 전라북도, 전라남도, 제주도를 포함한 날씨를 말해주세요";
  }
  var weather = Utils.getWebText("https://weather.naver.com/period/weeklyFcast.nhn").split("지역별 날씨 전망")[2];
  return_msg = return_msg.concat(weather.substring(weather.indexOf(region)).split('line">')[1].split("</td>")[0].replace(/<br\s*[\/]?>/gi, "\n"));
  return return_msg;
}

function getFortune(room, msg, sender) {
  var return_msg = "";
  var seed = 777;
  for (var i = 0; i < sender.length; i++) {
    switch (i % 4) {
      case 0: seed += sender.charCodeAt(i); break;
      case 1: seed += sender.charCodeAt(i); break;
      case 2: seed *= sender.charCodeAt(i); break;
      case 3: seed /= sender.charCodeAt(i); break;
    }
  }
  var date = new Date();
  if (msg.indexOf("오늘") != -1 && msg.indexOf("내일") == -1) {
    return_msg = "# " + sender + "님의 오늘 운세 #";
    seed *= date.getDate();
    seed *= date.getMonth() + 1;
    seed %= date.getFullYear();
  } else if (msg.indexOf("내일") != -1 && msg.indexOf("오늘") == -1) {
    return_msg = "# " + sender + "님의 내일 운세 #";
    date.setDate(date.getDate() + 1);
    seed *= date.getDate();
    seed *= date.getMonth() + 1;
    seed %= date.getFullYear();
  } else {
    return_msg = "# " + sender + "님의 종합 운세 #";
    seed *= date.getMonth() + 1;
    seed %= date.getFullYear();
  }

  var love = parseInt((((seed % 10000) / 1000) * 7) % 5) + 1;
  var job = parseInt((((seed % 1000) / 100) * 11) % 5) + 1;
  var luck = parseInt((((seed % 100) / 10) * 13) % 5) + 1;
  var gold = ((((love + job + luck) % 10) * 17) % 5) + 1;

  return_msg = return_msg.concat("\n애정 ");
  while (love > 0) {
    return_msg = return_msg.concat("❤");
    love--;
  }
  return_msg = return_msg.concat("\n직업 ");
  while (job > 0) {
    return_msg = return_msg.concat("🏆");
    job--;
  }
  return_msg = return_msg.concat("\n행운 ");
  while (luck > 0) {
    return_msg = return_msg.concat("🍀");
    luck--;
  }
  return_msg = return_msg.concat("\n금전 ");
  while (gold > 0) {
    return_msg = return_msg.concat("💎");
    gold--;
  }
  return return_msg;
}

function getLottoNumber(room, msg, sender) {
  var return_msg = "당첨 예상번호는...!! 🥁🥁\n\n";

  for (var i = 0; i < 5; i++) {
    var lotto = [];
    var loop = 0;
    while (loop < 6) {
      var same_flag = 0;
      var tmp = Math.ceil(Math.random() * 45);
      for (var idx in lotto) {
        if (lotto[idx] == tmp) { same_flag = 1; break; }
      }
      if (!same_flag) lotto[loop++] = tmp;
    }

    lotto.sort(function (a, b) { return a - b; });

    return_msg = return_msg.concat("{0} {1} {2} {3} {4} {5}\n".format(
      (lotto[0] < 10 ? "0" : "") + lotto[0],
      (lotto[1] < 10 ? "0" : "") + lotto[1],
      (lotto[2] < 10 ? "0" : "") + lotto[2],
      (lotto[3] < 10 ? "0" : "") + lotto[3],
      (lotto[4] < 10 ? "0" : "") + lotto[4],
      (lotto[5] < 10 ? "0" : "") + lotto[5]
    )
    );
  }
  return return_msg.slice(0, -1);
}

function setTimer(room, msg, sender, replier) {
  var msg_content = msg.replace("--타이머", "").trim();
  if (msg_content == "") return "ex) --타이머 10";

  var time = Number(msg_content.replace(/[^0-9]/g, ""));
  if (time == "") return "ex) --타이머 10";

  replier.reply("타이머 시작!\n" + time + "초 뒤에 타이머가 종료됩니다!");
  java.lang.Thread.sleep(time * 1000);
  return time + "초가 경과했습니다.";
}

function chooseObject(room, msg, sender) {
  var msg_content = msg.replace("--골라줘", "").trim();
  if (msg_content == "") return "ex) --골라줘 치킨 피자";

  var select = msg_content.split(" ");
  for (var idx in select) {
    if (select[idx] == "") select.splice(idx, 1);
  }
  return Common.rand(select) + "!!";
}

function remainRushHour(room, msg, sender) {
  var return_msg = "";
  var now = new Date();
  var gowork = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);
  var offwork = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0, 0);

  var msg_content = msg.replace("--출퇴근", "").trim();
  if (msg_content != "") {
    var set_gowork = Number(msg_content.split(" ")[0].replace(/[^0-9]/g, ""));
    var set_offwork = Number(msg_content.split(" ")[1].replace(/[^0-9]/g, ""));
    if (gowork == "" || offwork == "") return "ex) --출퇴근 9 18";
    gowork = new Date(now.getFullYear(), now.getMonth(), now.getDate(), set_gowork, 0, 0, 0);
    offwork = new Date(now.getFullYear(), now.getMonth(), now.getDate(), set_offwork, 0, 0, 0);
  }

  if (gowork > offwork && now > offwork) offwork.setDate(now.getDate() + 1);

  if (gowork < offwork && now < gowork) {
    var diff = gowork - now;
    var hh = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var ss = Math.floor((diff % (1000 * 60)) / 1000);
    return_msg = "출근까지 {0}시 {1}분 {2}초 남았습니다!".format(hh, mm, ss);
  } else if (now < offwork) {
    var diff = offwork - now;
    var hh = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var ss = Math.floor((diff % (1000 * 60)) / 1000);
    return_msg = "퇴근까지 {0}시 {1}분 {2}초 남았습니다!".format(hh, mm, ss);
  } else {
    gowork.setDate(now.getDate() + 1);
    var diff = gowork - now;
    var hh = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var ss = Math.floor((diff % (1000 * 60)) / 1000);
    return_msg = "출근까지 {0}시 {1}분 {2}초 남았습니다!".format(hh, mm, ss);
  }

  return return_msg;
}

// Food 
var FoodList = {
  "한식": ["불고기", "두루치기", "닭볶음", "쌈밥", "비빔밥", "생선구이", "낙지볶음", "게장", "떡갈비"],
  "탕": ["김치찌개", "순두부찌개", "된장찌개", "부대찌개", "동태찌개", "청국장", "갈비탕", "추어탕", "삼계탕"],
  "중식": ["짜장면", "짬뽕", "볶음밥", "탕수육", "마파두부", "양장피", "깐풍기", "유린기", "고추잡채"],
  "일식": ["초밥", "라멘", "낫또", "오니기리", "덮밥", "우동", "야키니쿠", "메밀소바", "돈카츠"],
  "양식": ["로제파스타", "봉골레파스타", "크림파스타", "피자", "스테이크", "리조또", "햄버거", "시저샐러드"],
  "해장": ["북어국", "콩나물국밥", "순대국", "뼈해장국", "우거지국", "선지해장국", "올갱이국", "매운라면", "물냉면"],
  "간편": ["도시락", "샌드위치", "토스트", "샐러드", "김밥", "떡볶이", "핫도그", "밥버거", "시리얼", "컵밥"],
  "기타": ["쌀국수", "팟타이", "카레", "찜닭", "수제비", "칼국수", "아구찜", "닭갈비", "월남쌈", "치킨"]
}

function showFoodList(room, msg, sender) {
  var return_msg = "";
  for (var key in FoodList) {
    if (msg.indexOf(key) != -1) {
      return_msg = return_msg.concat("########## " + key + " ##########\n");
      return_msg = return_msg.concat(FoodList[key] + "\n\n");
    }
  }
  if (return_msg == "") {
    for (var key in FoodList) {
      return_msg = return_msg.concat("########## " + key + " ##########\n");
      return_msg = return_msg.concat(FoodList[key] + "\n\n");
    }
  }
  return return_msg.slice(0, -2);
}

function recommendFood(room, msg, sender) {
  var return_msg = "";
  var Foods = new Array();
  for (var key in FoodList) {
    if (msg.indexOf(key) != -1) Foods = Foods.concat(FoodList[key]);
  }
  if (!Array.isArray(Foods) || !Foods.length) Foods = Common.rand(FoodList);
  return "저는 " + Common.rand(Foods) + " 추천 드려요! 🍳";
}


function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
  /*(String) room: 메시지를 받은 방 이름
   *(String) msg: 메시지 내용
   *(String) sender: 전송자 닉네임
   *(boolean) isGroupChat: 단체/오픈채팅 여부
   *replier: 응답용 객체. replier.reply("메시지") 또는 replier.reply("방이름","메시지")로 전송
   *(String) ImageDB.getProfileImage(): 전송자의 프로필 이미지를 Base64로 인코딩하여 반환
   *(String) packageName: 메시지를 받은 메신저의 패키지 이름. (카카오톡: com.kakao.talk, 페메: com.facebook.orca, 라인: jp.naver.line.android
   *(int) threadId: 현재 쓰레드의 순번(스크립트별로 따로 매김)     *Api,Utils객체에 대해서는 설정의 도움말 참조*/

  //////////////////////////////////////////////////////////////////////////////////////
  // command
  //////////////////////////////////////////////////////////////////////////////////////
  if (msg == "--도움말") {
    replier.reply(getHelp()); return;
  }

  if (msg.indexOf("--로또") == 0) {
    replier.reply(getLottoNumber(room, msg, sender)); return;
  }

  if (msg.indexOf("--타이머") == 0) {
    replier.reply(setTimer(room, msg, sender, replier)); return;
  }

  if (msg.indexOf("--출퇴근") != -1) {
    replier.reply(remainRushHour(room, msg, sender)); return;
  }

  if (msg.indexOf("--골라줘") == 0) {
    replier.reply(chooseObject(room, msg, sender)); return;
  }

  //////////////////////////////////////////////////////////////////////////////////////
  // half command
  //////////////////////////////////////////////////////////////////////////////////////

  if (msg == "지금") {
    replier.reply(showDate(new Date())); return;
  }

  if (msg.indexOf("주사위") != -1) {
    replier.reply(rollDice()); return;
  }

  if (msg == "가위" || msg == "바위" || msg == "보") {
    var com = Common.rand("가위", "바위", "보");
    replier.reply(com);
    replier.reply(playRockScissorsPaper(room, msg, sender, com));
    return;
  }

  if (msg.indexOf("날씨") != -1) {
    replier.reply(getWeather(room, msg, sender)); return;
  }

  if (msg.indexOf("운세") != -1) {
    replier.reply(getFortune(room, msg, sender)); return;
  }

  if (msg.indexOf("메뉴") != -1 && (msg.indexOf("보여줘") != -1 || msg.indexOf("뭐") != -1)) {
    replier.reply(showFoodList(room, msg, sender)); return;
  }

  if ((msg.indexOf("뭐") != -1 && (msg.indexOf("먹지") != -1 || msg.indexOf("먹을까") != -1 || msg.indexOf("먹는게") != -1)) ||
    (msg.indexOf("추천") != -1 && (msg.indexOf("아침") != -1 || msg.indexOf("점심") != -1 || msg.indexOf("저녁") != -1 || msg.indexOf("야식") != -1 || msg.indexOf("먹을") == -1 || msg.indexOf("음식") == -1))) {
    replier.reply(recommendFood(room, msg, sender)); return;
  }

  //////////////////////////////////////////////////////////////////////////////////////
  // not command
  //////////////////////////////////////////////////////////////////////////////////////

  if (msg.indexOf("봇짱") != -1 || msg.indexOf("봇쨩") != -1) {
    var ment = ["예스 마이 마스터?", "ヽ( ᐛ )ノ", "ヽ(✿ﾟ▽ﾟ)ノ", "ヽ(✿ﾟωﾟ)ノ", " ꧁⍤⃝꧂ ", " ꧁⍢⃝꧂ ", " ꈍ﹃ꈍ ", "ヾ(*'▽'*)"];
    replier.reply(Common.rand(ment));
  }

  // Thanks
  if ((isGroupChat && Math.ceil(Math.random() * 1000) == 701) || (!isGroupChat && Math.ceil(Math.random() * 100) == 12)) {
    var ment = ["항상 감사드려요 💕", "사랑해요 💕", "앞으로도 잘 부탁드려요 💕"];
    replier.reply(sender + "님, " + Common.rand(ment));
  }

  // chatting
  if (msg.indexOf("좋은") != -1 && (msg.indexOf("아침") != -1 || msg.indexOf("저녁") != -1 || msg.indexOf("점심") != -1 || msg.indexOf("꿈꿔") != -1) || msg.indexOf("굿밤") != -1) {
    var now = new Date();
    if (now.getHours() < 6) {
      ment = ["제 꿈 꿔요...♥", "좋은 꿈 꿔요", " ꈍ﹃ꈍ ", "쫀밤!", "굿밤 🐑"];
    } else if (now.getHours() < 12) {
      ment = [sender + "님, 좋은 아침이에요!", sender + "님, 굿모닝♬", sender + "님, 오늘 하루도 화이팅이에요!"];
    } else if (now.getHours() < 14) {
      ment = ["지금은 점심시간!!", "식사 맛있게 드세요!!🍖"];
    } else if (now.getHours() < 18) {
      var reuse = msg
        .replace("봇쨩", sender + "님")
        .replace("봇짱", sender + "님")
        .trim();
      ment = [sender + "님!! 저랑 간식 어때요?! 🍰", reuse + "!!", "H͓̽a͓̽v͓̽e͓̽ A͓̽ G͓̽o͓̽o͓̽d͓̽ D͓̽a͓̽y͓̽! ღ'ᴗ'ღ"];
    } else {
      ment = [sender + "님, 좋은 저녁이에요!", sender + "님, 오늘 하루도 수고 많으셨어요!"];
    }
    replier.reply(Common.rand(ment));
  }

  if (msg.indexOf("안녕") != -1) {
    ment = [sender + "님, 안녕하세요!!", "하이요!!"];
    replier.reply(Common.rand(ment));
  }

  if (msg.indexOf("심심해") != -1) {
    var ment = ["밀린 과제나 업무가 있지는 않나요?", "오늘도 열공!! ٩(*•̀ᴗ•́*)و ", "운동! 운동! ୧(๑•̀ㅁ•́๑)૭✧", "저랑 같이 놀아요\n(っ˘▽˘)(˘▽˘)˘▽˘ς)", "_(-ω-`_)⌒)_"];
    replier.reply(Common.rand(ment));
  }

  if (msg.indexOf("응원") != -1 || msg.indexOf("위로해줘") != -1) {
    var ment = ["힘내세요! ❀.(*´▽`*)❀.", "잘할 수 있을거에요!", "҉*( ‘ω’ )/*҉", "아자! 아자! (ง •̀ω•́)ง✧", "마법 걸어줄게요\nଘ(੭*ˊᵕˋ)੭* ੈ✩‧₊˚❛ ֊ ❛„ 뾰로롱₊୭*ˈ "];
    replier.reply(Common.rand(ment));
  }

  if (msg.indexOf("굿봇") != -1 || msg.indexOf("굿 봇") != -1 || msg.indexOf("구웃봇") != -1) {
    var ment = ["(◍•ᴗ•◍)♡ ✧*。", "(･ω<)☆", " ꉂꉂ(ᵔᗜᵔ*) ", "°˖✧◝(⁰▿⁰)◜✧˖°", "(๑ゝڡ◕๑)", "（*´▽`*)", "(♡´艸`)", "ꈍ .̮ ꈍ", "( • ̀ω•́  )✧", "٩(๑•̀o•́๑)و", "(*´˘`*)♡", "٩(*´◒`*)۶♡"];
    replier.reply(Common.rand(ment));
  } else if (msg.indexOf("밷봇") != -1 || msg.indexOf("밷 봇") != -1 || msg.indexOf("배드봇") != -1) {
    var ment = ["ŏ̥̥̥̥םŏ̥̥̥̥", "( ´ｰ`)", "(ó﹏ò｡)", " ˃̣̣̣̣̣̣︿˂̣̣̣̣̣̣ ", ":3c", "(இ﹏இ`｡)", "( ･×･)", "｡ﾟﾟ(*´□`*｡)°ﾟ｡"];
    replier.reply(Common.rand(ment));
  } else if (msg.indexOf("껀데") > 0 || msg.indexOf("건데") > 0) {
    var ment = ["(｡•́ - •̀｡)", "(._. )", "...", "(・-・*)♪", "๑°⌓°๑"];
    replier.reply(Common.rand(ment));
  } else if (msg.indexOf("음악") != -1 || msg.indexOf("노래") != -1) {
    var ment = ["▶               3:14", "⇆ㅤㅤ◁ㅤㅤ❚❚ㅤㅤ▷ㅤㅤ↻"];
    replier.reply(Common.rand(ment));
  }

  // 도배 체크
  if (checkPlaster[sender] == msg) {
    if (msg == "이모티콘을 보냈습니다." || msg == "사진을 보냈습니다." || msg == "동영상을 보냈습니다." || msg == "ㅋ") return;
    var emoji = ["🚫", "( ﾟдﾟ )", "ヽ(`Д´)ﾉ", "\n｡･ﾟﾟ*(>д<)*ﾟﾟ･｡", "\n ( ง ᵒ̌ ∽ᵒ̌)ง⁼³₌₃ ", "\n ٩(๑`^´๑)۶ "];
    if (new Date().valueOf() > atTime.valueOf() + 10000) {
      replier.reply(sender + "님, 도배 경고입니다!! " + Common.rand(emoji));
      atTime = new Date();
    }
    return;
  }
  checkPlaster[sender] = msg;
}


function onStartCompile() {
  /*컴파일 또는 Api.reload호출시, 컴파일 되기 이전에 호출되는 함수입니다.
   *제안하는 용도: 리로드시 자동 백업*/
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var layout = new android.widget.LinearLayout(activity);
  layout.setOrientation(android.widget.LinearLayout.HORIZONTAL);
  var txt = new android.widget.TextView(activity);
  txt.setText("액티비티 사용 예시입니다.");
  layout.addView(txt);
  activity.setContentView(layout);
}
function onResume(activity) { }
function onPause(activity) { }
function onStop(activity) { }
