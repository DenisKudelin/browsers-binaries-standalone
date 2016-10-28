"use strict";
var Browsers_1 = require("./Browsers/Browsers");
exports.Platform = Browsers_1.Platform;
exports.Chromium = Browsers_1.Chromium;
exports.Firefox = Browsers_1.Firefox;
/*install({
    browsers: [{
        name: "chromium",
        version: "54.0.2840.71",
        platform: "Win_x64"
    }]
}, {
    browsers: [{
        name: "firefox",
        version: "49.0",
        platform: "Win_x64",
       language: "en-US" // default;
    }]
});*/
/*let chromeTest = [(() => {
    let browser = new Chromium(Platform.Win_x64, "54.0.2840.71");
    return browser.install();
}),
(() => {
    let browser = new Chromium(Platform.Linux_x64, "54.0.2840.71");
    return browser.install();
}),
(() => {
    let browser = new Chromium(Platform.Mac, "54.0.2840.71");
    return browser.install();
})];

let firefoxTest = [(() => {
    let browser = new Firefox(Platform.Win_x64, "49.0");
    return browser.install();
}),
(() => {
    let browser = new Firefox(Platform.Linux_x64, "40.0");
    return browser.install();
}),
(() => {
    let browser = new Firefox(Platform.Mac, "30.0");
    return browser.install();
})];*/
//Promise.each(firefoxTest, x => x());
//firefoxTest[2](); 
