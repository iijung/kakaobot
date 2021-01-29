/*

 * PC 기준 최대 텍스트 길이 
   ======================

 * 스크립트 공유
    var Common = Bridge.getScopeOf("common");
    replier.reply(Common.add(3, 7));  
*/

const scriptName = "common";

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

String.prototype.random = function (seq) {
    // Usage1: "1 2 3 4".random()
    // Usage2: "1 2 3 4".random(" ")
    if (seq == "" || seq == undefined) seq = " ";
    var list = this.split(seq);
    return list[Math.floor(Math.random() * list.length)];
};

function random(array, seq) {
    if (seq == "" || seq == undefined) seq = " ";
    if (typeof array == "string") array = array.split(seq);
    return array[Math.floor(Math.random() * array.length)];
}

function rollDice(min, max) {
    return min + Math.ceil(Math.random() * (max - min + 1)) - 1;
}

function rollDices(expr) {
    try {
        var data = expr.replace(/[^0-9+*d]/gi, "");
        data = data.replace(/\*/g, " *");
        data = data.replace(/\+/g, " +");
        data = data.split(" ");

        for (var idx in data) {
            if (data[idx].indexOf("d") == -1) continue;
            var token = data[idx].split("d");
            data[idx] = 0;
            for (j = 0; j < Number(token[0]); j++) data[idx] += rollDice(1, Number(token[1]));
            data[idx] = "+" + data[idx];
        }
        var result = 0;
        for (var value of data) {
            var operator = value[0];
            var number = Number(value.substr(1));
            if (value[0] == "+") result += number;
            if (value[0] == "*") result *= number;
        }
        return result;
    } catch (e) {
        return "오류";
    }
}

function getWeather(location) {
    try {
        if (location.trim() == "날씨") location = "서울 날씨";
        var weather = org.jsoup.Jsoup.connect("https://www.google.com/search?q=" + location.replace(" ", "+")).get().select("#wob_wc");;

        var wob_loc = weather.select("#wob_loc").text(); // 서울특별시
        var wob_dts = weather.select("#wob_dts").text(); // (화요일) 오후 11:00
        var wob_dc = weather.select("#wob_dc").text();   // 안개
        var wob_tm = weather.select("#wob_tm").text();   // -5
        var wob_df = weather.select(".wob_df");          // 주간 날씨 정보

        var result = wob_loc + " 날씨 ⛅";
        result += "\n" + wob_dts;
        result += "\n\n" + wob_dc + " " + wob_tm + "℃";
        result += "\n====================";
        for (var i = 0; i < wob_df.size(); i++) {
            var t = wob_df.get(i);
            result += "\n";
            result += t.select("div>div").get(0).text() + " : ";
            result += t.select("div>img").attr("alt") + " ";
            result += "(" + t.select("div>div>span").get(0).text();
            result += " ~ " + t.select("div>div>span").get(2).text() + "℃)";
        }
        result += "\n====================";
        result += "\n이 정보는 구글 검색 결과를";
        result += "\n바탕으로 제공됩니다.";
        return result;
    } catch (e) {
        return null;
    }
}

function getFortune(sender, msg) {
    try {
        var date = new Date();
        date.setHours(0, 0, 0, 0);

        if (msg.indexOf("내일") != -1) date.setDate(date.getDate() + 1);
        else if (msg.indexOf("어제") != -1) date.setDate(date.getDate() - 1);

        var seed = 1234;
        for (var i = 0; i < sender.length; i++) seed += sender.charCodeAt(i);
        seed += date.getFullYear();
        seed *= date.getMonth() + 1;
        seed *= date.getDate();

        var fortune = {
            'love': parseInt((seed / 258)) % 5 + 1,
            'job': parseInt((seed / 369)) % 5 + 1,
            'luck': parseInt((seed / 987)) % 5 + 1,
            'gold': parseInt((seed / 654)) % 5 + 1,
            'health': parseInt((seed / 321)) % 5 + 1
        }

        var sum = 0;
        for (var i in fortune) sum += fortune[i];
        if (sum / Object.keys(fortune).length < 2) for (var i in fortune) if (fortune[i] < 5) fortune[i]++;

        // render
        var result = "# {0} 님의 {1}월 {2}일 운세 🔮\n".format(sender, date.getMonth() + 1, date.getDate());
        result += "애정 " + "❤".repeat(fortune['love']) + "\n";
        result += "직업 " + "🏆".repeat(fortune['job']) + "\n";
        result += "행운 " + "🍀".repeat(fortune['luck']) + "\n";
        result += "금전 " + "💎".repeat(fortune['gold']) + "\n";
        result += "건강 " + "💊".repeat(fortune['health']) + "\n\n";

        result += "# 행운의 색 🎨\n";
        result += "https://www.htmlcsscolor.com/hex/";
        for (var i = 1; i < 7; i++) result += (parseInt(seed / i) % 16).toString(16);

        return result;
    } catch (e) {
        return null;
    }
}

function getLottoNumber() {
    var result = "당첨 예상번호는...!! 🥁🥁\n";
    for (var i = 0; i < 5; i++) {
        var lotto = [];
        while (lotto.length < 6) {
            var tmp = Math.ceil(Math.random() * 45);
            if (lotto.indexOf(tmp) == -1) lotto.push(tmp);
        }

        lotto.sort(function (a, b) { return a - b; });

        result += "\n{0} {1} {2} {3} {4} {5}".format(
            (lotto[0] < 10 ? "0" : "") + lotto[0],
            (lotto[1] < 10 ? "0" : "") + lotto[1],
            (lotto[2] < 10 ? "0" : "") + lotto[2],
            (lotto[3] < 10 ? "0" : "") + lotto[3],
            (lotto[4] < 10 ? "0" : "") + lotto[4],
            (lotto[5] < 10 ? "0" : "") + lotto[5]
        );
    }
    return result;
}

var Food = {
    menu: {
        "한식": ["불고기", "두루치기", "닭볶음", "쌈밥", "비빔밥", "생선구이", "한우정식", "낙지볶음", "양념게장", "간장게장", "고등어자반", "잡채", "더덕구이", "계란말이", "김치", "총각김치", "깍두기", "열무김치", "우엉조림", "멸치볶음", "소세지야채볶음", "스팸구이", "전복죽", "계란죽", "참치죽", "산적", "표고전", "풋고추전", "육전", "감자전", "해물파전", "김치전", "호박전", "오이소박이", "오징어볶음", "무생채", "북어구이", "너비아니", "두부조림"],
        "탕": ["김치찌개", "순두부찌개", "된장찌개", "부대찌개", "동태찌개", "청국장", "갈비탕", "추어탕", "삼계탕", "해물탕", "게국지", "알탕", "호박찌개", "고추장찌개", "시래기국", "만두국", "떡국"],
        "중식": ["짜장면", "짬뽕", "볶음밥", "탕수육", "마파두부", "양장피", "깐풍기", "유린기", "고추잡채", "군만두", "단무지", "칠리새우", "훠궈", "마라탕", "양꼬치", "양갈비"],
        "일식": ["초밥", "라멘", "낫또", "오니기리", "덮밥", "우동", "야키니쿠", "메밀소바", "돈카츠", "사케동"],
        "양식": ["로제파스타", "봉골레파스타", "크림파스타", "피자", "스테이크", "리조또", "햄버거", "시저샐러드", "빠네"],
        "고기": ["찜닭", "닭갈비", "월남쌈", "샤브샤브", "치킨", "스테이크", "떡갈비", "돼지갈비", "삼겹살", "소고기", "꽃등심", "육회", "양꼬치", "양갈비", "훠궈"],
        "해장": ["북어국", "콩나물국밥", "수육국밥", "순대국", "뼈해장국", "우거지국", "선지해장국", "올갱이국", "매운라면", "물냉면", , "우유", "맥주", "소주", "사케", "컨디션"],
        "간편": ["도시락", "샌드위치", "토스트", "샐러드", "닭가슴살 샐러드", "김밥", "떡볶이", "핫도그", "밥버거", "시리얼", "컵밥", "붕어빵", "핫바", "닭다리", "오뎅", "순대허파간"],
        "기타": ["쌀국수", "팟타이", "카레", "수제비", "칼국수", "아구찜", "베스킨라빈스31", "마카롱", "과자"]
    },

    show: function (msg) {
        var list = new Object();
        for (var key in this.menu) {
            if (msg && msg.indexOf(key) != -1) list[key] = this.menu[key];
        }
        if (Object.keys(list).length == 0) list = this.menu;

        var result = "";
        for (var key in list) {
            result += "########## " + key + " ##########\n";
            result += list[key] + "\n\n";
        }
        return result.slice(0, -2);
    },

    recommend: function (msg) {
        var list = new Array();
        for (var key in this.menu) {
            if (msg && msg.indexOf(key) != -1) list = list.concat(this.menu[key]);
        }
        if (!list.length) {
            var keys = Object.keys(this.menu);
            list = this.menu[keys[(keys.length * Math.random()) << 0]];
        }
        return random(list);
    }
}

var Tarot = {
    cards: [
        "https://ko.wikipedia.org/wiki/%EB%B0%94%EB%B3%B4_(%ED%83%80%EB%A1%9C)", /* O. 바보(The Fool) */
        "https://ko.wikipedia.org/wiki/%EB%A7%88%EC%88%A0%EC%82%AC_(%ED%83%80%EB%A1%9C)", /* I. 마술사(The Magician) */
        "https://ko.wikipedia.org/wiki/%EC%97%AC%EA%B5%90%ED%99%A9", /* II. 여교황(The High Priestess) */
        "https://ko.wikipedia.org/wiki/%EC%97%AC%EC%A0%9C_(%ED%83%80%EB%A1%9C)", /* III. 여제(The Empress) */
        "https://ko.wikipedia.org/wiki/%ED%99%A9%EC%A0%9C_(%ED%83%80%EB%A1%9C)", /* IV. 황제(The Emperor) */
        "https://ko.wikipedia.org/wiki/%EA%B5%90%ED%99%A9_(%ED%83%80%EB%A1%9C)", /* V. 교황(The Hierophant) */
        "https://ko.wikipedia.org/wiki/%EC%97%B0%EC%9D%B8_(%ED%83%80%EB%A1%9C)", /* VI. 연인(The Lovers) */
        "https://ko.wikipedia.org/wiki/%EC%A0%84%EC%B0%A8_(%ED%83%80%EB%A1%9C)", /* VII. 전차(The Chariot) */
        "https://ko.wikipedia.org/wiki/%ED%9E%98_(%ED%83%80%EB%A1%9C)", /* VIII. 힘(Strength) */
        "https://ko.wikipedia.org/wiki/%EC%9D%80%EC%9E%90_(%ED%83%80%EB%A1%9C)", /* IX. 현자(The Hermit) */
        "https://ko.wikipedia.org/wiki/%EC%9A%B4%EB%AA%85%EC%9D%98_%EB%B0%94%ED%80%B4", /* X. 운명의 수레바퀴(Wheel of Fortune) */
        "https://ko.wikipedia.org/wiki/%EC%A0%95%EC%9D%98_(%ED%83%80%EB%A1%9C)", /* XI. 정의(Justice) */
        "https://ko.wikipedia.org/wiki/%EB%A7%A4%EB%8B%AC%EB%A6%B0_%EC%82%AC%EB%9E%8C", /* XII. 매달린 사람(The Hanged Man) */
        "https://ko.wikipedia.org/wiki/%EC%A3%BD%EC%9D%8C_(%ED%83%80%EB%A1%9C)", /* XIII. 죽음(Death) */
        "https://ko.wikipedia.org/wiki/%EC%A0%88%EC%A0%9C_(%ED%83%80%EB%A1%9C)", /* XIV. 절제(Temperance) */
        "https://ko.wikipedia.org/wiki/%EC%95%85%EB%A7%88_(%ED%83%80%EB%A1%9C)", /* XV. 악마(The Devil) */
        "https://ko.wikipedia.org/wiki/%ED%83%91_(%ED%83%80%EB%A1%9C)", /* XVI. 탑(The Tower) */
        "https://ko.wikipedia.org/wiki/%EB%B3%84_(%ED%83%80%EB%A1%9C)", /* XVII. 별(The Star) */
        "https://ko.wikipedia.org/wiki/%EB%8B%AC_(%ED%83%80%EB%A1%9C)", /* XVIII. 달(The Moon) */
        "https://ko.wikipedia.org/wiki/%ED%83%9C%EC%96%91_(%ED%83%80%EB%A1%9C)", /* XIX. 태양(The Sun) */
        "https://ko.wikipedia.org/wiki/%EC%8B%AC%ED%8C%90_(%ED%83%80%EB%A1%9C)", /* XX. 심판(Judgement) */
        "https://ko.wikipedia.org/wiki/%EC%84%B8%EA%B3%84_(%ED%83%80%EB%A1%9C)" /* XXI. 세계(The World) */
    ],
    choose: function () { return random(this.cards); }
}

function getHelp() {
    return "## 도움말 ##"
        + "\n/로또"
        + "\n/타로"
        + "\n/음식메뉴"
        + "\n/음식추천"
        + "\n/r 2d6 * 5 + 30"
        + "\n운세"
        + "\n날씨"
        + "\n확률"
        + "\n주사위"
        + "\nA B C 골라줘 "
        + "\n어때?, 좋아?, 싫어?";
}

/*/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main
//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    /* 고정 명령어 호출 */
    if (msg.indexOf("/로또") == 0) { replier.reply(getLottoNumber()); return; }
    if (msg.indexOf("/타로") == 0) { replier.reply(Tarot.choose()); return; }
    if (msg.indexOf("/음식메뉴") == 0) { replier.reply(Food.show(msg)); return; }
    if (msg.indexOf("/음식추천") == 0) { replier.reply("저는 {0} 추천 드려요! 🍳".format(Food.recommend(msg))); return; }

    if (msg.indexOf("/r ") == 0) { // ex. /r 2d6 * 5 + 30        
        var data = rollDices(msg.replace("/r ", "").trim());
        if (data != null) replier.reply(data);
        return;
    }

    /* 채팅 명령어 호출 */
    if (msg.indexOf("운세") != -1) {
        var data = getFortune(sender, msg);
        if (data != null) replier.reply(data);
        return;
    }

    if (msg.indexOf("골라") != -1) {
        var data = msg.substring(0, msg.indexOf("골라")).trim();
        if (data != "") replier.reply(random(data) + "!!");
        return;
    }

    if (msg.indexOf("날씨") != -1) {
        var data = getWeather(msg);
        if (data != null) replier.reply(data);
        return;
    }

    if (msg.indexOf("확률") != -1) {
        var percent = Math.ceil(Math.random() * 101 * 1000) / 1000 - 1; // 0.000 ~ 100.000
        replier.reply(percent + "%로 나왔습니다!");
        return;
    }

    if (msg.indexOf("주사위") != -1) {
        var data = ["\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"];
        replier.reply(data[rollDice(1, 6) - 1]);
        return;
    }

    /* 음식 메뉴 */
    if (msg.indexOf("메뉴") != -1 && (msg.indexOf("보여줘") != -1 || msg.indexOf("뭐") != -1)) { replier.reply(Food.show(msg)); return; }

    /* 음식 추천 */
    if ((msg.indexOf("뭐") != -1 && (msg.indexOf("먹지") != -1 || msg.indexOf("먹을까") != -1 || msg.indexOf("먹는게") != -1))) {
        replier.reply("저는 {0} 추천 드려요! 🍳".format(Food.recommend(msg))); return;
    }
    if (msg.indexOf("추천") != -1) {
        var list = Object.keys(Food.menu).concat("아침", "점심", "저녁", "야식", "간식", "음식", "먹을");
        for (var idx in list) {
            if (msg.indexOf(list[idx]) != - 1) {
                replier.reply("저는 {0} 추천 드려요! 🍳".format(Food.recommend(msg)));
                return;
            }
        }
    }

    /* 마법의 소라고동 */
    if (msg.indexOf("어때?") != -1 || msg.indexOf("좋아?") != -1 || msg.indexOf("싫어?") != -1 ||
        msg.indexOf("어때요?") != -1 || msg.indexOf("좋아요?") != -1 || msg.indexOf("싫어요?") != -1) {
        var comments = [
            "엄청 좋아요! 🙆", "좋아요! 🙆", "좋을 것 같아요! 🙆",
            "네??", "글쎄요...", "고민되네요..😥",
            "정말 싫어요! 🙅", "싫어요! 🙅", "조금 별로인 것 같아요! 🙅"
        ];
        replier.reply(random(comments));
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