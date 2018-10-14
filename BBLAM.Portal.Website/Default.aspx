<%@ Page Title="" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" Inherits="BBLAM.Web.UI.PageBase" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row default-menu">
        <div class="col-lg-4 col-md-6 col-sm-8 col-xs-12">
            <div class="list-group">
                <li class="list-group-item active"><i class="fa fa-fw fa-chart-pie"></i> Reports</li>
                <a href="#" target="_blank" class="list-group-item list-group-item-action disabled">VaR Report</a>
                <a href="#" target="_blank" class="list-group-item list-group-item-action disabled">Beta & Duration Report</a>
                <a href="<% =ResolveUrl("~/EN/Reports/Equity/Equity.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Equity Report</a>
                <a href="<% =ResolveUrl("~/EN/Reports/Equity/EquityPeriod.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Equity Report (Period)</a>
                <a href="<% =ResolveUrl("~/EN/Reports/Liquidity/Liquidity.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Liquidity Report</a>
                <a href="<% =ResolveUrl("~/EN/Reports/Liquidity/LiquidityPeriod.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Liquidity Report (Period)</a>
                <a href="<% =ResolveUrl("~/EN/Reports/Counterparty/Counterparty.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Counterparty Report</a>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-8 col-xs-12">
            <div class="list-group">
                <li class="list-group-item active"><i class="fa fa-fw fa-envelope"></i> Mail Alert</li>
                <a href="<% =ResolveUrl("~/EN/MailAlert/Default.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Mail Alert</a>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-8 col-xs-12">
            <div class="list-group">
                <li class="list-group-item active"><i class="fa fa-fw fa-cog"></i> Limit Settings</li>
                <a href="<% =ResolveUrl("~/EN/Limit/Equity.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Equity Limit</a>
                <a href="<% =ResolveUrl("~/EN/Limit/Liquidity.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Liquidity Limit</a>
                <a href="<% =ResolveUrl("~/EN/Limit/Counterparty.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Counterparty Line</a>
                <a href="<% =ResolveUrl("~/EN/Limit/CounterpartyList.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Counterparty List</a>
            </div>
        </div>
    </div>

    <div class="row default-menu">
        <div class="col-lg-4 col-md-6 col-sm-8 col-xs-12">
            <div class="list-group">
                <li class="list-group-item active"><i class="fa fa-fw fa-upload"></i> Upload Files</li>
                <a href="<% =ResolveUrl("~/EN/Data/Hiport.aspx") %>" target="_blank" class="list-group-item list-group-item-action">HIPORT Files</a>
                <a href="<% =ResolveUrl("~/EN/Data/Stock.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Stock Detail</a>
                <a href="<% =ResolveUrl("~/EN/Data/Delta.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Equity Delta</a>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-8 col-xs-12">
            <div class="list-group">
                <li class="list-group-item active"><i class="fa fa-fw fa-line-chart"></i> Portfolio Performance</li>
                <a href="<% =ResolveUrl("~/EN/Performance/Default.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Portfolio Performance Report</a>
                <a href="<% =ResolveUrl("~/EN/FactSheet/Default.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Monthly Fund Fact Sheet</a>
                <a href="<% =ResolveUrl("~/EN/FactSheet/Summary.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Monthly Fund Fact Sheet Summary</a>
                <a href="<% =ResolveUrl("~/EN/Benchmark/IndexData.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Index Daily Return</a>
                <a href="<% =ResolveUrl("~/EN/Benchmark/IndexSim.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Index Simulated Return</a>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-8 col-xs-12">
            <div class="list-group">
                <li class="list-group-item active"><i class="fa fa-fw fa-cog"></i> Benchmark Settings</li>
                <a href="<% =ResolveUrl("~/EN/Benchmark/Index.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Index Information</a>
                <a href="<% =ResolveUrl("~/EN/Benchmark/IndexReturn.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Index Daily Return</a>
                <a href="<% =ResolveUrl("~/EN/Benchmark/Portfolio.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Portfolio Benchmark Setting</a>
                <a href="<% =ResolveUrl("~/EN/Benchmark/Weight.aspx") %>" target="_blank" class="list-group-item list-group-item-action">Benchmark Component Setting</a>
            </div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
</asp:Content>
