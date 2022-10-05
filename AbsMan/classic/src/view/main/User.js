
Ext.define('AbsMan.view.main.User', {
    extend: 'Ext.panel.Panel',
    xtype: 'top-user-panel',

    requires: [
        'AbsMan.view.main.UserController',
        'AbsMan.view.main.UserModel'
    ],



    viewModel: {
        type: 'user'
    },

    controller: 'user',
    items: [{
        xtype: 'button',
        iconCls: 'fa fa-user',

        text: 'Welcome ' + userDisplayName,
        menu: [{
            text: 'Change Password',
            iconCls: 'fa fa-key',
            handler: 'onChangePasswordClick'
        }, {
            text: 'Edit Profile',
            iconCls: 'fa fa-pencil',
            handler: 'onEditProfileClick'
        }, {
            text: 'Disconnect',
            iconCls: 'fa fa-close',
            handler: 'onDisconnectClick'
        }]
    }]
});