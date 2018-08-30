// Core React+Meteor imports
import React, {Component} from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import {Input, List, Loader, Icon} from 'semantic-ui-react';

// Component imports
import {Members} from '../../api/Members.js';
import {HOF} from '../../api/HOF.js';

import AddMember from './AddMember.jsx';
import MemberCard from './MemberCard.jsx';

// Semantic UI imports
import {Checkbox} from "semantic-ui-react";


// Other

// Styles

// Component
class MembersList extends Component {
    state = {
        searchFilter: '',
        timeout: null,
        hideAddMemberForm: false
    };

    checkMatch = (hof) => {
        let relations = hof.relations;
        let relationsLength = relations.length;
        for (let i = 0; i < relationsLength; i++) {
            let relationId = relations[i].split(':')[0];
            let relationName = Members.findOne({_id: relationId}, {fields: {name: 1}}).name;
            if (relationName && relationName.startsWith(this.state.searchFilter)) {
                return true;
            }
        }
        return false;
    };

    renderFamilyCards = () => {
        let hofList = this.props.hofList;

        if (this.state.searchFilter !== '') {
            if (isNaN(this.state.searchFilter)) {
                hofList = this.props.hofList.filter(hof => this.checkMatch(hof));
            } else {
                let searchFilter = +this.state.searchFilter;
                hofList = this.props.hofList.filter(hof => hof.famNum === searchFilter);
            }
        }

        return hofList.map(hof => (
            <List.Item key={hof._id}>
                <MemberCard hof={hof} members={this.props.members}/>
                <br/>
            </List.Item>
        ));
    };

    handleChange = (e, {name, value}) => {
        e.preventDefault();

        let timeout = this.state.timeout;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            this.setState({searchFilter: value});
        }, 500);
        this.setState({timeout});
    };

    toggle = () => this.setState({hideAddMemberForm: !this.state.hideAddMemberForm});

    render() {
        return (
            <div>
                {/*Search Bar*/}
                <Input fluid icon='search' size='large' placeholder='Search by name or family number...' onChange={this.handleChange}/>
                <br/>

                {/*Add Member Form*/}
                {this.props.isAdmin ?
                    <div>
                        <div style={{float: 'right'}}>
                            <Checkbox label={'Show/hide form'} checked={!this.state.hideAddMemberForm} onChange={this.toggle}/>
                        </div>
                        <br/>
                        {this.state.hideAddMemberForm ?
                            <span/> : <AddMember members={this.props.members} hofList={this.props.hofList}/>
                        }
                    </div> : <span/>
                }
                <br/>

                {/*Family Cards*/}
                {this.props.ready ?
                    <div>
                        <List>
                            {this.renderFamilyCards()}
                        </List>
                    </div> : <Loader/>
                }
            </div>
        );
    }

}

MembersList.propTypes = {
    isAdmin: PropTypes.bool,
    ready: PropTypes.bool,
    members: PropTypes.array,
    hofList: PropTypes.array
};

export default withTracker(() => {
    let isAdmin = false;
    let user = (Meteor.users.find().fetch())[0];

    let hofSub = Meteor.subscribe('allHOF');
    let membersSub = Meteor.subscribe('allMembers');
    let imageSub = Meteor.subscribe('allImages');

    let members = Members.find().fetch();
    let hofList = HOF.find().fetch();

    if (user && user.roles) {
        isAdmin = user.roles.__global_roles__[0] === 'Admin';
    }

    let ready = hofSub.ready() && membersSub.ready() && imageSub.ready();

    return {
        isAdmin,
        hofList,
        members,
        ready
    };
})(MembersList);
