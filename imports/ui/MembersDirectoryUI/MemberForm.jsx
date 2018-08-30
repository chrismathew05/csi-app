// Core React+Meteor imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Component imports
import Images from "../../api/Images";

// Semantic UI imports
import {Form} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

// Other
import {toast} from 'react-toastify';

// Styles
import 'react-datepicker/dist/react-datepicker.css';

// Component
export default class MemberForm extends Component {
    state = {
        adding: this.props.adding, // false if editing instead
        name: this.props.name,
        dob: this.props.dob,
        dow: this.props.dow,
        telephone: this.props.telephone,
        email: this.props.email,
        hof: this.props.hof,
        famNum: this.props.famNum,
        homeTelephoneNo: this.props.homeTelephoneNo,
        homeAddress: this.props.homeAddress,
        homeParish: this.props.homeParish,
        relations: this.props.relations,
        inProgress: false,
        file: {}
    };

    famNumError = () => {
        if (!this.state.hof) {
            return false;
        }
        if (this.state.famNum === '') {
            toast.error("Family Number is a required field for HOF!");
            return true;
        }

        // check for uniqueness
        let listLength = this.props.hofList.length;
        for (let i = 0; i < listLength; i++) {
            let hof = this.props.hofList[i];
            if (hof.famNum === this.state.famNum) {
                toast.error("Family Number already exists - must be unique!");
                return true;
            }
        }
    };

    // error checking and initiate file upload if necessary
    initializeSubmission = () => {
        //error checking
        if (this.state.name === '') {
            toast.error("Member name is a required field!");
            return;
        }
        if (this.famNumError()) {
            return;
        }
        if(this.state.file === {}) {
            toast.error('Family picture is required!');
            return;
        }

        if (this.state.adding) {
            if (this.state.hof) {
                // rename file to famNum for easy searchFilter later

                const uploader = Images.insert({
                    file: this.state.file,
                    meta: {famNum: this.state.famNum},
                    streams: 'dynamic',
                    chunkSize: 'dynamic',
                    allowWebWorkers: true
                }, false);

                // upload instance event handlers
                uploader.on('start', () => this.setState({inProgress: true}));
                uploader.on('error', (error) => {
                    this.setState({inProgress: false});
                    toast.error('Something went wrong - error: ' + error);
                });
                uploader.on('uploaded', () => this.submitMember()); // handle insertion of Member after successful image upload

                uploader.start(); // start upload
            } else {
                this.submitMember();
            }
        }
    };

    submitMember = () => {
        // create new Member
        let newMember = {
            name: this.state.name,
            dob: this.state.dob === null ? '' : this.state.dob.format('MM/DD'),
            dow: this.state.dow === null ? '' : this.state.dow.format('MM/DD'),
            telephone: this.state.telephone,
            email: this.state.email
        };

        // create new HOF as well, if applicable
        let newHof = {};
        if (this.state.hof) {
            newHof = {
                famNum: this.state.famNum,
                homeTelephoneNo: this.state.homeTelephoneNo,
                homeAddress: this.state.homeAddress,
                homeParish: this.state.homeParish,
                relations: this.state.relations
            }
        }

        // insert member
        Meteor.call("Members.insert", newMember, this.state.hof, newHof);
        toast.success('Member submitted successfully!');
        this.setState({
            name: '',
            dob: null,
            dow: null,
            telephone: '',
            email: '',
            hof: false,
            famNum: '',
            homeTelephoneNo: '',
            homeAddress: '',
            homeParish: '',
            relations: [],
            inProgress: false,
            uploader: {}
        });

        document.querySelector('#addName').focus();
    };

    populateMembersList = () => {
        let membersList = [];
        const relationsLength = this.state.relations.length;
        this.props.members.forEach((i) => {
            let val = i._id;
            for (let x = 0; x < relationsLength; x++) {
                // indicates that member has been selected
                let parts = this.state.relations[x].split(':');
                if (i._id === parts[0]) {
                    val += ':' + parts[1];
                }
            }
            membersList.push({key: i._id, value: val, text: i.name})
        });

        return membersList;
    };

    renderLabel = (label) => {
        let relation = `${label.value}`;
        relation = relation.split(':')[1];

        return {
            color: 'blue',
            content: `${label.text}` + ' - ' + relation,
        }
    };

    handleDropdownChange = (e, {value}) => {
        const relationsLength = this.state.relations.length;
        let newArray = value;
        let relation = null;
        if (relationsLength < newArray.length) {
            relation = prompt("Please enter relation (Son, Daughter, etc.):", "");
            newArray[newArray.length - 1] += ':' + relation;
        }

        if (relation) {
            this.setState({relations: newArray});
        }
    };

    handleChangeGeneral = (e, {name, value}) => this.setState({[name]: value});

    handleDOBChange = date => this.setState({dob: date});

    handleDOWChange = date => this.setState({dow: date});

    overrideEnterOnToggle = (e) => {
        let code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) {
            e.preventDefault();
            this.setState({hof: !this.state.hof})
        }
    };

    handleUpload = (e) => {
        if(e.currentTarget.files && e.currentTarget.files[0]) {
            this.setState({ file: e.currentTarget.files[0] });
        }
    };

    render() {

        return (
            <Form>
                {/* Regular member form controls */}
                <Form.Input id='addName' name='name' placeholder='Name' onChange={this.handleChangeGeneral} value={this.state.name} width={16}/>
                <Form.Input name='email' placeholder='Email' onChange={this.handleChangeGeneral} type='email' value={this.state.email} width={16}/>
                <Form.Input name='telephone' placeholder='Telephone #' type='tel' onChange={this.handleChangeGeneral} value={this.state.telephone} width={16}/>

                <Form.Group>
                    <Form.Field>
                        <DatePicker placeholderText="DOB - MM/DD" selected={this.state.dob} onChange={this.handleDOBChange} dateFormat="MM/DD">
                            <div style={{textAlign: 'center'}}>Select DOB - MM/DD</div>
                        </DatePicker>
                    </Form.Field>
                    <Form.Field>
                        <DatePicker placeholderText="DOW - MM/DD" selected={this.state.dow} onChange={this.handleDOWChange} dateFormat="MM/DD">
                            <div style={{textAlign: 'center'}}>Select DOW - MM/DD</div>
                        </DatePicker>
                    </Form.Field>
                    <Form.Checkbox toggle label='HOF?' onKeyPress={this.overrideEnterOnToggle} onChange={() => this.setState({hof: !this.state.hof})} checked={this.state.hof}/>
                </Form.Group>

                {/* HOF form controls */}
                {this.state.hof ?
                    <div>
                        <Form.Input name='homeAddress' placeholder='Home Address' onChange={this.handleChangeGeneral} value={this.state.homeAddress} width={16}/>
                        <Form.Input name='homeParish' list='homeParish' placeholder='Home Parish' onChange={this.handleChangeGeneral} value={this.state.homeParish} width={16}/>
                        <datalist id='homeParish'>
                            <option value='C.S.I. Christ Church, Toronto'/>
                        </datalist>
                        <Form.Group widths='equal'>
                            <Form.Input name='famNum' type='number' placeholder='Family No.' onChange={this.handleChangeGeneral} value={this.state.famNum} required/>
                            <Form.Input name='homeTelephoneNo' placeholder='Home Telephone Number' onChange={this.handleChangeGeneral} value={this.state.homeTelephoneNo}/>
                        </Form.Group>
                        <Form.Dropdown name='relations' placeholder='Relations' fluid multiple search selection
                                       onChange={this.handleDropdownChange} value={this.state.relations}
                                       options={this.populateMembersList()} renderLabel={this.renderLabel}/>
                        <br/>
                        <input type={'file'} onChange={this.handleUpload} />
                    </div> : <span/>
                }
                <br/>
                <Form.Button onClick={this.initializeSubmission}>Submit</Form.Button>
            </Form>
        );
    }
}

MemberForm.propTypes = {
    adding: PropTypes.bool,
    members: PropTypes.array,
    hofList: PropTypes.array,
    name: PropTypes.string,
    email: PropTypes.string,
    telephone: PropTypes.string,
    dob: PropTypes.object,
    dow: PropTypes.object,
    hof: PropTypes.bool,
    famNum: PropTypes.string,
    homeTelephoneNo: PropTypes.string,
    homeAddress: PropTypes.string,
    homeParish: PropTypes.string,
    relations: PropTypes.array
};
