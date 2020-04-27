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

![process](./images/process.png)
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
- 초록색 : 컴파일이 필요한 경우, 초록색 아이콘이 표시됩니다.
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
- 연필모양 : 되돌리기, 다시 실행, 모두 선택, 붙여넣기 등 편집 도구
- 설정버튼 : 자동 정렬, 검색, 공유, 이동, 자세히(문자 및 라인 수) 등 편의 도구
     * Beautify(Experimental) : 자동 정렬 (소스코드를 보기 편하게 탭 등을 자동으로 정렬)
```

 <br />

---

## 메신저봇R 개발
> 메신저봇R 에서는 `JavaScript`를 사용하며, 코드 수정 후 반드시 우측 상단 폴더의 `저장하고 컴파일`을 수행해야 합니다.

* `Javascript`를 잘 모르거나 자세한 사항은 [가이드](./Javascript_guide.md)를 참고바랍니다.

### 기본 소스코드
```javascript
const scriptName = "test";
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  // 이 주석을 제거한 뒤 중괄호 {} 안에 원하는 소스코드를 작성합니다. 
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}
```
<br />

### 작성 예시
`function response` 함수 내부에 앞으로 수행될 봇의 소스코드를 작성하게 됩니다.

```javascript
function response(room,msg,sender,isGroupChat, replier, imageDB, packageName) { 
    // 알림 팝업이 올 때마다 "안녕!" 이라는 메시지 답장
    replier.reply("안녕!");
}
```
`function response`의 각 파라미터는 다음과 같습니다.
| 파라미터        | 설명                                                |
| ----------- | ------------------------------------------------- |
| room        | 채팅방의 이름입니다.                                       |
| sender      | 보낸이의 이름입니다.                                       |
| isGorupChat | 단체톡방 여부입니다. (`false`: 개인톡방, `true`: 단체톡방)         |
| replier     | 답장을 보내기 위한 객체입니다.                                 |
| imageDB     | 프로필 이미지와 관련된 객체입니다.                               |
| packageName | 알림 팝업을 띄운 어플의 패키지명입니다. (ex. `com.kakao.talk.apk`) |

<br />

### 샘플 예제
> 채팅방 이름(room)과 메시지(msg)를 확인하지 않을 경우, 모든 채팅방의 모든 메시지에 답장을 보내므로 주의바랍니다! 

```javascript
function response(room,msg,sender,isGroupChat, replier, imageDB, packageName) { 

    // 채팅방 이름이 "DEBUG ROOM" 이 아닐 경우, response 함수 종료
    if(room != "DEBUG ROOM") return; 

    // 메시지가 "하이"일 경우, "Hi!" 답장 
    if(msg == "하이") {
        replier.reply("Hi!"); 
    }

    // 메시지가 "안녕"일 경우, "ㅇㅇ"님, 안녕하세요!" 답장 
    if(msg == "안녕") {
        replier.reply(sender + "님, 안녕하세요!"); 
    }

    // 메시지가 "여기 단체 톡방이야?"인 경우, 
    if (msg == "여기 단체 톡방이야?" && isGroupChat) {
        if (isGroupChat) {
            replier.reply("네!"); // 단체 톡방인 경우, "네!" 답장 
        } else {
            replier.reply("아니요!"); // 개인 톡방인 경우, "아니요!" 답장 
        }
    }

    // 메시지가 "방장 소환"인 경우, 방장의 채팅방(ex. 관리방)에 메시지 보내기 (답장X)
    if (msg == "방장 소환") {
        replier.reply("관리방", "방장님! " + room + "에서 불러요!!"); // 관리자님! 테스트방에서 불러요!!
    }

}
```
<br />

> 문자열 활용 
```javascript
function response(room,msg,sender,isGroupChat, replier, imageDB, packageName) { 
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
}
```
<br />

> 랜덤 출력 
```javascript
function response(room,msg,sender,isGroupChat, replier, imageDB, packageName) { 
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
 <br />

## 메신저봇 테스트
코드 작성이 끝났다면 `저장 후 컴파일`을 진행한 뒤, 메인 화면의 `채팅 모양`을 클릭해서 테스트합니다.

<br />

**만약, 디버그룸에서 답장이 오지 않는경우 다음을 확인합니다.**

1. 제대로 `저장 후 컴파일`이 되어 있는지 확인합니다.
   * 컴파일이 되어 있지 않은 경우, 메인화면 스크립트 좌측에 `초록색 동그라미`가 떠 있습니다.

2. 해당 스크립트와 전체 스크립트 활성화 버튼이 모두 켜져 있는지 확인합니다.

3. 메신저봇R 앱을 처음 구동할 때 권한을 설정하지 않았다면, `알림 읽기 권한`을 활성화 합니다. 
   * 우측 상단 > 설정 > 공용 설정 > 기타 > 알림 읽기 권한 : 메신저봇 활성화
  
4. 그래도 되지 않을 경우, 휴대폰을 재부팅하면 높은 확률로 해결됩니다.

<br />

**만약, 디버그룸에서는 답장이 오는데 카톡은 답장이 되지 않는다면 다음을 확인합니다**

1. 자신이 현재 답장을 보낼 채팅방을 보고 있는 지 확인합니다.
   * 자신이 읽고 있어서 알림 팝업이 뜨지 않을 경우, 답장을 보내지 않습니다. 

2. 카카오톡의 `더보기 > 설정 > 알림` 이 켜져있는지 확인합니다.
   * 메시지 알림 : ON
   * 알림 표시 > 알림 팝업 :  항상 받기
   * 알림 센터에 메시지 표시 
       - 모든 채팅방 : 모든 채팅방에 자동 응답이 수행됨 
       - 알림 켠 채팅방만 : 알림을 켠 채팅방만 자동 응답이 수행됨

<br />

## 참고 사이트
- 메신저봇 공식 홈 : [https://violet.develope.kr](https://violet.develope.kr)
- 메신저봇 구버전 API : [https://deviolet.tistory.com/entry/메신저봇-가이드](https://deviolet.tistory.com/entry/%EB%A9%94%EC%8B%A0%EC%A0%80%EB%B4%87-%EA%B0%80%EC%9D%B4%EB%93%9C)
- Javascript 테스트 사이트 : [https://jsfiddle.net](https://jsfiddle.net)
