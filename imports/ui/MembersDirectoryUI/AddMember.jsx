// Core React+Meteor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Component imports
import MemberForm from './MemberForm.jsx';

// Semantic UI imports
import { Card } from 'semantic-ui-react';

// Styles

// Component
export default class AddMember extends Component {
  render() {
    return (
      <Card fluid>
        <Card.Content header='Add Member' />
        <Card.Content>
          <MemberForm
            adding={true}
            members={this.props.members}
            hofList={this.props.hofList}
            name=''
            email=''
            telephone=''
            dob={null}
            dow={null}
            hof={false}
            famNum=''
            homeTelephoneNo=''
            homeAddress=''
            homeParish=''
            relations={[]}
          />
        </Card.Content>
      </Card>
    );
  }
}

AddMember.propTypes = {
  members: PropTypes.array,
  hofList: PropTypes.array
};
