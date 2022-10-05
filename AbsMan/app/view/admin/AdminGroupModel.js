
Ext.define('AbsMan.view.admin.AdminGroupModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.admingroup',

    formulas: {
        currentRecord: {
            get: function (get) {
                return get('formData').getAt(0);
            }
        },
        isNewRecord : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.get('id').substr(0, 2) === "0-";
                }
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
        favoriteIconCls : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.get('isfavorite') === true ? 'x-fa fa-heart' : 'x-fa fa-heart-o';
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

                    return  !record.get('isreadonly') && this.getView().getForm().isValid() && (record.dirty || this.get('hasDirtySubForm'));
                }
            }
        },
        isReadOnly : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {

                    return record.get('isreadonly') ;
                }
            }
        },
        canManageAdmins : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return !record.get('isreadonly');
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
                    return (record.get('isreadonly') == false && record.get('isdeletable') == true);
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
        groupNamePrefix : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function (record) {
                var val = record && record.isModel ? record.get('isdefaultgroup') : null;
                return val ? '(Default)' : '';
            }
        }
    },

    stores: {

        formData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.Group',

            listeners: {
                load: 'onLoadedRecord',
                beforeload: 'resetProxy'
            }
        }
    },

    data: {
        hasDirtySubForm: false
    }



});