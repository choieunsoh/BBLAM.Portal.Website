<%@ Page Title="Monthly Fund Fact Sheet" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" Inherits="BBLAM.Web.UI.PageBase" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="<% =ResolveUrl("styles/default.css") %>" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-xs-12">
            <div class="heading-title">
                <h4>
                    <i class="fa fa-clipboard"></i> Monthly Fund Fact Sheet
                </h4>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12">
                <div class="form-horizontal">
                    <div class="form-group search-group">
                        <label class="col-xs-4 control-label">Select Month :</label>
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
                        <label class="col-xs-4 control-label">Fund Type :</label>
				        <div class="col-xs-8">		
                            <select class="selectpicker show-tick" id="ddlFundType" title="Please select fund type" data-width="100%">
                                <option value="MF">Mutual Funds</option>
                                <option value="PVD">Provident/Private Funds</option>
                            </select>
				        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xs-12 form-data-wrapper">
            <div class="col-lg-6 col-sm-12">
                <div class="form-horizontal">
                    <div class="form-group search-group">
                        <label class="col-xs-4 control-label">Fund Code :</label>
				        <div class="col-xs-8">		
                            <select class="selectpicker show-tick" id="ddlFund" title="Please select fund" data-width="100%" data-live-search="true"></select>
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
                            <button id="btnGenerate" class="btn default-submit btn-warning"><i class="fa fa-cog"></i> Generate</button>
                            <button id="btnGenerateAll" class="btn default-submit btn-danger"><i class="fa fa-cogs"></i> Generate All Funds</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div id="grid" class="grid-xs" data-index="0"></div>
        </div>
    </div>
 
    <div class="row">
        <div class="col-xs-12">
            <div id="grid_act" class="grid-xs" data-index="1"></div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div id="grid_pa" class="grid-xs" data-index="2"></div>
        </div>
    </div>
  
    <div class="row">
        <div class="col-xs-12">
            <div id="grid_year" class="grid-xs" data-index="3"></div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
    <script src="<% =ResolveUrl("scripts/default.js")%>"></script>
</asp:Content>
