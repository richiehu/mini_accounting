function checkform(obj)
{
	if(obj.hostname_front.value.length == '')
	{
		alert('����дǰ��������');
		obj.hostname_front.focus();
		return false;
	}
	if (obj.productname.value.length == '') 
	{
		alert('����д��Ʒ��ʶ��');
		obj.productname.focus();
		return false;
	}
	if (obj.hostname_nd.value.length == '') 
	{
		alert('����д�˿ں�');obj.path.focus();
		return false;
	}
	if (obj.hostname_domain.value.length == '') 
	{
		alert('����д��Ʒ����');
		obj.hostname_domain.focus();
		return false;
	}
	if(obj.category.value.length=='')
	{
		alert('����дCategory�ֶ�');
		obj.category.focus();
		return false;
	}

	if (obj.task.value.length == '') 
	{
		alert('����д����');obj.task.focus();
		return false;
	}
	if (obj.sort.value.length == '') 
	{
		alert('����д���');
		obj.sort.focus();
		return false;
	}
	if (obj.path.value.length == '') 
	{
		alert('����д��־·��');
		obj.path.focus();
		return false;
	}
	if(obj.SubmitAdd)
	{
		obj.SubmitAdd.value='�ύ��...';
	}
	else
	{
		obj.SubmitEdit.value='�ύ��...';
	}
return true;
}
function requireNew(show)
{
	if (!document.getElementById) return false;

	var objDivOfNewDir = document.getElementById("divOfNewDir");
	var objDivOfMain = document.getElementById("divOfMain");
	var objDivsearch =  document.getElementById("searchdiv");
	if (!objDivOfNewDir || !objDivOfMain || !objDivsearch)
	{
		//	alert("false");
		return false;
	}

	if (show) {
		objDivOfNewDir.style.display = "block";
		objDivsearch.style.display = "none";
		objDivOfMain.style.display = "none";
		var objFocus = document.getElementById('newuser');
		if (objFocus) objFocus.focus();
	}
	else {
		objDivsearch.style.display = "block";
		objDivOfNewDir.style.display = "none";
		objDivOfMain.style.display = "block";
	}
}
function requireEdit(show,hostname_front,username,path,days,productname, kind,hostname_nd,state,hostname_domain,area,task,turntime,property,sort,category,savefront_value)
{
	if (!document.getElementById) return false;

	var objDivOfEdit = document.getElementById("divOfEdit");
	var objDivOfMain = document.getElementById("divOfMain");
	var objBack = document.getElementById("backdiv");
	if (!objDivOfEdit || !objDivOfMain || !objBack)
	{
		return false;
	}

	if (show) {
		objDivOfEdit.style.display = "block";
		objBack.style.display = "none"
		objDivOfMain.style.display = "none";

		document.formOfEdit.savefront.value = savefront_value;
		document.formOfEdit.hostname_front.value = hostname_front;
		document.formOfEdit.username.value = username;
		document.formOfEdit.path.value = path;
		document.formOfEdit.days.value = days;
		document.formOfEdit.productname.value = productname;
		document.formOfEdit.kind.value = kind;
		document.formOfEdit.hostname_nd.value = hostname_nd;
		document.formOfEdit.hostname_domain.value = hostname_domain;
		document.formOfEdit.area.value = area;
		document.formOfEdit.task.value = task;
		document.formOfEdit.turntime.value = turntime;
		document.formOfEdit.property.value = property;
		document.formOfEdit.sort.value = sort;
	//	document.formOfEdit.savefront.value = savefront;
		document.formOfEdit.category.value = category;
	}
	else {
		objDivOfEdit.style.display = "none";
		objDivOfMain.style.display = "block";
		objBack.style.display = "block";
	}
}
function checkAll(e, itemName)
{
	var aa = document.getElementsByName(itemName);
	for (var i=0; i<aa.length; i++)
		aa[i].checked = e.checked;
}
function checkForm()
{
	var isOk=false;
	var aa = document.getElementsByName("selectnode");
	for (var i = 0;i < aa.length; i++)
	{
		if(aa[i].checked == true)
			isOk=true;
	}
	if(!isOk)
	{
		alert('��ѡ��Ҫɾ���ļ�¼!');
	}
	return isOk;
}

function  Complete_Other()
{
	return true;
}
function goPage()
{
	maxPage = document.getElementById('g_maxpage').value;
	page = document.getElementById('g_page').value;
	if(page>maxPage || page == '' || page <= 0)
	{
		alert("��������ȷ��ҳ��!");
		return false;
	}
	category = document.getElementById('g_searchcategory').value;
	product = document.getElementById('g_searchproduct').value;
	host = document.getElementById('g_searchhost').value;
	window.location.replace(window.location.pathname+'?searchquery=yes&searchhost='+host+'&searchproduct='+product+'&searchcategory='+category+'&page='+page);
	return true;
}


