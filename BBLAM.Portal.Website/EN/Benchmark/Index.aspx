<%@ Page Title="Index Information" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" Inherits="BBLAM.Web.UI.PageBase" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="<% =ResolveUrl("~/plugins/FormValidation/v0.8.1/css/formValidation.min.css") %>" rel="stylesheet" />
    <link href="<% =ResolveUrl("styles/default.css") %>" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-xs-12">
            <div class="heading-title">
                <h4>
                    <i class="fa fa-line-chart"></i> Index Information
                </h4>
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
                            <label class="col-xs-4 control-label">Index Code :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control bold upper" data-field="index_code" maxlength="20" placeholder="Enter index code" disabled />
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Index Name :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control" data-field="index_name" maxlength="200" placeholder="Enter index name" />
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Sort Order :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control dialog-int" data-field="sort_order" maxlength="3" placeholder="Enter index sort order" value="0" />
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Fund Type :</label>
				            <div class="col-xs-8">		
                                <select class="selectpicker2 show-tick" data-field="fund_type" title="Please select fund type" data-width="100%">
                                    <option value="MF">Mutual Funds</option>
                                    <option value="PVD">Provident/Private Funds</option>
                                </select>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Index Type :</label>
				            <div class="col-xs-8">		
					            <select class="selectpicker2 show-tick" data-field="index_type" title="Please select index type" data-width="100%">
                                    <option value="Currency">Currency</option>
                                    <option value="Index">Index</option>
                                    <option value="Interest Rate">Interest Rate</option>
					            </select>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Index Sub Type :</label>
				            <div class="col-xs-8">		
					            <select class="selectpicker2 show-tick" data-field="index_sub_type" title="Please select index sub type" data-width="100%" disabled>
                                    <option value="Equity">Equity</option>
                                    <option value="Fixed Income">Fixed Income</option>
                                    <option value="Commodity">Commodity</option>
					            </select>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Origin :</label>
				            <div class="col-xs-8">		
                                <select class="selectpicker2 show-tick" id="ddlOrigin" data-field="origin" title="Please select origin" data-width="100%">
                                    <option value="Thai">Thai</option>
                                    <option value="Foreign">Foreign</option>
                                </select>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Currency :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control upper" data-field="currency" maxlength="3" placeholder="Enter currency" />
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Data Source :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control" data-field="data-source" maxlength="200" placeholder="Enter data source" />
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Remark :</label>
				            <div class="col-xs-8">		
					            <textarea class="form-control" data-field="remark" rows="5" placeholder="Enter currency"></textarea>
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
                            <label class="col-xs-4 control-label">Index CSV File :</label>
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
    <code>"INDEX_CODE","INDEX_NAME","SORT_ORDER","FUND_TYPE","INDEX_TYPE","INDEX_SUB_TYPE","ORIGIN","CURRENCY","DATA_SOURCE","REMARK"</code>
    <code>"XXX","XXX","0","MF|PVD|ALL","Currency|Index|Interest Rate","Currency|Equity|Fixed Income|Commodity|Interest Rate","Thai|Foreign","XXX","XXX","XXXXX"</code>
    <code></code>
    <code>Ex.</code>
    <code>"SET","SET Index","234","ALL","Index","Equity","Thai","THB","SET","-"</code>
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

    <script src="<% =ResolveUrl("scripts/index.js")%>"></script>
</asp:Content>
