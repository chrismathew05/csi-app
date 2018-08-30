//Core React+Meteor imports
import React, {Component} from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

//Component imports
import LoginPage from './LoginPage.jsx';
import MembersList from './MembersDirectoryUI/MembersList.jsx';
import Auction from "./AuctionUI/Auction.jsx";


//Semantic UI imports
import {Grid, Icon, Menu, Label, Header} from 'semantic-ui-react';

//Other
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

//Styles

//Component
class App extends Component {
    state = {activeItem: 'Directory'};

    render() {
        return (
            <div>
                {this.props.userId ?
                    <span>
                        {/* Navbar */}
                        <Menu id='navBar' borderless size='huge' fluid>
                          <Menu.Item>
                            <Header as='h3'>{this.state.activeItem}</Header>
                          </Menu.Item>
                          <Menu.Menu position='right'>
                            <Menu.Item as={Link} to='/' size='big' icon='address book outline' onClick={() => this.setState({activeItem: 'Directory'})}/>
                            <Menu.Item as={Link} to='/auction' size='big' icon='exchange' onClick={() => this.setState({activeItem: 'Auction'})}/>
                            <Menu.Item to='/' size='big' icon='lock' onClick={() => Meteor.logout()}/>
                          </Menu.Menu>
                        </Menu>

                        {/* Content */}
                        <Grid centered>
                          <Grid.Column mobile={16} computer={12}>
                            <Switch>
                                <Route exact path="/" component={MembersList}/>
                                <Route path='/auction' component={Auction}/>
                            </Switch>
                          </Grid.Column>
                        </Grid>
                        <br/>
                        <ToastContainer/>
                    </span>
                    : <LoginPage/>
                }
            </div>
        )
    }
}

App.propTypes = {
    userId: PropTypes.string
};

export default withTracker(() => {

    return {
        userId: Meteor.userId(),
    };
})(App);
