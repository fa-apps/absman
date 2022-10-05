Ext.define('AbsMan.model.admin.membership.UserMemberOf', {
    extend: 'AbsMan.model.admin.membership.UserMembership',


    proxy: {
        type: 'rest',
        baseUrl: 'admin/user/memberof/',
        url: 'admin/user/memberof/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        }
    }

});


