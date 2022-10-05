
Ext.define('AbsMan.view.ux.CategoryDistribution', {

    extend: 'Ext.Component',

    alias: 'widget.catdistribution',

    tpl: new Ext.XTemplate([

        '<div class="catDistribution">',
        '<div class="date-col"><tpl for=".">',
        '<div>{1}</div>',
        '</tpl></div>',
        '<div class="cat-col" id="ddGroup"><tpl for=".">',
        '<div class="cat"><span class="fa fa-navicon dragger">&nbsp;</span>{2}</div>',
        '</tpl></div>',
        '</div>'


        /*

        '<table class="hcalendar"><tbody><tr>',
        '<tpl for=".">',
        '<td colspan="15" class="hcalendar-month left">{1}</td>',
        '<td colspan="{[values[2]-15]}" class="hcalendar-month right">{1}</td>',
        '</tpl>',
        '</tr><tr>',
        '<tpl for=".">',
        '<tpl for ="values[3]">',
        '<td class="hcalendar-day<tpl if="values[3]"> {3}</tpl>" id="d-{2}" >',
        '<div title="{4}">',
        '<div>{1}</div>',
        '<div>{0}</div>',
        '</div>',
        '</td>',
        '</tpl>',
        '</tpl>',
        '</tr></tbody></table>'

        */

    ]),


    load: function (confirmStore) {

        var days= [];

        Ext.Array.each(confirmStore.data.items, function(item) {
            console.log(item);
            days.push([item.get("categoryId"),Ext.Date.format(item.get("date"),"d M Y"),item.get("name")])
        }, this);

        console.log(days);

        /*
        var today = new Date(),
            months = [],
            firstDate = Ext.Date.getFirstDateOfMonth(today);

        for (var mIndex = -parseInt(hcal.maxMonths / 2), idx = 0; mIndex < hcal.maxMonths; mIndex++) {

            var month = Ext.Date.add(firstDate, Ext.Date.MONTH, mIndex),
                daysInMonth = Ext.Date.getDaysInMonth(month);

            for (var dIndex = 0, days = []; dIndex < daysInMonth; dIndex++) {

                var day = Ext.Date.add(Ext.Date.getFirstDateOfMonth(month), Ext.Date.DAY, dIndex),
                    dayLetter = Ext.Date.format(day, 'D').substring(0, 1),
                    dayId = Ext.Date.format(day, 'Y-m-d'),
                    dayClass = [],
                    dayTitle = Ext.Date.format(day, 'D j F Y');

                if (dayId == Ext.Date.format(today, 'Y-m-d')) {
                    dayClass.push("hcalendar-today");
                }

                days[dIndex] = [dIndex + 1, dayLetter, dayId, dayClass.join(" "), dayTitle]
            }

            months[idx++] = [month, Ext.Date.format(month, 'F Y'), daysInMonth, days];
        }

    */
        this.update(days);

        //var overrides = {};

        var daysElements = Ext.get('ddGroup').select('div');

        console.log(daysElements);



        var overrides = {
            // Called the instance the element is dragged.
            b4StartDrag: function () {
                // Cache the drag element
                if (!this.el) {
                    this.el = Ext.get(this.getEl());
                }

                //Cache the original XY Coordinates of the element, we'll use this later.
                this.originalXY = this.el.getXY();
            },
            // Called when element is dropped in a spot without a dropzone, or in a dropzone without matching a ddgroup.
            onInvalidDrop: function () {

                console.log('inv');
                // Set a flag to invoke the animated repair
                this.invalidDrop = true;
            },
            // Called when the drag operation completes
            endDrag: function () {
                // Invoke the animation if the invalidDrop flag is set to true
                if (this.invalidDrop === true) {
                    // Remove the drop invitation
                    this.el.removeCls('dropOK');

                    // Create the animation configuration object
                    var animCfgObj = {
                        easing: 'elasticOut',
                        duration: 1,
                        scope: this,
                        callback: function () {
                            // Remove the position attribute
                            this.el.dom.style.position = '';
                        }
                    };

                    // Apply the repair animation
                    this.el.setXY(this.originalXY[0], this.originalXY[1], animCfgObj);
                    delete this.invalidDrop;
                }
            },

            onDragDrop : function(evtObj, targetElId) {

                console.log("dd");
                // Wrap the drop target element with Ext.Element
                var dropEl = Ext.get(targetElId);

                // Perform the node move only if the drag element's
                // parent is not the same as the drop target
                if (this.el.dom.parentNode.id != targetElId) {

                    // Move the element
                    dropEl.appendChild(this.el);

                    // Remove the drag invitation
                    this.onDragOut(evtObj, targetElId);

                    // Clear the styles
                    this.el.dom.style.position ='';
                    this.el.dom.style.top = '';
                    this.el.dom.style.left = '';
                }
                else {
                    // This was an invalid drop, initiate a repair
                    this.onInvalidDrop();
                }
            },

            onDragEnter : function(evtObj, targetElId) {

                // Colorize the drag target if the drag node's parent is not the same as the
                if (targetElId != this.el.dom.parentNode.id) {
                    this.el.addCls('dropOK');
                }
                else {
                    // Remove the invitation
                    this.onDragOut();
                }
            },
            // Only called when element is dragged out of a dropzone with the same ddgroup
            onDragOut : function(evtObj, targetElId) {
                this.el.removeCls('dropOK');
            }
        };

        var daysDDTarget = Ext.create('Ext.dd.DDTarget', 'ddGroup','daysDDGroup');

        Ext.each(daysElements.elements, function(el) {
            var dd = Ext.create('Ext.dd.DD', el, 'daysDDGroup', {
                isTarget  : false
            });
            //Apply the overrides object to the newly created instance of DD
            Ext.apply(dd, overrides);
        });



        return true;

    }

});

