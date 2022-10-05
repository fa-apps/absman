
Ext.define('AbsMan.view.formpanel.MyStaffController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.my-staff',


    init: function () {


        this.groupStore = this.getViewModel().getStore("groupData");
        this.groupTreeStore = this.getViewModel().getStore("groupTree");
        this.groupCalendarStore = this.getViewModel().getStore("gCalendarData");
        this.groupTreePanel = this.getView().down("#myStaffTreePanelId");
        this.schedulePanels = this.getView().down("#myStaffSchedulePanelsId");
        this.currentEditor = null;
        this.selectedGroupRecord = null;
        this.defaultGroupId = null;
        this.formTimestamp = null;

        this.getView().on("selectuser", function (userSelection) {

            var memberIds = [];

            Ext.Array.each(userSelection, function (member) {
                memberIds.push(member.id);
            }, this);

            this.addMemberToGroup(this.selectedGroupRecord.id, memberIds, null);

        }, this);

        this.loadForm();
    },


    loadForm: function () {

        this.resetProxy();
        this.groupStore.load({
            scope: this,
            callback: function (records, operation, success) {

                if (success) {

                    var response = Ext.JSON.decode(operation.getResponse().responseText);

                    this.groupTreePanel.getRootNode().insertChild(0, response.data.groups);
                    this.groupTreePanel.getRootNode().expand();
                    this.groupTreeStore.commitChanges();

                    //this.groupTreePanel.expandAll();

                    this.loadRequestList();

                    this.defaultGroupId = response.data.groups[0].id;

                    var schedulePanel = Ext.ComponentQuery.query('#scheduleTab-' + this.defaultGroupId)[0];

                    if (!schedulePanel) {

                        schedulePanel = this.schedulePanels.add({
                            itemId: 'scheduleTab-' + this.defaultGroupId,
                            xtype: "gcalendar",
                            title: response.data.groups[0].text,
                            iconCls: 'x-fa fa-calendar',
                            closable: false
                        });

                        this.schedulePanels.setActiveTab(schedulePanel);

                        this.loadGroupCalendar(schedulePanel, this.defaultGroupId);
                    }

                    this.formTimestamp = response.data.lastupdate;

                } else {

                    var response = operation.getError();

                    AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
                }

            }
        });
    },


    checkNeedReload: function () {

        if (this.groupStore.isLoaded()) {

            var groupIds = Ext.Array.map(this.schedulePanels.items.keys, function (id) {
                var aId = id.split("-");
                return aId[1];
            });

            Ext.Ajax.request({
                scope: this,
                url: this.groupStore.getProxy().baseUrl + 'checkform/' + userId,
                params: {
                    formTimestamp: this.formTimestamp,
                    ids: Ext.JSON.encode(groupIds)
                },
                success: function (responseData) {

                    var response = Ext.JSON.decode(responseData.responseText);

                    if (response.success) {

                        if (response.outdated === true) {

                            AbsMan.util.mess("Reloading, the form values are out of date.", AbsMan.util.INFO);

                            this.onReloadForm();
                        }

                    } else {

                        AbsMan.util.mess(response.mess || "Error during check for need reload operation", AbsMan.util.ERROR);
                    }
                },
                failure: function (response) {

                    AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
                }
            });
        }

    },


    loadRequestList: function () {

        var requestListView = this.getView().down("requestlist");

        if (requestListView) {

            requestListView.getController().loadFilterList();
        }
    },


    resetProxy: function () {

        this.groupStore.getProxy().url = this.groupStore.getProxy().baseUrl + userId;
    },


    onReloadForm: function () {

        this.groupTreePanel.getRootNode().collapse();
        this.groupTreePanel.getRootNode().removeAll();

        this.loadForm();

        Ext.Array.each(this.schedulePanels.items.keys, function (itemId) {

            var aId = itemId.split("-");

            this.reloadGroupCalendar(aId[1])

        }, this);

    },


    onAddGroup: function (event, el, panel, tool) {

        this.groupTreePanel.getRootNode().collapseChildren();
        this.groupTreePanel.getRootNode().insertChild(1, {
            "id": "newGroupId",
            "text": "New Group",
            "iconCls": "x-fa fa-users"
        });

        this.editGroup(1);

    },


    editGroup: function (row) {

        this.groupTreePanel.editingPlugin.startEditByPosition({row: row, column: 0});

        this.currentEditor.editors.items[0].items.items[0].selectText();

    },


    onItemEdit: function (editor, context) {

        this.groupTreeStore.sync({

            scope: this,
            success: function (batch, options) {

                Ext.Array.each(batch.getOperations(), function (operation) {

                    var response = Ext.JSON.decode(operation.getResponse().responseText);

                    if (response.success) {

                        if (response.data) {

                            if (response.data.newId) {

                                var tempNode = this.groupTreeStore.findNode("id", "newGroupId");

                                tempNode.remove();

                                this.groupTreePanel.getRootNode().collapseChildren();
                                this.groupTreePanel.getRootNode().appendChild({
                                    "id": response.data.newId,
                                    "text": response.data.text,
                                    "iconCls": "x-fa fa-users"
                                });

                                this.groupTreeStore.commitChanges();
                                this.groupTreeStore.sort("text", "ASC");

                                AbsMan.util.mess(response.mess || "Group added successfully.");

                            }
                            else {

                                AbsMan.util.mess(response.mess || "Group saved successfully.");

                            }
                        }

                    } else {

                        AbsMan.util.mess(response.mess || "Group not saved!.", AbsMan.util.ERROR);
                    }


                }, this);
            },
            failure: function (batch) {

                var response = batch.getOperations()[0].getError();

                AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
            }
        });

    },


    onItemBeforeEdit: function (editor, context, eOpts) {

        this.currentEditor = editor;

        return context.record.data.id !== "defaultGroupId" && context.record.parentNode.data.id == "root";
    },


    onActionClick: function (grid, rowIndex, colIndex, actionItem, event, record, row) {

        var groups = [];

        this.groupTreeStore.each(function (item) {
            if (item.parentNode.id == 'root' && item.id !== this.defaultGroupId && item.id !== "newGroupId") {
                groups.push({
                    value: item.get("id"),
                    text: item.get("text")
                });
            }
        }, this);

        //grid.getSelectionModel().select(record);

        var contextMenu = new Ext.menu.Menu({
            items: [
                {
                    text: 'Add my direct reports to group...',
                    iconCls: 'x-fa fa-plus',
                    //tooltip: 'Add all staff to a group',
                    scope: this,
                    hidden: record.id !== this.defaultGroupId,
                    menu: {
                        defaults: {
                            iconCls: 'x-fa fa-users',
                            scope: this,
                            handler: function (menuItem) {
                                this.addMemberToGroup(menuItem.value, "all", contextMenu)
                            }

                        },
                        items: groups
                    },
                    disabled: !groups.length
                }, {
                    text: 'Add to group...',
                    iconCls: 'x-fa fa-plus',
                    //tooltip: 'Add this person to a group',
                    scope: this,
                    hidden: record.parentNode.id !== this.defaultGroupId,
                    menu: {
                        defaults: {
                            iconCls: 'x-fa fa-users',
                            scope: this,
                            handler: function (menuItem) {
                                this.addMemberToGroup(menuItem.value, [record.get("userId")], contextMenu);
                            }

                        },
                        items: groups
                    },
                    disabled: !groups.length
                }, {
                    text: 'Add all direct reports to group...',
                    iconCls: 'x-fa fa-plus',
                    //tooltip: 'Add all direct reports from this person to a group',
                    scope: this,
                    hidden: !(record.parentNode.id == this.defaultGroupId || record.getDepth() == 2 && record.parentNode.id !== this.defaultGroupId),
                    menu: {
                        defaults: {
                            iconCls: 'x-fa fa-users',
                            scope: this,
                            handler: function (menuItem) {
                                this.addMemberToGroup(menuItem.value, "reports", contextMenu, record.get("userId"));
                            }

                        },
                        items: groups
                    },
                    disabled: !groups.length
                }, {
                    text: 'Add a member from global list',
                    iconCls: 'x-fa fa-plus',
                    //tooltip: 'Add a member from global list',
                    scope: this,
                    hidden: !(record.parentNode.id == 'root' && record.id !== this.defaultGroupId),
                    handler: function () {
                        this.addGlobalMember(record, contextMenu)
                    }
                }, {
                    text: 'Rename',
                    iconCls: 'x-fa fa-pencil',
                    //tooltip: 'Change the text for this group',
                    scope: this,
                    hidden: !(record.parentNode.id == 'root' && record.id !== this.defaultGroupId),
                    handler: function () {
                        this.editGroup(rowIndex)
                    }
                }, {
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash-o',
                    //tooltip: 'Delete this group',
                    scope: this,
                    hidden: !(record.parentNode.id == 'root' && record.id !== this.defaultGroupId),
                    handler: function () {
                        this.deleteGroup(record, rowIndex)
                    }
                }, {
                    text: 'Remove',
                    iconCls: 'x-fa fa-trash-o',
                    //tooltip: 'Remove from this group',
                    scope: this,
                    hidden: !(record.getDepth() !== 1 && record.parentNode.id !== this.defaultGroupId),
                    handler: function () {
                        this.removeGroupMember(record, rowIndex)
                    }
                }]
        });

        contextMenu.showBy(event.target.offsetParent, 'tr-br');
    },


    addGlobalMember: function (record, contextMenu) {

        //TODO Check authorisation

        this.selectedGroupRecord = record;

        var userSelection = new AbsMan.view.util.PickUser({
            allowMultiple: true,
            opener: this.getView(),
            openerEvent: "selectuser",
            title: "Please select one or more users"
        });

        userSelection.show();
        contextMenu.destroy();

    },


    addMemberToGroup: function (groupId, members, contextMenu, approver) {

        Ext.Ajax.request({
            scope: this,
            url: 'staff/group/member/' + groupId,
            method: 'PUT',
            params: {
                members: Ext.JSON.encode(members),
                approver: Ext.JSON.encode(approver)
            },
            success: function (responseData) {

                var response = Ext.JSON.decode(responseData.responseText);

                if (response.success) {

                    var members = response.data.members,
                        targetGroup = this.groupTreePanel.getRootNode().findChild("id", groupId);

                    targetGroup.removeAll();

                    targetGroup.appendChild(members);
                    targetGroup.leaf = false;
                    targetGroup.collapse();
                    targetGroup.expand();
                    this.groupTreeStore.commitChanges();
                    this.reloadGroupCalendar(groupId);


                    AbsMan.util.mess(response.mess || "Members added to group!");

                } else {

                    AbsMan.util.mess(response.mess || "Error during members add operation.", AbsMan.util.ERROR);
                }

            },
            failure: function (response) {

                AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
            }
        });

        if (contextMenu) contextMenu.destroy();

    },


    deleteGroup: function (record, rowIndex) {

        record.removeAll(false);
        record.erase({

            scope: this,

            success: function (record, operation) {


                var response = Ext.JSON.decode(operation.getResponse().responseText);

                if (response.success) {

                    var schedulePanel = Ext.ComponentQuery.query('#scheduleTab-' + record.id)[0];

                    if (schedulePanel) this.schedulePanels.remove(schedulePanel);

                    this.groupTreeStore.commitChanges();

                    AbsMan.util.mess(response.mess || "Group removed successfully.");

                } else {

                    AbsMan.util.mess(response.mess || "Error during group remove operation.", AbsMan.util.ERROR);
                }
            },

            failure: function (record, operation) {

                var response = operation.getError();

                AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
            }
        });
    },


    removeGroupMember: function (record, rowIndex) {


        var parentId = record.parentNode.id;

        Ext.Ajax.request({
            scope: this,
            url: 'staff/group/member/' + record.get("userId") + '/' + parentId,
            method: 'DELETE',

            success: function (responseData) {

                var response = Ext.JSON.decode(responseData.responseText);

                if (response.success) {

                    record.parentNode.removeChild(record, false);

                    this.groupTreeStore.commitChanges();

                    this.reloadGroupCalendar(parentId);

                    AbsMan.util.mess(response.mess || "Member removed to group!");

                } else {

                    AbsMan.util.mess(response.mess || "Error during members remove operation.", AbsMan.util.ERROR);
                }

            },
            failure: function (response) {

                AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
            }
        });

    },


    onClick: function (view, record, index) {

        if (record.parentNode.id == 'root' && record.id !== "newGroupId") {


            var newpanel = Ext.ComponentQuery.query('#scheduleTab-' + record.id)[0];

            if (!newpanel) {
                newpanel = this.schedulePanels.add({
                    itemId: 'scheduleTab-' + record.id,
                    xtype: "gcalendar",
                    title: record.get("text"),
                    iconCls: 'x-fa fa-calendar',
                    closable: true
                });
            }

            this.schedulePanels.setActiveTab(newpanel);

            if (record.id !== "defaultGroupId") this.loadGroupCalendar(newpanel, record.id)

        }
    },


    onDrop: function (node, data, overModel, dropPosition, eOpts) {

        var draggedRecord = data.records[0],
            parentNode = draggedRecord.parentNode,
            groupMemberIds = [];

        parentNode.eachChild(function (member) {
            groupMemberIds.push(member.id)
        }, this);


        Ext.Ajax.request({
            scope: this,
            url: this.groupTreeStore.getProxy().baseUrl + '/member/order/' + parentNode.id,
            method: 'POST',
            params: {
                ids: Ext.JSON.encode(groupMemberIds)
            },
            success: function (response) {

                var responseData = Ext.JSON.decode(response.responseText);

                if (responseData.success) {

                    this.reloadGroupCalendar(parentNode.id);
                    AbsMan.util.mess(responseData.mess || "Group ordered", AbsMan.util.INFO);

                } else {

                    AbsMan.util.mess(responseData.mess || responseData.code || responseData.reason || "Error during order operation", AbsMan.util.ERROR);

                }
            },
            failure: function (response) {

                AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
            }
        });

    },


    onBeforeDrop: function (node, data, overModel, dropPosition, dropHandlers) {

        dropHandlers.wait = false;

        return overModel.parentNode.id === data.records[0].get("parentId") && overModel.parentNode.id !== "root"

    },


    reloadGroupCalendar: function (groupId) {

        var schedulePanel = Ext.ComponentQuery.query('#scheduleTab-' + groupId)[0];

        if (schedulePanel) {

            this.loadGroupCalendar(schedulePanel, groupId);
        }
    },


    loadGroupCalendar: function (panel, groupId) {

        panel.getEl().mask('Loading...');
        this.groupCalendarStore.getProxy().url = this.groupCalendarStore.getProxy().baseUrl + groupId;
        this.groupCalendarStore.load({
            scope: this,
            callback: function (records, operation, success) {

                panel.getEl().mask('Loading...');

                var response = Ext.JSON.decode(operation.getResponse().responseText);

                if (!success) {

                    AbsMan.util.mess(response.mess || "Error during group calendar load operation.", AbsMan.util.ERROR);

                } else {

                    panel.load(this.groupCalendarStore);
                }
            }
        });
    },


    onScheduleTabChange: function (tabPanel, newTab, oldTab) {

        if (this.formTimestamp) {


            var newTabItemId = newTab.itemId.split('-'),
                groupId = newTabItemId.pop();

            Ext.Ajax.request({
                scope: this,
                url: this.groupStore.getProxy().baseUrl + 'checkform/' + userId,
                params: {
                    formTimestamp: this.formTimestamp,
                    ids: Ext.JSON.encode([groupId])
                },
                success: function (responseData) {

                    var response = Ext.JSON.decode(responseData.responseText);

                    if (response.success) {

                        if (response.outdated === true) {

                            AbsMan.util.mess("Reloading, the form values are out of date.", AbsMan.util.INFO);

                            this.onReloadForm();
                        }

                    } else {

                        AbsMan.util.mess(response.mess || "Error during check for need reload operation", AbsMan.util.ERROR);
                    }
                },
                failure: function (response) {

                    AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
                }
            });
        }

    },


    saveUserPreference: function(preference,value) {

        this.getView().up("#mainPanelId").getController().saveUserPreference("myStaff."+preference,value);
    }

});