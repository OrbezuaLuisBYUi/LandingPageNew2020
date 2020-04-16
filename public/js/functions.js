function showdashboard(button)
{
    if(button == "landingpage")
    {
        $('#landingpage').show();
        $('#subscribers').hide();
        
        fetch('/showinfo', {method: 'GET'})
        .then(res => res.json())
        .then(data => {
            //alert("PRUEBA: "+data[0].lan_tittle);
            const landingpages = $('#informationlandingpage');
            var j = 0;
            landingpages.empty();
            for(var i = 0; i <= data.length; i++)
            {
                j++;
                landingpages.append("<tr id='getinfo"+data[i].keylan+"'><td>"+j+"</td><td>"+data[i].tittle+"</td><td>"+data[i].subtittle+"</td><td><img src='images/landingpage/"+data[i].image+"' class='picture'><input type='hidden' id='editimage"+data[i].keylan+"' value='"+data[i].image+"'></td><td><iframe width='160' height='115' src='"+data[i].video+"' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe><input type='hidden' id='editvideo"+data[i].keylan+"' value='"+data[i].video+"'></td><td>"+data[i].textlan+"</td><td>"+data[i].namelan+"</td><td>"+data[i].email+"</td><td>"+data[i].swtext+"</td><td>"+data[i].swphone+"</td><td><a class='glyphicon glyphicon-link cursorpointer' href='https://landingpageluis.herokuapp.com/template/"+data[i].keylan+"' title='Link' target='_blank'></a></td></tr>");
            }
        });
    }
    else
    if(button == "subscribers")
    {
        $('#subscribers').show();
        $('#landingpage').hide();

        fetch('/showinfosubscribers', {method: 'GET'})
        .then(res => res.json())
        .then(data => {
            const subscribers = $('#informationsubscribers');
            var j = 0;
            subscribers.empty();
            for(var i = 0; i <= data.length; i++)
            {
                j++;
                subscribers.append("<tr id='getinfo"+data[i].keycus+"'><td>"+j+"</td><td>"+data[i].yourname+"</td><td>"+data[i].email+"</td><td>"+data[i].yourtext+"</td><td>"+data[i].phone+"</td><td>"+data[i].nameuser+"</td><td>"+data[i].keylan+"</td></tr>");
            }
        });
    }
}
function edituserdashboard()
{
    var edituser = "YES";
    fetch(buildUrl('/Showinfousers',{ edituser: edituser}), {method: 'GET'})
    .then(res => res.json())
    .then(data => {
        $('#editusername').val(data[0].username);
        $('#editname').val(data[0].myname);
        $('#editlastname').val(data[0].lastname);
        $('#editphone').val(data[0].phone);
        $('#editemail').val(data[0].email);
        $('#editprofile').val(data[0].profile);
    });
}
function edituser()
{
    var editusername = $('#editusername').val();
    var editpassword = $('#editpassword').val();
    var editname = $('#editname').val();
    var editlastname = $('#editlastname').val();
    var editphone = $('#editphone').val();
    var editemail = $('#editemail').val();
    var editprofile = $('#editprofile').val();
    var editkeyuser = 0;

    if(editusername.trim() == "" || editname.trim() == "" || editemail.trim() == "" || editprofile.trim() == "")
    {
        alert("Enter your required information");
        return false;
    }
    else
    {
        var edit = "YES";
        fetch('/UpdateUser', { 
            method: 'POST', 
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ editkeyuser:editkeyuser,editusername:editusername,editpassword:editpassword,editname:editname,editlastname:editlastname,editphone:editphone,editemail:editemail,editprofile:editprofile,edit:edit })
        })
        .then(res => res.text())
        .then(data => {
            alert(data);
        });
    }
}
function buildUrl(url, parameters) {
    let qs = "";
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const value = parameters[key];
            qs +=
                encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
    }
    return url;
}