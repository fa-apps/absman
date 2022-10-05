Ext.define('AbsMan.model.admin.membership.UserNotMemberOf', {
    extend: 'AbsMan.model.admin.membership.UserMembership',
    

    proxy: {
        type: 'rest',
        baseUrl: 'admin/user/notmemberof/',
        url: 'admin/user/notmemberof/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        }
    }

});


