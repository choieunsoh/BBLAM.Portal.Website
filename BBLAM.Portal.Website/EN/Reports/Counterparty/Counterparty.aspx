<%@ Page Title="Counterparty Report" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" Inherits="BBLAM.Web.UI.PageBase" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="<% =ResolveUrl("styles/counterparty.css") %>" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-xs-12">
            <div class="heading-title">
                <h4>
                    <i class="fa fa-users"></i> Counterparty Report
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
                        <label class="col-xs-4 control-label">FIXTERM Condition :</label>
				        <div class="col-xs-8">		
                            <select class="selectpicker show-tick" id="ddlFixTerm" title="Please select" data-width="100%">
                                <option value="0">Include FIXTERM</option>
                                <option value="1">Exclude FIXTERM</option>
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
                            <button id="btnView" class="btn default-submit btn-success"><i class="fa fa-search"></i> View</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="trade-container">
        <div class="row">
            <div class="col-xs-12">
                <div class="report-title">
                    <div>
                        <i class="fa fa-calendar-alt"></i> Trade Date: <span class="asof-title"></span>
                    </div>
                    <button id="btnTrade" class="btn btn-excel"><i class="fa fa-download" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>

        <div class="row" data-cp="N">
            <div class="grid col-md-6 col-sm-12" data-trans="F">
                <div id="gridTNF" class="grid-xs" data-tier="0"></div>
            </div>

            <div class="grid col-md-6 col-sm-12" data-trans="D">
                <div id="gridTND" class="grid-xs" data-tier="0"></div>
            </div>

            <div class="grid col-md-6 col-sm-12" data-trans="R">
                <div id="gridTNR" class="grid-xs" data-tier="0"></div>
            </div>
        </div>

        <div class="row" data-trans="F">
            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridTFB1" class="grid-xs" data-tier="1"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridTFF1" class="grid-xs" data-tier="1"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridTFB2" class="grid-xs" data-tier="2"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridTFF2" class="grid-xs" data-tier="2"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridTFB3" class="grid-xs" data-tier="3"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridTFF3" class="grid-xs" data-tier="3"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" data-trans="D">
            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridTDB1" class="grid-xs" data-tier="1"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridTDF1" class="grid-xs" data-tier="1"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridTDB2" class="grid-xs" data-tier="2"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridTDF2" class="grid-xs" data-tier="2"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridTDB3" class="grid-xs" data-tier="3"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridTDF3" class="grid-xs" data-tier="3"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" data-trans="R">
            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridTRB1" class="grid-xs" data-tier="1"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridTRF1" class="grid-xs" data-tier="1"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridTRB2" class="grid-xs" data-tier="2"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridTRF2" class="grid-xs" data-tier="2"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridTRB3" class="grid-xs" data-tier="3"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridTRF3" class="grid-xs" data-tier="3"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="settlement-container">
        <div class="row">
            <div class="col-xs-12">
                <div class="report-title">
                    <div>
                        <i class="fa fa-calendar-alt"></i> Settlement Date: <span class="asof-title"></span>
                    </div>
                    <button id="btnSettlement" class="btn btn-excel"><i class="fa fa-download" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
    
        <div class="row" data-cp="N">
            <div class="grid col-md-6 col-sm-12" data-trans="F">
                <div id="gridSNF" class="grid-xs" data-tier="0"></div>
            </div>

            <div class="grid col-md-6 col-sm-12" data-trans="D">
                <div id="gridSND" class="grid-xs" data-tier="0"></div>
            </div>

            <div class="grid col-md-6 col-sm-12" data-trans="R">
                <div id="gridSNR" class="grid-xs" data-tier="0"></div>
            </div>
        </div>

        <div class="row" data-trans="F">
            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridSFB1" class="grid-xs" data-tier="1"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridSFF1" class="grid-xs" data-tier="1"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridSFB2" class="grid-xs" data-tier="2"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridSFF2" class="grid-xs" data-tier="2"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridSFB3" class="grid-xs" data-tier="3"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridSFF3" class="grid-xs" data-tier="3"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" data-trans="D">
            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridSDB1" class="grid-xs" data-tier="1"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridSDF1" class="grid-xs" data-tier="1"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridSDB2" class="grid-xs" data-tier="2"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridSDF2" class="grid-xs" data-tier="2"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridSDB3" class="grid-xs" data-tier="3"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridSDF3" class="grid-xs" data-tier="3"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" data-trans="R">
            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridSRB1" class="grid-xs" data-tier="1"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridSRF1" class="grid-xs" data-tier="1"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridSRB2" class="grid-xs" data-tier="2"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridSRF2" class="grid-xs" data-tier="2"></div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="row">
                    <div class="grid col-md-6 col-sm-12" data-cp="B">
                        <div id="gridSRB3" class="grid-xs" data-tier="3"></div>
                    </div>
                    <div class="grid col-md-6 col-sm-12" data-cp="F">
                        <div id="gridSRF3" class="grid-xs" data-tier="3"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
    <script src="<% =ResolveUrl("scripts/counterparty.js")%>"></script>
</asp:Content>
