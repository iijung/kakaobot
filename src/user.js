const scriptName = "user.js";

var Common = Bridge.getScopeOf("common.js");
var Admin = Bridge.getScopeOf("admin.js");

var BotName = Admin.BotName;

var atTime = new Date();
var checkPlaster = "";

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
  if (sender != "민정") return;

  Log.info("packName: " + packageName + "\nroom: " + room + "\nsender: " + sender + "\nmsg: " + msg + "\nisGruptChat: " + isGroupChat);
  /*(String) room: 메시지를 받은 방 이름
   *(String) msg: 메시지 내용
   *(String) sender: 전송자 닉네임
   *(boolean) isGroupChat: 단체/오픈채팅 여부
   *replier: 응답용 객체. replier.reply("메시지") 또는 replier.reply("방이름","메시지")로 전송
   *(String) ImageDB.getProfileImage(): 전송자의 프로필 이미지를 Base64로 인코딩하여 반환
   *(String) packageName: 메시지를 받은 메신저의 패키지 이름. (카카오톡: com.kakao.talk, 페메: com.facebook.orca, 라인: jp.naver.line.android
   *(int) threadId: 현재 쓰레드의 순번(스크립트별로 따로 매김)     *Api,Utils객체에 대해서는 설정의 도움말 참조*/
   
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

  // 도배 체크
  if (checkPlaster == msg) {
    if (new Date().valueOf() > atTime.valueOf() + 10000) {
      replier.reply(sender + "님, 도배 경고입니다!!🚫");
      atTime = new Date();
    }
    return;
  }
  checkPlaster = msg;

  // 명령어
  if (msg.indexOf("--도움말") == 0 || (msg.indexOf("어떻게") != -1 && msg.indexOf(BotName) != -1)) {
    helper = "## " + BotName + " 도움말##\n";
    helper = helper.concat("주사위\n");
    helper = helper.concat("\n");
    helper = helper.concat("--타이머 <second>\n");
    helper = helper.concat("--학습 <질문>:<대답>\n");
    helper = helper.concat("--학습조회 [질문]");
    helper = helper.concat("--학습제거 <질문>");
    replier.reply(helper);
  }

  if (msg.indexOf("--타이머 ") == 0) {
    var time = Number(msg.split(" ")[1].replace(/[^0-9]/g, ""));
    replier.reply("타이머 시작!\n" + time + "초 뒤에 타이머가 종료됩니다!");
    java.lang.Thread.sleep(time * 1000);
    replier.reply(time + "초가 경과했습니다.");
  }

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
