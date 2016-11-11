import {IVirtualNode, IVirtualNodeProperties, IVirtualNodePatch, PatchOperation} from './IVirtualNode';

export default class Diff {
    static diff(newRoot: IVirtualNode<any>, oldRoot?: IVirtualNode<any>) {
        var diff: IVirtualNodePatch[] = [];
        if (oldRoot) {
            var newChildren = newRoot.children;
            var oldChildren = oldRoot.children;
            for (var index = 0, length = newChildren.length; index < length; index++) {
                var newChild = newChildren[index];
            }
        }
        return diff;
    }

    static createTable(m: number, n: number) {
        var table: number[][] = new Array(m);
        for (var i = 0; i < m; i++) {
            table[i] = new Array(n);
        }
        return table;
    }

    static lcs(x: string, y: string): string {
        var m = x.length;
        var n = y.length;
        var table: number[][] = Diff.createTable(m + 1, n + 1);

        /*
         * Following steps build table[m+1][n+1] in bottom up fashion.
         * Note that table[i][j] contains length of LCS of x[0..i-1] and y[0..j-1]
         */
        for (var i = 0; i <= m; i++) {
            for (var j = 0; j <= n; j++) {
                if (i == 0 || j == 0) {
                    table[i][j] = 0;
                } else if (x[i - 1] == y[j - 1]) {
                    table[i][j] = table[i - 1][j - 1] + 1;
                } else {
                    table[i][j] = Diff.max(table[i - 1][j], table[i][j - 1]);
                }
            }
        }

        /* table[m][n] contains length of LCS for X[0..n-1] and Y[0..m-1] */
        var index = table[m][n];

        // Create a character array to store the lcs string
        var lcs: string[] = new Array(index);
        //lcs[index] = '\0'; // Set the terminating character

        // Start from the right-most-bottom-most corner and
        // one by one store characters in lcs[]
        i = m;
        j = n;
        while (i > 0 && j > 0) {
            // If current character in X[] and Y are same, then
            // current character is part of LCS
            if (x[i - 1] == y[j - 1]) {
                lcs[index - 1] = x[i - 1]; // Put current character in result
                i--; j--; index--;     // reduce values of i, j and index
            }

            // If not same, then find the larger of two and
            // go in the direction of larger value
            else if (table[i - 1][j] > table[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }

        return lcs.join('');
    }

    /* Utility function to get max of 2 integers */
    static max(a: number, b: number) {
        return (a > b) ? a : b;
    }
}
