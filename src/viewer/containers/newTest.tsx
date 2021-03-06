import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FromViewerMessage } from '../../types/messages';
import { createNewTest } from '../api';

interface NewTestProps {
    sendMessage: (msg: FromViewerMessage) => void;
}

export class NewTest extends React.Component<NewTestProps & RouteComponentProps<any>, {}> {
    private inputElement: HTMLInputElement;

    public render() {
        return <div>
            <h1>New test creating</h1>
            <label>
                URL:&nbsp;
                <input
                    style={{
                        width: '300px',
                    }}
                    type='text'
                    ref={(el: HTMLInputElement) => this.inputElement = el}
                    defaultValue='http://localhost:3000/examples'
                    onKeyPress={this.onKeyPress}
                />
            </label>
            <br/>
            <button onClick={this.buttonOnClick}>Create</button>
        </div>;
    }

    private onKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.which === 13) {
            this.buttonOnClick();
        }
    }

    private buttonOnClick = async () => {
        const value = this.inputElement.value;
        if (value.length === 0) {
            return;
        }

        try {
            await createNewTest(value);
            this.props.history.push('/');
        } catch (err) {
            console.log(err, err.response);
        }
    }
}
