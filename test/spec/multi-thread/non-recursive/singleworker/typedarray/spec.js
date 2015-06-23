describe("NonRecursiveQuickSort", function () {
    it("should sort an array in ascending order", function () {
        var conf = {n: 10, randMax: 100, verbose: false};
        var queryStrings = location.search.substring(1).split("&");
        for (var i = 0, len = queryStrings.length; i < len; i++) {
            if (queryStrings[i] !== "") {
                var query = queryStrings[i].split("=");
                if (query[0] === "n") conf.n = parseInt(query[1]);
                if (query[0] === "randmax") conf.randMax = parseInt(query[1]);
            }
        }
        var ary = new Array(conf.n);
        var result = new Array(ary.length);
        var w = new Worker(window.location.origin + "/quicksort/src/worker/non-recursive/typedarray/worker.js");

        // message handler
        w.onmessage = function (event) {
            console.log("------------------------------");
            console.timeEnd("Time");
            var ary = event.data;
            for (var i = 0, len = ary.length; i < len; i++) {
                result[i] = ary[i];
            }
            if (conf.verbose) console.log("sorted array: " + result);
            if (conf.verbose) console.log("len: " + result.length);
        };

        // generate the values
        for (var i = 0, count = conf.n; i < count; i++) {
            ary[i] = Math.floor(Math.random() * conf.randMax);
        }

        console.log("n: " + conf.n);
        if (conf.verbose) console.log("original array: " + ary);
        if (conf.verbose) console.log("len: " + ary.length);

        // ------------------------------
        //  start sorting
        // ------------------------------
        {
            console.log("------------------------------");
            console.time("Time");
            console.time("create a typed array");
        }
        var data = new Int32Array(ary);
        {
            console.timeEnd("create a typed array");
        }
        w.postMessage(data, [data.buffer]);

        // ------------------------------
        //  check the result
        // ------------------------------
        var isAscendingOrder = true;
        if (result.length > 0) {
            for (var i = 0, len = result.length; i + 1 < len; i++) {
                if (result[i] > result[i + 1]) {
                    isAscendingOrder = false;
                    break;
                }
            }
        }
        else {
            isAscendingOrder = false;
        }
        expect(isAscendingOrder).toEqual(true);
    });
});
