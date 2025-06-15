//★表示履歴の機能部分
document.addEventListener("DOMContentLoaded", ()=> {
  //保存されている勘定記録を取得
  const entries = JSON.parse(localStorage.getItem("remindEntries") || "[]");
  const historyContainer = document.getElementById("historyContainer");

  //表用HTMLを作成
  entries.forEach(entry => {
    const entryCard = document.createElement("div");
    entryCard.className = "entry-card";
    entryCard.innerHTML = `
    <p><strong>日付:</strong>${entry.date}</p>
    <p><strong>感情:</strong>${entry.emotion}</p>
    <p><strong>強さ:</strong>${entry.strength}</p>
    <p><strong>メモ:</strong>${entry.memo}</p>
    `;
    historyContainer.appendChild(entryCard);
    
  });
});

