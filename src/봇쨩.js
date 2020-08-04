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

function isNull(value) {
    return typeof value == "undefined" || value == null || value == "" ? true : false;
}

function getHelp() {
    var rtn_msg = "## " + scriptName + " 도움말##";
    rtn_msg = rtn_msg.concat("\n# 명령어\n");
    rtn_msg = rtn_msg.concat("-도움말\n");
    rtn_msg = rtn_msg.concat("-로또\n");
    rtn_msg = rtn_msg.concat("-타이머 10\n");;
    rtn_msg = rtn_msg.concat("-출퇴근 9 18\n");
    rtn_msg = rtn_msg.concat("-골라줘 A B C D...\n");

    rtn_msg = rtn_msg.concat("\n# 봇 응답\n");
    rtn_msg = rtn_msg.concat("지금 몇\n");
    rtn_msg = rtn_msg.concat("주사위\n");
    rtn_msg = rtn_msg.concat("경기도 날씨\n");
    rtn_msg = rtn_msg.concat("가위, 바위, 보\n");
    rtn_msg = rtn_msg.concat("운세, 오늘 운세, 내일 운세, ...\n");
    rtn_msg = rtn_msg.concat("메뉴 뭐, 메뉴 보여줘\n");
    rtn_msg = rtn_msg.concat("음식 추천, 뭐 먹지, ...\n");

    rtn_msg = rtn_msg.concat("\n# 봇 채팅\n");
    rtn_msg = rtn_msg.concat("봇짱, 봇쨩\n");
    rtn_msg = rtn_msg.concat("굿봇, 굿 봇, 구웃봇\n");
    rtn_msg = rtn_msg.concat("밷봇, 밷 봇, 배드봇\n");
    rtn_msg = rtn_msg.concat("~건데, ~껀데\n");
    rtn_msg = rtn_msg.concat("심심해\n");
    rtn_msg = rtn_msg.concat("응원, 위로해줘, 힘들어\n");
    rtn_msg = rtn_msg.concat("어때?, 좋아?, 싫어?\n");
    return rtn_msg;
}

function showDate(date) {
    var yy = date.getFullYear();
    var mo = date.getMonth() + 1;
    var dd = date.getDate();
    var week = ["일", "월", "화", "수", "목", "금", "토"];
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    return yy + "년 " + mo + "월 " + dd + "일 (" + week[date.getDay()] + ")\n" + hh + "시 " + mm + "분 " + ss + "초" + "입니다!";
}

function rollDice() {
    var rtn_msg = "";
    switch (Math.ceil(Math.random() * 6)) {
        case 1: rtn_msg = "\u2680"; break;
        case 2: rtn_msg = "\u2681"; break;
        case 3: rtn_msg = "\u2682"; break;
        case 4: rtn_msg = "\u2683"; break;
        case 5: rtn_msg = "\u2684"; break;
        case 6: rtn_msg = "\u2685"; break;
    }
    return rtn_msg;
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
    return ment[Math.floor(Math.random() * ment.length)];
}

function getWeather(replier, msg) {
    var weather = org.jsoup.Jsoup.connect("https://www.google.com/search?q=" + msg.replace(" ", "+")).get().select("#wob_wc");;
    if (weather == undefined || weather == "") return;

    var wob_loc = weather.select("#wob_loc").text();
    var wob_dts = weather.select("#wob_dts").text();
    var wob_dc = weather.select("#wob_dc").text();
    var wob_tm = weather.select("#wob_tm").text();

    var rtn_msg = wob_loc + " 날씨 ⛅";
    rtn_msg = rtn_msg.concat("\n" + wob_dts + "\n");
    rtn_msg = rtn_msg.concat("\n" + wob_dc + " " + wob_tm + "℃");

    var wob_d = weather.select("#wob_d").select(".wob-dtl");
    rtn_msg = rtn_msg.concat("\n강수확률 : " + wob_d.select("#wob_pp").text());
    rtn_msg = rtn_msg.concat("\n습도 : " + wob_d.select("#wob_hm").text());
    rtn_msg = rtn_msg.concat("\n풍속 : " + wob_d.select("#wob_ws").text());


    rtn_msg = rtn_msg.concat("\n\n=-=-=-=-=-=-=-=-=-=-=-=-=");
    var wob_df = weather.select(".wob_df");
    for (var i = 0; i < wob_df.size(); i++) {
        var t = wob_df.get(i);
        rtn_msg = rtn_msg.concat("\n");
        rtn_msg = rtn_msg.concat(t.select("div>div").get(0).text() + " : ");
        rtn_msg = rtn_msg.concat(t.select("div>img").attr("alt") + " ");
        rtn_msg = rtn_msg.concat("(" + t.select("div>div>span").get(0).text());
        rtn_msg = rtn_msg.concat(" ~ " + t.select("div>div>span").get(2).text() + "℃)");
    }
    replier.reply(rtn_msg);
}

function getFortune(sender, msg) {
    var rtn_msg = "";
    var seed = 970119;
    for (var i = 0; i < sender.length; i++) seed *= sender.charCodeAt(i);

    var date = new Date();
    seed *= date.getFullYear();
    seed *= date.getMonth() + 1;
    if (msg.indexOf("오늘") != -1 && msg.indexOf("내일") == -1) {
        rtn_msg = "# " + sender + "님의 오늘 운세 #";
        seed *= date.getDate();
    } else if (msg.indexOf("내일") != -1 && msg.indexOf("오늘") == -1) {
        rtn_msg = "# " + sender + "님의 내일 운세 #";
        date.setDate(date.getDate() + 1);
        seed *= date.getDate();
    } else {
        rtn_msg = "# " + sender + "님의 종합 운세 #";
        seed += 58;
    }

    var love = parseInt((seed = seed / 258)) % 5 + 1;
    var job = parseInt((seed = seed / 369)) % 5 + 1;
    var luck = parseInt((seed = seed / 987)) % 5 + 1;
    var gold = parseInt((seed = seed / 654)) % 5 + 1;
    var health = parseInt((seed = seed / 321)) % 5 + 1;

    if ((love + job + luck + gold + health) / 5 < 2) { love++; job++; luck++; gold++; health++; }

    if (love > 5) love = 5;
    if (job > 5) job = 5;
    if (luck > 5) luck = 5;
    if (gold > 5) gold = 5;
    if (health > 5) health = 5;

    rtn_msg = rtn_msg.concat("\n애정 "); while (love > 0) { rtn_msg = rtn_msg.concat("❤"); love--; }
    rtn_msg = rtn_msg.concat("\n직업 "); while (job > 0) { rtn_msg = rtn_msg.concat("🏆"); job--; }
    rtn_msg = rtn_msg.concat("\n행운 "); while (luck > 0) { rtn_msg = rtn_msg.concat("🍀"); luck--; }
    rtn_msg = rtn_msg.concat("\n금전 "); while (gold > 0) { rtn_msg = rtn_msg.concat("💎"); gold--; }
    rtn_msg = rtn_msg.concat("\n건강 "); while (health > 0) { rtn_msg = rtn_msg.concat("💊"); health--; }

    rtn_msg = rtn_msg.concat("\n\n# 행운의 색 🎨 #");
    rtn_msg = rtn_msg.concat("\nhttps://www.htmlcsscolor.com/hex/");
    for (var i = 1; i < 7; i++) rtn_msg = rtn_msg.concat((parseInt(seed / i) % 16).toString(16));

    return rtn_msg;
}

function getLottoNumber() {
    var rtn_msg = "당첨 예상번호는...!! 🥁🥁\n\n";

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

        rtn_msg = rtn_msg.concat("{0} {1} {2} {3} {4} {5}\n".format(
            (lotto[0] < 10 ? "0" : "") + lotto[0],
            (lotto[1] < 10 ? "0" : "") + lotto[1],
            (lotto[2] < 10 ? "0" : "") + lotto[2],
            (lotto[3] < 10 ? "0" : "") + lotto[3],
            (lotto[4] < 10 ? "0" : "") + lotto[4],
            (lotto[5] < 10 ? "0" : "") + lotto[5])
        );
    }
    return rtn_msg.slice(0, -1);
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

    var select = content.split(" ");
    for (var idx in select) {
        if (select[idx] == "") select.splice(idx, 1);
    }
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

// Food 
var FoodList = {
    "한식": ["불고기", "두루치기", "닭볶음", "쌈밥", "비빔밥", "생선구이", "한우정식", "낙지볶음", "양념게장", "간장게장", "고등어자반", "잡채", "더덕구이", "계란말이", "김치", "총각김치", "깍두기", "열무김치", "우엉조림", "멸치볶음", "소세지야채볶음", "스팸구이", "전복죽", "계란죽", "참치죽", "산적", "표고전", "풋고추전", "육전", "감자전", "해물파전", "김치전", "호박전", "오이소박이", "오징어볶음", "무생채", "북어구이", "너비아니", "두부조림"],
    "탕": ["김치찌개", "순두부찌개", "된장찌개", "부대찌개", "동태찌개", "청국장", "갈비탕", "추어탕", "삼계탕", "해물탕", "게국지", "알탕", "호박찌개", "고추장찌개", "시래기국", "만두국", "떡국"],
    "중식": ["짜장면", "짬뽕", "볶음밥", "탕수육", "마파두부", "양장피", "깐풍기", "유린기", "고추잡채", "군만두", "단무지", "칠리새우", "훠궈", "마라탕", "양꼬치", "양갈비"],
    "일식": ["초밥", "라멘", "낫또", "오니기리", "덮밥", "우동", "야키니쿠", "메밀소바", "돈카츠", "사케동"],
    "양식": ["로제파스타", "봉골레파스타", "크림파스타", "피자", "스테이크", "리조또", "햄버거", "시저샐러드", "빠네"],
    "고기": ["찜닭", "닭갈비", "월남쌈", "샤브샤브", "치킨", "스테이크", "떡갈비", "돼지갈비", "삼겹살", "소고기", "꽃등심", "육회", "양꼬치", "양갈비", "훠궈"],
    "해장": ["북어국", "콩나물국밥", "수육국밥", "순대국", "뼈해장국", "우거지국", "선지해장국", "올갱이국", "매운라면", "물냉면", , "우유", "맥주", "소주", "사케", "컨디션"],
    "간편": ["도시락", "샌드위치", "토스트", "샐러드", "닭가슴살 샐러드", "김밥", "떡볶이", "핫도그", "밥버거", "시리얼", "컵밥", "붕어빵", "핫바", "닭다리", "오뎅", "순대허파간"],
    "기타": ["쌀국수", "팟타이", "카레", "수제비", "칼국수", "아구찜", "베스킨라빈스31", "마카롱", "과자"]
};

function showFoodList(msg) {
    var rtn_msg = "";
    for (var key in FoodList) {
        if (msg.indexOf(key) != -1) {
            rtn_msg = rtn_msg.concat("########## " + key + " ##########\n");
            rtn_msg = rtn_msg.concat(FoodList[key] + "\n\n");
        }
    }
    if (rtn_msg == "") {
        for (var key in FoodList) {
            rtn_msg = rtn_msg.concat("########## " + key + " ##########\n");
            rtn_msg = rtn_msg.concat(FoodList[key] + "\n\n");
        }
    }
    return rtn_msg.slice(0, -2);
}

function recommendFood(msg) {
    var Foods = new Array();
    for (var key in FoodList) {
        if (msg.indexOf(key) != -1) Foods = Foods.concat(FoodList[key]);
    }

    if (!Array.isArray(Foods) || !Foods.length) {
        var keys = Object.keys(FoodList);
        Foods = FoodList[keys[(keys.length * Math.random()) << 0]];
    }
    return "저는 " + Foods[Math.floor(Math.random() * Foods.length)] + " 추천 드려요! 🍳";
}


var atTime = new Date();
var checkPlaster = {};

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    //////////////////////////////////////////////////////////////////////////////////////
    // command
    //////////////////////////////////////////////////////////////////////////////////////
    if (msg == "-도움말") {
        replier.reply(getHelp()); return;
    }

    if (msg.indexOf("-로또") == 0) {
        replier.reply(getLottoNumber()); return;
    }

    if (msg.indexOf("-타이머") == 0) {
        replier.reply(setTimer(msg, replier)); return;
    }

    if (msg.indexOf("-출퇴근") != -1) {
        replier.reply(remainRushHour(msg)); return;
    }

    if (msg.indexOf("-골라줘") == 0) {
        replier.reply(chooseObject(room, msg, sender)); return;
    }

    //////////////////////////////////////////////////////////////////////////////////////
    // half command
    //////////////////////////////////////////////////////////////////////////////////////
    if (msg.indexOf("지금 몇") != -1) {
        replier.reply(showDate(new Date())); return;
    }

    if (msg.indexOf("주사위") != -1) {
        replier.reply(rollDice()); return;
    }

    if (msg.indexOf("날씨") != -1) {
        getWeather(replier, msg); return;
    }

    if (msg == "가위" || msg == "바위" || msg == "보") {
        var RSP = ["가위", "바위", "보"];
        var com = RSP[Math.floor(Math.random() * RSP.length)];
        replier.reply(com);
        replier.reply(playRockScissorsPaper(room, msg, sender, com));
        return;
    }

    if (msg.indexOf("운세") != -1) {
        replier.reply(getFortune(sender, msg)); return;
    }

    if (msg.indexOf("메뉴") != -1 && (msg.indexOf("보여줘") != -1 || msg.indexOf("뭐") != -1)) {
        replier.reply(showFoodList(msg)); return;
    }

    if ((msg.indexOf("뭐") != -1 && (msg.indexOf("먹지") != -1 || msg.indexOf("먹을까") != -1 || msg.indexOf("먹는게") != -1)) || (msg.indexOf("추천") != -1)) {
        if (msg.indexOf("추천") != -1) {
            var flag = 0;
            for (var idx in FoodList) { if (msg.indexOf(idx) != - 1) flag = 1; }

            var list = ["아침", "점심", "저녁", "야식", "간식", "음식", "먹을"];
            for (var idx in list) { if (msg.indexOf(list[idx]) != - 1) flag = 1; }

            if (flag == 0) return;
        }
        replier.reply(recommendFood(msg)); return;
    }

    //////////////////////////////////////////////////////////////////////////////////////
    // not command
    //////////////////////////////////////////////////////////////////////////////////////
    if (msg.indexOf("봇짱") != -1 || msg.indexOf("봇쨩") != -1) {
        var ment = ["예스 마이 마스터?", "ヽ( ᐛ )ノ", "ヽ(✿ﾟ▽ﾟ)ノ", "ヽ(✿ﾟωﾟ)ノ", " ꧁⍤⃝꧂ ", " ꧁⍢⃝꧂ ", " ꈍ﹃ꈍ ", "ヾ(*'▽'*)"];
        replier.reply(ment[Math.floor(Math.random() * ment.length)]);
    }

    // Thanks
    if ((isGroupChat && Math.ceil(Math.random() * 1000) == 701) || (!isGroupChat && Math.ceil(Math.random() * 100) == 12)) {
        var ment = ["항상 감사드려요 💕", "사랑해요 💕", "앞으로도 잘 부탁드려요 💕"];
        replier.reply(sender + "님, " + ment[Math.floor(Math.random() * ment.length)]);
    }

    // chatting
    if ((msg.indexOf("좋은") != -1 && msg.indexOf("아침") != -1) || (msg.indexOf("굿모닝") != -1)) {
        ment = [sender + "님, 좋은 아침이에요!", sender + "님, 굿모닝♬", sender + "님, 오늘 하루도 화이팅이에요!"];
        replier.reply(ment[Math.floor(Math.random() * ment.length)]);
    }
    if (msg.indexOf("좋은") != -1 && msg.indexOf("저녁") != -1) {
        ment = [sender + "님, 좋은 저녁이에요!", sender + "님, 오늘 하루도 수고 많으셨어요!"];
        replier.reply(ment[Math.floor(Math.random() * ment.length)]);
    }
    if ((msg.indexOf("좋은") != -1 && (msg.indexOf("꿈") != -1)) || (msg.indexOf("굿밤") != -1) || (msg.indexOf("잘자요") != -1)) {
        ment = ["제 꿈 꿔요...♥", "좋은 꿈 꿔요💕", " ꈍ﹃ꈍ ", "쫀밤!", "굿밤 🐑", " (¦ꒉ[▓▓] zZ"];
        replier.reply(ment[Math.floor(Math.random() * ment.length)]);
    }

    if (msg.indexOf("안녕") != -1) {
        ment = [sender + "님, 안녕하세요!!", "하이요!!", "하이하이"];
        replier.reply(ment[Math.floor(Math.random() * ment.length)]);
    }

    if (msg.indexOf("심심해") != -1) {
        var ment = ["밀린 과제나 업무가 있지는 않나요?", "오늘도 열공!! ٩(*•̀ᴗ•́*)و ", "운동! 운동! ୧(๑•̀ㅁ•́๑)૭✧", "저랑 같이 놀아요\n(っ˘▽˘)(˘▽˘)˘▽˘ς)", "_(-ω-`_)⌒)_"];
        replier.reply(ment[Math.floor(Math.random() * ment.length)]);
    }

    if (msg.indexOf("응원") != -1 || msg.indexOf("위로해줘") != -1 || msg.indexOf("힘들어") != -1) {
        var ment = ["힘내세요! ❀.(*´▽`*)❀.", "충분히 잘하고 계세요!", "҉*( ‘ω’ )/*҉", "아자! 아자! (ง •̀ω•́)ง✧", "마법 걸어줄게요\nଘ(੭*ˊᵕˋ)੭* ੈ✩‧₊˚❛ ֊ ❛„ 뾰로롱₊୭*ˈ ", "전 힘들 때 빗속에서 힙합을 춰요\n｀、、｀ヽ｀ヽ｀、、ヽヽ、｀、\nヽ｀ヽ｀ヽヽ｀ヽ｀、｀ヽ｀、ヽ\n｀｀、ヽ｀ヽ｀、ヽヽ｀ヽ、｀ヽ\n、ヽヽ｀ヽ｀ヽ、ヽ、｀ヽ｀ヽ、\nヽ｀ヽ｀ヽ、ዽ｀｀、ヽ｀、ヽヽ"];
        replier.reply(ment[Math.floor(Math.random() * ment.length)]);
    }

    if (msg.indexOf("어때?") != -1 || msg.indexOf("좋아?") != -1 || msg.indexOf("싫어?") != -1) {
        ment = ["엄청 좋아요! 🙆", "좋아요! 🙆", "싫어요! 🙅", "조금 별로인 것 같아요! 🙅", "고민되네요..😥", "다시 물어봐주세요!", sender + "님이 고르신 걸로! 0.<"];
        replier.reply(ment[Math.floor(Math.random() * ment.length)]);
    }


    if (msg.indexOf("굿봇") != -1 || msg.indexOf("굿 봇") != -1 || msg.indexOf("구웃봇") != -1) {
        var ment = ["(◍•ᴗ•◍)♡ ✧*。", "(･ω<)☆", " ꉂꉂ(ᵔᗜᵔ*) ", "°˖✧◝(⁰▿⁰)◜✧˖°", "(๑ゝڡ◕๑)", "（*´▽`*)", "(♡´艸`)", "ꈍ .̮ ꈍ", "( • ̀ω•́  )✧", "٩(๑•̀o•́๑)و", "(*´˘`*)♡", "٩(*´◒`*)۶♡"];
        replier.reply(ment[Math.floor(Math.random() * ment.length)]);
    } else if (msg.indexOf("밷봇") != -1 || msg.indexOf("밷 봇") != -1 || msg.indexOf("배드봇") != -1) {
        var ment = ["ŏ̥̥̥̥םŏ̥̥̥̥", "( ´ｰ`)", "(ó﹏ò｡)", " ˃̣̣̣̣̣̣︿˂̣̣̣̣̣̣ ", ":3c", "(இ﹏இ`｡)", "( ･×･)", "｡ﾟﾟ(*´□`*｡)°ﾟ｡"];
        replier.reply(ment[Math.floor(Math.random() * ment.length)]);
    } else if (msg.indexOf("껀데") > 0 || msg.indexOf("건데") > 0) {
        var ment = ["(｡•́ - •̀｡)", "(._. )", "...", "(・-・*)♪", "๑°⌓°๑"];
        replier.reply(ment[Math.floor(Math.random() * ment.length)]);
    }

    // 도배 체크
    if (new Date().valueOf() < atTime.valueOf() + 10000) return; // 도배 경고 후, 일정 시간 동안 도배 확인 X
    if (checkPlaster[sender] == msg) {
        msg = msg.replace(/ㅋ/g, "");
        if (msg == "" || msg == "이모티콘을 보냈습니다." || msg == "사진을 보냈습니다." || msg == "동영상을 보냈습니다.") return;
        if (msg.indexOf("사진 ") == 0 && msg.indexOf("장을 보냈습니다.") != -1) return;
        if (msg.indexOf("#") == 0) return;

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