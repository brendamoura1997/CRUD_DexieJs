import prodb, {
  bulkcreate,
  createEle,
  getData,
  SortObj
} from "./module.js";


let db = prodb("Productdb", {
  products: `++id, name, seller, price`
});

// tags de entrada
const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const seller = document.getElementById("seller");
const price = document.getElementById("price");

// botão criar
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

// dados do usuário

// event listener para o botão criar
btncreate.onclick = event => {
  // inserir valores
  let flag = bulkcreate(db.products, {
    name: proname.value,
    seller: seller.value,
    price: price.value
  });
  // reset textbox values
  //proname.value = "";
  //seller.value = "";
  // price.value = "";
  proname.value = seller.value = price.value = "";

  // set id textbox value
  getData(db.products, data => {
    userid.value = data.id + 1 || 1;
  });
  table();

  let insertmsg = document.querySelector(".insertmsg");
  getMsg(flag, insertmsg);
};

// event listener para criar botão
btnread.onclick = table;

// butão editar
btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
    // chamar método update do dexie
    db.products.update(id, {
      name: proname.value,
      seller: seller.value,
      price: price.value
    }).then((updated) => {
      // let get = updated ? `data updated` : `couldn't update data`;
      let get = updated ? true : false;

      // exibir mensagem
      let updatemsg = document.querySelector(".updatemsg");
      getMsg(get, updatemsg);

      proname.value = seller.value = price.value = "";
      //console.log(get);
    })
  } else {
    console.log(`Selecione o ID: ${id}`);
  }
}

// botão deletar
btndelete.onclick = () => {
  db.delete();
  db = prodb("Productdb", {
    products: `++id, name, seller, price`
  });
  db.open();
  table();
  textID(userid);
  // display message
  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
}

window.onload = event => {
  // definir o valor da caixa de texto do id
  textID(userid);
};




// create dynamic table
function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";
  // remove all childs from the dom first
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }


  getData(db.products, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent = data.price === data[value] ? `R$ ${data[value]}` : data[value];
          });
        }
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            // armazenar o número de botões de edição
            i.onclick = editbtn;
          });
        })
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            // armazenar o número de botões de delete
            i.onclick = deletebtn;
          });
        })
      });
    } else {
      notfound.textContent = "Nenhum registro encontrado no banco de dados...!";
    }

  });
}

const editbtn = (event) => {
  let id = parseInt(event.target.dataset.id);
  db.products.get(id, function (data) {
    let newdata = SortObj(data);
    userid.value = newdata.id || 0;
    proname.value = newdata.name || "";
    seller.value = newdata.seller || "";
    price.value = newdata.price || "";
  });
}

// excluir ícone remover elemento 
const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  table();
}

// ID da caixa de texto
function textID(textboxid) {
  getData(db.products, data => {
    textboxid.value = data.id + 1 || 1;
  });
}

// mensagem da função
function getMsg(flag, element) {
  if (flag) {
    // mensagem da chamada 
    element.className += " movedown";

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 4000);
  }
}