
Ext.define('AbsMan.view.formpanel.MyHome', {
    extend: 'Ext.form.Panel',
    xtype: 'my-home',

    requires: [
        'AbsMan.view.request.RequestList',
        'AbsMan.view.formpanel.MyHomeController',
        'AbsMan.view.formpanel.MyHomeModel',
        'AbsMan.view.util.PickUser',
        'AbsMan.view.ux.HCalendar'
    ],

    controller: 'my-home',
    viewModel: {
        type: 'my-home'
    },

    title: 'Home',
    iconCls: 'x-fa fa-home',

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    scrollable: true,

    items: [

        {
            xscrollable: true,

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                frame: true,
                bodyPadding: 10
            },
            items: [
                {
                    bind: {
                        title: '<b>{currentRecord.displayname}</b>'
                    },
                    tools: [{
                        type: 'refresh',
                        callback: 'onReloadForm',
                        tooltip: 'Click here to reset the form'
                    }],
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    flex: .7,
                    minWidth: 300,
                    margin: '0 10 0 0',
                    defaults: {
                        labelClsExtra: "a-display-label",
                        labelWidth: 110
                    },

                    dockedItems: [{
                        dock: 'right',
                        xtype: 'toolbar',
                        defaults: {
                            baseCls: 'x-btn x-btn-default-small ',
                            cls: 'absman-small-button',
                            handler: 'onEditProfile'
                        },
                        items: [
                            {
                                iconCls: 'x-fa fa-pencil ',
                                xtype: 'button',
                                itemId: 'editProfileId',
                                bind: {
                                    disabled: '{editingProfile}'
                                }

                            }, {
                                iconCls: 'x-fa fa-save',
                                xtype: 'button',
                                itemId: 'saveProfileId',
                                bind: {
                                    disabled: '{!editingProfile}'
                                }
                            }, {
                                iconCls: 'x-fa fa-undo',
                                xtype: 'button',
                                itemId: 'cancelProfileId',
                                bind: {
                                    disabled: '{!editingProfile}'
                                }
                            }]
                    }],
                    items: [{
                        labelClsExtra: "a-display-label",
                        xtype: 'textareafield',
                        fieldLabel: 'My Notes',
                        labelAlign: 'top',
                        height: 90,
                        grow: false,
                        name: 'notes',
                        bind: {
                            value: '{currentRecord.notes}',
                            readOnly: '{!editingProfile}'
                        }
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: 'Approver',
                        bind: {
                            value: '{currentRecord.approver}'
                        }
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: 'Stand-in Approver',
                        bind: {
                            value: '{currentRecord.standinapprover}',
                            hidden: '{!currentRecord.requirestandinapprover}'
                        }
                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'Substitute',
                        itemId: 'substitute',
                        bind: {
                            value: '{currentRecord.substitute}',
                            hidden: '{!currentRecord.requiresubstitute}',
                            editable: '{!editingProfile}',
                            readOnly: '{!editingProfile}'

                        },
                        listeners: {
                            expand: 'selectUser'
                        },
                        margin: '0 0 10 0'

                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'Notified',
                        itemId: 'notified',
                        bind: {
                            value: '{currentRecord.notified}',
                            hidden: '{!currentRecord.requirenotified}',
                            editable: '{editingProfile}',
                            readOnly: '{!editingProfile}'

                        },
                        listeners: {
                            expand: 'selectUser'
                        },
                        margin: '0 0 10 0'
                    }

                        /*
                         , {
                         xtype: 'displayfield',
                         fieldLabel: 'Email',
                         bind: {
                         value: '{currentRecord.email}'
                         }
                         },{
                         xtype: 'displayfield',
                         fieldLabel: 'Number',
                         bind: {
                         value: '{currentRecord.usernumber}'
                         }
                         },{
                         xtype: 'displayfield',
                         fieldLabel: 'Entity',
                         bind: {
                         value: '{currentRecord.company}'
                         }
                         },{
                         xtype: 'displayfield',
                         fieldLabel: 'Country',
                         bind: {
                         value: '{currentRecord.country}'
                         }
                         }

                         */

                    ]
                }, {

                    title: 'My Entitlements',
                    margin: '0 10 0 0',
                    bodyPadding: "0 10 10 10",
                    scrollable: false,
                    flex: 1,
                    minHeight: 240,

                    dockedItems: [{
                        dock: 'top',
                        xtype: 'toolbar',
                        padding: "10 10 0 10",
                        items: [{
                            xtype: "displayfield",
                            cls: "entitlement-left",
                            bind: {value: "{daysLeft} available"}

                        }, "->", {
                            iconCls: 'x-fa fa-info ',
                            xtype: 'button',
                            handler: 'toggleEntitledDetails',
                            baseCls: 'x-btn x-btn-default-small ',
                            cls: 'absman-small-button',
                            enableToggle: true,
                            reference: 'toggleEntitled',
                            itemId: 'toggleEntitledId'
                        }]
                    }],
                    items: [
                        {
                            xtype: "panel",
                            layout: {
                                type: 'vbox',
                                pack: 'start',
                                align: 'stretch'
                            },

                            items: [
                                {
                                    xtype: "dataview",
                                    itemId: "myEntitlementSummaryId",


                                    tpl: [
                                        '<div class="sum">',
                                        '<div class="item title">',
                                        '   <div class="stay">',
                                        '       <span class="f-left">Category</span>',
                                        '   </div>',
                                        '   <div class="hide f-right-num">Left</div>',
                                        '   <div class="hide f-right-date">Limit</div>',
                                        '   <div class="hide f-right-num">Grant</div>',
                                        '   <div class="hide f-right-num">Used</div>',
                                        '</div>',
                                        '<tpl for=".">',
                                        '<tpl if="left &gt; 0">',
                                        '<div class="item">',
                                        '   <div class="stay">',
                                        '       <span class="f-left">{name}</span>',
                                        '<tpl if="this.warn(values) != \'\'">',
                                        '       <span class="badge" data-balloon="{[this.warn(values)[1]]}" data-balloon-pos="right"><span class="{[this.warn(values)[0]]}"></span></span>',
                                        '</tpl>',
                                        '   </div>',
                                        '   <div class="hide f-right-num">{left}</div>',
                                        '   <div class="hide f-right-date">{validto:date("d M Y")}</div>',
                                        '   <div class="hide f-right-num">{allocated}</div>',
                                        '   <div class="hide f-right-num">{taken}</div>',
                                        '</div></tpl>',
                                        '</tpl>',
                                        '</div>',
                                        {
                                            warn: function (record) {
                                                var expired = Ext.Date.diff(record.validto, new Date(), Ext.Date.DAY) > 0,
                                                    almostExpired = Ext.Date.diff(record.validto, new Date(), Ext.Date.DAY) > -30;
                                                return record.enforcevalidity ? expired ? ['badge-expired', 'Expired !'] : almostExpired ? ['badge-warning', 'Almost expired !'] : '' : '';
                                            }
                                        }

                                    ],
                                    bind: {
                                        store: '{entitlementData}'
                                    },
                                    itemSelector: 'item',
                                    listeners: {
                                        click: {
                                            element: 'el',
                                            fn: "showEntitlementDetails"
                                        }
                                    }

                                },
                                {
                                    xtype: 'grid',
                                    itemId: 'myEntitlementDetailsId',
                                    margin: '0 0 0 0',
                                    bodyPadding: 0,

                                    hidden: true,
                                    frame: true,
                                    scrollable: true,
                                    bind: {
                                        store: '{entitlementData}'
                                    },
                                    viewConfig: {
                                        stripeRows: false,
                                        getRowClass: function (record) {
                                            return this.up("#HomePanelId").getController().setEntitledRowClass(record);
                                        }
                                    },
                                    // todo title in values
                                    columns: [
                                        {
                                            header: 'Entitled category',
                                            flex: 1,
                                            sortable: true,
                                            cls: "a-display-label",
                                            dataIndex: 'name'
                                        }, {
                                            header: 'Alloc.',
                                            sortable: true,
                                            dataIndex: 'allocated',
                                            align: 'center',
                                            width: 70,
                                            xtype: 'numbercolumn',
                                            cls: "a-display-label",
                                            format: '0.##'

                                        }, {
                                            header: 'Used',
                                            sortable: true,
                                            dataIndex: 'taken',
                                            align: 'center',
                                            width: 70,
                                            xtype: 'numbercolumn',
                                            cls: "a-display-label",
                                            format: '0.##'

                                        }, {
                                            header: 'Left',
                                            sortable: true,
                                            tooltip: 'Remaining once approved',
                                            dataIndex: 'left',
                                            align: 'center',
                                            cls: "a-display-label",
                                            width: 70
                                        }, {
                                            header: 'Limit',
                                            tooltip: 'Category available until',
                                            sortable: true,
                                            dataIndex: 'validto',
                                            align: 'center',
                                            xtype: 'datecolumn',
                                            cls: "a-display-label",
                                            format: 'd M Y',
                                            width: 110

                                        }
                                    ]
                                }
                            ]
                        },
                        {

                            flex: 1,
                            layout: {
                                align: 'middle',
                                pack: 'center',
                                type: 'hbox'
                            },
                            items: [{
                                xtype: "button",
                                scale: "small",
                                margin: "10 0",
                                text: "New Absence Request",
                                badgeText: "33",
                                handler: "onNewRequestClick"
                            }]
                        }]
                },
                {
                    flex: .8,

                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    frame: false,
                    bodyPadding: 0,
                    margin: '0 10 0 0',
                    items: [

                        {
                            xtype: 'panel',
                            itemId: 'actionRequiredPanelId',
                            bodyCls: 'action-required-panel',
                            margin: '0 0 10 0',
                            hidden: true,
                            bind: {
                                hidden: '{!currentRecord.pendingcount}',
                                data: '{currentRecord.pendingtext}'
                            },
                            listeners: {
                                click: {
                                    element: 'el',
                                    fn: "onPendingPanelClick"
                                }
                            }
                        }, {
                            itemId: 'newSimpleRequestId',
                            title: 'New Simple Absence Request',
                            bodyPadding: 10,
                            flex:1,
                            frame: true,
                            layout: {
                                type: 'vbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            defaults: {
                                margin: '5 10',
                                labelClsExtra: "a-display-label",
                                labelWidth: 90
                            },
                            listeners: {
                                beforeclose: "onHCalendarClose"
                            },
                            items: [{
                                xtype: 'datefield',
                                fieldLabel: 'Start date',
                                itemId: 'startDateId',
                                format: 'D j F Y',
                                bind: {
                                    value: '{leavedate}'
                                },
                                listeners: {
                                    expand: 'onDatePickerExpand',
                                    change: 'onFormChange'
                                }
                            }, {
                                xtype: 'datefield',
                                itemId: 'endDateId',
                                fieldLabel: 'End date',
                                format: 'D j F Y',
                                bind: {
                                    value: '{returndate}'
                                },
                                listeners: {
                                    expand: 'onDatePickerExpand',
                                    change: 'onFormChange'
                                }
                            }, {
                                xtype: 'combobox',
                                itemId: "selectedCategoryId",
                                fieldLabel: 'Category',
                                queryMode: 'local',
                                displayField: 'name',
                                valueField: 'id',
                                editable: false,
                                name: 'category',
                                forceSelection: true,
                                emptyText: 'None Available',
                                bind: {
                                    store: '{categoryComboData}',
                                    value: '{suggestedCategory}'
                                }
                            }, {
                                layout: {
                                    type: 'hbox',
                                    pack: 'start',
                                    align: 'stretch'
                                },
                                defaults: {
                                    labelClsExtra: "a-display-label",
                                    labelWidth: 90,
                                    flex: 1
                                },
                                items: [{
                                    xtype: "displayfield",
                                    bind: {
                                        fieldLabel: 'Total {unit}',
                                        value: '{totalRequest}',
                                    }
                                }, {
                                    xtype: "displayfield",
                                    fieldStyle: 'font-weight: bold;',
                                    bind: {
                                        fieldLabel: '{unit} used',
                                        value: '{totalEntitledDays}',
                                    }
                                }]
                            }, {

                                flex: 1,
                                layout: {
                                    align: 'middle',
                                    pack: 'center',
                                    type: 'hbox'
                                },
                                items: [{
                                    xtype: "button",
                                    scale: "small",
                                    margin: "10 0",
                                    text: "Submit",
                                    iconCls: 'fa fa-angle-double-right',
                                    handler: "onSimpleRequestSubmit",
                                    bind: {
                                        disabled: '{!requestIsValid}'
                                    }
                                }]
                            }]

                        }]
                }
            ]
        },
        {
            xtype: "hcalendar",
            itemId: "hcalendarId",
            margin: '10 0 10 0',
            height: 86,
            scrollable: true,
            listeners: {
                click: "onHCalendarClick",
                mouseover: "onHCalendarOver",
                element: 'el'
            }
        }, {
            itemId: 'hCalendarRequestId',
            width: 250,
            height: 150,
            bind: {
                title: 'Request Status: {hCalSelectedRequest.requestStatus}'
            },
            floating: true,
            closable: true,
            draggable: true,
            bodyPadding: 10,
            defaults: {
                margin: '-5 0',
                labelWidth: 80
            },
            listeners: {
                beforeclose: "onHCalendarClose"
            },
            items: [{
                xtype: "displayfield",
                bind: {
                    fieldLabel: 'Total {unit}',
                    value: '{hCalSelectedRequest.totalRequest}'
                }
            }, {
                xtype: "displayfield",
                fieldLabel: "Start Date",
                bind: {
                    value: '{hCalSelectedRequest.startDate:date("D j F Y")}'
                }
            }, {
                xtype: "displayfield",
                fieldLabel: "End Date",
                bind: {
                    value: '{hCalSelectedRequest.endDate:date("D j F Y")}'
                }
            }, {
                style: {
                    'text-align': 'center'
                },
                padding: 5,
                items: [{
                    xtype: "button",
                    handler: "onRequestDetailsClick",
                    text: "Details..."

                }]
            }]
        },
        {
            itemId: "requestListId",
            xtype: "requestlist",
            listType: 'user',
            collapsible: true,
            collapsed: false,
            split: true
        }, {
            xtype: 'hidden',
            name: 'approverid',
            itemId: 'approverId',
            bind: {
                value: '{currentRecord.approverid}'
            }
        }, {
            xtype: 'hidden',
            name: 'standinapproverid',
            itemId: 'standInApproverId',
            bind: {
                value: '{currentRecord.standinapproverid}'
            }
        }, {
            xtype: 'hidden',
            name: 'substituteid',
            itemId: 'substituteId',
            bind: {
                value: '{currentRecord.substituteid}'
            }
        }, {
            xtype: 'hidden',
            name: 'notifiedid',
            itemId: 'notifiedId',
            bind: {
                value: '{currentRecord.notifiedid}'
            }
        }
    ]

});




