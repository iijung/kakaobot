# 웹 서버 구축 

## 개발 정보
- 호스팅 사이트 : `Heroku`
- 프로그래밍 언어 : `Python`
  - `flask` :  `Python`으로 구동되는 웹 어플리케이션 프레임워크로 `Django`보다 가벼움 (API서버에 적합)
  - `gunicorn` : WSGI HTTP 서버로 Heroku에서 `flask` 동작을 하기 위해 추가

## Flask 서버 구축 
### Python 3.7.4 설치 
- 다운로드 경로 : http://www.python.org/downloads
- 설치 및 강의 참고 : http://wikidocs.net/8

### 모듈 설치 
```sh
C:\> pip install flask    # api 서버 구축을 위해 패키지 설치 
C:\> pip install gunicorn # heroku 연동을 위해 패키지 설치 
```


### 기본 구조
```sh
C:\프로젝트
├─ app.py                 # Flask 앱 (*중요)
├─ templates              # HTML 파일 모음 
│     └─ index.html
└─ static                 # js, css 등 정적 파일 모음
    ├─ js
    │   └─ main.js
    └─ css
        └─ style.css
```
- **app.py**
    ```py
    from flask import Flask
    app = Flask (__name__)

    @app.route('/')    
    def hello_world():
        return 'Hello, World!'

    if __name__ == "__main__":
        app.run()
      # app.run(host="127.0.0.1", port="5000", debug=True)  
    ```
- **style.css**
    ```css
    h1 {
        color : blue;
    }
    ```
- **index.html**
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">      
  </head>
  <body>
      <h1>대문 페이지</h1>
      <!-- 샘플 코드 적용 -->
  </body>
  </html>
  ```
<br>

### 데이터 반환 (서버 → 클라이언트)
- flask는 `jinja2` 템플릿 엔진을 사용하며, render_template로 변수를 전달합니다. 

#### index.html
```html
<!-- index.html  -->
    <h1>대문 페이지</h1>
    이름 : {{user}}             <!-- user 변수 -->
    레벨 : {{data.level}}       <!-- data 의 level  -->
    포인트 : {{data.point}}     <!-- data 의 point  -->
    경험치 : {{data.exp}}       <!-- data 의 exp  -->
<!-- 생략 -->
```
#### app.py
```py
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")               # http://127.0.0.1:5000
def hello():
  return 'Hello world!'

@app.route('/index')          # http://127.0.0.1:5000/index 
def index():
  return render_template('index.html',user="반원",data={'level':60,'point':360,'exp':45000})
  # index.html에 변수를 전달하여 페이지를 렌더링 합니다. 
  
if __name__=="__main__":
  app.run(debug=True)
```

### 데이터 요청 (클라이언트 → 서버)
#### index.html
```html
<!-- index.html  -->
    <h1>대문 페이지</h1>
    이름 : {{user}}             <!-- user 변수 -->
    레벨 : {{data.level}}       <!-- data 의 level  -->
    포인트 : {{data.point}}     <!-- data 의 point  -->
    경험치 : {{data.exp}}       <!-- data 의 exp  -->

    <form action="/" method="post">
        이름 : <input type="text" name="user">
        <input type="submit" value="이름 변경">
    </form>
<!-- 생략 -->
```
#### app.py
```py
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def hello():
  return 'Hello world!'

@app.route('/index',methods=('GET', 'POST')) 
def index():
    data = {'level': 60, 'point': 360, 'exp': 45000}
    if request.method == "POST":
        # HTML 코드 : <form action="/" method="post"> ...
        user = request.form.get('user')        
    elif request.method == "GET":
        # HTML 코드 : <form action="/" method="get"> ...
        user = request.args.get('user')    
    return render_template('index.html', user=user, data=data)

if __name__=="__main__":
    app.run(debug=True)
```

### Jinja2 템플릿 작성법 
#### 변수 출력 
```jinja
이름은 {{name}}이고 나이는 {{age}} 입니다. 
```
#### if 문법
```jinja
{% if data %}
    데이터 : {{data}}
{% endif %}
```
#### 반복문
- `{{loop.index}}` : 1부터 시작하는 반복 횟수
```jinja
{% for k,v in data.items() %}
    {{loop.index}} 번째 아이템 : {{k}} {{v}}
{% endfor %}
```

## Heroku 호스팅 
> 모든 CLI 명령어는 `Windos` + `R`, `cmd` 를 통해 명령 프롬프트를 실행시킨 후 입력합니다. 

### 기본 구조 
```sh
C:\프로젝트
└ .git                    # 로컬 Git 저장소. git init 명령어로 생성한다. 
└ .gitignore              # Git commit 시 제외될 파일 리스트
└ requirements.txt        # 앱 종속성 리스트 
└ runtime.txt             # 실행 시 파이썬 버전 명시 
└ Procfile
```

### Git 환경 설정 
- Git 다운로드 : https://git-scm.com/download/win

```sh
C:\> cd 프로젝트
C:\프로젝트> git init                                            # 로컬 git 생성 (.git 생성)
C:\프로젝트> git config --global user.name "John Doe"            # John Doe 사용자 이름 설정 
C:\프로젝트> git config --global user.email johndoe@example.com  # johndoe@example.com 이메일 설정 
C:\프로젝트> git config --list                                   # 설정 확인

C:\프로젝트> git add .                     # 현재 경로를 커밋 대상에 추가 
C:\프로젝트> git commit -m "commit test"   # 로컬 Git에 변경 사항 반영 
```

### 관련 파일 생성 
1. `Procfile` : 실행 명령어 
    ```sh
    # example1.py , example2=Flask(__name__) 
    # web: gunicorn example1:example2
    web: gunicorn app:app
    ```
2. `.gitignore` : 제외 리스트 
    - https://www.gitignore.io 사이트를 이용하여 작성하면 편리합니다. 
    - Flask의 경우, https://www.toptal.com/developers/gitignore/api/flask 내용 복붙
3. `runtime.txt` : 파이썬 버전 
    ```sh
    python-3.7.6
    ```
4. `requirements.txt` : 종속성 리스트 
    - `pip freeze` 명령어를 사용하여 생성하면 편리합니다. 
    - `pip install -r requirements.txt` 명령어로 개발환경 복구도 가능합니다. 
    ```sh
    C:\프로젝트> pip freeze > requirements.txt 
    ```

### Heroku 환경 설정
- Heroku 계정 당 하나의 앱을 배포할 수 있습니다. 
- Heroku CLI 다운로드 : https://devcenter.heroku.com/articles/getting-started-with-python#set-up
```sh
# heroku 로그인 
C:\> heroku login
 »   Warning: Our terms of service have changed: https://dashboard.heroku.com/terms-of-service
heroku: Press any key to open up the browser to login or q to exit:
Opening browser to https://cli-auth.heroku.com/auth/cli/browser/d883a5f1-3ffe-4afa-b408-7067a94f50f4?requestor=SFMyNTY.g3QAAAACZAAEZGF0YW0AAAANMTc1LjEyNC44NC43MGQABnNpZ25lZG4GADvkXw92AQ.kH6HuXQB807m3TxcBxMay0FkEBokepapCZHbBVuY5QU
Logging in... done
Logged in as 계정정보 

# heroku 앱 생성
C:\> heroku create 
Creating app... done, ⬢ protected-ocean-27789 # 랜덤 프로젝트명 부여
https://protected-ocean-27789.herokuapp.com/ | https://git.heroku.com/protected-ocean-27789.git


# heroku 앱 이름 변경
C:\> heroku rename tanya58
Renaming protected-ocean-27789 to tanya58... done
https://tanya58.herokuapp.com/ | https://git.heroku.com/tanya58.git
Git remote heroku updated
 !    Do not forget to update git remotes for all other local checkouts of the app.

# heroku와 git 연동 
C:\> cd 프로젝트
C:\프로젝트> heroku git:remote -a tanya58   # git heroku 연동 
C:\프로젝트> git push heroku master         # 로컬 Git을 heroku 서버에 업로드 
```
**추가 명령어 참고**
```sh
# heroku 타임존 변경 
C:\> heroku config:add TZ="Asia/Seoul"

# heroku 앱 바로가기 
C:\> heroku open

# 오류 확인 
C:\> heroku logs
C:\> heroku logs --tail

# 하나 이상의 인스턴스가 실행 중인지 확인 
C:\> heroku ps:scale web=1

# 유지보수모드 활성화/비활성화 
C:\> heroku maintenance:on # 서버 중지 (유지보수 활성화)
C:\> heroku maintenance:off # 서버 실행 (유지보수 비활성화)

# heroku와 git을 잘못 연동 한 경우 다음 명령어 실행 
C:\> cd 프로젝트
C:\프로젝트> heroku git:remote -a protected-ocean-27789  # 잘못 연결
C:\프로젝트> git remote rm heroku                        # 잘못 연결된 정보 제거 
C:\프로젝트> heroku git:remote -a tanya58 
C:\프로젝트> git push heroku master     
```

## Reference
- [핵심만 해보는 flask 튜토리얼](https://wikidocs.net/book/4479)
- [Python으로 Heroku 시작하기](https://devcenter.heroku.com/articles/getting-started-with-python)
- [자주 사용하는 기초 git 명령어 정리하기](https://medium.com/@pks2974/%EC%9E%90%EC%A3%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EA%B8%B0%EC%B4%88-git-%EB%AA%85%EB%A0%B9%EC%96%B4-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-533b3689db81)