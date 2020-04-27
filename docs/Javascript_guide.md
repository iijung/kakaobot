# JavaScript 간단 가이드
[메신저봇R](https://violet.develope.kr)을 통한 봇 개발을 위한 `Javascript 간단 가이드`입니다.
 
## 문자열 출력

### 문자열 출력`(기본)`
> 메신저봇R에서는 다른 함수를 사용하므로 이 함수들은 사용되지 않습니다.
```javascript
// 콘솔 화면에 특정 문자열을 출력합니다. (크롬에서 `F12`를 눌러서 나오는 창)
puts("console test");

//웹 페이지에 특정 문자열을 출력합니다.
document.write("webpage write test");
```

### 문자열 출력`(메신저봇R 전용)`
**메시지 보내기**
```javascript
replier.reply("메시지를 받은 톡방에 메시지를 보냅니다");
replier.reply("테스트방", "테스트방에 메시지를 보냅니다");
```
**개발 로그**
```javascript
// 디버그 로그를 씁니다.
d("디버그 메시지"); 
debug("디버그 메시지"); 

// 에러 로그를 씁니다.
e("에러 메시지");
error("에러 메시지");

// 정보 로그를 씁니다
i("정보성 메시지");
info("정보성 메시지");

// 로그를 모두 지웁니다.
clear();
```

<br />

## 변수
특정 데이터를 저장하기 위한 공간으로 여러 방향으로 활용 가능합니다.


**일반 변수**
> var 변수이름 = 값;
```javascript
// 특정 문자열을 담아두고 그대로 출력하기 
var name = "홍길동";
puts(name);             // 홍길동 출력 

// 특정 숫자를 담아두고 10을 두 번 더하기
var sum = 0;
sum += 10;
sum = sum + 10; 
puts(sum);              // 20 출력
```

**배열**
> 배열은 여러 데이터를 연속하여 저장하기 위한 공간이다 <br />
> 인덱스는 0부터 시작하며 인덱스를 통해 배열의 특정 값에 접근할 수 있다.

_**※ 배열의 인덱스를 넘어간 경우, 오류가 발생하여 프로그램이 멈추므로 주의!!!**_

```javascript
var array0 = [];     // null 배열 
var array1 = [1,3,5];
var array2 = ['A','B','C','D','F'];
var array3 = ["봄","여름","가을","겨울"];

puts(array1[0]); // 1 출력 
puts(array1[1]); // 3 출력 
puts(array1[2]); // 5 출력 

puts(array2[1]); // B 출력 
puts(array2[4]); // F 출력 

puts(array3[0]); // 봄 출력
puts(array3[3]); // 겨울 출력
puts(array3[4]); // 세그먼트 오류 발생으로 인해 프로그램 강제 종료!! 
```

**객체**
> 객체는 '키:값'으로 데이터를 저장하기 위한 공간이다. <br />
> `키`를 통해 `값`을 가져올 수 있으며, 아무것도 없을 경우 `undefined`가 출력된다.

```javascript
var object0 = {};     // null 오브젝트
var object1 = {1: "일", 2: "이", 3: "삼"};
var object2 = {"일": "하나", "이": "둘", "삼": "셋"};

puts(object1[0]); // undefined 출력 (아무것도 없으므로)
puts(object1[1]); // "일" 출력
puts(object1[2]); // "이" 출력
puts(object1[3]); // "삼" 출력

puts(object2["일"]); // "하나" 출력
puts(object2["하나"]); // undefined 출력
puts(object2["이"]); // "둘" 출력
puts(object2["삼"]); // "셋" 출력
```


## 조건문

**조건문 사용을 위한 연산자**
| 논리 연산자   | 의미  | 설명            |
| -------- | --- | ------------- |
| A        | -   | A가 참일 경우      |
| !A       | NOT | A 가 참이 아닐 경우  |
| A \|\| B | OR  | A 또는 B가 참일 경우 |
| A && B   | AND | A와 B 모두 참일 경우 |

| 비교 연산자 | 의미                       | 설명                |
| ------ | ------------------------ | ----------------- |
| A < B  | greater than             | A 보다 B가 클 경우      |
| A <= B | greater than or equal to | A 보다 B가 크거나 같을 경우 |
| A > B  | less than                | A 보다 B가 작을 경우     |
| A >=B  | less than or equal to    | A 보다 B가 작거나 같을 경우 |
| A == B | equals                   | A 와 B가 같을 경우      |
| A != B | not equal to             | A 와 B가 같지 않을 경우   |

<br />

**if문**
> if - else if - else 형태로 특정 조건을 만족할 경우에만, 명령어가 실행됩니다.

* `if` : 단독으로 사용 가능합니다.
* `else if` : `if`의 뒤에만 사용 가능합니다. (앞의 조건이 만족하지 않을 경우 조건 확인)
* `else` : `if` 또는 `else if`의 뒤에만 사용 가능합니다. (앞의 조건이 만족하지 않을 경우 명령어 수행)

```javascript
// a == 1 이 참일 경우, puts("True"); 실행 
var a = 1;
if (a == 1) {
    puts("True");
}

// a == 1 이 참일 경우, puts("True"); 실행
// 위 조건이 아닐 경우, puts("False"); 실행
var a = 1;
if (a == 1) {
    puts("True");
} else {
    puts("False");
}

/* 1 또는 2 또는 3 또는 Not Found 출력 */
var a = 1;
if (a == 1) { // a == 1 이 참일 경우, puts("1"); 실행
    puts("1");
} else if (a == 2) { // 위 조건이 아니고 a == 2 이 참일 경우, puts("2"); 실행
    puts("2");
} else if (a == 3) { // 위 조건이 아니고 a == 3 이 참일 경우, puts("3"); 실행
    puts("3");
} else {             // 위 조건이 아닐 경우, puts("Not Found"); 실행
    puts("Not Found");
}
```

**switch문**

> 특정 변수의 값과 동일한 `case`의 명령문 부터 시작한다. `break`를 만날 경우, switch를 종료한다. <br />
동일한 case가 없을 경우, `default`의 명령문 부터 시작한다.

```javascript
// 숫자 비교 => "일"
var number = 1;
switch (number) {
    case 1: puts("일"); break;
    case 2: puts("이"); break;
    case 3: puts("삼"); break;
    case 4: puts("사"); break;
    default: puts("??"); break;
}

// 문자 비교 => "비"
var ch = 'B';
switch (ch) {
    case 'A': puts("에이"); break;
    case 'B': puts("비"); break;
    case 'C': puts("씨"); break;
    case 'D': puts("디"); break;
    default: puts("??"); break;
}

// 문자열 비교 => "에이"  (*javascript에서만 가능하고 다른 언어에서는 대체로 불가능하다.)
var str = "에이";
switch (str) {
    case "에이": puts("A"); break;
    case "비": puts("B"); break;
    case "씨": puts("C"); break;
    case "디": puts("D"); break;
    case "에프": puts("F"); break;
    default: puts("??"); break;
}

// 특정 월이 입력된 경우, 어떤 사계절인지 출력하기
// (break 또는 switch의 끝을 만날 떄까지 명령문을 이어서 수행한다.)
var month = 3;
switch (month) {
    case 12:
    case 1:
    case 2:
        puts("겨울"); break;
    case 3:
    case 4:
    case 5:
        puts("봄"); break;
    case 6:
    case 7:
    case 8:
        puts("여름"); break;
    case 9:
    case 10:
    case 11:
        puts("가을"); break;
    default:
        puts("1~12월 사이를 입력해주세요.");
        break; // default 아래로는 어차피 switch가 종료되므로 break 생략 가능
}
```

<br />

## 반복문 

- `continue` : 반복문 내의 명령문일 경우, 반복문 { }을 `증감문 - 조건문`으로 건너뛴다.
- `break` : 반복문 내의 명령문일 경우, 반복문 { }을 종료한다.

**for문**
> for (초기문; 조건문; 증감문) { } 형태로, 조건을 만족하면 { } 를 반복 <br />
> `초기문 - 조건문 - 명령문{} - 증감문 - 조건문 - 명령문{} - 증감문 - ...` 반복
```javascript
// 0 부터 4 까지의 합
var sum = 0;
for (var i = 0; i < 5; i++) {
	sum += i;
}

// 0 부터 4 까지의 합
var i = 0, sum = 0;    // 반복문
for (;;) {
    if (i > 4) break;  // 조건문
    sum += i;          // 명령문
    i++;               // 증감문
}

// 배열의 "여름" 데이터의 idx 반환
var array = ["봄", "여름", "가을", "겨울"];
for (var idx in array) {
    if (array[idx] == "여름") puts(idx); // 1 반환 
}
```

**while문**
> while (조건문) { } 형태로, 조건을 만족하면 { } 를 반복 
```javascript
var i = 0;
while (i < 5) {
	명령문;
	i++;
}
```

**do-while문**
> do{ } while (조건문); 형태로, { } 를 한 번 수행 후 조건을 만족하면 { } 를 반복 
```javascript
var i = 0;
do{
	명령문;
	i++;
} while(i <= 5);
```

<br />

## 사용자 지정 함수
> 여러가지 이유로 다음과 같이 함수(`function`)를 직접 만들어 사용할 수 있습니다.
* 코드를 깔끔하게 보기 쉽게 관리하기 위해
* 코드를 여러번 재사용하기 위해
```javascript
function add(a,b) {
	return a + b;
}
// ...
var result = 0;
result = add(3,5);
puts(result);        // 8 출력
// ...
puts(add(1,3));      // 4 출력 
puts(add(2,5));      // 7 출력 
```

 <br />

## 랜덤 함수
> Math.ceil(Math.random() * (최대값 - 최소값 + 1)) + 최소값 - 1
```javascript
// 1 ~ 6 랜덤 숫자 활용
var dice = Math.ceil(Math.random() * 6);
switch (dice) {
    case 1: puts("\u2680"); break; // ⚀
    case 2: puts("\u2681"); break; // ⚁
    case 3: puts("\u2682"); break; // ⚂
    case 4: puts("\u2683"); break; // ⚃
    case 5: puts("\u2684"); break; // ⚄
    case 6: puts("\u2685"); break; // ⚅
}

// "봄", "여름", "가을", "겨울" 배열 랜덤 뽑기 
var array = ["봄", "여름", "가을", "겨울"];
puts(Math.ceil(Math.random() * array.length) - 1);  // 랜덤 범위 0 ~ 3
```

## 문자열 조작 함수

**trim()** : 문자열의 좌우 공백을 제거해서 반환한다.
```javascript
var msg = "     테스트용 메시지    ";
puts(msg.trim());               // "테스트용 메시지" 반환 
```

**indexOf("문자열")** : 찾고 싶은 문자열의 첫번째 위치를 반환한다. (없으면, -1 반환)
```javascript
//         012345
var msg = "abcabc";
puts(msg.indexOf("a"));          //  0 반환
puts(msg.indexOf("c"));          //  2 반환
puts(msg.indexOf("f"));          // -1 반환
```

**lastIndexOf("문자열")** : 찾고 싶은 문자열의 뒤에서부터의 첫번째 위치를 반환한다. (없으면, -1 반환)
```javascript
//         012345
var msg = "abcabc";
puts(msg.lastIndexOf("a"));      //  3 반환
puts(msg.lastIndexOf("c"));      //  5 반환
puts(msg.lastIndexOf("f"));      // -1 반환
```

**split("문자열")** : 기준 문자열이 있는 곳을 모두 잘라서 배열로 반환한다.
```javascript
var msg = "1 2 3 4 5";
puts(msg.split(" "));            // "1,2,3,4,5" 반환
puts(msg.split(" ")[0]);         // "1" 반환
puts(msg.split(" ")[3]);         // "4" 반환

var msg = "가나 다라 마바 사아 자차 카타 파하";
puts(msg.split(" "));            // "가나,다라,마바,사아,자차,카타,파하" 반환 
puts(msg.split(" ")[0]);         // "가나" 반환
puts(msg.split(" ")[3]);         // "사아" 반환
```

**substring(시작위치, 종료위치+1)** : 문자열의 원하는 위치만 잘라서 반환한다.
```javascript
//         012345
var msg = "abcabc";
puts(msg.substring(1,3));        // "bc"
puts(msg.substring(3,6));        // "abc"
```

**replace("문자열1","문자열2")** : 문자열1을 문자열2로 치환하여 반환한다.
```javascript
var msg = "abcabc"
puts(msg.replace("a","A"));      // "Abcabc" 반환 (처음 발견된 문자열1만 변경)
puts(msg.replace(/bc/g,"BC"));   // "aBCaBC" 반환 (모든 문자열1이 변경)
	// # 정규표현식 설명
    // - /bc : 문자열 bc 를 대상으로 
	// - /g : 모든 문자열을 치환한다.
	// - /i : 대소문자 구분없이 치환한다.
  }
}
```

 <br />

## JSON 데이터
> 키와 값 쌍으로 이루어진 데이터 집합

* `JSON.parse()` : string 객체를 json 객체로 변환시켜줍니다.
* `JSON.stringify()` :json 객체를 String 객체로 변환시켜 줍니다.

```javascript
// create JSON 
var data = {
    "name": "bot",
    "age": 3,
    "isBot": true,
    "language": ["English", "Korean"],
    "command": {
            "hi": ["hi", "안녕"],
            "help": ["help", "도움말"]
    }
}

var text = JSON.stringify(data); // JSON -> String 
var json = JSON.parse(text);     // String -> JSON
```

 <br />

## 웹페이지 크롤링
> 조금 어려울 수 있습니다. 

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

<br />

**다음과 같은 형태로 네이버 날씨에서 날씨 정보 가져오기**
| 
| --------
| [오늘 오전] <br /> 미세먼지 : 보통 <br />초미세먼지 : 보통 <br />오존 : 보통 <br />자외선 : 보통 <br /> 황사 : 보통 <br /> [오늘 오후] <br /> 미세먼지 : 보통 <br /> 초미세먼지 : 좋음 <br /> 오존 : 보통 <br /> 자외선 : 보통 <br /> 황사 : 보통 <br /> |

```javascript
var data = ""; // 결과 데이터를 저장할 변수

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
    data = data.concat("[" + air_inn.select("h5>a").text() + "]\n");
    
    // 미세먼지 : 보통 
    var air_inn_ul = air_inn.select("ul>li");        
    for (var j = 0; j < air_inn_ul.size(); j++) {
        var li = air_inn_ul.get(j);
        data = data.concat(li.select("span").text() + " : " + li.select("strong").text() + "\n");
    }
} 
puts(data);

```

## 참고 사이트
- Javascript 테스트 사이트 : [https://jsfiddle.net](https://jsfiddle.net)
