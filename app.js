const { checkInventory, processPayment, shipOrder } = require("./library.js");

const order1 = {
  items: [
    ["lettuce", 2],
    ["tomato", 1],
  ],
  balance: 200,
};

const order2 = {
  items: [
    ["tomato", 1],
    ["milk", 1],
    ["lettuce", 6],
  ],
  balance: 1000,
};

const order3 = {
  items: [
    ["potato", 1],
    ["apple", 1],
    ["milk", 12],
    ["lettuce", 4],
  ],
  balance: 500,
};

const check = (order) => {
  checkInventory(order)
    .then((resolved) => {
      return processPayment(resolved);
    })
    .then((resolved) => {
      return shipOrder(resolved);
    })
    .then((successMessage) => {
      console.log(successMessage);
    })
    .catch((errorMessage) => {
      console.log(errorMessage);
    });
  console.log("\r");
};

check(order1);
setTimeout(() => {
  check(order2);
}, 5000);
setTimeout(() => {
  check(order3);
}, 10000);
