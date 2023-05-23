// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

let perDrinkVolume = 0;
let waterTakenInML = 0;

function setTestAlarm(event) {
  let minutes = parseFloat(event.target.value);
  setAlarm(minutes);
}

function setCustomAlarm(event) {
  let minutesAsText = document.getElementById("roundPeriod").value;
  console.log(minutesAsText);
  let minutes = parseFloat(minutesAsText);
  setAlarm(minutes);
}

function setAlarm(minutes) {
  waterTakenInML = chrome.storage.sync.get(["waterDrankInML"]);

  chrome.storage.sync.set({ waterDrankInML: 0 });
  if (perDrinkVolume == 0) {
    chrome.storage.sync.set({ perDrinkVolume: 0 });
  }
  console.log(perDrinkVolume);
  chrome.action.setBadgeText({ text: "ON" });
  chrome.alarms.create({ delayInMinutes: minutes });
  chrome.storage.sync.set({ minutes: minutes });
  window.close();
}

function clearAlarm() {
  chrome.action.setBadgeText({ text: "" });
  chrome.alarms.clearAll();
  window.close();
}

//An Alarm delay of less than the minimum 1 minute will fire
// in approximately 1 minute increments if released
// document.getElementById("sampleMinute").addEventListener("click", setTestAlarm);
document.getElementById("setAlarm").addEventListener("click", setCustomAlarm);
document.getElementById("cancelAlarm").addEventListener("click", clearAlarm);

document
  .getElementById("setWaterQuanPerRound")
  .addEventListener("change", setWaterPerRound);

function setWaterPerRound(ev) {
  perDrinkVolume = parseInt(ev.target.value);

  chrome.storage.sync.set({ perDrinkVolume: perDrinkVolume });
}
