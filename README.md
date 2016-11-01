Usage:

```
var browsersBinariesStandalone = require("browsers-binaries-standalone");

var browsers = browsersBinariesStandalone.install({
    defaultPath: __dirname + "/browsers", // default path to binaries
    firefox: {
        path: __dirname + "/not_browsers", // path to binaries
        version: "47.0.1",
        platform: "Win_x64",
        language: "en-US" // default;
    },
    chromium: [{
        version: "54.0.2840.71",
        platform: "Win_x64"
    },{
        version: "55.0.2883.21",
        platform: "Mac"
    }]
});
```

Available platforms:
```
Win
Win_x64
Linux
Linux_x64
Mac
```

Getting path to the executable file:
```
browsers[0].getExecutablePath();
```