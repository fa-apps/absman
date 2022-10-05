
Ext.define('AbsMan.view.ux.HCalendarTooltip', {

    extend: 'Ext.Component',

    alias: 'widget.hcalendartooltip',

    title: '',
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
    }],


    tpl: new Ext.XTemplate([
        '<table class="hcalendar"><tbody><tr>',
        '<tpl for=".">',
            '<td colspan="15" class="hcalendar-month left">{1}</td>',
            '<td colspan="{[values[2]-15]}" class="hcalendar-month right">{1}</td>',
        '</tpl>',
        '</tr><tr>',
        '<tpl for=".">',
            '<tpl for ="values[3]">',
                '<td class="hcalendar-day<tpl if="values[3]"> {3}</tpl>" id="d-{2}"<tpl if="values[5]">{5}</tpl>>',
                    '<div title="{4}">',
                        '<div>{1}</div>',
                        '<div>{0}</div>',
                    '</div>',
                '</td>',
            '</tpl>',
        '</tpl>',
        '</tr></tbody></table>'
    ]),


    load: function (hCalTooltip) {



        console.log(hCalTooltip);


        //this.update(tooltip);


        return true;

    }

});

