const scriptName = "test.js";

var Common = Bridge.getScopeOf("common.js");

/* Setting */
var botName = null;

function response(room, msg, sender, isGroupChat, replier, ImageDB) {
  if (sender != "민정") return;
}

/*

  if (msg.indexOf("--생성") == 0) {
    if (createDB("test.json")) {
      replier.reply("테스트 파일이 이미 존재합니다.");
    } else {
      replier.reply("테스트 파일이 생성되었습니다.");
    }
  }

  if (msg.indexOf("--삭제") == 0) {
    if (dropDB("test.json")) {
      replier.reply("삭제 중 오류가 발생했습니다.");
    } else {
      replier.reply("테스트 파일이 삭제되었습니다.");
    }
  }

  if (msg.indexOf("--추가") == 0) {
    var msg_content = msg.replace("--추가", "").trim();
    if (msg_content == "") {
      replier.reply("추가할 오브젝트가 없습니다.");
      return;
    }

    var names = msg_content.split(" ");
    for (var idx in names) {
      if (names[idx] == "") names.splice(idx, 1);
    }
    for (var idx in names) {
      var object = new Object();
      object["name"] = names[idx];
      if (insertDB("test.json", object)) {
        replier.reply("추가 중 오류가 발생했습니다.");
        return;
      }
    }
    replier.reply(names + "(이)가 오브젝트로 등록되었습니다.");
  }

  if (msg.indexOf("--제거") == 0) {
    var return_msg = "";
    var msg_content = msg.replace("--제거", "").trim();
    if (msg_content == "") {
      replier.reply("제거할 오브젝트가 없습니다.");
      return;
    }

    var names = msg_content.split(" ");
    for (var idx in names) {
      if (names[idx] == "") names.splice(idx, 1);
    }
    for (var idx in names) {
      var object = new Object();
      object["name"] = names[idx];
      var ObjectList = deleteDB("test.json", object);
      for (var idx in ObjectList) {
        return_msg = return_msg.concat(ObjectList[idx].name + ",");
      }
    }
    replier.reply(names + "(이)가 오브젝트에서 제거되었습니다.");
  }

  if (msg.indexOf("--수정") == 0) {
    // --수정 --u [-id 1 -name 하이 -date 2019] --w [-id 1 -name 하이 -date 2019]
    var return_msg = "";
    var msg_content = msg.replace("--수정", "").trim();
    if (msg_content == "") {
      replier.reply("수정할 오브젝트가 없습니다.");
      return;
    }

    var command_object = strtoObject(msg_content, "--");
    var update_object = strtoObject(command_object["u"]);
    var where_object = strtoObject(command_object["w"]);

    var ReturnList = updateDB("test.json", update_object, where_object);
    for (var key in ReturnList) {
      return_msg = return_msg.concat("### {0} ###".format(key));
      return_msg = return_msg.concat("\n" + JSON.stringify(ReturnList[key]) + "\n");
    }
    replier.reply(return_msg.slice(0, -1));
  }

  if (msg.indexOf("--조회") == 0) {
    var return_msg = "## 조회 ##";
    var ObjectList = selectDB("test.json", 0);
    for (var idx in ObjectList) {
      return_msg = return_msg.concat(" " + ObjectList[idx].name);
    }
    replier.reply(return_msg);
  }
*/
