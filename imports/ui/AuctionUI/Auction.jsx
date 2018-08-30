//Core React+Meteor imports
import React, {Component} from 'react';

//Custom Component Imports

//Semantic UI Imports
import { Message, Icon } from "semantic-ui-react";


//Other

export default class Auction extends Component {
    render() {
        return (
            <div>
                <Message icon>
                    <Icon name='inbox' />
                    <Message.Content>
                        <Message.Header>Coming Soon</Message.Header>
                        Page is under construction
                    </Message.Content>
                </Message>
            </div>
        );
    }
}