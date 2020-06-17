var apexClientSideTimer = (function () {
    "use strict";
    var scriptVersion = "1.4";
    var util = {
        version: "1.3.",
        isDefinedAndNotNull: function (pInput) {
            if (typeof pInput !== "undefined" && pInput !== null) {
                return true;
            } else {
                return false;
            }
        },
        isAPEX: function () {
            if (typeof (apex) !== 'undefined') {
                return true;
            } else {
                return false;
            }
        },
        debug: {
            info: function (str) {
                if (util.isAPEX()) {
                    apex.debug.info(str);
                }
            },
            error: function (str) {
                if (util.isAPEX()) {
                    apex.debug.error(str);
                } else {
                    console.error(str);
                }
            }
        },
        getItemValue: function (itemName) {
            if (!itemName) {
                return "";
            }

            if (util.isAPEX()) {
                if (apex.item(itemName) && apex.item(itemName).node != false) {
                    return apex.item(itemName).getValue();
                } else {
                    console.error('Please choose a get item. Because the value could not be get from item(' + itemName + ')');
                }
            } else {
                console.error("Error while try to call apex.item" + e);
            }
        }
    };

    /***********************************************************************
     **
     ** Init
     **
     ***********************************************************************/
    return {
        initialize: function (pThis, pType, pStaticValue, pItemName, pItemID) {
            util.debug.info({
                "pThis": pThis,
                "pType": pType,
                "pStaticValue": pStaticValue,
                "pItemName": pItemName,
                "pItemID": pItemID
            });

            var myInterval;

            function setTimer(pDur) {
                if (util.isDefinedAndNotNull(pDur) && pDur != 0 && !isNaN(pDur)) {
                    myInterval = setInterval(function () {
                        util.debug.info("Static Timer fired");
                        $.each(pThis.affectedElements, function (i, el) {
                            $(el).trigger("timer_expired");
                        });
                    }, pDur);
                } else {
                    apex.debug.info("Timer not set because duration is not a number greater then 0");
                }
            }

            switch (pType) {
                case "STATIC":
                    util.debug.info("Type of Timer is static");
                    setTimer(pStaticValue);
                    break;
                case "ITEM":
                    util.debug.info("Type of Timer is item");
                    var dur = util.getItemValue(pItemName);
                    setTimer(dur);
                    $(pItemID).on("change", function () {
                        util.debug.info("Item for Timer has changed. Timer has restarted");
                        clearInterval(myInterval);
                        dur = util.getItemValue(pItemName);
                        setTimer(dur);
                    });
                    break;
                default:
                    util.debug.error("Type of Timer is not set to STATIC or ITEM: " + pType);
            }
        }
    }
})();
