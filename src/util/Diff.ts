export default class Diff {
    static createTable<T>(m: number, n: number) {
        var table: T[][] = new Array(m);
        for (var i = 0; i < m; i++) {
            table[i] = new Array(n);
        }
        return table;
    }

    // TODO: Optimize for empty cases and identical beginnings and endings.
    static compare<T>(x: T[], y: T[], comparison?: (x: T, y: T) => boolean): IDiffItem<T>[];
    static compare(x: string, y: string, comparison?: (x: string, y: string) => boolean): IDiffItem<string>[];
    static compare<T>(x: T[] | string, y: T[] | string, comparison?: (x: T | string, y: T | string) => boolean): IDiffItem<T | string>[] {
        var m = x.length;
        var n = y.length;
        var table: number[][] = Diff.createTable<number>(m + 1, n + 1);

        /*
         * Following steps build table[m+1][n+1] in bottom up fashion.
         * Note that table[i][j] contains length of LCS of x[0..i-1] and y[0..j-1]
         */
        for (var i = 0; i <= m; i++) {
            for (var j = 0; j <= n; j++) {
                if (i == 0 || j == 0) {
                    table[i][j] = 0;
                } else if (comparison ? comparison(x[i - 1], y[j - 1]) : x[i - 1] == y[j - 1]) {
                    table[i][j] = table[i - 1][j - 1] + 1;
                } else {
                    table[i][j] = Diff.max(table[i - 1][j], table[i][j - 1]);
                }
            }
        }

        // Create a diff array
        var diff: IDiffItem<T | string>[] = [];

        // Start from the right-most-bottom-most corner and
        // one by one store characters in diff[]
        i = m;
        j = n;
        while (i > 0 || j > 0) {
            if (i === 0) {
                while (j > 0) {
                    diff.push({
                        operation: DiffOperation.ADD,
                        item: y[j - 1]
                    });
                    j--;
                }
            } else if (j === 0) {
                while (i > 0) {
                    diff.push({
                        operation: DiffOperation.REMOVE,
                        item: x[i - 1]
                    });
                    i--;
                }
            } else {
                // If current character in X[] and Y are same, then
                // current character is part of LCS
                if (comparison ? comparison(x[i - 1], y[j - 1]) : x[i - 1] == y[j - 1]) {
                    // Put current character in result
                    diff.push({
                        operation: DiffOperation.NONE,
                        item: x[i - 1],
                        itemB: y[j - 1]
                    });
                    // reduce values of i and j
                    i--; j--;
                } else {
                    // If not same, then find the larger of two and
                    // go in the direction of larger value
                    if (table[i - 1][j] > table[i][j - 1]) {
                        diff.push({
                            operation: DiffOperation.REMOVE,
                            item: x[i - 1]
                        });
                        i--;
                    } else {
                        diff.push({
                            operation: DiffOperation.ADD,
                            item: y[j - 1]
                        });
                        j--;
                    }
                }
            }
        }
        //diff.reverse();
        return diff;
    }

    /* Utility function to get max of 2 integers */
    static max(a: number, b: number) {
        return (a > b) ? a : b;
    }

    // TODO: Optimize reads
    // TODO: Decide if truthy or non-null and non-undefined
    static compareHash(x: Object, y: Object) {
        var result = {};

        for (var name in x) {
            if (x.hasOwnProperty(name)) {
                var xValue = x[name];
                var yValue = y[name];
                if (xValue !== yValue) {
                    // Should this be falsy?
                    if (yValue == undefined) {
                        result[name] = null;
                    } else {
                        result[name] = yValue;
                    }
                }
            }
        }

        for (var name in y) {
            if (y.hasOwnProperty(name)) {
                var xValue = x[name];
                var yValue = y[name];
                if (xValue !== yValue) {
                    // Should this be falsy?
                    if (yValue == undefined) {
                        result[name] = null;
                    } else {
                        result[name] = yValue;
                    }
                }
            }
        }

        return result;
    }
}

export enum DiffOperation {
    REMOVE = -1,
    NONE = 0,
    ADD = 1
}

export interface IDiffItem<T> {
    item: T;
    itemB?: T;
    operation: DiffOperation;
}
