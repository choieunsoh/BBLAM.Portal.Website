<%@ Page Title="" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="<%=ResolveUrl("styles/default.css") %>" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="chart-container">
        <div class="row">
            <div class="col-lg-12 text-title"><h1>Summary</h1></div>
            <div class="col-lg-6 col-md-12">
                <div id="chart1" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart2" class="chart2"></div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 text-title"><h1>By Department</h1></div>
            <div class="col-lg-6 col-md-12">
                <div id="chart3" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart4" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart5" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart6" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart7" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart8" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart9" class="chart2"></div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 text-title"><h1>By Developer</h1></div>
            <div class="col-lg-6 col-md-12">
                <div id="chart10" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart11" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart12" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart13" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart14" class="chart2"></div>
            </div>
            <div class="col-lg-6 col-md-12">
                <div id="chart15" class="chart2"></div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 text-title"><h1>By Project</h1></div>
            <div class="col-lg-12">
                <div id="chart16" class="chart2"></div>
            </div>
        </div>

    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
    <script src="<%= ResolveUrl("data/data.js") %>"></script>
    <script src="<%= ResolveUrl("scripts/project.js") %>"></script>
</asp:Content>
