Ext.define('AbsMan.view.request.Absence', {
    extend: 'Ext.form.Panel',
    xtype: 'absence-req',

    requires: [
        'AbsMan.view.request.AbsenceController',
        'AbsMan.view.request.AbsenceModel',
        'AbsMan.view.util.PickUser',
        'AbsMan.view.ux.HCalendar',
        'AbsMan.view.ux.CategoryDistribution',
        'AbsMan.view.request.RequestDetails'
    ],

    controller: 'abs-req',
    viewModel: {
        type: 'abs-req'
    },

    iconCls: 'x-fa fa-paper-plane',

    title: 'New Absence Request',

    border: false,
    plain: true,
    closable: true,
    scrollable: true,

    layout: {
        type: 'anchor',
        reserveScrollbar: true
    },
    defaults: {
        anchor: '100%'
    },


    items: [
        {
            scrollable: true,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    defaults: {
                        frame: true,
                        padding: 10
                    },
                    scrollable: true,
                    flex: .4,
                    items: [
                        {
                            bind: {
                                title: 'Request for: <b>{requestUser}</b>'
                            },
                            tools: [{
                                type: 'search',
                                callback: 'selectUser',
                                tooltip: 'Click here to setup the request for another Employee'
                            }, {
                                type: 'refresh',
                                callback: 'reloadForm',
                                tooltip: 'Click here to reset the form'
                            }],
                            margin: '0 10 0 0',
                            layout: {
                                type: 'vbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            itemId: 'requestUser',
                            items: [
                                {
                                    layout: 'hbox',
                                    defaults: {
                                        labelClsExtra: "a-display-label",
                                        labelAlign: 'top',
                                        margin: '0 10 0 10'
                                    },
                                    items: [
                                        {
                                            xtype: 'datefield',
                                            itemId: 'startDateId',
                                            fieldLabel: 'Start Date',
                                            allowBlank: false,
                                            name: 'startdate',
                                            format: 'd M Y',
                                            flex: .6,
                                            bind: {
                                                value: '{currentRecord.leavedate}'
                                            },
                                            listeners: {
                                                expand: 'onDatePickerExpand',
                                                change: 'onFormChange'
                                            }
                                        }, {
                                            xtype: 'combo',
                                            editable: false,
                                            fieldLabel: 'Leaving time',
                                            name: 'leavetime',
                                            flex: 1,
                                            valueField: 'value',
                                            displayField: 'text',
                                            queryMode: 'local',
                                            forceSelection: true,
                                            listConfig: {
                                                minWidth: 250
                                            },
                                            bind: {
                                                store: '{leavingTime}',
                                                value: '{currentRecord.leavetime}',
                                                disabled: '{startIsNonWorkingDay}'
                                            }
                                        }
                                    ]
                                }, {
                                    layout: 'hbox',
                                    defaults: {
                                        labelClsExtra: "a-display-label",
                                        labelAlign: 'top',
                                        margin: '5 10 5 10'
                                    },
                                    items: [
                                        {
                                            xtype: 'datefield',
                                            itemId: 'endDateId',
                                            fieldLabel: 'End Date',
                                            allowBlank: false,
                                            name: 'enddate',
                                            format: 'd M Y',
                                            flex: .6,
                                            bind: {
                                                value: '{currentRecord.returndate}'
                                            },
                                            listeners: {
                                                expand: 'onDatePickerExpand',
                                                change: 'onFormChange'
                                            }
                                        }, {
                                            xtype: 'combo',
                                            editable: false,
                                            fieldLabel: 'Return time',
                                            name: 'returntime',
                                            flex: 1,
                                            valueField: 'value',
                                            displayField: 'text',
                                            queryMode: 'local',
                                            forceSelection: true,
                                            listConfig: {
                                                minWidth: 250
                                            },
                                            bind: {
                                                store: '{returnTime}',
                                                value: '{currentRecord.returntime}',
                                                disabled: '{endIsNonWorkingDay}'
                                            }
                                        }
                                    ]
                                }, {
                                    layout: 'hbox',
                                    defaults: {
                                        labelClsExtra: "a-display-label",
                                        labelAlign: 'top',
                                        margin: '0 10 0 10',
                                        editable: false,
                                        xtype: 'textfield'
                                    },
                                    items: [
                                        {
                                            fieldLabel: 'Approver',
                                            name: 'approver',
                                            itemId: 'approver',
                                            flex: 1,
                                            bind: {
                                                value: '{currentRecord.approver}'
                                            }
                                        }, {
                                            fieldLabel: 'Stand-in Approver',
                                            name: 'standinapprover',
                                            itemId: 'standInApprover',
                                            flex: 1,
                                            bind: {
                                                value: '{currentRecord.standinapprover}',
                                                hidden: '{!currentRecord.requirestandinapprover}'
                                            }
                                        }
                                    ]
                                }, {
                                    layout: 'hbox',
                                    defaults: {
                                        labelClsExtra: "a-display-label",
                                        labelAlign: 'top',
                                        margin: '5 10 5 10',
                                        editable: false,
                                        listeners: {
                                            expand: 'selectUser'
                                        }
                                    },
                                    items: [
                                        {
                                            xtype: 'combo',
                                            fieldLabel: 'Substitute',
                                            name: 'substitute',
                                            itemId: 'substitute',
                                            flex: 1,
                                            bind: {
                                                value: '{currentRecord.substitute}',
                                                hidden: '{!currentRecord.requiresubstitute}'
                                            }
                                        }, {
                                            xtype: 'combo',
                                            fieldLabel: 'Notified',
                                            name: 'notified',
                                            itemId: 'notified',
                                            flex: 1,
                                            bind: {
                                                value: '{currentRecord.notified}',
                                                hidden: '{!currentRecord.requirenotified}'
                                            }
                                        }
                                    ]
                                }, {
                                    xtype: 'textareafield',
                                    labelClsExtra: "a-display-label",
                                    fieldLabel: 'Comments',
                                    margin: '0 10 5 10',
                                    labelAlign: 'top',
                                    grow: false,
                                    name: 'comments',
                                    bind: {
                                        value: '{currentRecord.comments}'
                                    }
                                }
                            ]
                        }
                    ]
                }, {
                    bind: {
                        title: '{unit} left to distribute from categories: <strong>{totalRemaining}</strong>'
                    },
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    flex: 1,
                    frame: true,
                    items: [
                        {
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            flex:1,
                            defaults: {
                                margin: '20 20 0 20',
                                border: true,
                                frame: true,
                                header: false,
                                plugins: {
                                    ptype: 'cellediting',
                                    pluginId: 'cellEditorId',
                                    clicksToEdit: 1,
                                    listeners: {
                                        beforeedit: 'onGridBeforeEdit'
                                    }
                                },
                                listeners: {
                                    afterLayout: 'onGridAfterLayout'
                                },
                                scrollable: true
                            },
                            items: [
                                {
                                    xtype: 'grid',
                                    itemId: 'entitled',
                                    flex: .8,
                                    bind: {
                                        store: '{entitledCategory}'
                                    },
                                    viewConfig: {
                                        markDirty: false,
                                        getRowClass: function (record) {
                                            return this.up("#new-req").getController().setEntitledRowClass(record);
                                        }
                                    },
                                    columns: [
                                        {
                                            header: 'Entitled category',
                                            flex: 1,
                                            sortable: true,
                                            dataIndex: 'name',
                                            cls: "a-display-label",
                                            draggable: false
                                        }, {
                                            header: 'OD',
                                            cls: "a-display-label",
                                            width: 45,
                                            xtype: 'checkcolumn',
                                            dataIndex: 'useondemand',
                                            tooltip: 'Use On Demand',
                                            menuDisabled: true,
                                            bind: {
                                                visible: '{currentRecord.manageondemand}'
                                            },
                                            listeners: {
                                                checkchange: 'resetOnDemand'
                                            },
                                            draggable: false
                                        }, {
                                            header: 'OD Available',
                                            cls: "a-display-label",
                                            tooltip: 'On Demand Available',
                                            sortable: true,
                                            dataIndex: 'ondemandleft',
                                            align: 'center',
                                            width: 80,
                                            hidden: true,
                                            draggable: false

                                        }, {
                                            header: 'Available',
                                            cls: "a-display-label",
                                            sortable: true,
                                            tooltip: 'Available',
                                            dataIndex: 'left',
                                            align: 'center',
                                            width: 80,
                                            draggable: false
                                        }, {
                                            header: 'Take',
                                            cls: "a-display-label",
                                            sortable: true,
                                            dataIndex: 'take',
                                            align: 'center',
                                            width: 80,
                                            tdCls: 'editable-cell',
                                            xtype: 'numbercolumn',
                                            format: '0.##',
                                            editor: {
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                listeners: {
                                                    focus: 'OnEditorFocus'
                                                }
                                            },
                                            renderer: 'takeRenderer',
                                            draggable: false


                                        }
                                    ]
                                }, {
                                    xtype: 'grid',
                                    flex: 1,
                                    itemId: 'other',
                                    bind: {
                                        store: '{otherCategory}'
                                    },
                                    viewConfig: {
                                        markDirty: false,
                                        getRowClass: function (record) {
                                            return this.up("#new-req").getController().setOtherRowClass(record);
                                        }
                                    },
                                    columns: [
                                        {
                                            xtype: 'actioncolumn',
                                            cls: "a-display-label",
                                            iconCls: 'fa fa-info-circle',
                                            width: 22,
                                            getTip: function(value, metadata, record) {
                                                return this.up("#new-req").getController().getOtherTip(record);
                                            },
                                            menuDisabled: true,
                                            draggable: false
                                        }, {
                                            header: 'Other category',
                                            cls: "a-display-label",
                                            flex: 1,
                                            sortable: true,
                                            dataIndex: 'name',
                                            draggable: false

                                        }, {
                                            header: 'Take',
                                            cls: "a-display-label",
                                            sortable: true,
                                            dataIndex: 'take',
                                            tdCls: 'editable-cell',
                                            width: 80,
                                            align: 'center',
                                            xtype: 'numbercolumn',
                                            format: '0.##',
                                            editor: {
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                listeners: {
                                                    focus: 'OnEditorFocus'
                                                }
                                            },
                                            renderer: 'takeRenderer',
                                            draggable: false
                                        }, {
                                            header: 'Justification',
                                            cls: "a-display-label",
                                            sortable: true,
                                            dataIndex: 'justification',
                                            flex: 1,
                                            tdCls: 'justification-cell',
                                            editor: {
                                                xtype: 'textarea',
                                                listeners: {
                                                    focus: 'OnEditorFocus'
                                                }
                                            },
                                            renderer: 'justificationRenderer',
                                            draggable: false
                                        }
                                    ]
                                }
                            ]
                        }, {
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            defaults: {
                                border: true,
                                header: false
                            },
                            items: [
                                {
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },

                                    flex: .8,
                                    defaults: {
                                        bodyPadding: 10,
                                        border: true,
                                        bodyCls: 'results-cell'

                                    },

                                    margin: '0 0 0 20',
                                    items: [
                                        {
                                            flex: 1,
                                            layout: {
                                                type: 'hbox',
                                                align: 'stretch'
                                            },
                                            defaults: {
                                                bodyCls: 'results-cell'
                                            },
                                            items: [
                                                {
                                                    bind: {
                                                        html: 'Total {unit} :'
                                                    },
                                                    flex: 1
                                                }, {
                                                    bind: {
                                                        html: "{totalRequest} "
                                                    },
                                                    width: 60
                                                }
                                            ]
                                        }, {
                                            html: '=',
                                            width: 30

                                        }, {
                                            align: 'center',
                                            width: 80,
                                            bind: {
                                                html: " {totalEntitled} "
                                            },
                                            style: 'border-top : solid 1px #157fcc;'
                                        },
                                        {
                                            bind: {
                                                visible: '{entitledScrollBarIsVisible}',
                                                width: '{scrollBarWidth}'
                                            }
                                        }
                                    ]
                                }, {
                                    width: 40,
                                    margin: 0,
                                    bodyCls: 'results-cell'
                                }, {
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },

                                    flex: 1,
                                    defaults: {
                                        bodyPadding: 10,
                                        border: true,
                                        bodyCls: 'results-cell'

                                    },

                                    margin: '0 20 0 0',
                                    items: [
                                        {width: 20},
                                        {
                                            html: "+",
                                            flex: 1,
                                            bodyAlign: 'center'
                                        }, {
                                            width: 80,
                                            bind: {
                                                html: " {totalOther} "
                                            },
                                            style: 'border-top : solid 1px #157fcc;'
                                        }, {
                                            bind: {
                                                html: "{leftToDistributeText}"
                                            },
                                            flex: 1
                                        },
                                        {
                                            bind: {
                                                visible: '{otherScrollBarIsVisible}',
                                                width: '{scrollBarWidth}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }, {
                            margin: '20 0 20 100',
                            layout: {
                                align: 'middle',
                                pack: 'left',
                                type: 'hbox'
                            },
                            items: [{
                                xtype: 'button',
                                itemId: 'submitButtonId',
                                text: ' Submit Request ',
                                scale: 'medium',
                                iconCls: 'fa fa-exclamation',
                                bind: {
                                    disabled: '{!requestIsValid}',
                                    text: '{submitButtonText}',
                                    iconCls: '{submitButtonIconCls}'
                                },
                                handler: 'onSubmitRequest'
                            }]

                        }
                    ]
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
        },{
            itemId: 'hCalendarTooltipId',
            width: 250,
            height: 115,
            title: 'New Request...',
            floating: true,
            closable : true,
            draggable: true,
            bodyPadding: 10,
            defaults: {
                margin: '-5 0',
                labelWidth: 80
            },
            listeners: {
                beforeclose : "onHCalendarClose"
            },
            items : [{
                xtype: "displayfield",
                bind: {
                    fieldLabel: 'Total {unit}',
                    value: '{totalRequest}'
                }
            },{
                xtype: "displayfield",
                fieldLabel: "Start Date",
                bind: {
                    value: '{currentRecord.leavedate:date("D j F Y")}'
                }
            }, {
                xtype: "displayfield",
                fieldLabel: "End Date",
                bind: {
                    value: '{currentRecord.returndate:date("D j F Y")}'
                }
            }]
        },{
            itemId: 'hCalendarRequestId',
            width: 250,
            height: 150,
            bind: {
                title: 'Request Status: {hCalSelectedRequest.requestStatus}'
            },
            floating: true,
            closable : true,
            draggable: true,
            bodyPadding: 10,
            defaults: {
                margin: '-5 0',
                labelWidth: 80
            },
            listeners: {
                beforeclose : "onHCalendarClose"
            },
            items : [{
                xtype: "displayfield",
                bind: {
                    fieldLabel: 'Total {unit}',
                    value: '{hCalSelectedRequest.totalRequest}'
                }
            },{
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
            },{
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
        }, {
            itemId: "confirmPanelId",
            width: 450,
            maxHeight: 450,
            title: "Please review and confirm",
            floating: true,
            closable: true,
            draggable: true,
            modal: true,
            framed: true,
            defaultAlign: "c-t",
            style: {
                marginTop: '10px'
            },
            listeners: {
                beforeclose: "onConfirmPanelClose"
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            flex: 1,
            items: [{
                bodyPadding: 10,
                cls: 'confirm-panel',
                bind: {
                    html: "<p><b>Category distribution and confirmation</b>" +
                    "</p>New absence request for {requestUser} from {currentRecord.leavedate:date('l j F Y')} to {currentRecord.returndate:date('l j F Y')}, using {totalRequest} days."
                }
            }, {
                xtype: 'grid',
                flex: 1,
                itemId: 'confirmGridId',
                reference: 'confirmGrid',
                bind: {
                    store: '{confirmStore}'
                },
                viewConfig: {
                    markDirty: false
                },
                columns: [
                    {
                        header: 'Date',
                        cls: "a-display-label",
                        width: 140,
                        sortable: false,
                        xtype: 'datecolumn',
                        dataIndex: 'date',
                        format: 'd M Y',
                        menuDisabled: true
                    }, {
                        cls: "a-display-label",
                        bind: {
                            text: '<span>{unit}</span>'
                        },
                        width: 70,
                        sortable: false,
                        dataIndex: 'quantity',
                        xtype: 'numbercolumn',
                        menuDisabled: true
                    }, {
                        cls: "a-display-label",
                        header: 'Category',
                        flex: 1,
                        sortable: false,
                        dataIndex: 'name',
                        menuDisabled: true
                    }
                ],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    itemId: 'top-bar',
                    defaults: {
                        baseCls: 'x-btn x-btn-default-small ',
                        cls: 'absman-small-button'
                    },
                    items: [{
                        text: 'Confirm',
                        iconCls: 'x-fa fa-thumbs-o-up',
                        handler: 'submitRequest'
                    }, {
                        text: 'Cancel',
                        iconCls: 'x-fa fa-thumbs-o-down',
                        handler: 'onConfirmPanelCancel'
                    }, "->", {
                        text: 'Move Up',
                        itemId: 'moveCategoryUp',
                        iconCls: 'x-fa fa-arrow-up',
                        handler: 'onConfirmPanelMoveCategory',
                        bind: {
                            disabled: '{categorySelected}'
                        }
                    }, {
                        text: 'Move Down',
                        itemId: 'moveCategoryDown',
                        iconCls: 'x-fa fa-arrow-down',
                        handler: 'onConfirmPanelMoveCategory',
                        bind: {
                            disabled: '{categorySelected}'
                        }
                    }]
                }]
            }, {
                bodyPadding: 5
            }
            ]
        }, {
            itemId: "requestListId",
            xtype: "requestlist",
            listType: 'user'
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

