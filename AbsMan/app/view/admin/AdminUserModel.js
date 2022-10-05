
Ext.define('AbsMan.view.admin.AdminUserModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.adminuser',

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
        isReadOnly: {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return (record.data.isreadonly);
                }
            }
        },
        manageOnDemand : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.get('manageondemand');
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
        disablePublicDays : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function (record) {
                var val = record && record.isModel ? record.get('disablepublicdays') : null;
                return { disablepublicdays:val };
            },
            set: function(value) {
                var val = Ext.isObject(value) ? value.disablepublicdays : value ;
                this.get('currentRecord').set('disablepublicdays',val);
            }
        },
        isEnabled : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function (record) {
                var val = record && record.isModel ? record.get('enabled') : null;
                return { enabled:val };
            },
            set: function(value) {
                var val = Ext.isObject(value) ? value.enabled : value ;
                this.get('currentRecord').set('enabled',val);
            }
        }
    },

    stores: {

        formData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.User',

            listeners: {
                load: 'onLoadedRecord',
                beforeload: 'resetProxy'
            }
        }

    }

});