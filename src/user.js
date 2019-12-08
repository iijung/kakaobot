const scriptName = "user.js";

var Common = Bridge.getScopeOf("common.js");
var Admin = Bridge.getScopeOf("admin.js");

var BotName = Admin.BotName;

var atTime = new Date();
var checkPlaster = {};

/* Food List */
var FoodList = new Object();
FoodList["한식"] = ["불고기", "두루치기", "닭볶음", "쌈밥", "비빔밥", "생선구이", "낙지볶음", "게장", "떡갈비"];
FoodList["탕"] = ["김치찌개", "순두부찌개", "된장찌개", "부대찌개", "동태찌개", "청국장", "갈비탕", "추어탕", "삼계탕"];
FoodList["중식"] = ["짜장면", "짬뽕", "볶음밥", "탕수육", "마파두부", "양장피", "깐풍기", "유린기", "고추잡채"];
FoodList["일식"] = ["초밥", "라멘", "낫또", "오니기리", "덮밥", "우동", "야키니쿠", "메밀소바", "돈카츠"];
FoodList["양식"] = ["로제파스타", "봉골레파스타", "크림파스타", "피자", "스테이크", "리조또", "햄버거", "시저샐러드"];
FoodList["해장"] = ["북어국", "콩나물국밥", "순대국", "뼈해장국", "우거지국", "선지해장국", "올갱이국", "매운라면", "물냉면"];
FoodList["간편"] = ["도시락", "샌드위치", "토스트", "샐러드", "김밥", "떢볶이", "핫도그", "밥버거", "시리얼", "컵밥"];
FoodList["기타"] = ["쌀국수", "팟타이", "카레", "찜닭", "수제비", "칼국수", "아구찜", "닭갈비", "월남씸"];
/**************/

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
  Log.info("packName: " + packageName + "\nroom: " + room + "\nsender: " + sender + "\nmsg: " + msg + "\nisGruptChat: " + isGroupChat);
  /*(String) room: 메시지를 받은 방 이름
   *(String) msg: 메시지 내용
   *(String) sender: 전송자 닉네임
   *(boolean) isGroupChat: 단체/오픈채팅 여부
   *replier: 응답용 객체. replier.reply("메시지") 또는 replier.reply("방이름","메시지")로 전송
   *(String) ImageDB.getProfileImage(): 전송자의 프로필 이미지를 Base64로 인코딩하여 반환
   *(String) packageName: 메시지를 받은 메신저의 패키지 이름. (카카오톡: com.kakao.talk, 페메: com.facebook.orca, 라인: jp.naver.line.android
   *(int) threadId: 현재 쓰레드의 순번(스크립트별로 따로 매김)     *Api,Utils객체에 대해서는 설정의 도움말 참조*/

  if (msg.indexOf("봇짱") != -1 || msg.indexOf("봇쨩") != -1) {
    var ment = ["예스 마이 마스터?", "ヽ(✿ﾟ▽ﾟ)ノ", "ヽ(✿ﾟωﾟ)ノ"];
    replier.reply(Common.rand(ment));
  } else if (msg.indexOf("굿봇") != -1 || msg.indexOf("굿 봇") != -1 || msg.indexOf("구웃봇") != -1) {
    var ment = ["(･ω<)☆", "(･ω<)☆", "(･ω<)☆", "(๑ゝڡ◕๑)", "（*´▽`*)", "(♡´艸`)", "ꈍ .̮ ꈍ", "(ง •̀ω•́)ง✧", "( • ̀ω•́  )✧"];
    replier.reply(Common.rand(ment));
  }

  if (msg.indexOf("주사위") != -1) {
    var dice = Math.ceil(Math.random() * 6);
    switch (dice) {
      case 1:
        replier.reply("\u2680");
        break;
      case 2:
        replier.reply("\u2681");
        break;
      case 3:
        replier.reply("\u2682");
        break;
      case 4:
        replier.reply("\u2683");
        break;
      case 5:
        replier.reply("\u2684");
        break;
      case 6:
        replier.reply("\u2685");
        break;
      default:
        break;
    }
    return;
  }

  if (
    (msg.indexOf("뭐") != -1 && (msg.indexOf("먹지") != -1 || msg.indexOf("먹을까") != -1 || msg.indexOf("먹는게 좋을까") != -1)) ||
    (msg.indexOf("추천해줘") != -1 && (msg.indexOf("아침") != -1 || msg.indexOf("점심") != -1 || msg.indexOf("저녁") != -1 || msg.indexOf("먹을 거") != -1 || msg.indexOf("음식") != -1))
  ) {
    var category = Common.rand(FoodList);
    var menu = Common.rand(category);
    replier.reply("오늘은 " + menu + " 추천 드려요! 🍳");
  }

  // 도배 체크
  if (checkPlaster[sender] == msg) {
    var emoji = ["🚫", "( ﾟдﾟ )", "ヽ(`Д´)ﾉ", "\n｡･ﾟﾟ*(>д<)*ﾟﾟ･｡", "\n(　ﾟ皿ﾟ)", "\n(╬ ಠ 益ಠ)"];
    if (new Date().valueOf() > atTime.valueOf() + 10000) {
      replier.reply(sender + "님, 도배 경고입니다!! " + Common.rand(emoji));
      atTime = new Date();
    }
    return;
  }
  checkPlaster[sender] = msg;

  // 명령어
  if (msg.indexOf("--도움말") == 0 || (msg.indexOf("어떻게") != -1 && msg.indexOf(BotName) != -1)) {
    helper = "## " + BotName + " 도움말##\n";
    helper = helper.concat("주사위\n");
    helper = helper.concat("--타이머 <second>\n");
    helper = helper.concat("--골라줘 <A> <B> ...\n");
    helper = helper.concat("\n");
    helper = helper.concat("--학습 <질문>:<대답>\n");
    helper = helper.concat("--학습조회 [질문]");
    helper = helper.concat("--학습제거 <질문>");
    replier.reply(helper);
  }

  if (msg.indexOf("--타이머 ") == 0) {
    var time = Number(msg.split(" ")[1].replace(/[^0-9]/g, ""));
    if (time == "") {
      replier.reply("ex) --타이머 10");
      return;
    }
    replier.reply("타이머 시작!\n" + time + "초 뒤에 타이머가 종료됩니다!");
    java.lang.Thread.sleep(time * 1000);
    replier.reply(time + "초가 경과했습니다.");
  }

  if (msg.indexOf("--골라줘 ") == 0) {
    var msg_content = msg.replace("--골라줘 ", "").trim();
    if (msg_content == "") {
      replier.reply("ex) --골라줘 치킨 피자");
      return;
    }

    var select = msg_content.split(" ");
    for (var idx in select) {
      if (select[idx] == "") select.splice(idx, 1);
    }
    replier.reply(Common.rand(select) + "!!");
  }

  /* 시간 많을 때 개발 예정 */
  if (msg.indexOf("--학습 <질문>:<대답>") == 0) {
  }
  if (msg.indexOf("--학습조회 [질문]") == 0) {
    var return_msg = "";
    var ObjectList = selectDB("test.json", 0);
    for (var idx in ObjectList) {
      return_msg = return_msg.concat(" " + ObjectList[idx].name);
    }
    replier.reply(return_msg);
  }

  if (msg.indexOf("--학습제거 <질문>") == 0) {
    var msg_content = msg.replace("--관리자 제거 ", "").trim();
    if (msg_content == "") {
      replier.reply("ex) --관리자 제거 Tanya");
      return;
    }

    var return_name = "";
    var names = msg_content.split(" ");
    for (var idx in names) {
      if (names[idx] == "") names.splice(idx, 1);
    }
    for (var idx in names) {
      var object = new Object();
      object["name"] = names[idx];
      var ObjectList = Common.deleteDB("AdminList.json", object);
      for (var idx in ObjectList) {
        return_name = return_name.concat(ObjectList[idx].name + ",");
      }
    }
    replier.reply(return_name + "님이 관리자에서 제거되었습니다.");
  }
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
function onResume(activity) {}
function onPause(activity) {}
function onStop(activity) {}
