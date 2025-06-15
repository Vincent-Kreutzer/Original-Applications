/*✅ 1. 保存されたデータを取得する
localStorage または sessionStorage から情報を取り出す（どちらを使っているかに応じて）

保存形式はおそらく JSON文字列 だから JSON.parse() が必要ね

✅ 2. テーブルにデータを表示する
<tbody id="table-body"> の中に行（<tr>～</tr>）を追加していく

各データ項目を <td> で入れて、さらに削除ボタンも含める

✅ 3. 削除ボタンの実装
各行に「削除」ボタンをつけて、それをクリックすると該当データを削除＆表示更新
*/
//ローカルストレージからデータを引き出し
const storedInfo = localStorage.getItem("passwords");
//変数にデータがあればそれを配列化して入れ、なければ空の配列を入れる。
const data = storedInfo ? JSON.parse(storedInfo) : [];
//各要素を入れる受け皿であるtablebody要素を取得
const passwordBody = document.getElementById("table-body");

//dataオブジェクト内のデータひとつづつを取り出して同一処理を行う
data.forEach((item, index)=>{
  //tr要素の受け皿を作って入れる
  let makeTr = document.createElement("tr");
  
  //td要素の受け皿を作って入れる 
  let siteTd = document.createElement("td");
  siteTd.textContent = item.site;
  makeTr.appendChild(siteTd);

  let idTd = document.createElement("td");
  idTd.textContent = item.loginId;
  makeTr.appendChild(idTd);

  let passTd = document.createElement("td");
  passTd.textContent = item.password;
  makeTr.appendChild(passTd);

  let memoTd = document.createElement("td");
  memoTd.textContent = item.memo;
  makeTr.appendChild(memoTd);

  let deleteTd = document.createElement("td");
  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "削除";
  deleteBtn.setAttribute("data-index", index);//後で必要(属性名、値)
  deleteTd.appendChild(deleteBtn);
  makeTr.appendChild(deleteTd);

  passwordBody.appendChild(makeTr);
});

//各削除ボタンにイベントを設定
document.querySelectorAll("button[data-index]").forEach(btn=>{
  btn.addEventListener("click", (e)=> {
    const index = e.target.getAttribute("data-index");
    data.splice(index, 1);
    localStorage.setItem("passwords", JSON.stringify(data));
    location.reload();
  });
});