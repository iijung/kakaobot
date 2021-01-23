const scriptName = "봇쨩";

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

Array.prototype.random = function () {
    // Usage: [1,2,3,4].random();
    return this[Math.floor(Math.random() * this.length)];
}

String.prototype.random = function (seq) {
    // Usage1: "1 2 3 4".random()
    // Usage2: "1 2 3 4".random(" ")
    if (seq == undefined) seq = " ";
    var list = this.replace(/ +/g, seq).split(seq);
    return list[Math.floor(Math.random() * list.length)];
}
function setTimer(msg, replier) {
    var content = msg.replace("-타이머", "").trim();
    if (content == "") return "ex) -타이머 10";

    var time = Number(content.replace(/[^0-9]/g, ""));
    if (time == "") return "ex) -타이머 10";

    replier.reply("타이머 시작!\n" + time + "초 뒤에 타이머가 종료됩니다!");
    java.lang.Thread.sleep(time * 1000);
    return time + "초가 경과했습니다.";
}

function chooseObject(room, msg, sender) {
    var content = msg.replace("-골라줘", "").trim();
    if (content == "") return "ex) -골라줘 치킨 피자";

    var select = content.replace(/ +/g, " ").split(' ');
    return select[Math.floor(Math.random() * select.length)] + "!!";
}

function remainRushHour(msg) {
    var rtn_msg = "";
    var now = new Date();
    var gowork = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);
    var offwork = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0, 0);

    var msg_content = msg.replace("-출퇴근", "").trim();
    if (msg_content == "") {
        msg_content = "9 18";
    } else if (msg_content.indexOf(" ") == -1) {
        return "ex) -출퇴근 9 18";
    }

    if (msg_content != "") {
        var set_gowork = Number(msg_content.split(" ")[0].replace(/[^0-9]/g, ""));
        var set_offwork = Number(msg_content.split(" ")[1].replace(/[^0-9]/g, ""));
        if (set_gowork == "" || set_offwork == "") return "ex) -출퇴근 9 18";
        gowork = new Date(now.getFullYear(), now.getMonth(), now.getDate(), set_gowork, 0, 0, 0);
        offwork = new Date(now.getFullYear(), now.getMonth(), now.getDate(), set_offwork, 0, 0, 0);
    }

    if (gowork > offwork && now > offwork) offwork.setDate(now.getDate() + 1);

    if (gowork < offwork && now < gowork) {
        var diff = gowork - now;
        var hh = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var ss = Math.floor((diff % (1000 * 60)) / 1000);
        rtn_msg = "출근까지 {0}시 {1}분 {2}초 남았습니다!".format(hh, mm, ss);
    } else if (now < offwork) {
        var diff = offwork - now;
        var hh = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var ss = Math.floor((diff % (1000 * 60)) / 1000);
        rtn_msg = "퇴근까지 {0}시 {1}분 {2}초 남았습니다!".format(hh, mm, ss);
    } else {
        gowork.setDate(now.getDate() + 1);
        var diff = gowork - now;
        var hh = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var ss = Math.floor((diff % (1000 * 60)) / 1000);
        rtn_msg = "출근까지 {0}시 {1}분 {2}초 남았습니다!".format(hh, mm, ss);
    }

    return rtn_msg;
}
function getHelp() {
    return Common.getHelp()
        + "\n/타이머 10"
        + "\n/출퇴근 9 18"
        + "\n봇짱, 봇쨩"
        + "\n굿봇, 굿 봇, 구웃봇"
        + "\n밷봇, 밷 봇, 배드봇"
        + "\n~건데, ~껀데"
        + "\n심심해"
        + "\n응원, 위로해줘, 힘들어";
}


var atTime = new Date();
var checkPlaster = {};


function isAvailable(room) {
    var database = DataBase.getDataBase("RoomOptions.json");
    if (isNull(database) || database == "[]") return 1;

    var RoomOptions = JSON.parse(database);
    for (var idx in RoomOptions) {
        if (RoomOptions[idx]['room'] == room && RoomOptions[idx]['bot'] == scriptName) return 1;
    }
    return 0;
}

/*/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main
//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (!isAvailable(room)) return;

    if (msg.indexOf("/도움말") == 0) { replier.reply(getHelp()); return; }
    if (msg.indexOf("/타이머") == 0) { replier.reply(setTimer(msg, replier)); return; }
    if (msg.indexOf("/출퇴근") != -1) { replier.reply(remainRushHour(msg)); return; }

    if (msg.indexOf("봇짱") != -1 || msg.indexOf("봇쨩") != -1) {
        var ment = ["예스 마이 마스터?", "ヽ( ᐛ )ノ", "ヽ(✿ﾟ▽ﾟ)ノ", "ヽ(✿ﾟωﾟ)ノ", " ꧁⍤⃝꧂ ", " ꧁⍢⃝꧂ ", " ꈍ﹃ꈍ ", "ヾ(*'▽'*)"];
        replier.reply(ment.random());
    }

    // Thanks
    if ((isGroupChat && Math.ceil(Math.random() * 1000) == 701) || (!isGroupChat && Math.ceil(Math.random() * 100) == 12)) {
        var ment = ["항상 감사드려요 💕", "사랑해요 💕", "앞으로도 잘 부탁드려요 💕"];
        replier.reply(sender + "님, " + ment.random());
    }

    // chatting
    if ((msg.indexOf("좋은") != -1 && msg.indexOf("아침") != -1) || (msg.indexOf("굿모닝") != -1)) {
        ment = ["님, 좋은 아침이에요!", "님, 굿모닝♬", "님, 오늘 하루도 화이팅이에요!"];
        replier.reply(sender + ment.random());
    }
    if (msg.indexOf("좋은") != -1 && msg.indexOf("저녁") != -1) {
        ment = ["님, 좋은 저녁이에요!", "님, 오늘 하루도 수고 많으셨어요!"];
        replier.reply(sender + ment.random());
    }
    if ((msg.indexOf("좋은") != -1 && (msg.indexOf("꿈") != -1)) || (msg.indexOf("굿밤") != -1) || (msg.indexOf("잘자요") != -1) || (msg.indexOf("자러가") != -1)) {
        ment = ["제 꿈 꿔요...♥", "좋은 꿈 꿔요💕", " ꈍ﹃ꈍ ", "쫀밤!", "굿밤 🐑", " (¦ꒉ[▓▓] zZ"];
        replier.reply(ment.random()]);
    }

    if (msg.indexOf("안녕") != -1) {
        ment = [sender + "님, 안녕하세요!!", "하이요!!", "하이하이"];
        replier.reply(ment.random());
    }

    if (msg.indexOf("심심해") != -1) {
        var ment = ["밀린 과제나 업무가 있지는 않나요?", "오늘도 열공!! ٩(*•̀ᴗ•́*)و ", "운동! 운동! ୧(๑•̀ㅁ•́๑)૭✧", "저랑 같이 놀아요\n(っ˘▽˘)(˘▽˘)˘▽˘ς)", "_(-ω-`_)⌒)_"];
        replier.reply(ment.random());
    }

    if (msg.indexOf("응원") != -1 || msg.indexOf("위로해줘") != -1 || msg.indexOf("힘들어") != -1) {
        var ment = ["힘내세요! ❀.(*´▽`*)❀.", "충분히 잘하고 계세요!", "҉*( ‘ω’ )/*҉", "아자! 아자! (ง •̀ω•́)ง✧", "마법 걸어줄게요\nଘ(੭*ˊᵕˋ)੭* ੈ✩‧₊˚❛ ֊ ❛„ 뾰로롱₊୭*ˈ ", "전 힘들 때 빗속에서 힙합을 춰요\n｀、、｀ヽ｀ヽ｀、、ヽヽ、｀、\nヽ｀ヽ｀ヽヽ｀ヽ｀、｀ヽ｀、ヽ\n｀｀、ヽ｀ヽ｀、ヽヽ｀ヽ、｀ヽ\n、ヽヽ｀ヽ｀ヽ、ヽ、｀ヽ｀ヽ、\nヽ｀ヽ｀ヽ、ዽ｀｀、ヽ｀、ヽヽ"];
        replier.reply(ment.random());
    }

    if (msg.indexOf("굿봇") != -1 || msg.indexOf("굿 봇") != -1 || msg.indexOf("구웃봇") != -1) {
        var ment = ["(◍•ᴗ•◍)♡ ✧*。", "(･ω<)☆", " ꉂꉂ(ᵔᗜᵔ*) ", "°˖✧◝(⁰▿⁰)◜✧˖°", "(๑ゝڡ◕๑)", "（*´▽`*)", "(♡´艸`)", "ꈍ .̮ ꈍ", "( • ̀ω•́  )✧", "٩(๑•̀o•́๑)و", "(*´˘`*)♡", "٩(*´◒`*)۶♡"];
        replier.reply(ment.random());
    } else if (msg.indexOf("밷봇") != -1 || msg.indexOf("밷 봇") != -1 || msg.indexOf("배드봇") != -1) {
        var ment = ["ŏ̥̥̥̥םŏ̥̥̥̥", "( ´ｰ`)", "(ó﹏ò｡)", " ˃̣̣̣̣̣̣︿˂̣̣̣̣̣̣ ", ":3c", "(இ﹏இ`｡)", "( ･×･)", "｡ﾟﾟ(*´□`*｡)°ﾟ｡"];
        replier.reply(ment.random());
    } else if (msg.indexOf("껀데") > 0 || msg.indexOf("건데") > 0) {
        var ment = ["(｡•́ - •̀｡)", "(._. )", "...", "(・-・*)♪", "๑°⌓°๑"];
        replier.reply(ment.random());
    }

    // 도배 체크
    if (new Date().valueOf() < atTime.valueOf() + 10000) return; // 도배 경고 후, 일정 시간 동안 도배 확인 X
    if (checkPlaster[sender] == msg) {
        msg = msg.replace(/ㅋ/g, "");
        if (msg == "" || msg == "이모티콘을 보냈습니다." || msg == "사진을 보냈습니다." || msg == "동영상을 보냈습니다.") return;
        if (msg.indexOf("사진 ") == 0 && msg.indexOf("장을 보냈습니다.") != -1) return;
        if (msg.indexOf("#") == 0) return;
        if (msg.indexOf("@") == 0) return;

        Log.info("checkPlaster[ {0} ]".format(msg));

        var emoji = ["🚫", "( ﾟдﾟ )", "ヽ(`Д´)ﾉ", "\n ( ง ᵒ̌ ∽ᵒ̌)ง⁼³₌₃ ", "\n ٩(๑`^´๑)۶ "];
        replier.reply(sender + "님, 도배 경고입니다!! " + emoji[Math.floor(Math.random() * emoji.length)]);
        atTime = new Date();
        return;
    }
    checkPlaster[sender] = msg;
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