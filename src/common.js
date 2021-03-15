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

function getWeather(replier, location) {
    try {
        if (location.trim() == "날씨") location = "서울 날씨";
        var weather = org.jsoup.Jsoup.connect("https://www.google.com/search?q=" + location.replace(" ", "+")).get().select("#wob_wc");;
        if (weather == undefined || weather == "") return;

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
        replier.reply(result);
    } catch (e) {
        return;
    }
}

function getFortune(sender, msg) {
    try {
        var date = new Date();
        date.setHours(0, 0, 0, 0);

        if (msg.indexOf("내일") != -1) date.setDate(date.getDate() + 1);
        else if (msg.indexOf("어제") != -1) date.setDate(date.getDate() - 1);
        else {
            if ((t = msg.match(/(\d{1,2})월/))) date.setMonth(t[1] - 1);
            if ((t = msg.match(/(\d{1,2})일/))) date.setDate(t[1]);
        }

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
        if (sum / Object.keys(fortune).length < 2.5) for (var i in fortune) if (fortune[i] < 5) fortune[i]++;

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

function remainTime(msg) {
    var now = new Date();
    var time = [now.getFullYear(), now.getMonth() + 1, now.getDate(), 0, 0, 0];

    // parse {yyyy-mm-dd} or {mm-dd}
    if ((t = msg.match(/(\d{4})-(\d{1,2})-(\d{1,2})/))) {
        time[0] = t[1];
        time[1] = t[2];
        time[2] = t[3];
    } else if ((t = msg.match(/(\d{1,2})-(\d{1,2})/))) {
        time[1] = t[1];
        time[2] = t[2];
    }
    // parse {hh:mm:dd} or {hh:mm}
    if ((t = msg.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/))) {
        time[3] = t[1];
        time[4] = t[2];
        time[5] = t[3];
    } else if ((t = msg.match(/(\d{1,2}):(\d{1,2})/))) {
        time[3] = t[1];
        time[4] = t[2];
    }
    // pase {년 월 일 시 분 초}
    if ((t = msg.match(/(\d{4})년/))) time[0] = t[1];
    else if ((t = msg.match(/(\d{2})년/))) time[0] = 20 + t[1];
    if ((t = msg.match(/(\d{1,2})월/))) time[1] = t[1];
    if ((t = msg.match(/(\d{1,2})일/))) time[2] = t[1];
    if ((t = msg.match(/(\d{1,2})시/))) time[3] = t[1];
    if ((t = msg.match(/(\d{1,2})분/))) time[4] = t[1];
    if ((t = msg.match(/(\d{1,2})초/))) time[5] = t[1];

    var end = new Date(Date.UTC(time[0], time[1] - 1, time[2], time[3] - 9, time[4], time[5]));

    var diff = end > now ? end - now : now - end;
    var ss = Math.floor((diff % (1000 * 60)) / 1000);
    var mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var hh = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var dd = Math.floor((diff) / (1000 * 60 * 60 * 24));

    var result = "{0}년 {1}월 {2}일 {3}시 {4}분 {5}초{6}".format(end.getFullYear(), (end.getMonth() + 1), end.getDate(), end.getHours(), end.getMinutes(), end.getSeconds(), end > now ? "까지 " : "부터 ");
    if (dd > 0) result += dd + "일 ";
    if (hh > 0) result += hh + "시 ";
    if (mm > 0) result += mm + "분 ";
    if (ss >= 0) result += ss + "초 ";
    result += end > now ? "남았습니다!" : "지났습니다!";
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

var Calc = {
    help: function () {
        var rtn = "[계산기 도움말]"
            + "\n 도움말"
            + "\n"
            + "\n 제곱 : a ^ b 또는 a ** b"
            + "\n 곱셈 : a * b"
            + "\n 나눗셈 : a / b"
            + "\n 나머지 : a % b"
            + "\n 덧셈 : a + b"
            + "\n 뺄셈 : a - b";
        return rtn;
    },
    /* 연산자 우선 순위 반환 */
    prec: function (op) {
        switch (op) {
            case '^':
                return 1;
            case '*':
            case '/':
            case '%':
                return 2;
            case '+':
            case '-':
                return 3;
        }
        return 999;
    },
    /* 후위 표기식 (Postfix expression) 으로 전환*/
    convert: function (f) {
        f = f.replace(/(\s*)/g, ""); //공백 제거 
        f = f.replace("**", "^");    //거듭제곱 연산자 변경

        var stack = [];
        var result = [];

        for (var i = 0; i < f.length; i++) {
            switch (f[i]) {
                case '(':
                    stack.push(f[i]);
                    break;
                case ')':
                    while ((tmp = stack.pop()) != '(') result.push(tmp);
                    break;
                default:
                    // 피연산자 계산 
                    if ((t = f.slice(i).match(/^(\d+(?:[.]\d+)?)/))) {
                        result.push(t[0]);
                        i += t[0].length - 1;
                        break;
                    }
                    // 연산자 계산 
                    if (stack.length != 0 && this.prec(f[i]) >= this.prec(stack[stack.length - 1])) {
                        result.push(stack.pop());
                    }
                    stack.push(f[i]);
            }
        }
        while (stack.length != 0) result.push(stack.pop());
        return result;
    },
    calc: function (f) {
        try {
            if (f.indexOf("도움말") != -1) return this.help();

            var array = this.convert(f);
            var stack = [];

            for (var value of array) {
                if ((t = value.match(/^(\d+(?:[.]\d+)?)/))) {
                    stack.push(value);
                    continue;
                }
                var b = parseFloat(stack.pop());
                var a = parseFloat(stack.pop());
                if (isNaN(a) || isNaN(b)) throw {};
                switch (value) {
                    case '+': stack.push(a + b); break;
                    case '-': stack.push(a - b); break;
                    case '*': stack.push(a * b); break;
                    case '/': stack.push(a / b); break;
                    case '%': stack.push(a % b); break;
                    case '^': stack.push(Math.pow(a, b)); break;
                }
            }
            return stack[0];
        } catch (e) {
            return null;
        }
    }
}


var Roll20 = {
    history: [],

    help: function () {
        var rtn = "[다이스 도움말]"
            + "\n 도움말"
            + "\n 기록"
            + "\n"
            + "\n /r 2dF (Fate Dice)"
            + "\n -1, 0, 1 주사위를 2번 굴려 더한 합 "
            + "\n"
            + "\n /r 2d6 (Normal Dice)"
            + "\n 6면체 주사위를 2번 굴려 더한 합"
            + "\n"
            + "\n /r 2d6! (Exploding Dice)"
            + "\n 최대값이 나올 때마다 한 번 더 굴려 더한 합"
            + "\n"
            + "\n /r 2d6>2 (>,<) (Reroll Dice)"
            + "\n 설정 이상의 수가 나오면 취소하고 다시 굴려 더한 합"
            + "\n"
            + "\n /r 5d6k2 (Keep Dice)"
            + "\n 가장 높은 값 2개를 합산"
            + "\n"
            + "\n /r 5d6d2 (Down Dice)"
            + "\n 가장 낮은 값 2개를 버린 뒤 합산"
            + "\n"
            + "\n /r 5d6mt (Match Dice)"
            + "\n 같은 값이 2번 이상 나온 개수"
            + "\n"
            + "\n /r 5d6>=3 (>,>=,<=,<) (S/F Dice)"
            + "\n 설정 범위 안으로 나온 개수"
            + "\n"
            + "\n /r 2d6s 후 /r 기록 (오름차순 정렬)"
            + "\n /r 2d6sd 후 /r 기록 (내름차순 정렬)";
        return rtn;
    },
    calc: function (f) {
        try {
            if (f.indexOf("도움말") != -1) return this.help();
            if (f.indexOf("기록") != -1) return this.history.join("\n");

            this.history = [];
            while (((t = f.match(/(\d+)d(\d+)(\S*)/)))) {
                f = f.replace(t[0], this.ndm(t[1], t[2], t[3]));
            }
            f = Calc.calc(f);
            return f;
        }
        catch (e) {
            return this.help();
        }
    },
    ndm: function (n, m, options) {
        var min = 1, max = m;

        var history = ["# " + n + "d" + m + options];
        var result = [];

        // set Fate Dice 
        if (m == "F") { min = -1; max = 1; }

        for (var i = 0; i < n; i++) {
            var dice = rollDice(min, max);

            // Exploding Dice
            while (options.indexOf("!") != -1 && dice == max) {
                history.push(dice + "e");
                result.push(dice);
                dice = rollDice(min, max);
            }

            // Reroll Dice 
            if (((t = options.match(/r([<>])(\d+)/)))) {
                if ((t[1] == "<" && dice <= t[2]) || t[1] == ">" && dice >= t[2]) {
                    history.push(dice + "r");
                    i--;
                    continue;
                }
            }

            history.push(dice);
            result.push(dice);
        }

        /* Dice sorting */
        result.sort(function (a, b) { return parseInt(b) - parseInt(a); });
        if (options.indexOf("sd") != -1) {
            history.sort(function (a, b) { return parseInt(b) - parseInt(a); }); // desc
        } else if (options.indexOf("s") != -1) {
            history.sort(function (a, b) { return parseInt(a) - parseInt(b); }); // asc 
        }
        this.history.push(history);


        /* Dice Pool */
        // Match Dice 
        if (options.indexOf("mt") != -1) {
            var cnt = 0;
            var obj = {};
            result.forEach((x) => { obj[x] = (obj[x] || 0) + 1; });
            for (var key in obj) if (obj[key] > 1) cnt++;
            return cnt;
        }

        // Success & failure Dice      
        if (((t = options.match(/r([<>])(\d+)/)))) options = options.replace(t[0], "");
        if (((t = options.match(/([<>=]{1,2})(\d+)/)))) {
            var cnt = 0;
            for (var value of result) {
                switch (t[1]) {
                    case "<": if (value < t[2]) cnt++; break;
                    case ">": if (value > t[2]) cnt++; break;
                    case "<=": if (value <= t[2]) cnt++; break;
                    case ">=": if (value >= t[2]) cnt++; break;
                }
            }
            return cnt;
        }

        // Keep Dice
        if (((t = options.match(/k(\d+)/)))) {
            for (var i = 0; i < result.length; i++) if (i >= t[1]) result.pop();
        }
        // Down Dice        
        if (((t = options.match(/d(\d+)/)))) {
            for (var i = 0; i < t[1]; i++) result.pop();
        }

        var sum = 0;
        for (var i of result) sum += i;
        return sum;
    }
}

function getHelp() {
    return "## 도움말 ##"
        + "\n/로또"
        + "\n/타로"
        + "\n/계산"
        + "\n/음식메뉴"
        + "\n/음식추천"
        + "\n/디데이 yyyy-mm-dd hh:mm:ss"
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
    if (msg.indexOf("/디데이") == 0) { replier.reply(remainTime(msg)); return; }
    if (msg.indexOf("/음식메뉴") == 0) { replier.reply(Food.show(msg)); return; }
    if (msg.indexOf("/음식추천") == 0) { replier.reply("저는 {0} 추천 드려요! 🍳".format(Food.recommend(msg))); return; }


    if (msg.indexOf("/계산") == 0 && (f = msg.replace("/계산", "").trim())) {
        var data = Calc.calc(f);
        if (data != null) replier.reply(data);
        else replier.reply(Calc.help());
        return;
    }
    if (msg.indexOf("/r") == 0 && (f = msg.replace("/r", "").trim())) {
        var data = Roll20.calc(f);
        if (data != null) replier.reply(data);
        else replier.reply(Roll20.help());
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

    if (msg.indexOf("날씨") != -1) { getWeather(replier, msg); return; }

    if (msg.indexOf("확률") != -1) {
        var percent = Math.ceil(Math.random() * 101 * 1000) / 1000 - 1; // 0.000 ~ 100.000
        replier.reply("예상 확률 " + percent + "%!");
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