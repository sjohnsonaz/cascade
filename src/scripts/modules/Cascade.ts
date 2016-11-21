export {IObservable, ISubscriber, ISubscriberFunction} from '../graph/IObservable';
export {default as Observable} from '../graph/Observable';
export {default as Computed} from '../graph/Computed';
export {default as ObservableArray} from '../graph/ObservableArray';
import {default as Graph} from '../graph/Graph';
export {observable, computed, array} from '../graph/Decorators';
export {IVirtualNode, IVirtualNodeProperties} from '../cascade/IVirtualNode';
export {default as VirtualNode} from '../cascade/VirtualNode';
export {default as Component} from '../cascade/Component';
import {default as VirtualDom} from '../cascade/VirtualDom';

export default class Cascade {
    static createElement = VirtualDom.createElement;
    static render = VirtualDom.render;
    static createObservable = Graph.createObservable;
    static createObservableArray = Graph.createObservableArray;
    static createComputed = Graph.createComputed;
    static disposeAll = Graph.disposeAll;
    static peek = Graph.peek;
    static subscribe = Graph.subscribe;
    static getObservable = Graph.getObservable;
    static getSubscribers = Graph.getSubscribers;
    static getReferences = Graph.getReferences;
}
