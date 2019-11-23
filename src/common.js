const scriptName = "common.js";

String.prototype.format = function() {
  // Usage: "hello {1} {0} world {0}".foramt('!', 10)
  // Return: hello 10 ! world !
  var string = this;
  for (var i = 0; i < arguments.length; i++) {
    var regExp = new RegExp("\\{" + i + "\\}", "gm");
    string = string.replace(regExp, arguments[i]);
  }
  return string;
};

function strtoObject(str, token) {
  // Usage: strtoObject("-key1 value1 -key2 value2");  // default = "-"
  // Usage: strtoObject("+key1 value1 +key2 value2", "+");
  if (!token) token = "-";
  var object = {};

  while (str != "") {
    var start = str.indexOf(token);
    var end = str.indexOf(token, start + 1);
    var object_str = end == -1 ? str.substring(start) : str.substring(start, end);

    var key = object_str.substring(token.length).split(" ")[0];
    var value = object_str.replace(token + key, "").trim();

    object[key] = value;

    str = end == -1 ? "" : str.substring(end);
  }
  return object;
}

function rand() {
  if (typeof arg[0] == "object" && arg[1] == undefined) {
    return arg[0][Math.floor(Math.random() * arg[0].length)];
  } else if (typeof arg[0] == "number" && arg[1] == "number") {
    return Math.floor(Math.random() * Math.abs(arg[1] - arg[0]) + Math.min(arg[0], arg[1]));
  } else {
    return arg[Math.floor(Math.random() * arg.length)];
  }
}

/******************************************************************* */
// JSON Database
/******************************************************************* */
function createDB(file_name) {
  if (DataBase.getDataBase(file_name) != null) {
    Log.error("database [{0}] already exists.".format(file_name));
    return -1;
  }
  DataBase.setDataBase(file_name, JSON.stringify(new Array()));
  Log.info("database [{0}] created.".format(file_name));
  return 0;

  //  0 : success
  // -1 : already exists
}

function dropDB(file_name) {
  if (DataBase.getDataBase(file_name) == null) {
    Log.error("database [{0}] not exists.".format(file_name));
    return -1;
  }
  if (DataBase.removeDataBase(file_name) == null) {
    Log.error("an error occurred while deleting the database [{0}].".format(file_name));
    return -2;
  }
  Log.info("database [{0}] dropped.".format(file_name));
  return 0;

  //  0 : success
  // -1 : file not exists
  // -2 : unkown error
}

function insertDB(file_name, insert_object) {
  if (typeof insert_object != "object") {
    Log.error("no insert object.");
    return -1;
  }

  var database = DataBase.getDataBase(file_name);
  if (database == null) {
    if (createDB(file_name) == 0) {
      database = DataBase.getDataBase(file_name);
    } else {
      Log.error("database [{0}] not exists.".format(file_name));
      return -2;
    }
  }

  ObjectList = JSON.parse(database);
  ObjectList.push(insert_object);

  DataBase.setDataBase(file_name, JSON.stringify(ObjectList));
  Log.info("object inserted in database [{0}]".format(file_name));
  return 0;

  //  0 : success
  // -1 : no insert object
  // -2 : file not exists
}

function selectDB(file_name, where_object) {
  var database = DataBase.getDataBase(file_name);
  if (database == null) return null;

  ObjectList = JSON.parse(database);
  var SelectList = [];

  for (var idx in ObjectList) {
    // where
    var same_flag = 1;
    for (var key in where_object) {
      if (ObjectList[idx][key] !== where_object[key]) same_flag = 0;
    }
    if (same_flag == 0) continue;
    SelectList.push(ObjectList[idx]);
  }
  Log.info("{1} objects selected in database [{0}]".format(file_name, SelectList.length));
  return SelectList;
}

function deleteDB(file_name, where_object) {
  var database = DataBase.getDataBase(file_name);
  if (database == null) return 0;

  var ObjectList = JSON.parse(database);
  var InsertList = [];
  var DeleteList = [];
  for (var idx in ObjectList) {
    // where
    var same_flag = 1;
    for (var key in where_object) {
      if (ObjectList[idx][key] !== where_object[key]) same_flag = 0;
    }
    if (same_flag == 0) {
      InsertList.push(ObjectList[idx]);
    } else {
      DeleteList.push(ObjectList[idx]);
    }
  }

  DataBase.setDataBase(file_name, JSON.stringify(InsertList));
  Log.info("{1} objects deleted in database [{0}]".format(file_name, DeleteList.length));
  return DeleteList;
}

function updateDB(file_name, update_object, where_object) {
  var database = DataBase.getDataBase(file_name);
  if (database == null) return 0;

  var ObjectList = JSON.parse(database);
  var BeforeList = [];
  var AfterList = [];
  for (var idx in ObjectList) {
    var same_flag = 1;
    for (var key in where_object) {
      if (ObjectList[idx][key] !== where_object[key]) same_flag = 0;
    }
    if (same_flag == 0) continue;

    BeforeList.push(ObjectList[idx]);
    for (var key in update_object) {
      ObjectList[idx][key] = update_object[key];
    }
    AfterList.push(ObjectList[idx]);
  }

  DataBase.setDataBase(file_name, JSON.stringify(ObjectList));
  Log.info("{1} objects updated in database [{0}]".format(file_name, AfterList.length));
  return { before: BeforeList, after: AfterList };
}

/******************************************************************* */
// Test Example
/******************************************************************* */
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
