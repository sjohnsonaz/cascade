export default class Context {
    $data: Object;
    $root: Context;
    $parent: Context;
    $depth: number;
    $index: number;
    $children: IContextIndex = {};

    constructor(data: Object, root?: Context, parent?: Context, depth?: number, index?: number) {
        this.$data = data
        this.$root = root || parent || this;
        this.$parent = parent;
        this.$depth = depth || 0;
        this.$index = index || 0;
    }

    $parents(parentIndex) {
        var parent = this.$parent;
        for (var index = 0; index < parentIndex; index++) {
            if (parent) {
                parent = parent.$parent;
            } else {
                parent = undefined;
                break;
            }
        }
        return parent;
    }

    static child(value, current) {
        if (current) {
            return new Context(value, current.$root, current);
        } else {
            return new Context(value);
        }
    }
}

export interface IContextIndex {
    [index: string]: Context;
}
