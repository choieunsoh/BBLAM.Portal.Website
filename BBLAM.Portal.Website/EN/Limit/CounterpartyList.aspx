<%@ Page Title="Counterparty List" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" Inherits="BBLAM.Web.UI.PageBase" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="<% =ResolveUrl("~/plugins/FormValidation/v0.8.1/css/formValidation.min.css") %>" rel="stylesheet" />
    <link href="<% =ResolveUrl("styles/default.css") %>" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-xs-12">
            <div class="heading-title">
                <h4>
                    <i class="fa fa-users"></i> Counterparty List
                </h4>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12">
                <div class="form-horizontal">
                    <div class="form-group search-group">
                        <label class="col-xs-4 control-label">Period :</label>
				        <div class="col-xs-8">		
                            <select class="selectpicker show-tick" id="ddlPeriod" title="Please select period" data-width="100%">
                            </select>
				        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xs-12">
            <div class="col-lg-6 col-sm-12">
                <div class="form-horizontal">
                    <div class="form-group search-group">
                        <div class="col-xs-offset-4 col-xs-8">
                            <button id="btnSubmit" class="btn default-submit btn-success"><i class="fa fa-cog"></i> Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-sm-12">
            <div id="grid" class="grid-xs"></div>
        </div>
    </div>

    <div id="editDialog" class="hide">
        <div class="row">
            <form id="formMain">

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Period :</label>
				            <div class="col-xs-4">		
                                <select class="selectpicker2 show-tick" id="ddlQuarter" data-field="period_quarter" title="Please select quarter" data-width="100%">
                                    <option value="1">Q1</option>
                                    <option value="2">Q2</option>
                                    <option value="3">Q3</option>
                                    <option value="4">Q4</option>
                                </select>
				            </div>
				            <div class="col-xs-4">		
                                <select class="selectpicker2 show-tick" id="ddlYear" data-field="period_year" title="Please select year" data-width="100%">
                                </select>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Counter Party :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control bold upper" data-field="counter_party" maxlength="20" placeholder="Enter counter party" />
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Counterparty Type :</label>
				            <div class="col-xs-8">		
                                <select class="selectpicker2 show-tick" id="ddlCounterpartyType" data-field="counterparty_type" title="Please select counterparty type" data-width="100%">
                                    <option value="B">Bank</option>
                                    <option value="F">Finance</option>
                                </select>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Fund Type :</label>
				            <div class="col-xs-8">		
                                <select class="selectpicker2 show-tick" id="ddlFundType" data-field="fund_type" title="Please select fund type" data-width="100%">
                                    <option value="M">Mutual Funds</option>
                                    <option value="P">Provident/Private Funds</option>
                                </select>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Transaction Type :</label>
				            <div class="col-xs-8">		
                                <select class="selectpicker2 show-tick" id="ddlTransType" data-field="transaction_type" title="Please select transaction type" data-width="100%">
                                    <option value="D">Deposit</option>
                                    <option value="T">Trade</option>
                                    <option value="R">Repo</option>
                                </select>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Tier :</label>
				            <div class="col-xs-8">		
                                <select class="selectpicker2 show-tick" id="ddlTier" data-field="tier_level" title="Please select tier" data-width="100%">
                                    <option value="1">Tier 1</option>
                                    <option value="2">Tier 2</option>
                                    <option value="3">Tier 3</option>
                                </select>
				            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    </div>

    <div id="uploadDialog" class="hide">
        <div class="row">
            <form id="formUpload">
                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-3 control-label">Counterparty List CSV File :</label>
				            <div class="col-xs-9">		
                                <input name="files" id="files" type="file" />
                                <small class="text-muted col-xs-12">Allow .CSV file to be uploaded (maximum size: 1MB).</small>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <div class="col-xs-12">
<pre class="code">
    <code>.CSV File Format:</code>
    <code></code>
    <code>"COUNTER_PARTY","PERIOD","TIER","TRANSACTION_TYPE","COUNTERPARTY_TYPE","FUND_TYPE"</code>
    <code></code>
    <code>Ex.</code>
        <code>"BAY","201801","1","D","B","M"</code>
        <code>"SCB","201801","1","T","F","P"</code>
        <code>...</code>
    <code></code>
    <code>where</code>
        <code>PERIOD: YYYYQQ</code>
        <code>TRANSACTION_TYPE: D = Deposit, T = Trade, R = Repo</code>
        <code>COUNTERPARTY_TYPE: B = Bank, F = Finance</code>
        <code>FUND_TYPE: M = Mutual Fund, P = PVD/PF Fund</code>
    <code></code>
</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    
    <script type="text/x-kendo-template" id="templateAdd">
        <div class="row">
            <div class="col-xs-7 col-sm-9 btn-toolbar">
                <button class="btn btn-success btn-add"><i class="fa fa-plus"></i> Add</button>
                <button class="btn btn-warning btn-upload"><i class="fa fa-upload"></i> Upload</button>
            </div>
            <div class="col-xs-3 col-sm-2 pull-right"><button class="k-grid-excel btn btn-excel pull-right"><i class="fa fa-download" aria-hidden="true"></i></button></div>
        </div>
    </script>

    <script id="fileDownloadTemplate" type="text/x-kendo-template">
        <span class='k-progress'></span>
        <span class="k-file-extension-wrapper">
            <span class="k-file-extension">#=files[0].extension.substr(1)#</span>
            <span class="k-file-state"></span>
        </span>
        <span class="k-file-name-size-wrapper">
            # if (files[0].path && files[0].id) { #
            <span class="k-file-name" title="Download: #=name#" data-name="#=name#">Name: 
                <a href="#=files[0].path#" download target="_blank">#=name#</a>
            </span>
            # } else { #
            <span class="k-file-name" title="Name: #=name#" data-name="#=name#">Name: #=name#</span>
            # } #
            <span class="k-file-size">Size: #=kendo.toString(size/1024,'n2')# KB</span>
        </span>
        <strong class="k-upload-status">
            <button type="button" class="k-button k-upload-action" aria-label="Remove"><span class="k-icon k-i-close k-i-x" title="Remove"></span></button>
        </strong>
    </script>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
    <script src="<% =ResolveUrl("~/plugins/inputmask/jquery.inputmask.bundle-4.0.0.min.js")%>"></script>
    <!-- FormValidation plugin and the class supports validating Bootstrap form -->
    <script src="<% =ResolveUrl("~/plugins/formvalidation/v0.8.1/js/formValidation.min.js") %>"></script>
    <script src="<% =ResolveUrl("~/plugins/formvalidation/v0.8.1/js/framework/bootstrap.min.js") %>"></script>

    <script src="<% =ResolveUrl("scripts/counterparty-list.js")%>"></script>
</asp:Content>
