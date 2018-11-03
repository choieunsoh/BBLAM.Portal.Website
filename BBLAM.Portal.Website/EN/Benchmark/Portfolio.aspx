<%@ Page Title="Portfolio Benchmark Setting" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" Inherits="BBLAM.Web.UI.PageBase" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="<% =ResolveUrl("~/plugins/FormValidation/v0.8.1/css/formValidation.min.css") %>" rel="stylesheet" />
    <link href="<% =ResolveUrl("styles/default.css") %>" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-xs-12">
            <div class="heading-title">
                <h4>
                    <i class="fa fa-cogs"></i> Portfolio Benchmark Setting
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
                            <label class="col-xs-4 control-label">Portfolio :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control bold upper" data-field="port_code" maxlength="20" placeholder="Enter portfolio code" disabled />
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
                            <label class="col-xs-4 control-label">Policy :</label>
				            <div class="col-xs-8">		
					            <select class="selectpicker2 show-tick" data-field="policy_code" title="Please select policy" data-width="100%">
                                    <option value="EQ">EQ</option>
                                    <option value="FI">FI</option>
                                    <option value="FIF">FIF</option>
                                    <option value="MIXED">MIXED</option>
                                    <option value="RF">RF</option>
                                </select>
				            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">BM No. :</label>
				            <div class="col-xs-8">		
					            <select class="selectpicker2 show-tick" data-field="bm_order" title="Please select benchmark no." data-width="100%">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
				            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Benchmark :</label>
				            <div class="col-xs-8">		
					            <select class="selectpicker2 show-tick" data-field="bm_code" data-live-search="true" title="Please select benchmark" data-width="100%"></select>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Start Date :</label>
                            <div class="col-xs-8">
                                <div class="input-group date dialog-asof">
                                    <input type="text" class="form-control lg-date" data-field="start_date" data-control="datetime" placeholder="Enter start date" />
                                    <span class="input-group-addon"><span class="fa fa-calendar"></span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Remark :</label>
				            <div class="col-xs-8">		
					            <textarea class="form-control" data-field="remark" rows="5" maxlength="500" placeholder="Enter remark"></textarea>
				            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    
    <div id="calcDialog" class="hide">
        <div class="row">
            <form id="formCalc">
                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Start Date :</label>
                            <div class="col-xs-8">
                                <div class="input-group date dialog-asof">
                                    <input type="text" class="form-control lg-date" data-field="start_date" data-control="datetime" placeholder="Enter start date" />
                                    <span class="input-group-addon"><span class="fa fa-calendar"></span></span>
                                </div>
                                <small>Leave blank for re-generate starts from start date</small>
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
                            <label class="col-xs-4 control-label">Portfolio Benchmark CSV File :</label>
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
    <code>"PORT_CODE","FUND_TYPE","POLICY_CODE","BM_ORDER","BM_CODE","START_DATE","REMARK"</code>
    <code>"XXX","MF|PVD","EQ|FI|FIF|MIXED|RF","1|2|3","XXX","dd/MM/yyyy","XXXX"</code>
    <code></code>
    <code>Ex.</code>
    <code>"BTP","MF","EQ","1","MF-EQ-01","01/01/2018",""</code>
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

    <script src="<% =ResolveUrl("scripts/portfolio.js")%>"></script>
</asp:Content>
