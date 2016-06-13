var TestRunner = (function () {
    function TestRunner() {

    }

    TestRunner.prototype = {

    };

    TestRunner.tests = [];

    TestRunner.test = function (test) {
        TestRunner.tests.push(test);
    };

    TestRunner.run = function (callback, tests) {
        tests = tests || TestRunner.tests;
        var results = [];
        if (tests.length) {
            console.log('Running tests...');
            console.time('Test time');
            runTests(tests, results, function () {
                console.timeEnd('Test time');
                var pass = 0;
                var fail = 0;
                for (var index = 0, length = results.length; index < length; index++) {
                    if (results[index].pass) {
                        pass++;
                    } else {
                        fail++;
                    }
                }
                console.log('Tests: ' + results.length + ', Pass: ' + pass + ', Fail: ' + fail);
                callback();
            });
        } else {
            console.log('No tests to run.');
        }
    }

    function runTests(tests, results, callback) {
        var test = tests.shift();
        if (test) {
            results.push(test);
            console.log('Running: ' + test.name || 'test');
            test.test(test.input, function (result) {
                test.result = result;
                if (test.assert) {
                    test.assert(result, function (pass) {
                        test.pass = pass;
                        console.log('Pass: ' + pass);
                        runTests(tests, results, callback);
                    });
                } else {
                    test.pass = true;
                    console.log('Pass: ' + true);
                    runTests(tests, results, callback);
                }
            });
        } else {
            callback();
        }
    }

    return TestRunner;
})();
