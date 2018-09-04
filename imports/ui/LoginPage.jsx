import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';

import {Grid, Segment, Form, Icon, Header, Image} from 'semantic-ui-react';

class LoginPage extends Component {
    state = {userNameAttempt: '', pwdAttempt: ''};

    handleChange = (e, {name, value}) => this.setState({[name]: value});

    render() {
        return (
            <div className='fully-centred'>
                <Grid>
                    <Grid.Column mobile={16}>
                        <Segment size='massive' raised textAlign='center'>
                            <Image src={'full-logo.jpg'}/>
                            <br/>
                            <Form>
                                <Form.Input placeholder='Username' name='userNameAttempt'
                                            value={this.state.userNameAttempt} onChange={this.handleChange}/>
                                <Form.Input placeholder='Password' name='pwdAttempt' value={this.state.pwdAttempt}
                                            onChange={this.handleChange} type='password'/>
                                <Form.Button
                                    onClick={() => Meteor.loginWithPassword(this.state.userNameAttempt, this.state.pwdAttempt)}>Login</Form.Button>
                            </Form>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }

}

export default LoginPage;
