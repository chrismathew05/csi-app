import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';

import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

export const HOF = new Mongo.Collection('HOF');

// SCHEMA
// HOF = head of family
HOF.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  memberName: { //corresponds to member id
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1
  },
  famNum: { //corresponds to member id
    type: SimpleSchema.Integer,
    unique: true,
    min: 0,
    index: 1
  },
  homeTelephoneNo: {
    type: String,
    optional: true
  },
  homeAddress: {
    type: String,
    max: 100
  },
  homeParish: {
    type: String,
    max: 100
  },
  relations: {
    type: Array,
    optional: true,
  },
  'relations.$': String,
});
HOF.attachSchema(HOF.schema);

// PUBLICATIONS
if(Meteor.isServer){
  Meteor.publish('allHOF', () => {
    return HOF.find({}, { fields: { memberName: 1, famNum: 1, homeTelephoneNo: 1, homeAddress: 1, homeParish: 1, relations: 1 }, sort: { famNum: 1 } });
  });
}

// METHODS
Meteor.methods({
  'HOF.insert'(memberName, newHof) {
    if(!this.userId) {
      throw new Meteor.Error('Not Authorized!');
    }

    HOF.insert({ memberName, ...newHof });
  },

  'HOF.updateBLANK'(objId, allocation) {
    if(!this.userId) {
      throw new Meteor.Error('Not Authorized!');
    }

    HOF.update({ _id: objId }, { $set: { allocation } });
  },
});

// SECURITY
HOF.deny({
  // DENY all client-side updates since we will be using methods to manage this collection
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
// RATE LIMITING
if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains([
        'HOF.insert',
        'HOF.remove',
      ], name);
    },
    // Rate limit per connection ID
    connectionId() { return true; }
  }, 20, 1000);
}
