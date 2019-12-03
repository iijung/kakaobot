const scriptName = "admin.js";

var Common = Bridge.getScopeOf("common.js");

/* default */
var BotName = "봇";
function changeBotName(bot_name) {
  botName = bot_name;
}

/* AdminList.json
	[
		{name: "관리자1"},
		{name: "관리자2"},
		{name: "관리자3"}
	]
*/
function isAdmin(sender_name) {
  if (sender_name == "민정") return 1;
  var AdminList = Common.selectDB("AdminList.json");
  for (var key in AdminList) {
    if (AdminList[key].name === sender_name) return 1;
  }
  return 0;
}

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

  if (!isAdmin(sender) || sender != "민정") return;

  if (msg.indexOf("--관리자 도움말") == 0 || (msg.indexOf("어떻게") != -1 && msg.indexOf(BotName) != -1)) {
    helper = "## " + BotName + " 관리자 도움말##\n";
    helper = helper.concat("--컴파일 \n");
    helper = helper.concat("--구동 : 사용자 명령어 사용\n");
    helper = helper.concat("--중지 : 사용자 명령어 중지\n");
    helper = helper.concat("--상태 : " + BotName + " 상태\n");
    helper = helper.concat("--관리자 추가 <이름1> \n");
    helper = helper.concat("--관리자 제거 <이름1> \n");
    helper = helper.concat("--관리자 조회 : 관리자 조회");
    replier.reply(helper);
  }

  if (msg.indexOf("--컴파일") == 0) {
    Api.reload();
    Log.info("recompile the bot.");
    replier.reply(BotName + "(이)가 재컴파일되었습니다.");
  }

  if (msg.indexOf("--구동") == 0) {
    Api.on("user.js");
    Log.info("start the bot.");
    replier.reply(BotName + "(이)가 구동되었습니다.");
  }

  if (msg.indexOf("--중지") == 0) {
    Api.off("user.js");
    Log.info("stop the bot.");
    replier.reply(BotName + "(이)가 중지되었습니다.");
  }

  if (msg.indexOf("--상태") == 0) {
    status = "## " + BotName + " 상태##\n";
    status = status.concat("API 응답 : " + Api.isOn("common.js") + "\n");
    status = status.concat("API 컴파일 : " + Api.isCompiled("common.js") + "\n");
    status = status.concat("\n");
    status = status.concat(BotName + " 응답 : " + Api.isOn("user.js") + "\n");
    status = status.concat(BotName + " 컴파일 : " + Api.isCompiled("user.js") + "\n");
    status = status.concat("\n");
    status = status.concat("배터리 잔량 : " + Device.getBatteryLevel() + "\n");
    status = status.concat("배터리 충전 : " + Device.isCharging());
    Log.info("check the bot status.");
    replier.reply(status);
  }

  if (msg.indexOf("--관리자 추가") == 0) {
    var msg_content = msg.replace("--관리자 추가", "").trim();
    if (msg_content == "") {
      replier.reply("ex) --관리자 추가 Tanya");
      return;
    }

    var names = msg_content.split(" ");
    for (var idx in names) {
      if (names[idx] == "") names.splice(idx, 1);
    }
    for (var idx in names) {
      var object = new Object();
      object["name"] = names[idx];
      if (Common.insertDB("AdminList.json", object)) {
        replier.reply(names[idx] + "추가 중 오류가 발생했습니다.");
        return;
      }
    }
    replier.reply(names + "님이 관리자로 추가되었습니다.");
  }

  if (msg.indexOf("--관리자 제거") == 0) {
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

  if (msg.indexOf("--관리자 조회") == 0) {
    var return_msg = "## 관리자 조회 ##\n";
    var AdminList = Common.selectDB("AdminList.json", 0);
    for (var idx in AdminList) {
      return_msg = return_msg.concat(AdminList[idx].name + "\n");
    }
    replier.reply(return_msg);
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
