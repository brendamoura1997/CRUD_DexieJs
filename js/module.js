const productsdb = (dbname, table) => {
  const db = new Dexie(dbname);
  db.version(1).stores(table);
  db.open();

  return db;
  /**
       * const db = new Dexie('myDb');
          db.version(1).stores({
          friends: `name, age`
      });
       */
};

const bulkcreate = (dbtable, data) => {
  let flag = empty(data);
  if (flag) {
    dbtable.bulkAdd([data]);
    console.log("dados inseridos com sucesso...!");
  } else {
    console.log("Por favor, forneça dados...!");
  }
  return flag;
};

// criar elementos dinâmicos
const createEle = (tagname, appendTo, fn) => {
  const element = document.createElement(tagname);
  if (appendTo) appendTo.appendChild(element);
  if (fn) fn(element);
};

// verificar a validação da caixa de texto
const empty = object => {
  let flag = false;
  for (const value in object) {
    if (object[value] != "" && object.hasOwnProperty(value)) {
      flag = true;
    } else {
      flag = false;
    }
  }
  return flag;
};

// obter dados do banco de dados
const getData = (dbname, fn) => {
  let index = 0;
  let obj = {};
  dbname.count(count => {
    // conta as linhas na tabela usando o método count
    if (count) {
      dbname.each(table => {
        // table => retorne os dados do objeto da tabela
        // para organizar a ordem que vamos criar no loop
        obj = SortObj(table);
        fn(obj, index++); // call function with data argument
      });
    } else {
      fn(0);
    }
  });
};

const SortObj = (sortobj) => {
  let obj = {};
  obj = {
    id: sortobj.id,
    name: sortobj.name,
    seller: sortobj.seller,
    price: sortobj.price
  };
  return obj;
}


export default productsdb;
export {
  bulkcreate,
  createEle,
  getData,
  SortObj
};