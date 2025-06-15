// new-entry.html専用処理(ページごとに分ける場合は条件分岐も可)
//日付の自動入力
window.addEventListener('DOMContentLoaded', ()=>{
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');    
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
});

//フォーム送信時のsubmitイベント
document.addEventListener("DOMContentLoaded", ()=> {
  //formそのものを取得して代入
  const form = document.getElementById("entry-form");

  //submitボタンを押したときのイベントを定義　
  form.addEventListener("submit", (e)=> {
    //フォーム送信時のページ同時リロードを防ぐことでページのリセットを防ぐ。
    e.preventDefault();

    //送信データの定数への代入
    const date = document.getElementById("date").value;
    const emotion = document.querySelector('input[name="emotion"]:checked')?.value;
    const intensity = document.getElementById("intensity").value;
    const memo = document.getElementById("memo").value;

    if (!emotion) {
      alert("感情を選んでください");
      return;
    }

    //定数に入れたデータを配列として代入
    const entry = {
      date, emotion, intensity, memo,
    };

    //保存済みJSON文字列を取得⇒配列に戻す⇒定数に代入、無ければ空の配列を代入
    const existingEntries = JSON.parse(localStorage.getItem("remindEntries")) || [];
    //その配列を既存の配列に追加する
    existingEntries.push(entry);
    //配列から文字列に変換⇒保存する
    localStorage.setItem("remindEntries", JSON.stringify(existingEntries));

    alert("記録しました。あなたの気持ちを大事にしましょう");
    form.reset();
    setToday();
  });

  function setToday() {
    //ISO形式で文字列に変換、Tのところで分割して0番目の要素を代入
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").value = today;
  }

  setToday();
});

