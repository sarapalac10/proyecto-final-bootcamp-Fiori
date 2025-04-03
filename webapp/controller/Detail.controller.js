sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "com/bootcamp/sapui5/freestyle/utils/HomeHelper",
    "sap/m/MessageBox",
    "com/bootcamp/sapui5/freestyle/model/formatter"
], (Controller, JSONModel, Fragment, HomeHelper, MessageBox, formatter) => {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.freestyle.controller.Detail", {
        formatter: formatter,

        onInit() {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

            this._i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        _onObjectMatched: function (oEvent) {
            const sSupplierID = oEvent.getParameter("arguments").SupplierID;

            this.getView().bindElement({
                path: "/Suppliers(" + sSupplierID + ")",
                parameters: {
                    expand: "Products,Products/Category"
                }
            });

            const oModel = this.getView().getModel();
            const sKey = `SavedProducts_${sSupplierID}`;
            const sSaved = localStorage.getItem(sKey);

            if (sSaved) {
                const aSavedProducts = JSON.parse(sSaved);
                HomeHelper.setSimulatedProductsModel(this.getOwnerComponent(), aSavedProducts);
            } else {
                oModel.read(`/Suppliers(${sSupplierID})/Products`, {
                    success: (oData) => {
                        HomeHelper.setSimulatedProductsModel(this.getOwnerComponent(), oData.results);
                    },
                    error: () => {
                        HomeHelper.setSimulatedProductsModel(this.getOwnerComponent(), []);
                    }
                });
            }
        },

        onAddProduct: function () {
            HomeHelper.setEmptyProductModel(this.getOwnerComponent());

            const sTitle = this._i18n.getText("dialogProductTitleNuevo");
            this.getView().setModel(new JSONModel({ isCreating: true, dialogTitle: sTitle }), "viewFlags");

            this._openProductDialog();
        },

        onProductPress: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oContext = oItem.getBindingContext("SimulatedProductsModel");
            const oProduct = oContext.getObject();

            const oProductModel = HomeHelper.createProductModelFromExisting(oProduct);
            this.getOwnerComponent().setModel(oProductModel, "ProductModel");

            const sTitle = this._i18n.getText("dialogProductTitleEditar");
            this.getView().setModel(new JSONModel({ isCreating: false, dialogTitle: sTitle }), "viewFlags");

            this._openProductDialog();
        },

        _openProductDialog: async function () {
            const oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    name: "com.bootcamp.sapui5.freestyle.view.fragments.Product_Form",
                    controller: this
                }).then(oDialog => {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            const oDialogInstance = await this._pDialog;
            this._validateProductForm();
            oDialogInstance.open();
        },

        onCreateProduct: async function () {
            const oProductModel = this.getView().getModel("ProductModel");
            const oProduct = oProductModel.getData();
            let bIsValid = true;

            const aFieldsToValidate = [
                { path: "/ProductName", statePath: "/ProductNameState" },
                { path: "/UnitPrice", statePath: "/UnitPriceState" },
                { path: "/UnitsInStock", statePath: "/UnitsInStockState" },
                { path: "/CategoryID", statePath: "/CategoryIDState" }
            ];

            aFieldsToValidate.forEach(field => {
                const value = oProductModel.getProperty(field.path);
                oProductModel.setProperty(field.statePath, value ? "None" : "Error");
                if (!value) bIsValid = false;
            });

            if (!bIsValid) {
                MessageBox.error(this._i18n.getText("msgFillAllFields"));
                return;
            }

            const oModel = this.getView().getModel("SimulatedProductsModel");
            const aProducts = oModel.getData();
            const isCreating = this.getView().getModel("viewFlags").getProperty("/isCreating");

            if (isCreating) {
                const iNextID = aProducts.length > 0
                    ? Math.max(...aProducts.map(p => p.ProductID || 0)) + 1
                    : 1;

                oProduct.ProductID = iNextID;
                aProducts.push(oProduct);

                sap.m.MessageToast.show(this._i18n.getText("msgProductSaved"));
            }

            oModel.refresh();

            // Guardar local
            const sSupplierID = this.getView().getBindingContext()?.getProperty("SupplierID");
            if (sSupplierID) {
                localStorage.setItem(`SavedProducts_${sSupplierID}`, JSON.stringify(aProducts));
            }

            const oDialog = await this._pDialog;
            oDialog.close();
        },

        onDeleteProduct: function (oEvent) {
            const iIndex = this._getProductIndexFromEvent(oEvent);
            if (iIndex === null) return;

            const oModel = this.getView().getModel("SimulatedProductsModel");
            const aData = oModel.getData();

            MessageBox.confirm(this._i18n.getText("msgConfirmDelete"), {
                title: this._i18n.getText("msgTitleDelete"),
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        aData.splice(iIndex, 1);
                        oModel.refresh();
                        sap.m.MessageToast.show(this._i18n.getText("msgDeleted"));
                    }
                }
            });
        },

        _getProductIndexFromEvent: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("SimulatedProductsModel");
            if (!oContext) return null;
            const sPath = oContext.getPath();
            return parseInt(sPath.replace("/", ""), 10);
        },

        onCloseDialog: async function () {
            HomeHelper.setEmptyProductModel(this.getOwnerComponent());
            const oDialog = await this._pDialog;
            oDialog.close();
        },

        onNavBack: function () {
            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteHome", {}, true);
            }
        },

        _validateProductForm: function () {
            const oProductModel = this.getView().getModel("ProductModel");
            const oData = oProductModel.getData();

            const bIsValid =
                oData.ProductName?.trim() &&
                oData.UnitPrice !== "" &&
                oData.UnitsInStock !== "" &&
                oData.CategoryID !== "";

            const oSaveButton = this.getView().byId("btn_SaveProduct");
            if (oSaveButton) {
                oSaveButton.setEnabled(!!bIsValid);
            }
        },

        onInputChange: function () {
            this._validateProductForm();
        }
    });
});
