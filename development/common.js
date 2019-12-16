
const scriptName="main.js";

var Api = Bridge.getScopeOf("api.js");
var Admin = Bridge.getScopeOf("admin.js");
var cmd;

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){

 if(msg=="/가르친말"){
  replier.reply(Api.dbPrint("BotChating", "2n", "0"));
 }
 if(msg.indexOf("/가르치기 ") == 0){
  replier.reply(Api.dbEdit(msg, 6, "BotChating", "add", 0));
 }
 if(msg.indexOf("/가르친말 삭제 ") == 0){
  replier.reply(Api.dbEdit(msg, 9, "BotChating", "del", 0));
 }
 if(msg.indexOf(adminJs.botname)!=-1){
  var dbArray = Api.dbRead("BotChating");
  var keyArray = dbArray[0];
  var valueArray = dbArray[1];
  for ( var i in keyArray ) {
   if(msg.indexOf(keyArray[i])!=-1){
    replier.reply(valueArray[i]);
   }
  }
 }
 if(msg.indexOf("모집")==0){
  if(msg.indexOf("1")!=-1){
   replier.reply(sender + " 님\n" +"1명 모집하고 계십니다.");
  }
  if(msg.indexOf("2")!=-1){
   replier.reply(sender + " 님\n" +"2명 모집하고 계십니다.");
  }
  if(msg.indexOf("3")!=-1){
   replier.reply(sender + " 님\n" +"3명 모집하고 계십니다.");
  }
 }
 if(msg.indexOf("자리")==0){
  if(msg.indexOf("1")!=-1){
   replier.reply(sender + " 님\n" +"1자리 구하고 계십니다.");
  }
  if(msg.indexOf("2")!=-1){
   replier.reply(sender + " 님\n" +"2자리 구하고 계십니다."); 
  }
  if(msg.indexOf("3")!=-1){
   replier.reply(sender + " 님\n" +"3자리 구하고 계십니다.");
  }
 }
 if(msg=="/가위바위보"){
  replier.reply(Api.GBB(sender));
 }
 if(msg=="/클랜마크"){
  replier.reply(adminJs.clanName);
 }
 if(msg.indexOf("/주사위")==0){
  replier.reply(Api.namecut(sender, 6, "n") + " 님\n" + "숫자 [ " + Api.ranNumber(msg, 5, 1) + " ] 이 나왔습니다.");
 }
 if(msg=="/로또"){
  var lottonum = Api.ranNumList(45, 5, 1, 1);
  replier.reply(Api.namecut(sender, 6, "n") + "님의 이번 주 행운의 숫자\n" + lottonum[0] + " " + lottonum[1] + " " + lottonum[2] + " " + lottonum[3] + " " + lottonum[4] + " " + lottonum[5]);
 }
 if(msg=="/참가"){
  replier.reply(Api.dbEdit(Api.namecut(sender, 6, "n"), 0, "CustomList", "add", 1));
 }
 if(msg=="/참가취소"){
  replier.reply(Api.dbEdit(Api.namecut(sender, 6, "n"), 0, "CustomList", "del", 1));
 }
 if(msg=="/?"){
  replier.reply(DataBase.getDataBase("UserCommand"));
 }
 if(msg.indexOf("/날씨 ") == 0){
  replier.reply(Api.getWeathetInfo(msg));
 }
 if(msg){
  var buffStr = Api.spamCheck(sender, 20);
  if(buffStr != "Pass") {
   replier.reply(buffStr);
  }
 }
}


# User Command
모집 숫자
자리 숫자
/주사위
/가위바위보
/로또
/클랜마크
/참가 ( 클랜 커스텀전 참가신청 용 )
/참가취소 ( 클랜 커스텀전 참가신청 취소 용 )
/날씨 지역
/?

# ClanList.txt
클랜원1	-
클랜원2	-
클랜원3	-
클랜원4	-
클랜원5	-

# BotChating
안녕	안녕하세요!(꺄아)
하이	하이요!
ㅎㅇ	ㅎㅇ(꺄아)
메롱	(허걱)