var defaultFecthNum = 5;
var backendUrl = '${BACKEND_URL}';

$(function() {
    fecthData(defaultFecthNum);

    $("#btn-update").click(function() {
        $("#btn-update").attr("disabled", true)
        $("#btn-update").html("Atualizando...")
		updateData();
	});
});

function fecthData() {
    $.ajax(backendUrl+'/fetch/'+defaultFecthNum,{
        async: true,
        method: 'GET',
    })
    .done(
        function(data) {
            ret = data;	
            fillTable(ret);
        });
};

function fillTable(data) {
    if (data.length > 0) {
        $("#no-data-msg").hide(0);
        $("#data-table tbody").empty();
        i = 0;
        while (i < data.length) {
            j = i + 1
            $("#data-table tbody").append("<tr><th scope='row'>"+j+"</th><td>"+data[i].UserName+"</td><td>"+data[i].FollowersCount+"</td></tr>");
            i++;
        }
        $("#data-table").show();
        $("#btn-update").removeClass("btn-info");
        $("#btn-update").addClass("btn-success");
    } else {
        $("#data-table").hide(0);
        $("#no-data-msg").show();
    }
};

function updateData() {
    $.ajax(backendUrl+'/update',{
        async: true,
        method: 'GET',
    })
    .done(
        function(data) {
            fecthData();
            $("#btn-update").html("Atualizar <span class='glyphicon glyphicon-refresh'></span>")
            $("#btn-update").removeAttr("disabled");
        });
}