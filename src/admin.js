const scriptName = "admin";

var DFLT_ADMIN = [{ name: "Tanya" }];

function isNull(value) {
  return typeof value == "undefined" || value == null || value == "" ? true : false;
}

function checkRoom(room, bot) {
  // 0 : new , 1 : change
  if (isNull(bot)) bot = "봇쨩";

  var database = DataBase.getDataBase("RoomOptions.json");
  if (isNull(database) || database == "[]") {
    database = DataBase.setDataBase("RoomOptions.json", JSON.stringify([{ room: room, bot: bot }]));
    return 0;
  }
  var RoomOptions = JSON.parse(database);
  for (var idx in RoomOptions) {
    if (RoomOptions[idx]['room'] == room) {
      RoomOptions[idx]['bot'] = bot;
      DataBase.setDataBase("RoomOptions.json", JSON.stringify(RoomOptions));
      return 1;
    }
  }
  RoomOptions.push({ room: room, bot: bot });
  DataBase.setDataBase("RoomOptions.json", JSON.stringify(RoomOptions));
  return 0;
}

function showRooms() {
  var rtn_msg = "";
  var database = DataBase.getDataBase("RoomOptions.json");
  if (isNull(database) || database == "[]") return "설정된 방이 없습니다.";

  var RoomOptions = JSON.parse(database);
  for (var idx in RoomOptions) {
    rtn_msg = rtn_msg.concat(RoomOptions[idx]['room'] + " : \n");
    rtn_msg = rtn_msg.concat(" - " + RoomOptions[idx]['bot'] + "\n\n");
  }
  return rtn_msg.slice(0, -2);
}

function getAdminList() {
  var database = DataBase.getDataBase("AdminList.json");
  if (isNull(database) || database == "[]") database = DataBase.setDataBase("AdminList.json", JSON.stringify(DFLT_ADMIN));
  return database;
}

// 관리자 조회
function getAdminText() {
  var AdminList = JSON.parse(getAdminList());
  var text = "";
  for (var idx in AdminList) text = text.concat(AdminList[idx]["name"] + "\n");
  return text.slice(0, -1);
}

// 관리자 추가
function addAdmin(name) {
  var AdminList = JSON.parse(getAdminList());
  for (var idx in AdminList) {
    if (AdminList[idx]["name"] == name) return -1; // already exist
  }
  AdminList.push({ name: name });
  DataBase.setDataBase("AdminList.json", JSON.stringify(AdminList));
  return 0; // success
}

// 관리자 제거
function delAdmin(name) {
  var AdminList = JSON.parse(getAdminList());
  for (var idx in AdminList) {
    if (AdminList[idx]["name"] == name) {
      AdminList.splice(idx, 1);
      DataBase.setDataBase("AdminList.json", JSON.stringify(AdminList));
      return 0; // success
    }
  }
  return -1; // not exist
}

// 관리자 확인
function isAdmin(name) {
  var AdminList = JSON.parse(getAdminList());
  for (var idx in AdminList) {
    if (AdminList[idx]["name"] == name) return 1; // is admin
  }
  return 0; // isn't admmin
}

function help() {
  var help_msg = "[관리자 도움말]";
  help_msg = help_msg.concat("\n*도움말");
  help_msg = help_msg.concat("\n*디바이스 상태");
  help_msg = help_msg.concat("\n");
  help_msg = help_msg.concat("\n*방");
  help_msg = help_msg.concat("\n*상태");
  help_msg = help_msg.concat("\n*구동 bot1 ...");
  help_msg = help_msg.concat("\n*중지 bot2 ...");
  help_msg = help_msg.concat("\n*초대 bot1");
  help_msg = help_msg.concat("\n");
  help_msg = help_msg.concat("\n*관리자 조회");
  help_msg = help_msg.concat("\n*관리자 추가 admin1 ...");
  help_msg = help_msg.concat("\n*관리자 제거 admin1 ...");
  help_msg = help_msg.concat("\n");
  help_msg = help_msg.concat("\n*공지\n공지할 방이름\n하고싶은말");
  return help_msg;
}

function botStatus() {
  var stat_msg = "";
  var scripts = Api.getScriptNames();
  for (var idx in scripts) {
    stat_msg = stat_msg.concat("[" + scripts[idx] + " 상태]");
    stat_msg = stat_msg.concat("\n 전원 상태 : " + Api.isOn(scripts[idx]));
    stat_msg = stat_msg.concat("\n 컴파일 완료 : " + Api.isCompiled(scripts[idx]));
    stat_msg = stat_msg.concat("\n 컴파일 진행중 : " + Api.isCompiling(scripts[idx]));
    stat_msg = stat_msg.concat("\n\n");
  }
  return stat_msg.slice(0, -2);
}

function deviceStatus() {
  var stat_msg = "[디바이스 상태]";
  stat_msg = stat_msg.concat("\n안드로이드 OS빌드 : " + Device.getBuild());
  stat_msg = stat_msg.concat("\n안드로이드 버전코드 : " + Device.getAndroidVersionCode());
  stat_msg = stat_msg.concat("\n안드로이드 버전이름 : " + Device.getAndroidVersionCode());
  stat_msg = stat_msg.concat("\n휴대폰 브랜드명 : " + Device.getPhoneBrand());
  stat_msg = stat_msg.concat("\n휴대폰 모델명 : " + Device.getPhoneModel());
  stat_msg = stat_msg.concat("\n");
  stat_msg = stat_msg.concat("\n충전 여부 : " + Device.isCharging());
  stat_msg = stat_msg.concat("\n충전기 타입 : " + Device.getPlugType());
  stat_msg = stat_msg.concat("\n배터리 잔량 : " + Device.getBatteryLevel() + "%");
  stat_msg = stat_msg.concat("\n배터리 온도 : " + Device.getBatteryTemperature());
  stat_msg = stat_msg.concat("\n배터리 전압 : " + Device.getBatteryVoltage() + "mV");
  stat_msg = stat_msg.concat("\n배터리 상태 : " + Device.getBatteryStatus());
  stat_msg = stat_msg.concat("\n배터리 건강상태 : " + Device.getBatteryHealth());
  return stat_msg;
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if (msg == "일어나") { Api.reload(); Api.on(); }

  if (msg.indexOf("*초대") == 0) {
    checkRoom(room, msg.replace("*초대", "").trim());
    replier.reply("초대되었습니다.");
    return;
  }

  if (!isAdmin(sender)) return; // sedner가 관리자가 아닐 경우, 종료

  if (msg == "*도움말") replier.reply(help());

  if (msg == "*디바이스 상태") replier.reply(deviceStatus());

  if (msg.indexOf("*소스") == 0) {
    var contents = msg.replace("*소스", "").trim();
    if (isNull(contents)) return;
    var documents = org.jsoup.Jsoup.connect(contents).get();
    if (documents == undefined || documents == "") return;
    replier.reply(documents);
  }

  if (msg.indexOf("*공지") == 0) {
    var contents = msg.replace("*공지", "").trim();
    if (isNull(contents)) {
      replier.reply("ex) *공지\n디버그룸\n테스트 메시지 입니다.");
    } else {
      var room_name = contents.split("\n")[0]; // 공백이 오기 전 문자열
      var notice = contents.substring(contents.indexOf("\n") + 1); // 공백 다음 문자열
      replier.reply(room_name, notice);
    }
  }

  // 방 확인
  if (msg == "*방") replier.reply(showRooms());

  // 스크립트 상태 확인
  if (msg == "*상태") replier.reply(botStatus());

  // 스크립트 구동
  if (msg.indexOf("*구동") == 0) {
    var contents = msg.replace("*구동", "").trim();
    if (isNull(contents)) {
      var rtn_msg = "";
      var scripts = Api.getScriptNames();
      for (var idx in scripts) {
        rtn_msg = rtn_msg.concat("*구동 " + scripts[idx] + "\n");
      }
      replier.reply(rtn_msg.slice(0, -1));
    } else {
      var scripts = contents.split(" ");
      for (var idx in scripts) {
        if (!isNull(scripts[idx])) {
          Api.reload(scripts[idx]);
          Api.on(scripts[idx]);
          replier.reply(scripts[idx] + "(이)가 구동되었습니다.");
        }
      }
    }
  }

  // 스크립트 중지
  if (msg.indexOf("*중지") == 0) {
    var contents = msg.replace("*중지", "").trim();
    if (isNull(contents)) {
      var rtn_msg = "";
      var scripts = Api.getScriptNames();
      for (var idx in scripts) {
        rtn_msg = rtn_msg.concat("*중지 " + scripts[idx] + "\n");
      }
      replier.reply(rtn_msg.slice(0, -1));
    } else {
      var scripts = contents.split(" ");
      for (var idx in scripts) {
        if (!isNull(scripts[idx])) {
          Api.off(scripts[idx]);
          replier.reply(scripts[idx] + "(이)가 중지되었습니다.");
        }
      }
    }
  }

  // 관리자 관리
  if (msg == "*관리자 조회") replier.reply("[관리자 리스트]\n" + getAdminText());

  if (msg.indexOf("*관리자 추가") == 0) {
    var contents = msg.replace("*관리자 추가", "").trim();
    if (isNull(contents)) {
      replier.reply("ex) *관리자 추가 admin1 admin2");
      return;
    }
    var admins = contents.split(" ");
    for (var idx in admins) {
      if (!isNull(admins[idx])) {
        if (addAdmin(admins[idx]) < 0) {
          replier.reply(admins[idx] + "님은 이미 추가된 관리자입니다.");
        } else {
          replier.reply(admins[idx] + "님을 관리자로 추가했습니다.");
        }
      }
    }
  }

  if (msg.indexOf("*관리자 제거") == 0) {
    var contents = msg.replace("*관리자 제거", "").trim();
    if (isNull(contents)) {
      replier.reply("ex) *관리자 제거 admin1 admin2");
      return;
    }
    var admins = contents.split(" ");
    for (var idx in admins) {
      if (!isNull(admins[idx])) {
        if (delAdmin(admins[idx]) < 0) {
          replier.reply(admins[idx] + "님은 관리자가 아닙니다.");
        } else {
          replier.reply(admins[idx] + "님을 관리자에서 제거했습니다.");
        }
      }
    }
  }
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) { }

function onResume(activity) { }

function onPause(activity) { }

function onStop(activity) { }