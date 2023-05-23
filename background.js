// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

chrome.alarms.onAlarm.addListener(() => {
  var quote = "";
  fetch("https://type.fit/api/quotes")
    .then(function (response) {
      return response.json();
    })
    .then(async (data) => {
      console.log(data);
      let max = 100;
      var num = Math.ceil(Math.random() * max);

      quote = data[num].text;
      console.log(num);
      console.log(quote);

      chrome.action.setBadgeText({ text: "" });

      var waterDrankInML = await chrome.storage.sync.get(["waterDrankInML"]);
      var perDrinkVolume = await chrome.storage.sync.get(["perDrinkVolume"]);
      waterDrankInML = waterDrankInML.waterDrankInML
      perDrinkVolume = perDrinkVolume.perDrinkVolume
      waterDrankInML += perDrinkVolume
      await chrome.storage.sync.set({
        waterDrankInML: waterDrankInML,
      });
      chrome.notifications.create({
        type: "basic",
        iconUrl: "resources/drink_water128.png",
        title: "H2O-ation",
        message: quote + "\n\nAnd you are "+waterDrankInML+" ml healthier than before :)",
        buttons: [{ title: "Keep it flowing" }],
        priority: 0,
        requireInteraction: true,
      });
    });
});

chrome.notifications.onButtonClicked.addListener(async () => {
  const item = await chrome.storage.sync.get(["minutes"]);
  chrome.action.setBadgeText({ text: "ON" });
  chrome.alarms.create({ delayInMinutes: item.minutes });
});

// when notification closed.. not right, when service worker installed, reset to 0
chrome.notifications.onClosed.addListener(async () => {
  chrome.storage.sync.set({ waterDrunkInML: 0 });
});
