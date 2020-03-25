# 메신저 봇 개발
카카오톡에서 구동 가능한 자동응답 봇을 만들기 위한 개발 가이드입니다.

자동응답 어플 중 하나인 [메신저봇R](https://violet.develope.kr)을 사용하여 진행합니다. 
 
 <br />

## 환경구성  
> 안드로이드 휴대폰일 경우, 환경 구성 생략 가능합니다. 

아이폰에서는 메신저봇R과 같은 자동응답 어플이 지원되지 않습니다. <br />
따라서, 휴대폰에서 사용할 수 없으므로 다음과 같이 PC에 개발환경 구성이 필요합니다.  

1. PC 에서 모바일 애플리케이션을 구동하기 위한 앱플레이어를 하나 다운 받습니다. 
    * [LD 앱플레이어](https://kr.ldplayer.net/)
    * [NOX 앱플레이어](https://kr.bignox.com/)

3. 앱 플레이어 내부에서 자동응답을 수행할 카카오톡 계정 로그인을 시도합니다.
   * 다른 기기에서 카카오톡 로그인 시, 단톡방이나 대화내용 등이 사라므로 다음과 같이 백업을 추천드립니다. 
    ```
    # 기존 기기에서 수행
    1. 카카오톡 접속
    2. 더보기 > 설정 > 채팅 > 대화 백업
    3. 백업 패스워드 입력

    # 새로운 기기에서 수행
    1, 카카오톡 접속
    1. 복원하기
    2. 복원 패스워드 입력

    ※ 오래된 미디어 파일이나 비밀 채팅 및 오픈 채팅의 대화 내용은 백업이 되지 않습니다. 
    ```
 
 <br />

---

## 애플리케이션 설치
자동 응답을 위해 필요한 앱은 총 3개 입니다.  <br />
구글 플레이스토어를 통해 앱을 설치해야하므로 구글 계정이 필요합니다. 


|                   용도                   | 간단 설명                           |
| :------------------------------------: | :------------------------------ |
|                  카카오톡                  | 알림센터에 메시지를 표시한다. (알림 팝업)        |
|                 메신저봇R                  | 알림센터에서 메시지를 읽어와 답장을 보낸다.        |
| Wear OS by Google <br> Galaxy Wearable | 자동 응답 어플로 부터 요청받은 답장을 실제로 전달한다. |

1. 카카오톡
   ```
   카카오톡 알림이 꺼져 있거나 채팅방을 보고 있는 경우, 자동응답이 실행되지 않습니다.   
   알림센터로 부터 메시지를 읽어와 답장을 보내야하기 때문에 알림 팝업 설정이 꼭 필요합니다.

   1. 카카오톡 접속
   2. 더보기 > 설정 > 알림
      * 메시지 알림 : ON
      * 알림 표시 > 알림 팝업 :  항상 받기
      * 알림 센터에 메시지 표시 
          - 모든 채팅방 : 모든 채팅방에 자동 응답이 수행됨 
          - 알림 켠 채팅방만 : 알림을 켠 채팅방만 자동 응답이 수행됨


    ※ 카카오톡 부계정을 생성하는 방법
      1. 다이소 국민 유심(5000원)을 구입합니다.
         - 유심 구입 시, 뒷면의 가입 가능한 요금제를 확인합니다.
         - LG U+ 이야기알뜰 요금제의 경우, 2년간 월 통신비 0원입니다.
      2. 설명서를 따라 공기계에 유심을 삽입한 후 새로운 휴대폰 번호를 개통합니다. 
      3. 이후 와이파이만 연결해서 사용하면 월 통신비 0원! 
         - 3개월간 통화내역이 없을 경우, 요금제가 자동 변경되므로 주의바랍니다.
   ```

2. 메신저봇R
   ```
   구글 플레이스토어에서 설치 가능한 다른 자동 응답 어플을 사용하셔도 되지만, 사용 언어나 API에 차이가 있을 수 있습니다.

   알림 팝업을 읽어올 권한이 필요합니다. 
   첫 실행 시 권한 설정 화면이 출력되지만 설정하지 못한 경우, 다음과 같이 권한을 부여합니다.
   
   # 알림 읽기 권한 
   1. 메신저봇R 접속
   2. 우측 상단 > 설정 > 공용 설정 > 기타 > 알림 읽기 권한
        - 메신저봇 활성화 
        - Wear OS by Google 또는 Galaxy Wearable 활성화
   ```

3. Wear OS by Google 또는 Galaxy Wearable
   ```
   답장을 보내기 위해 사용되는 어플입니다. 둘 중 하나가 설치만 되어있으면 됩니다. 
   스마트워치에서 답장을 보낼 때 사용하는 어플이기도 합니다.
   ```

 <br />

---

## 메신저봇R 화면 구성
<img src="./images/main.png" height="500"> </img><img src="./images/main_bot.png" height="500"></img> <img src="./images/edit.png" height="500"> </img>

**메인 화면** 

`추가` 버튼을 클릭하여 새로운 스크립트를 생성합니다. 

```
- 활성화 : 모든 스크립트에 대하여 활성화/비활성화 여부를 지정합니다.
- 추가(+) : 새로운 스크립트를 추가합니다. (스크립트 ≒ 봇)
```

<br />

**메인화면 - test 스크립트** 
```
- 활성화 : 해당 스크립트에 대하여 활성화/비활성화 여부를 지정합니다. <br>

- 새로고침 : 스크립트를 컴파일합니다. (컴파일: 소스코드를 실행파일로 변환하는 작업)
- 연필모양 : 스크립트를 편집합니다. 
- 채팅모양 : 스크립트가 잘 구동하는지 테스트합니다.
     * 디폴트 Room 이름 : DEBUG ROOM
     * 디폴트 Sender 이름 : DEBUG SENDER
- 막대모양 : 스크립트에서 출력되는 로그 메시지를 확인합니다.
- 재생버튼 : ??? 
- 설정버튼 : 스크립트에 대한 개별 설정입니다.
```

 <br />

**편집화면 - test 스크립트** 
```
- 폴더모양 : `저장` 또는 `저장하고 컴파일`
- 연필모양 : 되돌아가기 등 편집 도구
- 설정버튼 : ???
```

 <br />

---

## 메신저봇R 개발
메신저봇R 에서 봇 개발을 하기 위해서는 `JavaScript`를 사용하며, 소스코드 수정 후 반드시 우측 상단의 폴더를 클릭하여 `저장하고 컴파일`을 수행해야 합니다.

### 간단한 응답 
> 채팅방 이름(room)과 메시지(msg)를 확인하지 않을 경우, 모든 채팅방의 모든 메시지에 답장을 보내므로 주의바랍니다! 

```javascript
funciton response(room,msg,sender,isGroupChat, replier, imageDB, packageName) { 

    // 채팅방 이름이 "DEBUG ROOM" 이 아닐 경우, response 함수 종료
    if(room != "DEBUG ROOM") return; 


    // 메시지가 "하이"일 경우, "Hi!" 답장 
    if(msg == "하이") {
        replier.reply("Hi!"); 
    }

    // 메시지가 "안녕"일 경우, "ㅇㅇ님, 안녕하세요!" 답장
    if(msg == "안녕") {
        replier.reply(sender + "님, 안녕하세요!"); 
    }
  }
}
```
 <br />

### JavaScript 간단 가이드

```javascript
// 변수 선언
var 변수이름 = 값;

// 콘솔 출력
puts(메세지);   // puts("hi"); puts(변수명); puts("I'm " + name); ...

// 조건문
if (조건문1) {
	명령어1;
} else if (조건문2) {
	명령어2;
} else if (조건문3) {
	명령어3;
} else {
	명령어4;
}

// 반복문 (for)
for (var i = 0; i < 5; i++) {
	명령문;
}

// 반복문 (while)
var i = 0;
while (i < 5) {
	명령문;
	i++;
}

// 반복문 (do-while)
var i = 0;
do{
	명령문;
	i++;
} while(i <= 5);

// 함수
function add(a,b) {
	return a + b;
}
```


 <br />

### JavaScript 문자열 조작 함수 간단 가이드

`trim()` - 문자열의 좌우 공백을 제거해서 반환한다.
```javascript
var msg = "     봇 개발 테스트용 메시지    ";
replier.reply(msg.trim());               // "봇 개발 테스트용 메시지" 반환 
```

`indexOf("문자열")` - 찾고 싶은 문자열의 첫번째 위치를 반환한다. (없으면, -1 반환)
```javascript
//         012345
var msg = "abcabc";
replier.reply(msg.indexOf("a"));          //  0 반환
replier.reply(msg.indexOf("c"));          //  2 반환
replier.reply(msg.indexOf("f"));          // -1 반환
```

`lastIndexOf("문자열")` - 찾고 싶은 문자열의 뒤에서부터의 첫번째 위치를 반환한다. (없으면, -1 반환)
```javascript
//         012345
var msg = "abcabc";
replier.reply(msg.lastIndexOf("a"));      //  3 반환
replier.reply(msg.lastIndexOf("c"));      //  5 반환
replier.reply(msg.lastIndexOf("f"));      // -1 반환
```

`split("문자열")` - 기준 문자열이 있는 곳을 모두 잘라서 배열로 반환한다.
```javascript
var msg = "1 2 3 4 5";
replier.reply(msg.split(" "));            // "1,2,3,4,5" 반환
replier.reply(msg.split(" ")[0]);         // "1" 반환
replier.reply(msg.split(" ")[3]);         // "4" 반환

var msg = "가나 다라 마바 사아 자차 카타 파하";
replier.reply(msg.split(" "));            // "가나,다라,마바,사아,자차,카타,파하" 반환 
replier.reply(msg.split(" ")[0]);         // "가나" 반환
replier.reply(msg.split(" ")[3]);         // "사아" 반환
```

`substring(시작위치, 종료위치+1)` - 문자열의 원하는 위치만 잘라서 반환한다.
```javascript
//         012345
var msg = "abcabc";
replier.reply(msg.substring(1,3));        // "bc"
replier.reply(msg.substring(3,6));        // "abc"
```

`replace("문자열1","문자열2")` - 문자열1을 문자열2로 치환하여 반환한다.
```javascript
var msg = "abcabc"
replier.reply(msg.replace("a","A"));      // "Abcabc" 반환 (처음 발견된 문자열1만 변경)
replier.reply(msg.replace(/bc/g,"BC"));   // "aBCaBC" 반환 (모든 문자열1이 변경)
	// # 정규표현식 설명
    // - /bc : 문자열 bc 를 대상으로 
	// - /g : 모든 문자열을 치환한다.
	// - /i : 대소문자 구분없이 치환한다.
  }
}
```

 <br />

### 문자열을 조작하여 응답
```javascript
funciton response(room,msg,sender,isGroupChat, replier, imageDB, packageName) { 
    if(room != "DEBUG ROOM") return; 

    // 메시지가 "안녕"으로 시작할 경우, "안녕1" 응답
    if(msg.indexOf("안녕") == 0) {
        replier.reply("안녕1"); 
    }

    // 메시지에 "안녕"이 포함된 경우, "안녕2" 응답 
    if(msg.indexOf("안녕") != -1) {
        replier.reply("안녕2"); 
    }

    // 메시지에 "봇쨩"이 포함된 경우, sender의 이름 + "님" 으로 변경하여 똑같이 응답
    if(msg.indexOf("봇쨩") != -1) {
        replier.reply(msg.replace("봇쨩", sender + "님")); 

        // 아리 : 봇쨩! 안녕?
        // 봇쨩 : 아리님! 안녕? 
    }

```

 <br />

#### 랜덤 출력

```javascript
funciton response(room,msg,sender,isGroupChat, replier, imageDB, packageName) { 
    if(room != "DEBUG ROOM") return; 

    // 주사위가 포함된 경우, 주사위 굴리기 
    if (msg.indexOf("주사위") != -1) {
        var dice = Math.ceil(Math.random() * 6);    // 1 ~ 6 랜덤 숫자 
        switch (dice) {
            case 1: replier.reply("\u2680"); break;
            case 2: replier.reply("\u2681"); break;
            case 3: replier.reply("\u2682"); break;
            case 4: replier.reply("\u2683"); break;
            case 5: replier.reply("\u2684"); break;
            case 6: replier.reply("\u2685"); break;
        }
    }

    // --골라줘로 시작하는 경우, 
    if (msg.indexOf("--골라줘") == 0) {
        var content = msg.replace("--골라줘", "").trim(); // 좌우 공백 제거 
        if (content == "") return; // 내용이 없을 경우, 종료

        var array = content.split(" "); // 띄어쓰기를 기준으로 나눠 배열 array 생성 
        for (var idx in array) {
            if (array[idx] == "") array.splice(idx, 1); // 값이 없을 경우, 배열에서 제거
        }
        replier.reply(array[Math.ceil(Math.random() * array.length) -1] + "!!");
    }
}
```
#### 웹페이지 크롤링

<br />

**가져올 데이터 구조 확인** 

크롬 브라우저에서 `F12`를 클릭해 개발자 도구를 연 뒤 좌측 상단의 버튼을 클릭합니다. <br />
커서를 사용하여 가져오길 원하는 부분을 클릭하면 해당 데이터의 HTML 소스코드를 우측에서 확인할 수 있습니다. 

<img src="./images/chrome_developer_tool1.png" width="100%">
<img src="./images/chrome_developer_tool2.png" width="100%">


<br />

**JSOUP을 사용한 간단한 데이터 크롤링** 
| 구분   | HTML 소스코드                                        | 예시                                                              |
| ---- | ------------------------------------------------ | --------------------------------------------------------------- |
| 전체   | HTML 소스 전체                                       | var doc = org.jsoup.Jsoup.connect("https://github.com/").get(); |
| 클래스  | \<div class="test_class"\> 의 값                   | var element = doc.select(".test_class");                        |
| 아이디  | \<p id="test_id" alt="100"\> 의 값                 | var element = doc.select("#test_id");                           |
| 속성값  | \<p id="test_id" alt="100"\> 의 값                 | var element = doc.select("#test_id").attr("alt");               |
| 하위태그 | \<div class="test"\>\<a\>...\<\/a\>\<\/div\> 의 값 | var element = doc.select("div.test a");                         |
| 하위태그 | <ul\>\<li\>...\<\/li\>\<\/ul\> 의 값               | var element = doc.select("ul>li");                              |  |  |


```javascript
funciton response(room,msg,sender,isGroupChat, replier, imageDB, packageName) { 

    var reply_msg = ""; // 응답에 사용될 메시지 변수 

    // 특정 웹 페이지로부터 HTML 소스코드 가져오기
    var weather = org.jsoup.Jsoup.connect("https://weather.naver.com/air/airFcast.nhn").get();

    // 클래스가 list_air_inn인 데이터들을 가져와서 반복을 돌린다. 
    var list_air_inn = weather.select(".list_air_inn");
    for (var i = 0; i < list_air_inn.size(); i++) {        
        var air_inn = list_air_inn.get(i); // i 번째 데이터 가져오기        
        /* 추출된 데이터 air_inn 예시 
        <h5><a href="#">오늘 오후</a></h5>
        <ul>
	        <li><span>미세먼지</span> <strong class="normal">보통</strong></li>
	        <li><span>초미세먼지</span> <strong class="good">좋음</strong></li>
	        <li><span>오존</span> <strong class="normal">보통</strong></li>
	        <li><span>자외선</span> <strong class="normal">보통</strong></li>
	        <li><span>황사</span> <strong class="normal">보통</strong></li>
        </ul>
        */

        // [오늘 오후]
        reply_msg = reply_msg.concat("[" + air_inn.select("h5>a").text() + "]\n");
        
        // 미세먼지 : 보통 
        var air_inn_ul = air_inn.select("ul>li");        
        for (var j = 0; j < air_inn_ul.size(); j++) {
            var li = air_inn_ul.get(j);
            reply_msg = reply_msg.concat(li.select("span").text() + " : " + li.select("strong").text() + "\n");
        }
    } 
    replier.reply(reply_msg);

    /* 결과
    [오늘 오전]
    미세먼지 : 보통
    초미세먼지 : 보통
    오존 : 보통
    자외선 : 보통
    황사 : 보통
    [오늘 오후]
    미세먼지 : 보통
    초미세먼지 : 좋음
    오존 : 보통
    자외선 : 보통
    황사 : 보통
    
    */
  }
}
```

#### 참고 사이트
- 메신저봇 공식 홈 : [https://violet.develope.kr](https://violet.develope.kr)
- 메신저봇 구버전 API : [https://deviolet.tistory.com/entry/메신저봇-가이드](https://deviolet.tistory.com/entry/%EB%A9%94%EC%8B%A0%EC%A0%80%EB%B4%87-%EA%B0%80%EC%9D%B4%EB%93%9C)
- Javascript 테스트 사이트 : [https://jsfiddle.net](https://jsfiddle.net)
