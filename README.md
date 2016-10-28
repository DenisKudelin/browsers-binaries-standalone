Usage:

```
var browsersBinariesStandalone = require("browsers-binaries-standalone");

var browsers = browsersBinariesStandalone.install({
    browsers: [{
        name: "chromium",
        version: "54.0.2840.71",
        platform: "Win_x64"
    },{
        name: "firefox",
        version: "49.0",
        platform: "Win_x64",
       language: "en-US" // default;
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