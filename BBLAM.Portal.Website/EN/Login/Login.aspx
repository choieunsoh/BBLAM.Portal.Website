<%@ Page Language="C#" AutoEventWireup="true" Inherits="BBLAM.Web.UI.LoginPage" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <title>BBLAM Risk 2018</title>
    <!-- Meta -->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <link rel="shortcut icon" type="image/x-icon" href="<% =ResolveUrl("~/images/icon-ibond2.ico")%>" />
    <link rel="shortcut icon" type="image/ico" href="<% =ResolveUrl("~/images/icon-ibond2.ico")%>" />

    <!-- Reset All CSS -->
    <link href="<% =ResolveUrl("~/styles/reset.css")%>" rel="stylesheet" type="text/css" />
    <!-- Bootstrap Core CSS -->
    <link href="<% =ResolveUrl("~/plugins/bootstrap/bootstrap.min.css")%>" rel="stylesheet" type="text/css" />
    <!-- Font Awesome CSS -->
    <link href="<% =ResolveUrl("~/styles/fonts/font-awesome-4.7.0.min.css")%>" rel="stylesheet" type="text/css" />
    <!-- Animation CSS -->
    <link href="<% =ResolveUrl("~/styles/animate.min.css")%>" rel="stylesheet" type="text/css" />
    <!-- Font CSS -->
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
	<link href='https://fonts.googleapis.com/css?family=Kanit:300,400,500,600,700,300,400italic,500italic,600italic&subset=thai,latin' rel='stylesheet' type='text/css'>

    <!--[if lt IE 8]>
    <link href="<% =ResolveUrl("~/plugins/bootstrap/bootstrap-ie7.css")%>" rel="stylesheet" type="text/css" />
    <link href="<% =ResolveUrl("~/styles/fonts/font-awesome-ie7.min.css")%>" rel="stylesheet" type="text/css" />
    <![endif]-->

    <!-- Bootstrap Plugins CSS -->
    <link href="<% =ResolveUrl("~/plugins/bootstrap-dialog/bootstrap-dialog.min.css")%>" rel="stylesheet" type="text/css" />

    <!-- HTML5 & CSS3 -->
    <script src="<% =ResolveUrl("~/plugins/common/modernizr-2.8.3.min.js")%>"></script>
        
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="<% =ResolveUrl("~/plugins/common/html5shiv-3.7.3.min.js")%>"></script>
    <script src="<% =ResolveUrl("~/plugins/common/respond-1.4.2.min.js")%>"></script>
    <script src="<% =ResolveUrl("~/plugins/common/es5-shim-4.4.1.min.js")%>"></script>
    <script src="<% =ResolveUrl("~/plugins/common/es5-sham-4.4.1.min.js")%>"></script>
    <script>var start = new Date().getTime();</script>
    <![endif]-->

    <link href="<% =ResolveUrl("styles/default.css")%>" rel="stylesheet">

</head>
<body>
    <div id="debug2" class="hide"></div>
    <!--=== Content Part ===-->
    <div class="container">
        <h1 class="full"><span class="welcome"></span><span class="ibond">BBLAM Risk 2018</span></h1>
        <div class="intro">
            <p></p>
        </div>

        <form id="Form1" runat="server">
            <div class="reg-block">
                <div class="input-group">
                    <input type="text" runat="server" id="txtUserName" name="txtUserName" maxlength="20" class="form-control valid" placeholder="Username" aria-required="true" aria-invalid="false">
                    <span class="input-group-addon"><i class="fa fa-user"></i></span>
                </div>
                <div class="input-group">
                    <input type="password" runat="server" id="txtPassword" name="txtPassword" maxlength="20" class="form-control" placeholder="Password">
                    <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                </div>
                <div class="row">
                    <div class="col-md-12  margin-top-20">
                        <asp:Button ID="btnLogin" runat="server" CssClass="btn-u btn-block" Text="Login" OnClick="btnLogin_Click" />
                    </div>
                </div>
            </div>
        </form>
        <!--End Reg Block-->
    </div>
    <div class="footer">
        <p class="copyright">Copyright © <%=DateTime.Today.Year %> <a href="http://www.bblam.co.th" target="_blank" class="color-white">BBLAM</a> <span>All Rights Reserved.</span></p>
    </div>
    <!--/container-->
    <!--=== End Content Part ===-->

    <!-- jQuery -->
    <script src="<% =ResolveUrl("~/plugins/jquery/jquery-1.11.3-ie8.min.js")%>"></script>
    <script src="<% =ResolveUrl("~/plugins/jquery/jquery-migrate-1.3.0.min.js")%>"></script>
    <script src="<% =ResolveUrl("~/plugins/bootstrap/bootstrap-3.3.6.min.js")%>"></script>

    <!-- Moment DateTime -->
    <script src="<% =ResolveUrl("~/plugins/moment/moment-2.11.1-holidays.min.js")%>"></script>

    <!-- Bootstrap Plugins -->
    <script src="<% =ResolveUrl("~/plugins/bootstrap-dialog/bootstrap-dialog.min.js")%>"></script>
    
    <!-- FormValidation plugin and the class supports validating Bootstrap form -->
    <script src="<% =ResolveUrl("~/plugins/formvalidation/v0.8.1/js/formValidation.min.js")%>"></script>
    <script src="<% =ResolveUrl("~/plugins/formvalidation/v0.8.1/js/framework/bootstrap.min.js")%>"></script>

    <!-- iBond App -->
    <script src="<% =ResolveUrl("~/scripts/utils.js")%>"></script>
    <script src="<% =ResolveUrl("scripts/login.js")%>"></script>

</body>
</html>
