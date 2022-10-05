
Ext.define('AbsMan.view.main.User', {
    extend: 'Ext.panel.Panel',
    xtype: 'topbanner',

    requires: [
        'AbsMan.view.main.UserController',
        'AbsMan.view.main.UserModel'
    ],


    layout: 'hbox',
    items: [{
        xtype: 'box',
        contentEl: 'top-box',
        padding:5,
        align:'middle'
    },{
        xtype: 'tbspacer',
        flex : 1
    }, {
        xtype: 'container',
        items: {
            text: ' <b>Disconnect <u>' + uname + '</u></b> ',
            scope: this,
            handler: function () {
                window.location = '/logon.php';
            },
            menu: new Ext.menu.Menu({
                items: [
                    {
                        text: 'Change Password', handler: function () {
                        alert('todo chpass')
                    }
                    },
                    {
                        text: 'My Profile', handler: function () {
                        alert('todo chprof')
                    }
                    }
                ]
            }),
            padding: 10,
            align: 'middle'
        }
    }]
});