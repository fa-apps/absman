
Ext.define('AbsMan.view.admin.membership.GroupMemberModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.admingroupmember',

    formulas : {

        editDisabled: {

            bind: {
                bindTo: '{adminGroupMemberPanel.selection}',
                deep: true
            },
            get :function(selection) {
                return  !(selection && !this.get('isReadOnly'));
            }
        },
        removeDisabled: {

            bind: {
                bindTo: '{adminGroupMemberPanel.selection}',
                deep: true
            },
            get :function(selection) {
                return  !(selection && !this.get('isReadOnly'));
            }
        },
        addMemberButtonText : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function (record) {
                var val = record && record.isModel ? record.get('isdefaultgroup') : null;
                return val ? 'Add New User' : 'Add Existing User';
            }
        }
    },

    stores: {

        subFormData: {

            autoLoad: false,
            autoSync: false,
            remoteSort: true,
            model: 'admin.membership.GroupMember',

            listeners: {
                "beforeload" : 'resetProxy',
                "load" : 'onLoad'
            }
        }
    }

});