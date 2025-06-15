//ステップ1：HTMLのフォームデータ取得
const form =document.getElementById("password-form");
const siteInput = document.getElementById("site");
const idInput = document.getElementById("loginId");
const pwInput = document.getElementById("password");
const memoInput = document.getElementById("memo");

//ステップ2：フォームの送信イベントをキャッチする
form.addEventListener("submit", (event)=>{
  event.preventDefault();//遷移無し、フォームを自分で管理する宣言
  
  // 1. 送信データの各値を取得、trim()で対象の前後のインデントを削除
  const siteInfo = siteInput.value.trim();
  const idInfo = idInput.value.trim();
  const pwInfo = pwInput.value.trim();
  const memoInfo = memoInput.value.trim();
  
  // 2. 取得した値をオブジェクトにまとめる
  const entry = {
    site: siteInfo,
    loginId: idInfo,
    password: pwInfo,
    memo: memoInfo
  };

  // 3. localStorageに保存する（ローカルストレージはキーと値のセットで保存する)  

  //まず既存のローカルストレージのデータを取得（上書きを防ぐため）
  const storedInfo = localStorage.getItem("passwords");
  //既存データがあれば配列・オブジェクトに戻し、なければ空を代入
  const data = storedInfo ? JSON.parse(storedInfo) : [];
  //新規データを追加する
  data.push(entry);
  //ローカルストレージにデータを保管する。
  // "passwords"をキーとして、dataをJSON形式に直してローカルストレージに保管する処理
  localStorage.setItem("passwords", JSON.stringify(data));

  alert("新規データを保存しました！")
  form.reset();
  // 4. index.htmlに遷移（必要なら
});
      