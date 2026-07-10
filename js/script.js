/* 🔒 contatos ocultos */
const contatos = {
  barbara: { nome: "Bárbara", numero: "5524999161333" },
  huila: { nome: "Huila", numero: "5524999522320" }
};

function openTab(tabId, el) {
  document.querySelectorAll('.content').forEach(c => c.style.display = 'none');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  document.getElementById(tabId).style.display = 'block';
  el.classList.add('active');

  el.scrollIntoView({
  behavior: "smooth",
  inline: "center",
  block: "nearest" // 👈 impede movimento vertical
  });
}

function changeQty(button, value) {
  const item = button.closest('.item');
  const nome = item.querySelector('span').innerText;

  const qtyElement = item.querySelector('.qty');
  let qty = parseInt(qtyElement.innerText);
  qty = Math.max(0, qty + value);
  qtyElement.innerText = qty;

  localStorage.setItem(nome, qty);
}

/* 📲 envio whatsapp */
function enviarWhatsApp() {
  const destino = document.getElementById("destino").value;
  const contato = contatos[destino];

  let mensagem = "*Reabastecimento:*\n\n";

  document.querySelectorAll('.content').forEach(secao => {
    const titulo = secao.id.toUpperCase();
    let itens = "";

    secao.querySelectorAll('.item').forEach(item => {
      const nome = item.querySelector('span').innerText;
      const qtd = item.querySelector('.qty').innerText;

      if (parseInt(qtd) > 0) {
        itens += `- ${nome}: ${qtd}\n`;
      }
    });

    if (itens) {
      mensagem += `*${titulo}*\n${itens}\n`;
    }
  });

  if (mensagem.trim() === "*Reabastecimento:*") {
    alert("Nenhum item selecionado.");
    return;
  }

  const url = `https://wa.me/${contato.numero}?text=${encodeURIComponent(mensagem)}`;
  window.location.href = url;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js")
    .then(() => console.log("Service Worker ativo"))
    .catch(err => console.log("Erro SW:", err));
}

window.onload = () => {
  document.querySelectorAll('.item').forEach(item => {
    const nome = item.querySelector('span').innerText;
    const salvo = localStorage.getItem(nome);
    if (salvo) {
      item.querySelector('.qty').innerText = salvo;
    }
  });
};

function zerarTudo() {
  document.querySelectorAll('.qty').forEach(q => q.innerText = 0);
  localStorage.clear();
}


function buscarItem(texto) {
  texto = texto.toLowerCase();

  const abaAtiva = document.querySelector('.content:not([style*="none"])');

  abaAtiva.querySelectorAll('.item').forEach(item => {
    const nome = item.innerText.toLowerCase();
    item.style.display = nome.includes(texto) ? "flex" : "none";
  });
}

function zerarTudo() {
  if (!confirm("⚠️ Tem certeza que deseja zerar TODOS os itens?\nEssa ação não pode ser desfeita.")) return;

  document.querySelectorAll('.qty').forEach(q => q.innerText = 0);
  localStorage.clear();
  alert("Itens zerados com sucesso.");
}