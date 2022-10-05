
Ext.define('AbsMan.view.admin.category.UserEntitledDetailsModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.user-entitled-details',

    formulas: {
        currentRecord: {
            get: function (get) {
                return get('formData').getAt(0);
            }
        },
        isDirtyRecord : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.dirty === true;
                }
            }
        },
        saveEnabled : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return (record.data.isreadonly == false && record.dirty == true);
                }
            }
        },
        deleteEnabled : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return (record.data.isreadonly == false && record.data.isdeletable == true);
                }
            }
        },
        favoriteIconCls : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.data.isfavorite === true ? 'x-fa fa-heart' : 'x-fa fa-heart-o';
                }
            }
        }
    },


    stores: {

        formData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.category.EntitledUserDetails',

            listeners: {
                load: 'onLoadedRecord',
                beforeload: 'resetProxy'
            }

        }
    }



});