export enum CascadeError {
    NoRootNode = 'Could not find root node',
    InvalidRootRender = 'Root render is not a Node.  Nothing was rendered, and nothing will be updated',
    NoObservable = 'No observable attached to Object: ',
    NoOldComponent = 'Old Component has never been rendered',
    TimeoutElapsed = 'Timeout elapsed'
}