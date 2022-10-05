Ext.define('AbsMan.view.request.RequestDetailsModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.request-details',

    formulas : {

        currentRecord: {
            get: function (get) {
                return get('formData').getAt(0);
            }
        },
        unit: {
            bind: {
                bindTo: '{currentRecord.absenceunit}',
                deep: true
            },
            get: function (val) {
                return val == 0 ? 'Days' : 'Hours';
            }
        },
        unitSingle: {
            bind: {
                bindTo: '{currentRecord.absenceunit}',
                deep: true
            },
            get: function (val) {
                return val == 0 ? 'day' : 'hours';
            }
        },
        leaveTime: {
            bind: {
                val: '{currentRecord.leavetime}',
                unit: '{unitSingle}'

            },
            get: function (res) {
                return res.val + ' ' + res.unit + ' before end of day';
            }
        },
        returnTime: {
            bind: {
                val: '{currentRecord.returntime}',
                unit: '{unitSingle}'

            },
            get: function (res) {
                return res.val + ' ' + res.unit + ' after begin of day';
            }
        },
        hideLeaveTime: {
            bind: {
                bindTo: '{currentRecord.leavetime}',
                deep: true
            },
            get: function (val) {
                return val == 0;
            }
        },
        hideReturnTime: {
            bind: {
                bindTo: '{currentRecord.returntime}',
                deep: true
            },
            get: function (val) {
                return val == 0;
            }
        },

        currentStatus: {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function (val) {
                return val ? 'Current Status: <b>' + val.get('statustext') + '</b>' : 'Current Status: Unknown';
            }
        },

        categoriesUsedVisible: {
            bind: {
                bindTo: '{currentRecord.role}',
                deep: true
            },
            get: function (role) {
                return role ? role.isApprover || role.isAdmin || role.isRequestedFor || role.isAbsProxy : false;
            }
        },

        commentsVisible: {
            bind: {
                bindTo: '{currentRecord.role}',
                deep: true
            },
            get: function (role) {
                return role ? role.isApprover || role.isAdmin || role.isRequestedFor || role.isAbsProxy : false;
            }
        },

        cancelPanelVisible: {
            bind: {
                bindTo: '{currentRecord.role}',
                deep: true
            },
            get: function (role) {
                return role ? role.isRequestedFor || role.isAdmin || role.isAbsProxy : false;
            }
        },

        approvePanelVisible: {
            bind: {
                bindTo: '{currentRecord.role}',
                deep: true
            },
            get: function (role) {
                return role ? role.isApprover || role.isAdmin : false;
            }
        },

        substitutePanelVisible: {
            bind: {
                bindTo: '{currentRecord.role}',
                deep: true
            },
            get: function (role) {
                return role ? role.isSubstitute : false;
            }
        },

        approveEnabled: {
            bind: {
                role: '{currentRecord.role}',
                status: '{currentRecord.status}'
            },
            get: function (get) {
                return get ? (get.role.isApprover || get.role.isAdmin) && get.status == "PENDING_APPROVER" : false;
            }
        },

        disapproveEnabled: {
            bind: {
                role: '{currentRecord.role}',
                status: '{currentRecord.status}'
            },
            get: function (get) {
                return get ? (get.role.isApprover || get.role.isAdmin) && get.status == "PENDING_APPROVER" : false;
            }
        },

        cancelEnabled: {
            bind: {
                role: '{currentRecord.role}',
                status: '{currentRecord.status}'
            },
            get: function (get) {
                return get ? (get.role.isRequestedFor || get.role.isAdmin) && !( get.status == "CANCELED" || get.status == "REJECTED" ) : false;
            }
        },

        ackEnabled: {
            bind: {
                role: '{currentRecord.role}',
                status: '{currentRecord.status}'
            },
            get: function (get) {
                return get ? (get.role.isSubstitute || get.role.isAdmin) && !( get.status == "CANCELED" || get.status == "REJECTED" || get.status == "APPROVED") : false;
            }
        },

        nackEnabled: {
            bind: {
                role: '{currentRecord.role}',
                status: '{currentRecord.status}'
            },
            get: function (get) {
                return get ? (get.role.isSubstitute || get.role.isAdmin) && !( get.status == "CANCELED" || get.status == "REJECTED" || get.status == "APPROVED" ) : false;
            }
        },

        requestedByVisible: {
            bind: {
                user: '{currentRecord.userid}',
                requester: '{currentRecord.requestedById}'
            },
            get: function (get) {
                return get.user !== get.requester;
            }
        },

        substituteAck: {
            bind: {
                status: '{currentRecord.substituteack}',
                date: '{currentRecord.substituteackdate}'
            },
            get: function (get) {
                return get.date !== null ? get.status ? "OK" : "NOT OK" : "No response yet";
            }
        },

        substituteStatusType: {
            bind: {
                status: '{currentRecord.substituteack}',
                date: '{currentRecord.substituteackdate}'
            },
            get: function (get) {
                return get.date !== null ? get.status ? "save" : "close" : "help";
            }
        },

        approvalStatusType: {
            bind: {
                bindTo: '{currentRecord.status}',
                deep: true
            },
            get: function (get) {
                if (get == "APPROVED") {
                    return "save"
                } else if (get == "PENDING_APPROVER") {
                    return "help"
                } else {
                    return "close";
                }
            }
        },

        totalRequestLabel: {
            bind: {
                bindTo: '{currentRecord.requestcontext.unit}',
                deep: true
            },
            get: function (res) {
                return 'Total ' + ( res == 0 ? 'days ' : 'hours' );
            }
        },

        confirmDisabled: {

            bind: {
                required: '{confirmCommentsRequired}',
                comments: '{confirmComments}'
            },
            get: function (res) {
                return res.required && res.comments.trim().length < 5;
            }
        },

        requestListUser: {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function (rec) {
               return rec ? rec.get("userid") == userId ? "My" : rec.get("username") : null ;
            }
        },


        listPendingPreference: {
            get: function (get) {
                var rec = get('userPreference').findRecord("name", "user.listPending");
                return rec ? rec.get("value") === "true" : false;
            }
        }
    },


    stores: {

        formData: {

            autoLoad: false,
            autoSync: false,
            pageSize: 0,
            model: 'request.Absence'
        },

        usedCategories: {

            fields: [
                {name: 'id', type: 'string'},
                {name: 'name', type: 'string'},
                {name: 'useondemand', type: 'boolean'},
                {name: 'taken', type: 'number'},
                {name: 'ondemandtaken', type: 'number'},
                {name: 'startdateratio', type: 'number'},
                {name: 'enddateratio', type: 'number'},
                {name: 'startdate', type: 'date', dateFormat: 'Y-m-d'},
                {name: 'enddate', type: 'date', dateFormat: 'Y-m-d'},
                {name: 'lastupdate', type: 'int'},
                {name: 'justification', type: 'string' }
            ]

        },

        entitledCategory: {

            autoLoad: false,
            autoSync: false,
            pageSize: 0,
            model: 'request.EntitledCategory'
        },


        otherCategory: {

            autoLoad: false,
            autoSync: false,
            pageSize: 0,
            model: 'request.OtherCategory'
        },


        hCalendarRequests: {

            autoLoad: false,
            autoSync: false,
            model: 'ux.HCalendar'
        },


        requestHistory: {

            autoLoad: false,
            autoSync: false,
            model: 'request.RequestHistory',
            sorters: {
                property : 'date',
                direction: 'DESC'
            }
        }

    },

    data : {

        confirmPanelTitle: "",
        confirmComments: "",
        confirmLabel: "",
        confirmCommentsRequired: true,
        confirmAction: "",

        requesterId: null,

        hCalSelectedRequest: {}
     }

});