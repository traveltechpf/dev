<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>Travel Platform</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <!-- Global vars from backend -->
    <script>
        window.out = {
            moduleType: "<c:out value='${moduleType}'/>"
        };
    </script>

    <!-- Reuse your React entrypoint -->
    <jsp:include page="/index.html"/>

    <!-- React bundles (from Vite build) -->
    <script type="module" src="/js/main.js"></script>
</body>
</html>