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
        var index = 0;
        var output = [];
        if (index < tests.length) {
            console.log('Running tests...');
            console.time('Test time');
            runTest(tests, index, function iterate(data) {
                output.push(data);
                index++;
                if (index < tests.length) {
                    runTest(tests, index, iterate);
                } else {
                    console.timeEnd('Test time');
                    callback(output);
                }
            });
        } else {
            console.log('No tests to run.');
        }
    }

    function runTest(tests, index, callback) {
        var test = tests[index];
        console.log('Running: ' + test.name || 'test');
        test.test(test.input, callback);
    }

    return TestRunner;
})();
