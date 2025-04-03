sap.ui.define([
    "sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
    "use strict";

    return {
        /**
         * Formatea el precio como moneda, con separadores y dos decimales.
         */
        formatCurrency: function (value) {
            if (!value) return "";

            const oCurrencyFormat = NumberFormat.getFloatInstance({
                decimals: 2,
                groupingEnabled: true,
                groupingSeparator: ".",
                decimalSeparator: ","  
            });


            return "$" + oCurrencyFormat.format(value);
        },

        /**
         * Devuelve el estado del stock (verde o rojo) según disponibilidad.
         */
        getStateStock: function (value) {
            if (value === null || value === undefined) {
                return "None";
            }
            return value > 0 ? "Success" : "Error";
        }
    };
});
