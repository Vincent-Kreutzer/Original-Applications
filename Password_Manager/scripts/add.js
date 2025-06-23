//DOM要素取得==============================================
const form = document.getElementById("password-form");
const siteInput = document.getElementById("site");
const idInput = document.getElementById("loginId");
const pwInput = document.getElementById("password");
const memoInput = document.getElementById("memo");

const modal = document.getElementById("password-modal");
const openBtn = document.getElementById("open-modal");
const closeBtn = document.querySelector(".close");
const generateBtn = document.getElementById("generate-password");
const useSymbols = document.getElementById("include-symbols");
const symbolOptions = document.getElementById("symbol-options");
const symbols = document.querySelectorAll(".symbols");

//DOM要素の取得ここまで=======================================


//モーダル表示制御============================================
function setupModalEvents() {
  openBtn.addEventListener("click", ()=> {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", ()=> {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event)=> {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}
//モーダルの表示制御ここまで==================================


//記号オプション表示切り替え==================================
function setupSymbolToggle() {
  useSymbols.addEventListener("change", function() {
    symbolOptions.style.display = this.checked ? "block" : "none";
  });
}
//記号オプション表示切り替え==================================


//パスワード生成ロジック======================================
function generatePassword() {  
     
  const length = parseInt(document.getElementById("length").value);
  const upper = document.getElementById("include-uppercase").checked;
  const lower = document.getElementById("include-lowercase").checked;
  const numbers = document.getElementById("include-numbers").checked;
    
  //入力可能な文字列を入れる変数
  let chars = "";   
  if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) chars += "0123456789";   
  if (symbolOptions.checked) {
    symbols.forEach((symbol) => {
      if (symbol.checked) chars += symbol.value;
    });
  } 

  if (chars === "") {
    alert("少なくとも1つの文字種を選択してください。");
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random()*chars.length));
  }

  pwInput.value = password;
};


//パスワード生成ロジックここまで===============================

//フォーム送信処理============================================
function handleFormSubmit(event) {
  event.preventDefault();//遷移無し、フォームを自分で管理する宣言
  const entry = {
    site: siteInput.value.trim(),
    loginId: idInput.value.trim(),
    password: pwInput.value.trim(),
    memo: memoInput.value.trim()
  };  
    
  const storedInfo = localStorage.getItem("passwords");
  const data = storedInfo ? JSON.parse(storedInfo) : [];
  data.push(entry);
  localStorage.setItem("passwords", JSON.stringify(data));

  alert("新規データを保存しました！")
  form.reset();
}
//フォーム送信処理ここまで=====================================

//初期化=====================================================
function init() {
  setupModalEvents();
  setupSymbolToggle();

  generateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    generatePassword();
  });

  form.addEventListener("submit", handleFormSubmit);
}

init();

//初期化ここまで==============================================




   