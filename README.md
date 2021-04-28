# hexview-js
Simple hex viewer

## How to use

``` html
<!DOCTYPE html>

<html>
    <head>
        <title>hexview sample</title>
        <!-- 1. load hexview.css -->
        <link href="./hexview.css" rel="stylesheet" type="text/css">
        <!-- 2. load hexview.js -->
        <script src="./hexview.js"></script>
    </head>
    <body>
        <h1>hexview sample</h1>

        <!-- 3. create hexview render area -->
        <div id="hexview1"></div>

        <script>
            // 3. generate hexview
            var hv = hexview.generate({
                bindto: "hexview1", // id of render area
                data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // initial data
                flashTime: 120, // flash time when data changes (optional)
            });

            // 4. update data (optional)
            var i=0;
            setInterval(function(){
                i += 1;
                hv.update([i, i+1, i+2]);
            }, 1000);
        </script>
    </body>
</html>
```


## How to build

require: Node.js

```
git clone git://github.com/saelay/hexview-js
cd hexview-js
npm install restore
npm run build
```

After the build is complete, you can find `build/hexview.js`.

## License

MIT
