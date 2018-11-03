<%@ Page Title="Index Daily Return" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" Inherits="BBLAM.Web.UI.PageBase" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="<% =ResolveUrl("~/plugins/FormValidation/v0.8.1/css/formValidation.min.css") %>" rel="stylesheet" />
    <link href="<% =ResolveUrl("styles/default.css") %>" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-xs-12">
            <div class="heading-title">
                <h4>
                    <i class="fa fa-line-chart"></i> Index Daily Return
                </h4>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12">
                <div class="form-horizontal">
                    <div class="form-group search-group">
                        <label class="col-xs-4 control-label">Start Date :</label>
				        <div class="col-xs-8">		
                            <div class="input-group date" id="txtAsof">
                                <input type="text" class="form-control lg-date" data-field="asof" data-control="datetime" placeholder="Enter start date" />
                                <span class="input-group-addon"><span class="fa fa-calendar"></span></span>
                            </div>
				        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12">
                <div class="form-horizontal">
                    <div class="form-group search-group">
                        <label class="col-xs-4 control-label">End Date :</label>
				        <div class="col-xs-8">		
                            <div class="input-group date" id="txtAsofTo">
                                <input type="text" class="form-control lg-date" data-field="asof" data-control="datetime" placeholder="Enter end date" />
                                <span class="input-group-addon"><span class="fa fa-calendar"></span></span>
                            </div>
				        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12">
                <div class="form-horizontal">
                    <div class="form-group search-group">
                        <label class="col-xs-4 control-label">Index Code :</label>
				        <div class="col-xs-8">		
                            <select class="selectpicker show-tick" id="ddlIndexCode" title="All Indices" data-width="100%" data-live-search="true"></select>
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
                            <button id="btnView" class="btn default-submit btn-success"><i class="fa fa-search"></i> View</button>
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
                            <label class="col-xs-4 control-label">As of :</label>
                            <div class="col-xs-8">
                                <div class="input-group date dialog-asof">
                                    <input type="text" class="form-control lg-date" data-field="asof" data-control="datetime" placeholder="Enter as of" />
                                    <span class="input-group-addon"><span class="fa fa-calendar"></span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Index :</label>
				            <div class="col-xs-8">		
					            <select class="selectpicker2 show-tick" data-field="index_code" data-live-search="true" title="Please select index" data-width="100%"></select>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Closed Price :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control dialog-num" data-field="closed_price" maxlength="20" placeholder="Enter closed price"   />
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Return :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control dialog-num" data-field="index_return" maxlength="20" placeholder="Enter return"   />
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
                            <label class="col-xs-4 control-label">Index Return CSV File :</label>
				            <div class="col-xs-8">		
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
    <code>"ASOF","INDEX_CODE","CLOSED_PRICE","INDEX_RETURN"</code>
    <code>"DD/MM/YYYY","XXX","12.34","0.123456"</code>
    <code></code>
    <code>Ex.</code>
    <code>"01/01/2018","SET","1800","0.55"</code>
    <code>"01/01/2018","TBILL","2.22","0.000012"</code>
    <code>...</code>
    <code></code>
</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div id="calcDialog" class="hide">
        <div class="row">
            <form id="calcForm">
                <div class="col-xs-12">
                    <div class="form-horizontal">
         
                        <div class="form-group search-group">
                            <label class="col-xs-4 control-label">Benchmark :</label>
				            <div class="col-xs-8">		
					            <select class="selectpicker2 show-tick" data-field="bm_code" data-live-search="true" title="All benchmarks" data-width="100%"></select>
				            </div>
				        </div>

                        <div class="form-group search-group">
                            <label class="col-xs-4 control-label">Start Date :</label>
				            <div class="col-xs-8">		
                                <div class="input-group date" id="txtCalcStart">
                                    <input type="text" class="form-control lg-date" data-field="asof" data-control="datetime" placeholder="Enter start date" />
                                    <span class="input-group-addon"><span class="fa fa-calendar"></span></span>
                                </div>
				            </div>
                        </div>

                        <div class="form-group search-group">
                            <label class="col-xs-4 control-label">End Date :</label>
				            <div class="col-xs-8">		
                                <div class="input-group date" id="txtCalcEnd">
                                    <input type="text" class="form-control lg-date" data-field="asof" data-control="datetime" placeholder="Enter end date" />
                                    <span class="input-group-addon"><span class="fa fa-calendar"></span></span>
                                </div>
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
                <button class="btn btn-danger btn-calc"><i class="fa fa-refresh"></i> Calc BM Return (after upload index return)</button>
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

    <script src="<% =ResolveUrl("scripts/index-return.js")%>"></script>
</asp:Content>
