//初期変数定義=============================================================
let table = document.getElementById("sudoku");
let board;
let selectedCell = null;
let selectedNum = null;  
const counts = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
  
//=================================================================

//HTML描画系関数=======================================================
 
//HTMLの盤面作成------------------------------------------------
function createBoardHTML() {
  //テーブル自動作成のforループ
  for (let row=0;row<9;row++) {
    //外側ループで各行を作成
    const tr = document.createElement("tr");
    tr.classList.add("rows");
    //内側ループで各行内のセルを作成
    for (let col=0;col<9;col++) {
      const td = document.createElement("td");

      //各セルにID(0~8)付与:カウンター変数の変動する値を入れて行列番号を入れる
      td.id = `cell-${row}-${col}`;

      //データ属性（ブロック番号:0~8）
      //データ属性で各セルがどのブロックに属するかを計算する           
      //行を3で割り（切捨）、それに3を掛ける⇒上中下いずれかに分けるために0,3,6になる必要がある。
      //列を3で割る（切捨）ことで、左中右のいずれかのブロックに分けられる。     
      //⇒この行列番号を足すことで、割り振ったブロック番号に導くことが出来る。
      const block = Math.floor(row/3)*3+Math.floor(col/3);
      td.dataset.block = block;

      //スタイル
      td.style.border = "1px solid #000";
      td.style.width = "40px";
      td.style.height = "40px";
      td.style.textAlign = "center";
            
      //各td要素をHTML上に実際に追加
      tr.appendChild(td);
    }//内側forループ

    //各tr要素をHTML上に実際に追加
    table.appendChild(tr);
  }//外側forループ
}//createBoardHTML()ここまで-----------------------------------

//各セルの縦横番号を元に数字を表示する--------------------------
function renderBoard() {
  for (let row=0;row<9;row++) {
    for (let col=0;col<9;col++) {
      const cell = document.getElementById(`cell-${row}-${col}`);
      cell.textContent = board[row][col].value === 0 ? "" : board[row][col].value;
    }
  }
}//renderBoard()ここまで-----------------------------------------

//数字の再描画（更新）関数を作る----------------------
function updateNumberButtons() {
  const panel = document.getElementById("number-panel");
  panel.innerHTML = ""; //一度全部削除

  for (let num=1; num <=9; num++) {
    //counts配列から数字要素を取得
    const count = counts[num];
    //ボタン要素を作成する
    const btn = document.createElement("button")
    //表示形式を指定する
    btn.innerHTML = `${num}<sup>${count}</sup>`;
    //クラスを付与する
    btn.classList.add("num-btn");
    //属性値を設定する
    btn.setAttribute("data-number", num);
    //数値パネルの残数が0なら非表示にする
    if (count === 0) btn.disabled = true;
      //実際にHTML上に表示する
      panel.appendChild(btn);
  }              

    //数字ボタンの再描画後、イベントを再登録
    setNumberButtonEvents();
}//updataNumberButtonsここまで-----------------------------


//パズル完成時のメッセージを表示する関数を定義する---------------
function showCompleteMessage() {
  const overlay = document.createElement("div");
  overlay.id = "complete-overlay";
  overlay.textContent = "COMPLETE !!";
  document.body.appendChild(overlay);
}//showCompleteMessage()------------------------------------------

//ゲームオーバー時のメッセージを表示する(未完)-------------------

//-----------------------------------------------------------

//HTML描画系関数ここまで==========================================================


//ゲームロジック関数=================================================
//Fisher-Yatesシャッフル法-------------------------------------
function shuffle(array) {
  for (let i = array.length - 1;i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
//shuffle()ここまで------------------------------------------------


  //isSafe()値の合法チェック---------------------------------------------------
function isSafe(row,col,num) {
         
  //行チェック（ある行だけを確認するため、確認したい行を抽出して新しい配列を作る）
  const targetRow = board[row].map(cell=>cell.value);
  if (targetRow.includes(num)) return false;
          
          
  //列チェック（boardから繰返し処理で同列の値を取得して新しい列を作り、確認）
  const targetCol = board.map(r=>r[col].value);
  if (targetCol.includes(num)) return false;
          
  //ブロックチェック:ある行列のブロックナンバーを取得
  const blockNum = Math.floor(row / 3) * 3 + Math.floor(col / 3);
  const blockValues = [];          
          
  //2重ループで各セルに対する処理を実行
  //ある行列のセルのブロックナンバーが対象と同じであるとき、
    
  for (let i=0;i<9;i++) {
    for (let j=0;j<9;j++) {
      if (board[i][j].block === blockNum) {
        blockValues.push(board[i][j].value);
      }
    }
  }
    
  //同ブロック内のセルに対象と同じ数字があれば、falseを返す
  if (blockValues.includes(num)) return false;
  return true;
}//isSafe()ここまで------------------------------------------


//solve()再起バックトラックで盤面完成--------------------------------
function solve() {
  for (let row=0;row<9;row++) {
    for (let col=0;col<9;col++) {
      //もしセルの値が0なら、
      if (board[row][col].value === 0) {
        let numbers = shuffle([1,2,3,4,5,6,7,8,9]);
        for (let num of numbers) {
          if (isSafe(row,col,num)) {
            board[row][col].value = num;
            if (solve()) return true;
            board[row][col].value = 0; //バックトラック
          }//isSafe()のif文
        }//num of numbersのfor文
        return false; //どの数字もなければfalseを返す
      }//boardのif文
    }//colのif文
  }//rowのif文
  return true; //全部埋めたらtrue
}//solve()ここまで--------------------------------------------


//makePuzzle()空白マス作成-----------------------------------
function makePuzzle() {     
  const allCells = [];//81個のセル全てを入れる配列
  const numToHide = 30;//問題にする数字の個数を変数化          
  const solutionBoard = [];//正解盤面用に二次元配列を作成

  //盤面のランダム化、81個のセルを取得してまとめて配列に入れる。
  for (let row=0;row<9;row++) {
    for (let col=0;col<9;col++) {
      //allCellsに全セルのHTML要素を入れてセル情報を取得する
      allCells.push(document.getElementById(`cell-${row}-${col}`))              
    };//内ループ
  };//外ループ
            
  //上の処理で一纏めにしたセル群をシャッフルして別の配列に入れる
  const shuffledCells = shuffle(allCells);            
            
  //シャッフルしたセルを正解盤面の配列に入れる（＝盤面のランダム化）
  for (let row=0; row<9; row++) {
    //大ループで9つの一次配列を作る。
    solutionBoard[row] = [];
    //小ループで二次配列としてシャッフルしたセルを入れる
    for (let col=0; col<9; col++) {
      solutionBoard[row][col] = shuffledCells[row][col]
    }
  }

  //その中から最初の30個を空白にし、別に答えとして保管
  for (let i=0; i<numToHide; i++) {
    //シャッフルされたセルを先頭から問題の数だけ取り出す。
    const cell = shuffledCells[i];             
    //さらにそのセルから答えとなる数字をint型で取り出す。              
    const answer = Number(cell.innerText);
              
              
    //セルに必要なデータを与える。
    //答えとなる数字をカスタムデータ化してセルに持たせる
    cell.dataset.answer = answer;              
    //選択肢である数字の個数を増やす
    counts[answer]++;//カウントだけ更新、値の保存無し              
    //セルのテキストを空白にする
    cell.innerText = "";
    //問題セルにeditable属性を加えてクリックできるようにする
    cell.classList.add("editable");    
  }
  //問題盤面作成ここまで

  //数字パネルに出現数を表示する            
  //まずパネル表示箇所のHTML要素を取得する
  const panel = document.getElementById("number-panel");

  //ループ処理で非表示の数字だけを表示させる
  for (let num=0;num<9;num++) {
    //countsオブジェクトの中身を取り出していく
    const count = counts[num];
    //各数字の値が入っているなら（＝問題化されているなら）、
    if (count>0) {
    //HTML上にボタンを作成する
      const btn = document.createElement("button");

      //数字+上付きで出現数を表示する
      btn.innerHTML = `${num}<sup>${count}</sup>`;
      //btnにクラスを付与する
      btn.classList.add("num-btn")
      //btnにカスタムデータを付与する
      btn.setAttribute("data-number", num);
             
      //HTML上に実際に上記の要素を追加する
      panel.appendChild(btn);
    }            
  }
}
//makePuzzle()ここまで---------------------------------------


//isPuzzleComplete()全マス正解チェック----------------------
function isPuzzleComplete() {
  const allCells = document.querySelectorAll("td");

  for (const cell of allCells) {
    if (cell.classList.contains("editable") || cell.classList.contains("incorrect")) {
    return false;
    }          
  }
  return true;
}//isPuzzleComplete()ここまで-------------------------------------  

//ゲームロジックここまで=========================================


//イベント処理================================================
function setEditableCellEvents() {
  //.editableを持つ要素に以下の処理をする
  document.querySelectorAll(".editable").forEach(cell=> {
              
    //クリックされた際の動作を以下に設定する
    cell.addEventListener("click", ()=> {                
      
      //セルが.editableでも.incorrectでもなければreturn
      if (!cell.classList.contains("editable") && !cell.classList.contains("incorrect")) return;
                
      //もしincorrectならリセット処理を行う
      if (cell.classList.contains("incorrect")) {
        const value = parseInt(cell.textContent);//元の数字を保管
        cell.textContent = "";//空白に戻す
        cell.classList.remove("incorrect", "selected");//状態リセット
        cell.classList.add("editable");//再び入力できるようにする
        counts[value]++//カウントを戻す
        updateNumberButtons();//数字ボタンを更新
        selectedCell = null; //選択を解除
        return;
      }
      //既にcelectedCellに値が入っているなら選択済みを削除（＝前回の選択を解除）
      if (selectedCell) {
        selectedCell.classList.remove("selected");
      }
            
      //新しいセルを選択状態にする(=classListでselectedを追加)
      //selectedCellにクリックしたセルを入れて、selectedを追加
      selectedCell = cell;
      cell.classList.add("selected")     
    });
  });
} //function setEditableCellEventsここまで--------------        


function setNumberButtonEvents() {
  document.querySelectorAll(".num-btn").forEach(btn=> {
    btn.addEventListener("click", ()=> {
      //カスタムデータを取得、integer型に変換してselectedNumbeに保存
      const number = parseInt(btn.getAttribute("data-number"));                                                
      selectedNum = number;                  
      //確定&判定処理に進む
      checkAndConfirm();
    });                             
  });            
}//setNumberButtonEventsここまで--------------------------
            

function checkAndConfirm() {          
  //二つの定数に値が入っていれば処理を行う
  if (selectedCell && selectedNum !== null) {
    const correct = selectedCell.dataset.answer;
    //選択肢の数字をselectedCellに入れる
    selectedCell.textContent = selectedNum;

    //正解との比較（正誤判定）               
    if (selectedNum === parseInt(correct)) {
      const correctSound = new Audio("sounds/correct.mp3");
      correctSound.play();                  
      selectedCell.classList.add("correct");
      setTimeout(()=>{
        if (selectedCell) selectedCell.classList.remove("correct");
          },1000);
        } else {
          const incorrectSound = new Audio("sounds/incorrect.mp3");
          incorrectSound.play();
          selectedCell.classList.add("incorrect");
          setTimeout(()=>{
          if (selectedCell) selectedCell.classList.remove("incorrect");
            },1000);
        }

      //使用済みカウントを減らす
      if (counts[selectedNum] > 0) {
        counts[selectedNum]--;
        updateNumberButtons();
      }

      //editable状態を解除
      selectedCell.classList.remove("editable", "selected");

      //状態リセット
      selectedCell = null;
      selectedNum = null;
  }
  
  //パズル盤面をすべて正解で埋めることが出来たら、
  if (isPuzzleComplete()) {
    showCompleteMessage()
  }
}//checkAndConform()ここまで


//イベント処理ここまで===========================================
  
window.addEventListener("load", () => {
  table = document.getElementById("sudoku"); // ← ここで安全に取得！

  board = Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => ({
      value: 0,
      block: Math.floor(row / 3) * 3 + Math.floor(col / 3)
    }))
  );

  createBoardHTML();
  solve();
  renderBoard();
  makePuzzle();
  updateNumberButtons();
  setEditableCellEvents();
});

        

          
        
        
       
  