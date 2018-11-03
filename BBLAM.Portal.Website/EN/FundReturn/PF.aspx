<%@ Page Title="Import PF Return Excel File" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" Inherits="BBLAM.Web.UI.PageBase" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="<% =ResolveUrl("~/plugins/FormValidation/v0.8.1/css/formValidation.min.css") %>" rel="stylesheet" />
    <link href="<% =ResolveUrl("styles/pf.css") %>" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-xs-12">
            <div class="heading-title">
                <h4>
                    <i class="fa fa-upload"></i> Import PF Return Excel File
                </h4>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12 form-horizontal">
                <div class="form-group search-group">
                    <label class="col-xs-4 control-label">From :</label>
				    <div class="col-xs-8">		
                        <div class="input-group date" id="txtAsof">
                            <input type="text" class="form-control lg-date" data-control="datetime" placeholder="Enter as of" />
                            <span class="input-group-addon"><span class="fa fa-calendar"></span></span>
                        </div>
				    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12 form-horizontal">
                <div class="form-group search-group">
                    <label class="col-xs-4 control-label">To :</label>
				    <div class="col-xs-8">		
                        <div class="input-group date" id="txtAsofTo">
                            <input type="text" class="form-control lg-date" data-control="datetime" placeholder="Enter as of" />
                            <span class="input-group-addon"><span class="fa fa-calendar"></span></span>
                        </div>
				    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row">
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
                                    <input type="text" class="form-control lg-date" data-field="asof" data-control="datetime" placeholder="Enter as of" disabled />
                                    <span class="input-group-addon"><span class="fa fa-calendar"></span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Portfolio Code :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control bold upper" data-field="port_code" maxlength="20" placeholder="Enter port code" disabled />
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Total NAV :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control" data-field="total_nav" maxlength="20" placeholder="Enter total nav"   />
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">Daily Return :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control return" data-field="daily_return" maxlength="20" placeholder="Enter daily return"   />
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-xs-4 control-label">YTD Return :</label>
				            <div class="col-xs-8">		
					            <input type="text" class="form-control return" data-field="ytd_return" maxlength="20" placeholder="Enter ytd return"   />
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
                            <label class="col-xs-4 control-label">PF Return XLSX File :</label>
				            <div class="col-xs-8">		
                                <input name="files" id="files" type="file" />
                                <small class="text-muted col-xs-12">Allow .XLSX file to be uploaded (maximum size: 1MB).</small>
				            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <div class="col-xs-12">
<pre class="code">
    <code>.XLSX File Format:</code>
    <code></code>
    <code>"รหัสกองทุน","ชื่อกองทุน","สินทรัพย์สุทธิ	","อัตราผลตอบแทนต่อวัน (%)","อัตราผลตอบแทนสะสม (%)"</code>
    <code>"XXX","XXXXX","0.00","0.000000000000","0.000000000000"</code>
    <code></code>
    <code>Ex.</code>
    <code>"210004","นางอรนุช ตันติวรวงศ์","35532281.8","0.0168473231883511","0.485467085862814"</code>
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

    <script src="<% =ResolveUrl("scripts/pf.js")%>"></script>
</asp:Content>
