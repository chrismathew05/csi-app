import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

import '../imports/api/Members.js';
import '../imports/api/HOF.js';
import Images from '../imports/api/Images.js';

Meteor.startup(() => {
    // code to run on server at startup
    console.log(Meteor.rootPath);

    // create regular and admin users
    if (!Accounts.findUserByUsername(Meteor.settings.private.userId)) {
        userId = Accounts.createUser({username: Meteor.settings.private.userId, password: Meteor.settings.private.pwd});
        Roles.addUsersToRoles(userId, 'General', Roles.GLOBAL_GROUP);
    }
    if (!Accounts.findUserByUsername(Meteor.settings.private.adminUserId)) {
        userId = Accounts.createUser({
            username: Meteor.settings.private.adminUserId,
            password: Meteor.settings.private.adminPwd
        });
        Roles.addUsersToRoles(userId, 'Admin', Roles.GLOBAL_GROUP);
    }
});

Meteor.methods({
    'isAdmin'(userId) {
        return Roles.userIsInRole(userId, ['Admin'], 'global-group');
    }
});