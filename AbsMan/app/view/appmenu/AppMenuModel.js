Ext.define('AbsMan.view.appmenu.AppMenuModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.tree-list',

    stores: {
        navItems: {
            type: 'tree',
            root: {
                expanded: true,
                children: [{
                    text: 'Home',
                    iconCls: 'fa fa-home',
                    formId: 'HomePanelId',
                    formType: 'my-home',
                    children: [{
                        text: 'New Absence Request',
                        iconCls: 'x-fa fa-paper-plane',
                        formType: 'absence-req',
                        formId: 'new-req',
                        leaf: true
                    },{
                        text: 'New Other Request',
                        iconCls: 'x-fa fa-paper-plane-o',
                        children: [{
                            text: 'Home Working',
                            iconCls: 'x-fa fa-laptop',
                            leaf: true
                        },{
                            text: 'Travel',
                            iconCls: 'x-fa fa-plane',
                            leaf: true
                        },{
                            text: 'Training',
                            iconCls: 'x-fa fa-graduation-cap',
                            leaf: true
                        }]
                    },{
                        text: 'History',
                        iconCls: 'x-fa fa-history',
                        leaf: true
                    },{
                        text: 'Reports',
                        iconCls: 'x-fa fa-book',
                        leaf: true
                    }]
                },{
                    text: 'My Staff',
                    iconCls: 'x-fa fa-sitemap',
                    formType: 'my-staff',
                    formId: 'my-staff',
                    children: [{
                        text: 'Pending Actions',
                        iconCls: 'x-fa fa-exclamation',
                        formType: 'pending-req',
                        formId: 'pending-req',
                        leaf: true
                    },{
                        text: 'Schedules',
                        iconCls: 'x-fa fa-calendar',
                        leaf: true
                    },{
                        text: 'Approver Reports',
                        iconCls: 'x-fa fa-book',
                        leaf: true
                    }]
                },{
                    text: 'Contacts',
                    iconCls: 'x-fa fa-user',
                    leaf: true
                },{
                    text: 'Settings',
                    iconCls: 'x-fa fa-wrench',
                    children: [{
                        text: 'Administration',
                        iconCls: 'x-fa fa-gears',
                        formId: 'adminmain',
                        formType: 'adminmain',
                        leaf: true
                    },{
                        text: 'Bulk operations',
                        iconCls: 'x-fa fa-cog',
                        leaf: true
                    },{
                        text: 'Notifications',
                        iconCls: 'x-fa fa-flag',
                        formType: 'notification-panel',
                        formId: 'notificationFormId',
                        leaf: true
                    },{
                        text: 'Admin Reports',
                        iconCls: 'x-fa fa-book',
                        leaf: true
                    }]
                }]
            }
        }
    }
});