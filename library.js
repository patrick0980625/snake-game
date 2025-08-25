const store = {
  lettuce: {
    inventory: 5,
    price: 70,
  },
  tomato: {
    inventory: 50,
    price: 20,
  },
  potato: {
    inventory: 30,
    price: 30,
  },
  apple: {
    inventory: 100,
    price: 15,
  },
  milk: {
    inventory: 40,
    price: 100,
  },
};

const checkInventory = (order) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const itemArr = order.items;
      let instock = itemArr.every(
        (item) => store[item[0]].inventory >= item[1],
      );

      if (instock) {
        let total = 0;
        itemArr.forEach((item) => {
          total += item[1] * store[item[0]].price;
        });
        console.log(`All of the intems are in stock! Total cost: $${total}.`);
        resolve([order, total]);
      } else {
        reject("The order couldn't be completed. Not enough items in stock.");
      }
    }, generateRandomDelay());
  });
};

const processPayment = (responseArray) => {
  const order = responseArray[0];
  const total = responseArray[1];
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let hasEnoughMoney = order.balance >= total;
      if (hasEnoughMoney) {
        console.log(
          "Payment processed with gift card! Generating shipping label...",
        );
        let trackingNum = generateTrackingNumber();
        resolve([order, trackingNum]);
      } else {
        reject("Payment not processed. Insufficient funds.");
      }
    }, generateRandomDelay());
  });
};

const shipOrder = (responseArray) => {
  const trackingNum = responseArray[1];
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Order shipped! Tracking number: ${trackingNum}`);
    }, generateRandomDelay());
  });
};

const generateRandomDelay = () => {
  return Math.round(Math.random() * 2000);
};

const generateTrackingNumber = () => {
  return Math.floor(Math.random() * 1000000);
};

module.exports = { checkInventory, processPayment, shipOrder };
