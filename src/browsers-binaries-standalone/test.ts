import {_, Path, Url, Promise} from "./externals";
import {Platform, Chromium, Firefox} from "./Browsers/Browsers";
export {Chromium, Firefox, Platform};

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