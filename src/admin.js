const scriptName = "admin";

var DFLT_ADMIN = [{ name: "Tanya" }];

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
Object.prototype.where = function () {
  for (var key in arguments[0]) {
    if (this.hasOwnProperty(key) == false) continue;
    if (this[key] == arguments[0][key]) continue;
    return false;
  }
  return true;
};

function Table(name, columns) {
  /*
    var DEPT = new Table("dept", ["deptno","dname","loc"]);                     // new Table(파일명, 컬럼리스트)
    DEPT.insert({"deptno" : 10, "dname" : "ACCOUNTING", "loc" : "NEW YORK");    // .insert(values값)
    DEPT.insert({"deptno" : 20, "dname" : "RESEARCH",   "loc" : "DALLAS");
    DEPT.insert({"deptno" : 30, "dname" : "SALES",      "loc" : "CHICAGO");
    DEPT.insert({"deptno" : 40, "dname" : "OPERATIONS", "loc" : "BOSTON");
    DEPT.insert({"deptno" : 50, "dname" : "SALES",      "loc" : "BOSTON");
   
    DEPT.update({"deptno" : 10}, {"dname" : "TESTING"});      // .update(where절, update절)
    DEPT.delete({"dname" : "OPERATIONS", "loc" : "BOSTON"});  // .delete(where절)
    var result = DEPT.select({"deptno" : 40, "loc" : "BOSTON"}); // .select(where절)
    replier.reply(JSON.stringify(result));
   */
  this.storage = name;
  this.columns = columns;

  this.saveDB = function (db) { return DataBase.setDataBase(this.storage, JSON.stringify(db ? db : [])); }
  this.loadDB = function () { var db = DataBase.getDataBase(this.storage); return db ? JSON.parse(db) : []; }

  /* DDL(Data Definition Language) */
  this.drop = function () { return DataBase.removeDataBase(this.storage); }
  this.create = function () { return DataBase.setDataBase(this.storage, "[]"); }

  /* DML(Data Manipulation Language) */
  this.insert = function (insert_values) {
    var db = this.loadDB();
    var record = {};
    for (var key of this.columns) record[key] = insert_values.hasOwnProperty(key) ? insert_values[key] : null;;
    db.push(record);
    this.saveDB(db);
  }
  this.update = function (where_values, update_values) {
    var db = this.loadDB();
    for (var record of db) {
      if (record.where(where_values ? where_values : {}) == false) continue;
      for (var key in update_values) if (record.hasOwnProperty(key) == true) record[key] = update_values[key];
    }
    this.saveDB(db);
  }
  this.delete = function (where_values) {
    var new_db = [];
    for (var record of this.loadDB()) if (record.where(where_values ? where_values : {}) == false) new_db.push(record);
    this.saveDB(new_db);
  }
  this.select = function (where_values) {
    var result = [];
    for (var record of this.loadDB()) if (record.where(where_values ? where_values : {}) == true) result.push(record);
    return result;
  }
}

var AdminTable = {
  table: new Table("Admin.json", ["name"]),

  checkAdmin: function (user) {
    for (var record of this.table.select()) if (record["name"] == user) return true;
    return false;
  },
  drop: function () { this.table.drop(); },
  insert: function (user) { if (this.checkAdmin() == false) this.table.insert({ "name": user }); },
  delete: function (user) { this.table.delete({ "name": user }); },
  select: function () {
    var result = "# 관리자 리스트";
    for (var record of this.table.select()) result += "\n" + record["name"];
    return result;
  }
}

var RoomTable = {
  table: new Table("Room.json", ["name", "bot"]),

  checkRoom: function (room) {
    for (var record of this.table.select()) if (record["name"] == room) return true;
    return false;
  },
  drop: function () { this.table.drop(); },
  insert: function (room, bot) { if (this.checkRoom() == false) this.table.insert({ "name": room, "bot": bot ? bot : "봇쨩" }); },
  update: function (room, bot) { this.table.update({ "name": room }, { "bot": bot }); },
  select: function () {
    var result = "# 방 리스트";
    for (var record of this.table.select()) result += "\n {0} : {1}".format(record["name"], record["bot"]);
    return result;
  }
}

var Script = {
  getTarget: function (scripts) {
    var target = [];
    for (var s of Api.getScriptNames()) { if (scripts && scripts.indexOf(s) != -1) target.push(s); }
    return target.length ? target : Api.getScriptNames();
  },
  status: function (scripts) {
    var result = "";
    for (var s of this.getTarget(scripts)) {
      result += "[" + s + " 상태]"
        + "\n 전원 상태 : " + Api.isOn(s)
        + "\n 컴파일 완료 : " + Api.isCompiled(s)
        + "\n 컴파일 진행중 : " + Api.isCompiling(s) + "\n\n";
    }
    return result.slice(0, -2);
  },
  start: function (scripts) {
    var target = this.getTarget(scripts);
    for (var s of target) {
      Api.reload(s);
      Api.on(s);
    }
    return target + " 구동 완료!";
  },
  stop: function (scripts) {
    var target = this.getTarget(scripts);
    for (var s of target) {
      Api.off(s);
    }
    return target + " 구동 중지!";
  }
}

function help() {
  var help_msg = "[관리자 도움말]"
    + "\n*도움말"
    + "\n"
    + "\n*디바이스 상태"
    + "\n*상태 bot1 ..."
    + "\n*구동 bot2 ..."
    + "\n*중지 bot3 ..."
    + "\n"
    + "\n*방 조회"
    + "\n*방 설정\n방이름\n봇이름"
    + "\n"
    + "\n*관리자 조회"
    + "\n*관리자 추가 admin"
    + "\n*관리자 제거 admin"
    + "\n"
    + "\n*공지\n방이름\n하고싶은말";
  return help_msg;
}

function testing(replier, code) {
  /* 사용자 입력값을 그대로 코드로 넘겨주는 것은 보안상 위험하니 주의! */
  try {
    eval(code);
  } catch (e) {
    replier.reply("오류 발생!");
  }
}


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  try {
    if (msg.indexOf("일어나") != -1) { Api.reload(); Api.on(); }


    if (RoomTable.checkRoom(room) == false) RoomTable.insert(room, "봇쨩");  // 방 별 옵션 설정  
    if (AdminTable.checkAdmin(sender) == false) return;                      // sedner가 관리자가 아닐 경우, 종료

    if (msg == "*도움말") replier.reply(help());

    if (msg.indexOf("*테스트") == 0 && (msg = msg.replace("*테스트", "").trim())) { testing(replier, msg); return; }
    if (msg.indexOf("*공지") == 0 && (msg = msg.replace("*공지", "").trim())) {
      try {
        var room_name = msg.split("\n")[0];                // \n 이전 문자열
        var notice = msg.substring(msg.indexOf("\n") + 1); // \n 다음 문자열
        replier.reply(room_name, notice);
      } catch (e) {
        replier.reply("ex) *공지\n디버그룸\n테스트 메시지 입니다.");
      }
    }

    // 스크립트 
    if (msg == "*상태") { replier.reply(Script.status()); return; }
    if (msg.indexOf("*구동") == 0 && (args = msg.replace("*구동", "").trim())) { replier.reply(Script.start(args.split(" "))); return; }
    if (msg.indexOf("*중지") == 0 && (args = msg.replace("*중지", "").trim())) { replier.reply(Script.stop(args.split(" "))); return; }

    if (msg == "*디바이스 상태") {
      replier.reply("[디바이스 상태]"
        + "\n안드로이드 OS빌드 : " + Device.getBuild()
        + "\n안드로이드 버전코드 : " + Device.getAndroidVersionCode()
        + "\n안드로이드 버전이름 : " + Device.getAndroidVersionCode()
        + "\n휴대폰 브랜드명 : " + Device.getPhoneBrand()
        + "\n휴대폰 모델명 : " + Device.getPhoneModel()
        + "\n"
        + "\n충전 여부 : " + Device.isCharging()
        + "\n충전기 타입 : " + Device.getPlugType()
        + "\n배터리 잔량 : " + Device.getBatteryLevel() + "%"
        + "\n배터리 온도 : " + Device.getBatteryTemperature()
        + "\n배터리 전압 : " + Device.getBatteryVoltage() + "mV"
        + "\n배터리 상태 : " + Device.getBatteryStatus()
        + "\n배터리 건강상태 : " + Device.getBatteryHealth());
    }

    // 파일 관리
    if (msg.indexOf("*파일") == 0 && (cmd = msg.replace("*파일", "").trim())) {
      try {
        var args = msg.split("\n");
        if (cmd.indexOf("조회") == 0) { /*pass*/ }
        if (cmd.indexOf("제거") == 0) { DataBase.removeDataBase(args[1]); }
        if (cmd.indexOf("수정") == 0) { DataBase.setDataBase(args[1], args[2]); }
        replier.reply(DataBase.getDataBase(args[1]));
      } catch (e) {
        replier.reply("오류발생");
      }
    }
    // 관리자 관리
    if (msg.indexOf("*관리자") == 0 && (cmd = msg.replace("*관리자", "").trim())) {
      try {
        if (cmd.indexOf("조회") == 0) { /* pass */ }
        if (cmd.indexOf("추가") == 0) { AdminTable.insert(cmd.replace("추가", "").trim()); }
        if (cmd.indexOf("제거") == 0) { AdminTable.delete(cmd.replace("제거", "").trim()); }
      } finally {
        replier.reply(AdminTable.select()); return;
      }
    }
    // 방 확인
    if (msg.indexOf("*방") == 0 && (cmd = msg.replace("*방", "").trim())) {
      try {
        if (cmd.indexOf("조회") == 0) { /* pass */ }
        if (cmd.indexOf("설정") == 0) {
          var arg = cmd.replace("설정", "").trim().split("\n");
          if (RoomTable.checkRoom(arg[0])) RoomTable.update(arg[0], arg[1]);
        }
      } finally {
        replier.reply(RoomTable.select()); return;
      }
    }
  } catch (e) {
    replier.reply("Tanya", e); // 관리자에게 오류 메세지 전송
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