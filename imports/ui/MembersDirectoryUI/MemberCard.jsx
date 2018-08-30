// Core React+Meteor imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withTracker} from "meteor/react-meteor-data";

// Component imports
import Images from "../../api/Images.js";

// Semantic UI imports
import {Card, Grid, Image, Table, Message} from 'semantic-ui-react';

// Other

// Styles

// Component
class MemberCard extends Component {

    findMember = (memberId) => {
        const membersLength = this.props.members.length;
        for (let i = 0; i < membersLength; i++) {
            let member = this.props.members[i];
            if (member._id === memberId) {
                return member;
            }
        }
    };

    generateHOFName = (memberId) => {
        let m = this.findMember(memberId);
        let hofName = '';

        if (m) {
            hofName = m.name;
        }
        return hofName;
    };

    renderTableRows = () => {
        return this.props.hof.relations.map((relation) => {
            let parts = relation.split(':');
            let memberId = parts[0];
            let relationship = parts[1];

            let m = this.findMember(memberId);

            return (
                <Table.Row key={m._id}>
                    <Table.Cell>{m.name}</Table.Cell>
                    <Table.Cell>{relationship}</Table.Cell>
                    <Table.Cell>{m.dob}</Table.Cell>
                    <Table.Cell>{m.dow}</Table.Cell>
                    <Table.Cell>{<a href={'tel:' + m.telephone}>{m.telephone}</a>}</Table.Cell>
                    <Table.Cell>{<a href={'mailto:' + m.email}>{m.email}</a>}</Table.Cell>
                </Table.Row>
            );
        });
    };

    generateMapsLink = (address) => {
        let encodedURL = address.trim().split(' ').join('+');
        encodedURL = 'https://www.google.com/maps/dir/?api=1&destination=' + encodedURL + '&dir_action=navigate&travelmode=driving';
        console.log(encodedURL);
        return <a href={encodedURL}>{address}</a>;
    };

    render() {
        return (
            <Card fluid>
                <Card.Content header={this.props.hof.famNum + '. ' + this.generateHOFName(this.props.hof.memberName)}/>
                <Card.Content>
                    <Grid stackable>

                        {/* Family Info */}
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Image fluid src={this.props.link}/>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Message
                                    icon='phone'
                                    header='Home Number'
                                    content={<a href={'tel:' + this.props.hof.homeTelephoneNo}>{this.props.hof.homeTelephoneNo}</a>}
                                />
                                <Message
                                    icon='home'
                                    header='Home Address'
                                    content={this.generateMapsLink(this.props.hof.homeAddress)}
                                />
                                <Message
                                    icon='plus'
                                    header='Home Parish'
                                    content={this.generateMapsLink(this.props.hof.homeParish)}
                                />
                            </Grid.Column>
                        </Grid.Row>

                        {/* Individual Info */}
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Table celled unstackable>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Rel</Table.HeaderCell>
                                            <Table.HeaderCell>DOB</Table.HeaderCell>
                                            <Table.HeaderCell>DOW</Table.HeaderCell>
                                            <Table.HeaderCell>Tel #</Table.HeaderCell>
                                            <Table.HeaderCell>Email</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {this.renderTableRows()}
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
            </Card>
        );
    }
}

MemberCard.propTypes = {
    hof: PropTypes.object,
    members: PropTypes.array,
    link: PropTypes.string,
};

export default withTracker((props) => {

    let img = Images.findOne({meta: {famNum: props.hof.famNum.toString()}});
    let link = img ? img.link() : '';

    return {
        link
    };
})(MemberCard);
