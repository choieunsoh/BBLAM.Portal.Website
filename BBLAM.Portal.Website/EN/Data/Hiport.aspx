<%@ Page Title="Import HIPORT Data Files" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" Inherits="BBLAM.Web.UI.PageBase" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="<% =ResolveUrl("~/plugins/FormValidation/v0.8.1/css/formValidation.min.css") %>" rel="stylesheet" />
    <link href="<% =ResolveUrl("styles/hiport.css") %>" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-xs-12">
            <div class="heading-title">
                <h4>
                    <i class="fa fa-cogs"></i> Import HIPORT files and generate reports
                </h4>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12">
                <div class="form-horizontal">
                    <div class="form-group search-group">
                        <label class="col-xs-4 control-label">Report Date :</label>
				        <div class="col-xs-8">		
                            <div class="input-group date" id="txtAsof">
                                <input type="text" class="form-control lg-date" data-field="asof" data-control="datetime" placeholder="Enter report date" />
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
                        <label class="col-xs-4 control-label">FMVP02.CSV File :</label>
				        <div class="col-xs-8">		
                            <input name="mf0_file" id="mf0_file" type="file" />
				        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12">
                <div class="form-horizontal">
                    <div class="form-group search-group">
                        <label class="col-xs-4 control-label">FMVP02N.CSV File :</label>
				        <div class="col-xs-8">		
                            <input name="mf1_file" id="mf1_file" type="file" />
				        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12">
                <div class="form-horizontal">
                    <div class="form-group search-group">
                        <label class="col-xs-4 control-label">FMVP02C.CSV File :</label>
				        <div class="col-xs-8">		
                            <input name="mf2_file" id="mf2_file" type="file" />
                        </div>
				    </div>
                </div>
            </div>
        </div>

        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12">
                <div class="form-horizontal">
                    <div class="form-group search-group">
                        <label class="col-xs-4 control-label">PORT_DL.TXT File :</label>
				        <div class="col-xs-8">		
                            <input name="pvd_file" id="pvd_file" type="file" />
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
                            <button id="btnUploadAll" class="btn btn-warning"><i class="fa fa-upload"></i> Upload All</button>
                            <button id="btnReGenerateAll" class="btn btn-danger"><i class="fa fa-cog"></i> Re-generate All Reports</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-6 col-sm-12">
            <div id="gridFile" class="grid-xs"></div>
        </div>
        <div class="col-md-6 col-sm-12">
            <div id="gridReport" class="grid-xs"></div>
        </div>
    </div>

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

    <script src="<% =ResolveUrl("scripts/hiport.js")%>"></script>
</asp:Content>
