export default class TestRunner {
    constructor() {
    }

    static tests: Array<any> = [];
    static consoleRoot?: HTMLElement

    static test(test) {
        TestRunner.tests.push(test);
    }

    static run(callback, tests?: any) {
        tests = tests || TestRunner.tests;
        var results = [];
        if (tests.length) {
            TestRunner.consoleOutput('log', 'Running tests...');
            console.time('Test time');
            TestRunner.runTests(tests, results, function() {
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
                TestRunner.consoleOutput('log', 'Tests: ' + results.length + ', Pass: ' + pass + ', Fail: ' + fail);
                callback();
            });
        } else {
            TestRunner.consoleOutput('log', 'No tests to run.');
        }
    }

    static consoleOutput(type: string, ...output: any[]) {
        console[type](...output);
        if (TestRunner.consoleRoot) {
            var fragment = document.createDocumentFragment();
            for (var index = 0, length = output.length; index < length; index++) {
                var code = document.createElement('code');
                code.className = type;
                var text = document.createTextNode(output[index].toString() + '\r\n');
                code.appendChild(text);
                fragment.appendChild(code);
            }
            TestRunner.consoleRoot.appendChild(fragment);
            TestRunner.consoleRoot.scrollTop = TestRunner.consoleRoot.scrollHeight;
        }
    }

    private static runTests(tests, results, callback) {
        var test = tests.shift();
        if (test) {
            results.push(test);
            TestRunner.consoleOutput('log', 'Running: ' + test.name || 'test');
            test.test(test.input, function(result) {
                test.result = result;
                if (test.assert) {
                    test.assert(result, function(pass) {
                        test.pass = pass;
                        TestRunner.consoleOutput(pass ? 'log' : 'error', 'Pass: ' + pass);
                        TestRunner.runTests(tests, results, callback);
                    });
                } else {
                    test.pass = true;
                    TestRunner.consoleOutput('log', 'Pass: ' + true);
                    TestRunner.runTests(tests, results, callback);
                }
            });
        } else {
            callback();
        }
    }
}
