﻿<%@ Page Title="Equity Report by Currency" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" Inherits="BBLAM.Web.UI.PageBase" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="<% =ResolveUrl("styles/equity.css") %>" rel="stylesheet" type="text/css" />
    <link href="<% =ResolveUrl("styles/equity-detail.css") %>" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-xs-12">
            <div class="heading-title">
                <h4>
                    <i class="fa fa-pie-chart"></i> Equity Report by Currency
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        
    <div class="row">
        <div class="col-xs-12">
            <div id="chartAC" class="chart"></div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <div id="chartSUB" class="chart"></div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div id="gridEQ" class="grid-xs" data-fund="Equity Funds" data-index="0"></div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div id="gridFI" class="grid-xs" data-fund="Fixed Income Funds" data-index="1"></div>
        </div>
    </div>
  
    <div class="row">
        <div class="col-xs-12">
            <div id="gridFIF" class="grid-xs" data-fund="Unit Trust Funds" data-index="2"></div>
        </div>
    </div>
  
    <script type="text/x-kendo-template" id="template2">
        <div class="row">
            <div class="col-xs-7 col-sm-9 btn-toolbar">
            </div>
            <div class="col-xs-3 col-sm-2 pull-right"><button class="k-grid-excel-all btn btn-excel pull-right"><i class="fa fa-download" aria-hidden="true"></i></button></div>
        </div>
    </script>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
    <script src="<% =ResolveUrl("scripts/equity-detail.js")%>"></script>
</asp:Content>
