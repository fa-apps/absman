Ext.define('AbsMan.view.request.RequestDetails', {
    extend: 'Ext.form.Panel',
    xtype: 'request-details',


    requires: [
        'AbsMan.view.request.RequestDetailsController',
        'AbsMan.view.request.RequestDetailsModel',
        'AbsMan.view.request.RequestList',
        'AbsMan.view.ux.HCalendar',
        'AbsMan.view.util.PickUser'
    ],

    controller: 'request-details',
    viewModel: {
        type: 'request-details'
    },

    iconCls: 'x-fa fa-paper-plane',

    title: 'Absence Request Details',

    border: false,
    plain: true,
    closable: true,
    scrollable: true,

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },

    items: [
        {
            scrollable: true,

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                frame: true,
                //cls: "a-display-panel",
                bodyPadding: 10

            },
            items: [
                {
                    bind: {
                        title: 'Request for: <b>{currentRecord.username}</b>'
                    },
                    tools: [{
                        type: 'refresh',
                        callback: 'loadForm',
                        tooltip: 'Click here to reload the form'
                    }],
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    flex: .7,
                    minWidth: 300,
                    margin: '0 10 0 0',
                    items: [
                        {
                            layout: {
                                type: 'vbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            flex: 1,
                            defaults: {},
                            items: [
                                {

                                    xtype: 'displayfield',
                                    labelWidth: 120,
                                    margin: 2,
                                    labelAlign: 'left',
                                    labelClsExtra: "a-display-label",
                                    fieldLabel: 'Start Date',
                                    bind: {
                                        value: '{currentRecord.leavedate:date("D j F Y")}'
                                    }
                                }, {
                                    xtype: 'displayfield',
                                    labelWidth: 120,
                                    margin: 2,
                                    labelAlign: 'left',
                                    labelClsExtra: "a-display-label",
                                    fieldLabel: 'Leaving time',
                                    bind: {
                                        value: '{leaveTime}',
                                        hidden: '{hideLeaveTime}'
                                    }
                                }, {
                                    xtype: 'displayfield',
                                    labelWidth: 120,
                                    margin: 2,
                                    labelAlign: 'left',
                                    labelClsExtra: "a-display-label",
                                    fieldLabel: 'End Date',
                                    bind: {
                                        value: '{currentRecord.returndate:date("D j F Y")}'
                                    }
                                }, {
                                    xtype: 'displayfield',
                                    labelWidth: 120,
                                    margin: 2,
                                    labelAlign: 'left',
                                    labelClsExtra: "a-display-label",
                                    fieldLabel: 'Return time',
                                    bind: {
                                        value: '{returnTime}',
                                        hidden: '{hideReturnTime}'
                                    }
                                }, {
                                    xtype: 'displayfield',
                                    labelWidth: 120,
                                    margin: 2,
                                    labelClsExtra: "a-display-label",
                                    fieldLabel: 'Comments',
                                    labelAlign: 'left',
                                    fieldStyle: {
                                        maxHeight: "36px",
                                        overflowY: "scroll"
                                    },
                                    bind: {
                                        value: '{currentRecord.comments}',
                                        hidden: '{!commentsVisible}'
                                    }
                                }, {
                                    xtype: 'displayfield',
                                    labelWidth: 120,
                                    margin: 2,
                                    labelAlign: 'left',
                                    labelClsExtra: "a-display-label",
                                    fieldLabel: 'Requested By',
                                    bind: {
                                        value: '{currentRecord.requestedby}',
                                        hidden: '{requestedByVisible}'
                                    }
                                }, {
                                    xtype: 'displayfield',
                                    labelWidth: 120,
                                    margin: 2,
                                    labelAlign: 'left',
                                    labelClsExtra: "a-display-label",
                                    fieldLabel: 'Request Date',
                                    bind: {
                                        value: '{currentRecord.requestdate:date("D j F Y H:i:s")}'
                                    }
                                }, {

                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    itemId: "approvalStatusId",
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            labelWidth: 120,
                                            margin: 2,
                                            labelAlign: 'left',
                                            labelClsExtra: "a-display-label",
                                            fieldLabel: 'Approver',
                                            bind: {
                                                value: '{currentRecord.approver}'
                                            },
                                            flex: 1
                                        }, {
                                            xtype: 'tool',
                                            itemId: 'approvalToolId',
                                            bind: {
                                                type: '{approvalStatusType}'
                                            },
                                            width: 20,
                                            style: "margin-top: 6px",
                                            listeners: {
                                                mouseover: {
                                                    element: 'el',
                                                    fn: 'onWorkflowActorOver'
                                                },
                                                mouseout: {
                                                    element: 'el',
                                                    fn: 'onWorkflowActorOut'
                                                }
                                            }
                                        }, {
                                            itemId: 'toolTipId',
                                            floating: true,
                                            closable: false,
                                            shadow: false,
                                            baseCls: 'a-tooltip',
                                            defaults: {
                                                xtype: "displayfield",
                                                labelWidth: 110,
                                                margin: '0 5 -5 5'
                                            },
                                            items: [{
                                                fieldLabel: "Approval Status",
                                                bind: {
                                                    value: '{currentRecord.statustext}'
                                                }
                                            }, {
                                                fieldLabel: "Date",
                                                bind: {
                                                    hidden: '{!currentRecord.approvaldate}',
                                                    value: '{currentRecord.approvaldate:date("d M Y H:i:s")}'
                                                },
                                                hidden: true

                                            }, {
                                                fieldLabel: "Comments",
                                                bind: {
                                                    hidden: '{!currentRecord.approvaltext}',
                                                    value: '{currentRecord.approvaltext}'
                                                },
                                                hidden: true
                                            }]
                                        }
                                    ]
                                }, {
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    bind: {
                                        hidden: '{!currentRecord.requirestandinapprover}'
                                    },
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            labelWidth: 120,
                                            margin: 2,
                                            labelAlign: 'left',
                                            labelClsExtra: "a-display-label",
                                            fieldLabel: 'Stand-in Approver',
                                            bind: {
                                                value: '{currentRecord.standinapprover}'
                                            },
                                            flex: 1
                                        }, {

                                            xtype: 'tool',
                                            itemId: 'approvalToolId',
                                            bind: {
                                                type: '{approvalStatusType}'
                                            },
                                            width: 20,
                                            style: "margin-top: 6px",
                                            listeners: {
                                                mouseover: {
                                                    element: 'el',
                                                    fn: 'onWorkflowActorOver'
                                                },
                                                mouseout: {
                                                    element: 'el',
                                                    fn: 'onWorkflowActorOut'
                                                }
                                            }
                                        }, {
                                            itemId: 'toolTipId',
                                            floating: true,
                                            baseCls: 'a-tooltip',
                                            shadow: false,
                                            closable: false,
                                            defaults: {
                                                xtype: "displayfield",
                                                labelWidth: 110,
                                                margin: '0 5 -5 5'
                                            },
                                            items: [{
                                                fieldLabel: "Approval Status",
                                                bind: {
                                                    value: '{currentRecord.statustext}'
                                                }
                                            }, {
                                                fieldLabel: "Date",
                                                bind: {
                                                    hidden: '{!currentRecord.approvaldate}',
                                                    value: '{currentRecord.approvaldate:date("d M Y H:i:s")}'
                                                },
                                                hidden: true

                                            }, {
                                                fieldLabel: "Comments",
                                                bind: {
                                                    hidden: '{!currentRecord.approvaltext}',
                                                    value: '{currentRecord.approvaltext}'
                                                },
                                                hidden: true
                                            }]
                                        }
                                    ]
                                }, {
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    bind: {
                                        hidden: '{!currentRecord.requiresubstitute}'
                                    },
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            labelWidth: 120,
                                            margin: 2,
                                            labelAlign: 'left',
                                            labelClsExtra: "a-display-label",
                                            fieldLabel: "Substitute",
                                            bind: {
                                                value: '{currentRecord.substitute}'
                                            },
                                            flex: 1
                                        }, {
                                            xtype: 'tool',
                                            itemId: 'substituteToolId',
                                            bind: {
                                                type: '{substituteStatusType}'
                                            },
                                            width: 20,
                                            style: "margin-top: 6px",
                                            listeners: {
                                                mouseover: {
                                                    element: 'el',
                                                    fn: 'onWorkflowActorOver'
                                                },
                                                mouseout: {
                                                    element: 'el',
                                                    fn: 'onWorkflowActorOut'
                                                }
                                            }
                                        }, {
                                            itemId: 'toolTipId',
                                            baseCls: 'a-tooltip',
                                            shadow: false,
                                            floating: true,
                                            closable: false,
                                            defaults: {
                                                xtype: "displayfield",
                                                labelWidth: 120,
                                                margin: '0 5 -5 5'
                                            },
                                            items: [{
                                                fieldLabel: "Substitute Status",
                                                bind: {
                                                    value: '{substituteAck}'
                                                }
                                            }, {
                                                fieldLabel: "Date",
                                                bind: {
                                                    hidden: '{!currentRecord.substituteackdate}',
                                                    value: '{currentRecord.substituteackdate:date("d M Y H:i:s")}'
                                                },
                                                hidden: true

                                            }, {
                                                fieldLabel: "Comments",
                                                bind: {
                                                    hidden: '{!currentRecord.substituteacktext}',
                                                    value: '{currentRecord.substituteacktext}'
                                                },
                                                hidden: true
                                            }]
                                        }
                                    ]
                                }, {
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    bind: {
                                        hidden: '{!currentRecord.requirenotified}'
                                    },
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            labelWidth: 120,
                                            margin: 2,
                                            labelAlign: 'left',
                                            labelClsExtra: "a-display-label",
                                            fieldLabel: 'Notified',
                                            bind: {
                                                value: '{currentRecord.notified}'
                                            },
                                            flex: 1
                                        }, {
                                            xtype: 'tool',
                                            itemId: 'notifiedToolId',
                                            type: 'save',
                                            width: 20,
                                            style: "margin-top: 6px",
                                            listeners: {
                                                mouseover: {
                                                    element: 'el',
                                                    fn: 'onWorkflowActorOver'
                                                },
                                                mouseout: {
                                                    element: 'el',
                                                    fn: 'onWorkflowActorOut'
                                                }
                                            }
                                        }, {
                                            itemId: 'toolTipId',
                                            baseCls: 'a-tooltip',
                                            shadow: false,
                                            floating: true,
                                            closable: false,
                                            defaults: {
                                                xtype: "displayfield",
                                                labelWidth: 120,
                                                margin: '0 5 -5 5'
                                            },
                                            items: [{
                                                fieldLabel: "Notified Status",
                                                value: "Notified"
                                            }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }, {
                    title: 'Current Status: ',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    bind: {
                        title: '{currentStatus}'
                    },
                    bodyPadding: "0 10 10 10",
                    flex: 1,
                    margin: '0 10 0 0',
                    scrollable: true,
                    defaults: {
                        scrollable: true,
                        hidden: true,
                        bodyPadding: 10
                    },
                    dockedItems: {

                        dock: 'top',
                        xtype: 'toolbar',
                        padding: "10 10 0 10",
                        items: [

                            {
                                xtype: "displayfield",
                                hidden: false,
                                cls: "entitlement-left",
                                margin: 0,
                                bind: {
                                    value: '{totalRequestLabel} {currentRecord.totalrequest}',
                                }

                            }
                        ]
                    },
                    items: [{
                        xtype: "dataview",
                        itemId: "requestCategorySummaryId",
                        tpl: [
                            '<div class="sum">',
                            '<div class="item title">',
                            '   <div class="stay">',
                            '       <span class="f-left-num">Used</span>',
                            '       <span class="f-left">Category</span>',
                            '       <span class="f-right">&nbsp;</span>',
                            '   </div>',
                            '</div>',
                            '<tpl for=".">',
                            '<div class="item">',
                            '   <div class="stay">',
                            '       <span class="f-left-num">{taken}</span>',
                            '       <span class="f-left">{name}</span>',
                            '       <span class="f-right">{justification}</span>',
                            '   </div>',
                            '</div>',
                            '</tpl>',
                            '</div>'
                        ],
                        bind: {
                            store: '{usedCategories}',
                            hidden: '{!categoriesUsedVisible}'
                        },
                        itemSelector: 'item',
                        listeners: {
                            click: {
                                element: 'el',
                                fn: "showEntitlementDetails"
                            }
                        }
                    }, {
                        xtype: "dataview",
                        itemId: "textRoleSummaryId",
                        tpl: [
                            '<div class="sum">',
                            '<tpl for=".">',
                            '<tpl for="roleActionText">',
                            '<div class="item">',
                            '   <div class="stay">',
                            '       <span class="f-left">{.}</span>',
                            '   </div>',
                            '</div>',
                            '</tpl>',
                            '</tpl>',
                            '</div>'
                        ],
                        bind: {
                            store: '{formData}',
                            hidden: '{categoriesUsedVisible}'
                        },
                        itemSelector: 'item',
                        listeners: {
                            click: {
                                element: 'el',
                                fn: "showEntitlementDetails"
                            }
                        }
                    }, {
                        xtype: "displayfield",
                        labelWidth: 140,
                        margin: '10 0 0 10',
                        labelAlign: 'left',
                        labelClsExtra: "a-display-label",
                        fieldLabel: "Approver comments",
                        bind: {
                            value: '{currentRecord.approvaltext}',
                            hidden: '{!currentRecord.approvaltext}'
                        }

                    }, {
                        xtype: "displayfield",
                        labelWidth: 140,
                        margin: '10 0 0 10',
                        labelAlign: 'left',
                        labelClsExtra: "a-display-label",
                        fieldLabel: "Cancel comments",
                        bind: {
                            value: '{currentRecord.canceltext}',
                            hidden: '{!currentRecord.canceltext}'
                        }

                    }, {
                        xtype: "displayfield",
                        labelWidth: 140,
                        margin: '10 0 0 10',
                        labelAlign: 'left',
                        labelClsExtra: "a-display-label",
                        fieldLabel: "Substitute comments",
                        bind: {
                            value: '{currentRecord.substituteacktext}',
                            hidden: '{!currentRecord.substituteacktext}'
                        }

                    }, {
                        xtype: "dataview",
                        itemId: "readerSummaryId",
                        tpl: [
                            '<div class="sum-framed">',
                            '<tpl for=".">',
                            '<tpl for="roleActionText">',
                            '<div class="item">',
                            '   <span class="f-left">{.}</span>',
                            '</div>',
                            '</tpl>',
                            '</tpl>',
                            '</div>'
                        ],
                        bind: {
                            store: '{formData}',
                            hidden: '{!categoriesUsedVisible}'
                        },
                        itemSelector: 'item',
                        listeners: {
                            click: {
                                element: 'el',
                                fn: "showEntitlementDetails"
                            }
                        }
                    },
                        /*
                         {
                         bind: {
                         hidden: '{!categoriesUsedVisible}'
                         },
                         maxHeight: 170,
                         items: [
                         {
                         xtype: 'grid',
                         itemId: 'entitled',
                         margin: '5 0 5 0',
                         border: true,
                         frame: true,
                         header: false,
                         scrollable: true,
                         bind: {
                         store: '{entitledCategory}',
                         hidden: '{!totalEntitled}'

                         },
                         columns: [
                         {
                         header: 'Entitled category',
                         cls: "a-display-label",
                         width: 200,
                         sortable: true,
                         dataIndex: 'name'
                         }, {
                         header: 'Used',
                         cls: "a-display-label",
                         sortable: true,
                         dataIndex: 'taken',
                         align: 'center',
                         width: 80,
                         xtype: 'numbercolumn',
                         format: '0.##'


                         }, {
                         header: 'OD Used',
                         cls: "a-display-label",
                         tooltip: 'On Demand Taken',
                         sortable: true,
                         dataIndex: 'ondemandtaken',
                         align: 'center',
                         width: 80,
                         hidden: true

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
                         }
                         }, {
                         header: 'OD Avail.',
                         cls: "a-display-label",
                         tooltip: 'On Demand Available',
                         sortable: true,
                         dataIndex: 'ondemandleft',
                         align: 'center',
                         width: 80,
                         hidden: true

                         }, {
                         header: 'Remaining',
                         cls: "a-display-label",
                         sortable: true,
                         tooltip: 'Remaining once approved',
                         dataIndex: 'left',
                         align: 'center',
                         flex: 1
                         }
                         ]
                         }, {
                         xtype: 'grid',
                         border: true,
                         margin: '5 0 5 0',
                         frame: true,
                         itemId: 'other',

                         bind: {
                         store: '{otherCategory}',
                         hidden: '{!totalOther}'
                         },
                         columns: [
                         {
                         header: 'Other category',
                         cls: "a-display-label",
                         width: 200,
                         sortable: true,
                         dataIndex: 'name'

                         }, {
                         header: 'Used',
                         cls: "a-display-label",
                         sortable: true,
                         dataIndex: 'taken',
                         width: 80,
                         align: 'center',
                         xtype: 'numbercolumn',
                         format: '0.##'
                         }, {
                         header: 'Justification',
                         cls: "a-display-label",
                         sortable: true,
                         dataIndex: 'justification',
                         flex: 1,
                         tdCls: 'justification-cell',
                         renderer: 'justificationRenderer'
                         }
                         ]
                         }
                         ]
                         }*/
                        {
                            bind: {
                                hidden: '{!approvePanelVisible}'
                            },
                            layout: {
                                type: 'hbox',
                                pack: 'center',
                                align: 'top'
                            },
                            defaults: {
                                xtype: 'button',
                                scale: 'medium',
                                handler: 'onActionClick',
                                margin: 5
                            },
                            items: [
                                {
                                    itemId: 'approveButtonId',
                                    text: 'Approve Request ',
                                    iconCls: 'fa fa-thumbs-up',
                                    bind: {
                                        hidden: '{!approveEnabled}'
                                    }
                                }, {
                                    itemId: 'disapproveButtonId',
                                    text: 'Disapprove Request ',
                                    iconCls: 'fa fa-thumbs-down',
                                    bind: {
                                        hidden: '{!disapproveEnabled}'
                                    }
                                }
                            ]
                        }, {
                            bind: {
                                hidden: '{!cancelPanelVisible}'
                            },
                            scrollable: true,
                            layout: {
                                type: 'hbox',
                                pack: 'center',
                                align: 'top'
                            },
                            defaults: {
                                xtype: 'button',
                                scale: 'medium',
                                handler: 'onActionClick',
                                margin: 10,
                                cls: 'bold-text'
                            },
                            items: [
                                {
                                    itemId: 'cancelButtonId',
                                    text: 'Cancel Request ',
                                    iconCls: 'fa fa-trash',
                                    bind: {
                                        hidden: '{!cancelEnabled}'
                                    }
                                }
                            ]
                        }, {
                            layout: {
                                type: 'hbox',
                                pack: 'center',
                                align: 'top'
                            },
                            bind: {
                                hidden: '{!substitutePanelVisible}'
                            },
                            defaults: {
                                xtype: 'button',
                                margin: 10,
                                scale: 'medium',
                                handler: 'onActionClick'
                            },
                            items: [
                                {
                                    itemId: 'ackButtonId',
                                    text: 'OK',
                                    iconCls: 'fa fa-thumbs-up',
                                    bind: {
                                        disabled: '{!ackEnabled}'
                                    }
                                }, {
                                    itemId: 'nackButtonId',
                                    text: 'Not Good',
                                    iconCls: 'fa fa-thumbs-down',
                                    bind: {
                                        disabled: '{!nackEnabled}'
                                    }
                                }
                            ]
                        }
                    ]
                }, {
                    cls: "a-display-panel",
                    layout: {
                        type: 'box',
                        pack: 'start',
                        align: 'stretch'
                    },
                    title: "Request History", //todo filters and sorting
                    flex: .8,
                    items: [
                        {
                            xtype: "dataview",
                            scrollable: true,
                            flex: .9,
                            height: 240,
                            tpl: [
                                '<tpl for=".">',
                                '<div class="request-history-item x-panel-default-framed">',
                                '<div class="f-top">{actionBy}</div><div class="f-right f-top">{date:date("d M Y H:i:s")}<br>{[this.elapsed(values.date)]}</div>',
                                '<div class="f-bottom">{actionText}</div>',
                                '<tpl if="id ">',
                                    '<div class="f-bottom f-text">{text} <a href="#" class="more-button" history-id="{id}" >more...</a></div>',
                                    '<div class="more-panel more-hidden" id="{action}-{id}"></div>',
                                '</tpl>',
                                '</div>',
                                '</tpl>',
                                {
                                    elapsed: function (date) {
                                        return AbsMan.util.elapsed(date);
                                    }
                                }
                            ],
                            bind: {
                                store: '{requestHistory}'
                            },
                            itemSelector: 'div.request-history-item',
                            listeners: {
                                click: "showHistoryDetails",
                                element: 'el'
                            }
                        }
                    ]
                }
            ]
        },
        {
            xtype: "hcalendar",
            itemId: "hcalendarId",
            margin: '10 0 0 0',
            height: 83,
            scrollable: true,
            listeners: {
                click: "onHCalendarClick",
                mouseover: "onHCalendarOver",
                element: 'el'
            }
        }, {
            itemId: 'hCalendarTooltipId',
            width: 250,
            height: 115,
            title: 'New Request...',
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
                    value: '{totalRequest}'
                }
            }, {
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
        }, {
            itemId: 'confirmPanelId',
            xtype: "window",
            height: 240,
            width: 450,
            bind: {
                title: '{confirmPanelTitle}'
            },
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            scrollable: true,
            floating: true,
            bodyPadding: 10,
            modal: true,
            closable: true,
            closeAction: 'hide',
            items: [
                {
                    xtype: 'textarea',
                    flex: 1,
                    bind: {
                        fieldLabel: '{confirmLabel}',
                        value: '{confirmComments}'
                    },
                    labelAlign: 'top'
                }, {
                    bodyStyle: {textAlign: "center"},
                    defaults: {
                        margin: 10
                    },
                    allowBlank: false,
                    items: [
                        {
                            xtype: 'button',
                            text: 'Abort',
                            width: 60,
                            type: 'close',
                            handler: 'closeConfirm'
                        }, {
                            xtype: 'button',
                            text: 'Confirm Now!',
                            width: 120,
                            bind: {
                                handler: '{confirmAction}',
                                disabled: '{confirmDisabled}'
                            }
                        }
                    ]
                }
            ]
        }, {
            itemId: "requestListId",
            xtype: "requestlist",
            listType: 'user'
        }
    ]
});

