# Cascade

## A modern library for creating user interfaces

Written for JavaScript and TypeScript, Cascade is a complete framework for displaying and synchronizing application data.

Using modern techniques, the framework simply *"gets out of your way"*.  You simply set up your **Application State**, display it in a **Component**, and Cascade handles the rest.  If you update the data, the DOM is automatically updated as well!

Plus, using careful dependency tracking, updates are planned for maximum efficiency!

Getting a Cascade application going is super easy!

```` TypeScript
/* Import Cascade */
import Cascade, { Component, observable } from 'cascade';

/* Define your Application State */
class ApplicationState {
    @observable value = 'Some value';
}

/* Define your Component Props */
interface IViewProps {
    applicationState: ApplicationState;
}

/* Define your Component */
class View extends Component<IViewProps> {
    render() {
        let { applicationState } = this.props;
        return (
            <div>{applicationState.value}</div>
        );
    }
}

/* Render your Application */
let applicationState = new ApplicationState();
Cascade.render(document.body, <View applicationState={applicationState} />);

/* Update your Application State */
applicationState.value = 'Some NEW value';
````

**So go ahead and [get started](0-Overview/0.0-Getting-Started/)!**