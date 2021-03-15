const scriptName = "봇쨩";

var Common = Bridge.getScopeOf("common");

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
    try {
        var time = Number(msg.replace("-타이머", "").trim().replace(/[^0-9]/g, ""));
        replier.reply("타이머 시작!\n" + time + "초 뒤에 타이머가 종료됩니다!");
        java.lang.Thread.sleep(time * 1000);
        replier.reply(time + "초가 경과했습니다.");
    } catch (e) {
        replier.reply("ex) /타이머 10");
    }
}

function getHelp() {
    return Common.getHelp() + "\n"
        + "\n/타이머 10"
        + "\n봇짱, 봇쨩"
        + "\n   안돼 "
        + "\n   하지마 "
        + "\n굿봇, 굿 봇, 구웃봇"
        + "\n밷봇, 밷 봇, 배드봇"
        + "\n~건데, ~껀데"
        + "\n심심해"
        + "\n응원, 위로해줘, 힘들어"
        + "\n바보, 바부"
        + "\n봇쨩 안돼";
}


var atTime = new Date();
var checkPlaster = {};


function isAvailable(room) {
    try {
        var Rooms = JSON.parse(DataBase.getDataBase("Room.json"));
        for (var r of Rooms) if (r['name'] == room && r['bot'] == scriptName) return 1;
    } catch (e) { }
    return 0;
}

/*/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main
//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (!isAvailable(room)) return;

    if (msg.indexOf("/도움말") == 0) { replier.reply(getHelp()); return; }
    if (msg.indexOf("/타이머") == 0) { setTimer(msg, replier); return; }

    if (msg.indexOf("봇짱") != -1 || msg.indexOf("봇쨩") != -1) {

        if (msg.indexOf("안돼") != -1 || msg.indexOf("하지마") != -1) {
            var ment = ["엔 ( ˘•ω•˘ )", "진짜요? (*´□`*｡)", "( o̴̶̷᷄﹏o̴̶̷̥᷅ )", "ᐡඉ́  ̫ ඉ̀ᐡ", "힝 (._.`)"];
            replier.reply(ment.random());
        } else {
            var ment = ["예스 마이 마스터?", "ヽ( ᐛ )ノ", "ヽ(✿ﾟ▽ﾟ)ノ", "ヽ(✿ﾟωﾟ)ノ", " ꧁⍤⃝꧂ ", " ꧁⍢⃝꧂ ", " ꈍ﹃ꈍ ", "ヾ(*'▽'*)"];
            replier.reply(ment.random());
        }
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
        replier.reply(ment.random());
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
    } else if (msg.indexOf("바보") != -1 || msg.indexOf("바부") != -1) {
        var ment = ["저 불렀어요?(빼꼼)", "저 불렀어요? ┃´・ω・｀)", "⁽⁽٩(灬╹ω╹灬)۶⁾⁾"];
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