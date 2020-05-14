const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const realtimeDatabase = admin.database();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.filterMenu = functions.https.onCall(async (data, context) => {
  const snapshot = await admin
    .database()
    .ref("/public/items")
    .once("value")
    .then((snap) => {
      console.log(snap.val());
      var items = snap.val();
      var res = {};
      const textPassed = data;
      const dataPassed = JSON.parse(textPassed);
      const vendors = dataPassed.vendors;
      const categories = dataPassed.categories;
      const minPrice = dataPassed.minPrice;
      const maxPrice = dataPassed.maxPrice;
      if (vendors || categories || minPrice || maxPrice)
        Object.keys(items).forEach((key) => {
          var item = items[key];
          var flag = true;
          var flag1 = false;
          if (flag && vendors) {
            for (vendor in vendors) {
              if (vendors[vendor] === item.vendor) flag1 = true;
            }
            if (flag1 === false) flag = false;
          }
          flag1 = false;
          if (flag && categories) {
            for (category in categories) {
              if (item.menuCategories[categories[category]] !== undefined) {
                flag1 = true;
              }
            }
            if (flag1 === false) {
              flag = false;
            }
          }
          if (flag && (minPrice || maxPrice)) {
            flag1 = false;
            Object.keys(item.price).forEach((priceKey) => {
              if (minPrice && maxPrice) {
                if (
                  minPrice < item.price[priceKey].price &&
                  maxPrice > item.price[priceKey].price
                ) {
                  flag1 = true;
                }
              } else {
                if (
                  (minPrice && minPrice < item.price[priceKey].price) ||
                  (maxPrice && maxPrice > item.price[priceKey].price)
                ) {
                  flag1 = true;
                }
              }
            });
            if (flag1 === false) {
              flag = false;
            }
          }
          if (flag) res[key] = item;
        });
      else {
        //return Most Popular
        //todo
        res = items;
      }
      return res;
    });
  return snapshot;
});

exports.addToCart = functions.https.onCall(async (data, context) => {
  const dataPassed = JSON.parse(data);
});

exports.showCart = functions.https.onCall(async (data, context) => {
  const dataPassed = JSON.parse(data);
});

exports.removeFromCart = functions.https.onCall(async (data, context) => {
  const dataPassed = JSON.parse(data);
});

exports.purchaseCart = functions.https.onCall(async (data, context) => {
  const dataPassed = JSON.parse(data);
});

exports.emptyCart = functions.https.onCall(async (data, context) => {
  const dataPassed = JSON.parse(data);
});

exports.addBalance = functions.https.onCall(async (data, context) => {
  const dataPassed = JSON.parse(data);
});

exports.filter = functions.https.onRequest(async (request, response) => {
  const snapshot = await admin
    .database()
    .ref("/public/items")
    .once("value")
    .then((snap) => {
      console.log(snap.val());
      var items = snap.val();
      var res = {};
      Object.keys(items).forEach((key) => {
        var item = items[key];
        var flag = true;
        if (
          flag &&
          request.query.vendor &&
          request.query.vendor !== item.vendor
        ) {
          flag = false;
        }
        //if (request.vendor) {
        //  return "jess";
        //}
        var flag1 = false;
        if (flag && request.query.categories) {
          /*Object.keys(request.query.categories).forEach(function (categoryKey) {
            if (item.categories[categoryKey] !== undefined) {
              flag1 = true;
            }
          });*/
          if (item.menuCategories[request.query.categories] !== undefined) {
            flag1 = true;
          }
          if (flag1 === false) {
            flag = false;
          }
        }
        if (
          flag &&
          (request.query.priceLowerLimit || request.query.priceUpperLimit)
        ) {
          flag1 = false;
          Object.keys(item.price).forEach((priceKey) => {
            if (
              request.query.priceLowerLimit &&
              request.query.priceUpperLimit
            ) {
              if (
                request.query.priceLowerLimit < item.price[priceKey].price &&
                request.query.priceUpperLimit > item.price[priceKey].price
              ) {
                flag1 = true;
              }
            } else {
              if (
                (request.query.priceLowerLimit &&
                  request.query.priceLowerLimit < item.price[priceKey].price) ||
                (request.query.priceUpperLimit &&
                  request.query.priceUpperLimit > item.price[priceKey].price)
              ) {
                flag1 = true;
              }
            }
          });
          if (flag1 === false) {
            flag = false;
          }
        }
        if (flag) res[key] = item;
        //console.log(key, dictionary[key]);
      });
      //return snap.val();
      //if (request.yolo === "yes") return res;

      //else return request.query.vendor;

      return res;
    });
  response.send(snapshot);
});
