import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';

import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { HOF } from './HOF.js';

export const Members = new Mongo.Collection('Members');

// SCHEMA
Members.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    max: 100,
    min: 1
  },
  dob: {
    type: String,
    max: 5
  },
  dow: {
    type: String,
    max: 5,
    optional: true
  },
  telephone: {
    type: String,
    optional: true
  },
  email: {
    type: SimpleSchema.RegEx.Email,
    max: 50,
    optional: true
  },
});
Members.attachSchema(Members.schema);

// PUBLICATIONS
if(Meteor.isServer){
  Meteor.publish('allMembers', () => {
    return Members.find({}, { fields: { name: 1, dob: 1, dow: 1, telephone: 1, email: 1 } });
  });
}

// METHODS
Meteor.methods({
  'Members.insert'(newMember, isHof, newHof) {
    if(!this.userId) {
      throw new Meteor.Error('Not Authorized!');
    }

    let newMemberId = Members.insert({ ...newMember });
    if(isHof) {
      newHof.relations.unshift(newMemberId + ':');
      HOF.insert({ memberName: newMemberId, ...newHof })
    }
  },

  'Members.updateBLANK'(objId, allocation) {
    if(!this.userId) {
      throw new Meteor.Error('Not Authorized!');
    }

    Members.update({ _id: objId }, { $set: { allocation } });
  },
});

// SECURITY
Members.deny({
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
        'Members.insert',
        'Members.remove',
      ], name);
    },
    // Rate limit per connection ID
    connectionId() { return true; }
  }, 20, 1000);
}
