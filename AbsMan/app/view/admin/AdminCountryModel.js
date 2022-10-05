
Ext.define('AbsMan.view.admin.AdminCountryModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.admincountry',


    formulas: {
        currentRecord: {
            get: function (get) {
                return get('formData').first();
            }
        },
        isNewRecord: {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.data.id.substr(0, 2) === "0-";
                }
            }
        },
        isDirtyRecord: {
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
        favoriteIconCls: {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.data.isfavorite === true ? 'x-fa fa-heart' : 'x-fa fa-heart-o';
                }
            }
        },
        saveEnabled: {
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
        canManageAdmins: {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.data.isreadonly == false;
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
        }
    },

    stores: {

        formData: {

            autoLoad: false,
            autoSync: false,
            pageSize: 0,
            model: 'admin.Country',

            listeners: {
                load: 'onLoadedRecord',
                beforeload: 'resetProxy'
            }
        }
    }
});