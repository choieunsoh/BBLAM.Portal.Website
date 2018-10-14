<%@ Page Title="Liquidity Detail Report" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" Inherits="BBLAM.Web.UI.PageBase" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="<% =ResolveUrl("styles/liquidity-sector.css") %>" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-xs-12">
            <div class="heading-title">
                <h4>
                    <i class="fa fa-money-bill-alt"></i> Liquidity Report by Type
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
        <div class="grid col-md-12">
            <div id="gridEQ" class="grid-xs" data-fund="Equity Funds" data-index="0"></div>
        </div>
    </div>
  
    <div class="row">
        <div class="grid col-md-12">
            <div id="gridMX" class="grid-xs" data-fund="Mixed Funds" data-index="1"></div>
        </div>
    </div>

    <div class="row">
        <div class="grid col-md-12">
            <div id="gridFI" class="grid-xs" data-fund="Fixed Income Funds" data-index="2"></div>
        </div>
    </div>

    <div class="row">
        <div class="grid col-md-12">
            <div id="gridFIF" class="grid-xs" data-fund="FIF Funds" data-index="3"></div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
    <script src="<% =ResolveUrl("scripts/liquidity-sector.js")%>"></script>
</asp:Content>
