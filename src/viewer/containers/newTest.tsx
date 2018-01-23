import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FromViewerMessage, NewTestFromViewerMessage } from '../../types/messages';

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

    private buttonOnClick = () => {
        const value = this.inputElement.value;
        if (value.length === 0) {
            return;
        }

        const msg: NewTestFromViewerMessage = {
            type: 'newTest',
            data: {
                url: this.inputElement.value,
            },
        };

        this.props.sendMessage(msg);
        this.props.history.push('/');
    }
}
