/** getXmlHttp() 获取XmlHttpRequest实例 {{{
  *
  * return object
  */
function getXmlHttp()
{
  var xmlHttp;

  if(typeof(XMLHttpRequest) != 'undefined')
  {
    xmlHttp = new XMLHttpRequest();
  }
  else if(window.ActiveXObject)
  {
    var aVersions = ['Msxml2.XMLHttp.5.0', 'Msxml2.XMLHttp.4.0', 'Msxml2.XMLHttp.3.0', 'Msxml2.XMLHttp', 'Microsoft.XMLHttp'];
    for(var i = 0; i < aVersions.length; i++)
    {
      try
      {
        xmlHttp = new ActiveXObject(aVersions[i]);
        break;
      }
      catch (e){}
    }
  }

  return xmlHttp;
}
// }}}

function getResText(txt) {
    var n = text.lastIndexOf('<!--');
    if(-1 != n) {
        txt = txt.substring(0, n);
    }
    return txt;
}

function cutStr(str, len, hasDot) 
{ 
  if(typeof(str) != 'string') return '';

  var newLength = 0; 
  var newStr = "";  
  var chineseRegex = /[^\x00-\xff]/g; 
  var singleChar = "";  
  var strLength = str.replace(chineseRegex,"**").length; 
  for(var i = 0;i < strLength;i++) 
  { 
    singleChar = str.charAt(i).toString(); 
    if(singleChar.match(chineseRegex) != null) 
    {    
      newLength += 2; 
    }          
    else 
    {    
      newLength++; 
    }    
    if(newLength > len) 
    {    
      break; 
    }    
    newStr += singleChar; 
  } 

  if(hasDot && strLength > len) 
  { 
    newStr += "..."; 
  } 
  return newStr; 
}
/** loadJs() 动态加载Javascript {{{
  *
  * @param mix      js            Object、Array或String。javascript文件名
  * @param function callback      回调函数。可选
  * return void
  */
function loadJs(js)
{
  if(typeof(js) == 'string')
  {
    js = [js];
  }

  for(var i in js)
  {
    if(typeof(js[i]) == 'string')
    {
      var script = document.createElement('script');
      script.src = '/js/' + js[i];
      document.body.appendChild(script);
    }
  }
}
// }}}


/** getBrowser() 获取或判断浏览器及版本 {{{
  *
  * @param string browser     浏览器名称和版本号，用空格分隔。如果指定了本参数，则判定当前浏览器是否为指定的浏览器
  *                           合法的浏览器名称：IE、MSIE、Firefox、FF、Chrome、Safari、Opera
  * return bool|string        如指定了参数browser，返回bool；否则返回以空格分隔的包含浏览器名称和版本号的string，如：IE 7、Chrome 10.00.5
  */
function getBrowser()
{
  if(arguments.length > 0)
  {
    var version = null;
    if(arguments[0].indexOf(' ') >= 0)
    {
      var t = arguments[0].split(' ');
      var browser = t[0], version = t[1];
    }
    else var browser = arguments[0];

    switch(browser)
    {
      case 'MSIE':
      {
        return navigator.userAgent.indexOf(browser + (version ? ' ' + version : '')) >= 0;
      }
      case 'IE':
      {
        return navigator.userAgent.indexOf('MSIE' + (version ? ' ' + version : '')) >= 0;
      }
      case 'FF':
      {
        return navigator.userAgent.indexOf('Firefox' + (version ? '/' + version : '')) >= 0;
      }
      case 'Safari':
      {
        return navigator.userAgent.indexOf(browser + (version ? '/' + version : '')) >= 0 && navigator.userAgent.indexOf('Chrome') == -1;
      }
      default:
      {
        return navigator.userAgent.indexOf(browser + (version ? '/' + version : '')) >= 0;
      }
    }
  }

  else
  {
    var result = navigator.userAgent.match(/MSIE ([\d\.]+)/);
    if(result !== null)
    {
      return 'IE ' + result[1];
    }

    var result = navigator.userAgent.match(/Firefox\/([\d\.]+)/);
    if(result !== null)
    {
      return 'Firefox ' + result[1];
    }

    var result = navigator.userAgent.match(/Chrome\/([\d\.]+)/);
    if(result !== null)
    {
      return 'Chrome ' + result[1];
    }

    var result = navigator.userAgent.match(/Safari\/([\d\.]+)/);
    if(result !== null)
    {
      return 'Safari ' + result[1];
    }

    var result = navigator.userAgent.match(/Opera\/([\d\.]+)/);
    if(result !== null)
    {
      return 'Opera ' + result[1];
    }

    return false;
  }
}
// }}}


function createXMLHttpRequest() {
	var xmlHttp;
    try {
        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e2) {
            xmlHttp = false;
        }
    }
    if (!xmlHttp && typeof XMLHttpRequest != 'undefined') {
        xmlHttp = new XMLHttpRequest();
    }
	return xmlHttp; 
}
function checkSpaceid(){
	document.getElementById("error").innerHTML = '';
	var spaceid = document.getElementById("querySpaceid").value;
	var thedate = document.getElementById("f_date_c").value;
	if(spaceid == ''){
		alert("请选择spaceid");
		document.getElementById("querySpaceid").focus();
		return false;
	}
	var xmlHttp = createXMLHttpRequest();
	xmlHttp.onreadystatechange = function(){
		if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
				var tempdata = xmlHttp.responseText;
				var regExp= /(.*)(\s*)(<!--.*-->)/;
				var tmpArray = tempdata.match(regExp);
				
				var resCode = null;
				if(tmpArray != null){
					resCode = tmpArray[1];
				}else{
					resCode = tempdata;
				}

				if(resCode != null){
					if(resCode == 'notexist'){
						document.getElementById("error").innerHTML = "<font color=\"red\">对不起，您输入的spaceid不存在！</font>";
					}else if(resCode == 'nodata'){
						document.getElementById("error").innerHTML = "<font color=\"red\">对不起，没有符合您条件的数据！</font>";
					}else if(resCode == 'notleaf'){
						document.getElementById("error").innerHTML = "<font color=\"red\">对不起，请在左侧hotlist树中选择叶子节点！</font>";
					}else{
						var exDate = new Date();
						exDate.setFullYear(exDate.getFullYear()+2);
						document.cookie = 'pathSpid=' + spaceid + '; expires=' + exDate.toGMTString();
						document.cookie = 'pathNodeid=' + resCode + '; expires=' + exDate.toGMTString();
						document.cookie = 'pathDate=' + thedate;

						document.f1.submit();
					}
				}
			}
		}
	};
	var url = 'checkSpaceid.php?';
	url += 'spaceid=' + spaceid;
	url += '&thedate=' + thedate;
	//alert(url);
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
	return false;
}
function addBookmark(){
    var currNodename = document.getElementById("currNodename").innerHTML;

    switch(location.pathname)
    {
      case '/rdMetric.php':
      {
        currNodename += '-每日点击';
        break;
      }
      case '/rdMetric_realtime.php':
      {
        currNodename += '-分时点击';
        break;
      }
    }

    var loginUser = document.getElementById("loginUser").innerHTML;
    var link = location.href;
    var productName = window.prompt("书签名", currNodename);
    if(productName != null){
        var xmlHttp = createXMLHttpRequest();
        //xmlHttp.onreadystatechange =
        var url = 'addBookmark.php?';
        url += 'creater=' + loginUser;
        url += '&link=' + escape(link);
        url += '&name=' + productName;

		url += "&random="+Math.random();

        //alert(url);
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    }
}

function ifChecked(itemName)
{
    var item = document.getElementsByName(itemName);
    for (var i=0; i<item.length; i++){
        if(item[i].checked)
            break;
    }
    if(i >= item.length){
        return false;
    }else{
        return true;
    }
}

function onkeypress_comma_sep_ints(evt) {
    // filter for digits and ,
    // note that they can still paste crap in this only prevents entry
    evt = (evt) ? evt : event;
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
    //window.status = "pressed "+charCode;

    var bCtrlPressed = (evt.ctrlKey) ? evt.ctrlKey : evt.modifiers & 2 > 0; // for firefox need this
    if ( charCode < 32 || bCtrlPressed || charCode==37 || charCode==39 || charCode==13 || charCode==36 || charCode==35 || charCode==46) { // control chars, pass thru
        return true; // it's all good
    }

    if ( charCode >= 48 && charCode <= 57 ) { // nums
        return true; // it's all good
    }

    if ( charCode == 44 ) { // comma
        return true; // it's all good
    }

    return false; // rest are invalid
}

function onkeyup_comma_sep_ints(evt) {
    evt = (evt) ? evt : event;
    var elem = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    var nCurVal = elem.value;
    if (nCurVal == "") { return true; }
    nVal = nCurVal.replace(/[^0-9,]*/g, ''); // strip non nums or commas
    nVal = nVal.replace(/,+/g, ','); // get rid of multiple commas
    if (nCurVal != nVal) { elem.value = nVal; }
}

function limitLength(value, byteLength, title, attribute) {
    var newvalue = value.replace(/[^\x00-\xff]/g, "***");
    var length = newvalue.length;

    if (length * 1 <=byteLength * 1){
        return;
    }
    var limitDate = newvalue.substr(0, byteLength);
    var count = 0;
    var limitvalue = "";
    for (var i = 0; i < limitDate.length; i++) {
        var flat = limitDate.substr(i, 1);
        if (flat == "*") {
            count++;
        }
    }
    var size = 0;
    var istar = newvalue.substr(byteLength * 1 - 1, 1);

    if (count % 3 == 0) {
        size = count / 3 + (byteLength * 1 - count);
        limitvalue = value.substr(0, size);
    } else {
        size = (count - count%3) / 3 + (byteLength * 1 - count);
        limitvalue = value.substr(0, size);
    }
    alert(title + "请最多输入" +(byteLength-byteLength%3 )/3+"个汉字！");
    document.getElementById(attribute).value = limitvalue;
    return;
}

function onclick_img_sd(oImg) {
    // for the very simple triangle image style flipper toggles module open/closed
    var sSDElementId = oImg.id.split("-")[1];
    var oSDElement = document.getElementById(sSDElementId);
    if (oSDElement.style.display == "none") {
        oSDElement.style.display = "block";
        oImg.className = "sd-flipper-open";
    } else {
        oSDElement.style.display = "none";
        oImg.className = "sd-flipper-closed";
    }
}

function deleteItem(type, id){
    var name = document.getElementById(type+"_"+id).innerHTML;
    if (confirm("确定要删除 '" + name + "' 吗?")) {
        //document.location.href = "download_delete.aspx?id=" + sSelID +"&mode=" + sAction;
        var xmlHttp = createXMLHttpRequest();
        xmlHttp.onreadystatechange = function(){
            //alert(xmlHttp.readyState);
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    var tempdata = xmlHttp.responseText;
                    //alert(tempdata);
                    document.getElementById(type+"Table").innerHTML = tempdata;
                }
            }

        };
        var url = 'deleteMyItem.php?';
        url += 'type=' + type;
        url += '&id=' + id;
        //alert(url);
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    } else {
        return;
    }
}

function updateTree(sendED, pid, dp){
	var xmlHttp = createXMLHttpRequest();
	xmlHttp.onreadystatechange = function(){
		//alert(xmlHttp.readyState);
		if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
				var tempdata = xmlHttp.responseText;
				//alert(tempdata);
				var el = document.getElementById('treeScript');
				var ua = navigator.userAgent.toLowerCase();
				if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0) {
					tempdata = '<div style="display:none">for IE</div>' + tempdata;
					tempdata = tempdata.replace(/<script([^>]*)>/gi, '<script$1 defer="true">');
					el.innerHTML = tempdata;
					el.removeChild(el.firstChild);
				}else {
					var el_next = el.nextSibling;
					var el_parent = el.parentNode;
					el_parent.removeChild(el);
					el.innerHTML = tempdata;
					if (el_next) {
						el_parent.insertBefore(el, el_next)
					} else {
						el_parent.appendChild(el);
					}
				}
				//document.getElementById("pvuvFlash").focus();	
			}
		}

	};
	var url = 'updateTree.php?';
	url += 'date=' + sendED;
	url += '&pid=' + pid;
	url += '&dp=' + dp;
	//alert(url);
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

function updateDataTable(sendED, pid, dp, ttype){
	var xmlHttp = createXMLHttpRequest();
	xmlHttp.onreadystatechange = function(){
		//alert(xmlHttp.readyState);
		if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
				var tempdata = xmlHttp.responseText;
				//alert(tempdata);
				document.getElementById("dataTable").innerHTML = tempdata;
				//document.getElementById("pvuvFlash").focus();	
			}
		}

	};
	var url = 'updateDataTable.php?';
	url += 'date=' + sendED;
	url += '&pid=' + pid;
	url += '&dp=' + dp;
	url += '&ttype=' + ttype;
	//alert(url);
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

function updateChildDataTable(sendED, pid, dp, ttype){
	var xmlHttp = createXMLHttpRequest();
	xmlHttp.onreadystatechange = function(){
		//alert(xmlHttp.readyState);
		if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
				var tempdata = xmlHttp.responseText;
				//alert(tempdata);
				document.getElementById("childDataTable").innerHTML = tempdata;
				//document.getElementById("pvuvFlash").focus();	
			}
		}

	};
	var url = 'updateChildDataTable.php?';
	url += 'date=' + sendED;
	url += '&pid=' + pid;
	url += '&dp=' + dp;
	url += '&ttype=' + ttype;
	//alert(url);
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}
function updateMetricDataTable(sendED, mid, dp, table, lastDay){
	var xmlHttp = createXMLHttpRequest();
	xmlHttp.onreadystatechange = function(){
		//alert(xmlHttp.readyState);
		if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
				var tempdata = xmlHttp.responseText;
				//alert(tempdata);
				document.getElementById("dataTable").innerHTML = tempdata;
				//document.getElementById("pvuvFlash").focus();	
			}
		}

	};
	var url = 'updateMetricDataTable.php?';
	url += 'date=' + sendED;
	url += '&dp=' + dp;
	url += '&mid=' + mid;
	url += '&table=' + table;
	url += '&last=' + lastDay;
	//alert(url);
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}
function setDownloadProductParam(ts, st, et) {
	document.getElementById("exportTimeSlice").value = ts;
	document.getElementById("exportStartDate").value= st;
	document.getElementById("exportEndDate").value= et;
	//document.getElementById("pvuvFlash").focus();	
}
function tmpCook() {
    for(var i=0; i< tmpCook.arguments.length; i++) {
        var ckThing = tmpCook.arguments[i] + '=' + tmpCook.arguments[i+1];
        i++;
        document.cookie = ckThing;
    }
	//document.getElementById("pvuvFlash").focus();	
}
function getResText(text){
/*
    var regExp= /(.*)(\s*)(<!--.*-->)/;
    var tmpArray = text.match(regExp);
    var resText = null;
    if(tmpArray != null){
        resText = tmpArray[1];
    }else{
        resText = text;
    }
    return resText;
*/
	var n = text.lastIndexOf('<!--');
	if(-1 != n) {
		text = text.substring(0, n);
	}
	return text;
}
function changeNull(s){
    return (s == null ? '' : s);
}
//pos can be 'lt' or 'lb' or 'rt' or 'rb', and default value is 'rb'
function showTip(oEvent, id, pos) {
	var oDiv = document.getElementById(id);
	oDiv.style.display = 'block';
	var oDivWidth = oDiv.offsetWidth;
	var delta = 8;
	var oDivLeft = YAHOO.util.Event.getPageX(oEvent);
	var oDivTop = YAHOO.util.Event.getPageY(oEvent);
	if(pos == 'lt'){
		oDivLeft = oDivLeft - oDivWidth - delta;
		oDivTop = oDivTop - delta;
	}else if(pos == 'lb'){
		oDivLeft = oDivLeft - oDivWidth - delta;
		oDivTop = oDivTop + delta;
	}else if(pos == 'rt'){
		oDivLeft = oDivLeft + delta;
		oDivTop = oDivTop - delta;
	}else{
		oDivLeft = oDivLeft + delta;
		oDivTop = oDivTop + delta;
	}
	oDiv.style.left = oDivLeft + 'px';
	oDiv.style.top = oDivTop + 'px';
}
function hideTip(oEvent, id) {
	var oDiv = document.getElementById(id);
	oDiv.style.display = 'none';
}
function numberFormat(n){
	var s = n.toString();
	if(n*1 < 0){
		s = s.substr(1);
	}
	var len = s.length;
	if(len <= 3){
		return n;
	}else{
		var r = len % 3;
		var result = '';
		if(r !=0 ){
			result = s.substr(0,r) + ',';
		}
		for(var i = r; i < len-3; i += 3){
			result += s.substr(i,3)+',';
		}
		result += s.substr(len-3, 3);
		if(n*1 < 0){
			result = '-'+result;
		}
		return result;
	}
}
function setCurrentNav(ulId, liId){
    var navList = document.getElementById(ulId).childNodes;
    for(var i=0; i<navList.length; i++){
        var child = navList.item(i);
        if(child.nodeName.toLowerCase() == 'li'){
            child.className = '';
        }
    }
    var curNav = document.getElementById(liId);
    curNav.className = "current";
}
//当s以c结尾时，则删除c
function rmEndChar(s, c){
	if(s.charAt(s.length-1) == c){
		s = s.substr(0, s.length-1);
	}
	return s;
}
function textOnOff() {
	for (var i=0; i < arguments.length; i++) {
		var item = document.getElementById(arguments[i]);
		if (item.className=="texton") {
			item.className= "textoff";
		} else {
			item.className= "texton";
		}
	}
}

Date.prototype.format = function(format) {
    var o =
    {
        "m+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "M+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format))
        format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
function combineData(res,start_date) {
    var res_str = '';
    if(start_date == null) {
        for(var day in res) {
            if(day == 'rootParent' || day == 'root' || day == 'click_status' || day == 'uv_status') continue;
            if(res[day][res['rootParent']][res['root']]['click'] != null) {
                res_str += day + ";" + res[day][res['rootParent']][res['root']]['click'] + ";" + res[day][res['rootParent']][res['root']]['uv'] + "\n";
            } else {
                for(var hour in res[day][res['rootParent']][res['root']]) {
                    if(hour == 'daily' || hour == 'rd_dim' || hour == 'status') continue;
                    for(var minute in res[day][res['rootParent']][res['root']][hour]) {
                        res_str += day + ' ' + ("00"+ hour).substr(("" + hour).length) + ":" + ("00" + minute).substr((""+ minute).length) + ";" + res[day][res['rootParent']][res['root']][hour][minute]['click'] + ";" + res[day][res['rootParent']][res['root']][hour][minute]['uv'] + "\n";
                    }
                }
            }
        }
        return res_str;
    }
    for(var i = 0; i < res.length; i++) {
        if(res[i]['thedate'] < start_date || (res[i]['daily_flag'] != null && res[i]['daily_flag'] == 'daily')) continue;
        if(res[i]['hour'] != null && res[i]['minute'] != null) {
            res_str += res[i]['thedate'] + ' ' + ("00"+ res[i]['hour']).substr((""+ res[i]['hour']).length) + ":" + ("00"+ res[i]['minute']).substr((""+ res[i]['minute']).length) + ";" + res[i]['click'] + ";" + res[i]['uv'] + "\n";
        } else {
            res_str += res[i]['thedate'] + ";" + res[i]['click'] + ";" + res[i]['uv'] + "\n";
        }
    }
    return res_str;
}
function convertNum(num){
    if(num != parseFloat(num)) return num;

    num += "";
    var res = num.split(".");

    //为整数部分添加千分位分隔符(空格)
    var arr = res[0].split("").reverse();
    for(var i=1; i*4 - 1 < arr.length; i++) {
        arr.splice(i*4 - 1,0, ",");
    }
    res[0] = arr.reverse().join("");
 
    //为小数部分去掉尾部多余的0
    if (res[1]) {
        res[1] = res[1].replace(new RegExp("0+\x24"),"");
        if (res[1]=="") res.pop();
    }
    return res.join(".");
}


function $$(id)
{
  return document.getElementById(id);
}


/** cutStr 截取字符串（支持中文） {{{
  *
  * @param string str     要截取的字符串
  * @param int len        截取长度，1中文=2字节
  * @param bool hasDot    阶段的字符串时候添加'...'
  * return string
  */
function cutStr(str, len, hasDot) 
{ 
  if(typeof(str) != 'string') return '';

  var newLength = 0; 
  var newStr = ""; 
  var chineseRegex = /[^\x00-\xff]/g; 
  var singleChar = ""; 
  var strLength = str.replace(chineseRegex,"**").length; 
  for(var i = 0;i < strLength;i++) 
  { 
    singleChar = str.charAt(i).toString(); 
    if(singleChar.match(chineseRegex) != null) 
    { 
      newLength += 2; 
    }     
    else 
    { 
      newLength++; 
    } 
    if(newLength > len) 
    { 
      break; 
    } 
    newStr += singleChar; 
  } 

  if(hasDot && strLength > len) 
  { 
    newStr += "..."; 
  } 
  return newStr; 
}
// }}}

/** modifyQueryString() 替换location.search中的参数 {{{
  *
  * @param string param     参数名称
  * @param string value     参数值。如为null，则删除该参数
  * @param string arguments[2]    如此参数不为空，则将此参数当作location.search操作
  * return string
  */
function modifyQueryString(param, value)
{
  var QueryString = typeof(arguments[2]) == 'string' ? arguments[2] : location.search;
  if(QueryString.indexOf('?') === 0) QueryString = QueryString.substr(1);
  var T = QueryString.split('&');
  var search = [];
  var replaced = false;
  for(var c = 0; c < T.length; c++)
  {
    if(replaced)
    {
      search.push(T[c]);
    }
    else
    {
      var t = T[c].split('=');
      if(t[0] == param)
      {
        t[1] = value;
        replaced = true;
      }
      if(t[1] !== null) search.push(t[0] + '=' + t[1]);
    }
  }

  if(!replaced && value !== null) search.push(param + '=' + value);


  return search.join('&');
}
// }}}

/** getRadioValue() 获取单选框的值 {{{
  *
  * @param string name    radio的name
  * return string         选中的radio的值。如未选中，返回null
  */
function getRadioValue(name)
{
  var radio = document.getElementsByName(name);
  for(var c = 0; c < radio.length; c++)
  {
    if(radio[c].checked) return radio[c].value;
  }

  return null;
}
// }}}

/** getLastWeekDate() 获取上周的日期 {{{
  *
  * @param string date    日期。YYYY-MM-DD
  * return string         上周的日期。YYY-MM-DD
  */
function getLastWeekDate(date)
{
  var date = date.split('-'), D = new Date();
  D.setFullYear(date[0]);
  D.setMonth(date[1] - 1);
  D.setDate(date[2]);
  D.setTime(D.getTime() - 3600 * 24 * 7 * 1000);

  var month = D.getMonth() + 1;
  if(month < 10) month = '0' + month;
  var day = D.getDate();
  if(day < 10) day = '0' + day;

  return D.getFullYear() + '-' + month + '-' + day;
}
// }}}

/** parseQueryString() 解析location.search中的参数 {{{
  *
  * return array
  */
function parseQueryString()
{
  var search = location.search.substr(1),
      param = search.split('&'),
      result = {};

  if(search == '')
  {
    return result;
  }

  search = location.search.substr(1).replace('&amp;', '');

  for(var i in param)
  {
    if(typeof(param[i]) == 'string')
    {
      var t = param[i].split('=');
      result[t[0]] = t[1].replace('', '&amp;');
    }
  }

  return result;
}
// }}}

/** getMinDate() 获取最小日期 {{{
  * 可以传入多个array、object或string格式的日期作为参数比较
  *
  * @param mix date                     日期。array、object或string
  * @param mix date2, date3, ...dateN   日期。array、object或string
  * return string                       YYYY-MM-DD
  */
function getMinDate(date)
{
  var dates = [];
  for(var c = arguments.length; c--;)
  {
    var type = typeof(arguments[c]);
    if(type == 'object')
    {
      for(var i in arguments[c])
      {
        if(typeof(arguments[c][i]) == 'string')
        {
          dates.push(arguments[c][i]);
        }
      }
    }
    else if(type == 'string')
    {
      dates.push(arguments[c]);
    }
  }

  var min = Infinity;
  for(var c = dates.length; c--;)
  {
    if(/^\d{4}\-\d{2}\-\d{2}$/.test(date[c]))
    {
      var t = parseInt(date[c].replace(/-/g, ''));
      if(t < min)
      {
        min = t;
      }
    }
  }

  if(min == Infinity)
  {
    return '';
  }
  else
  {
    min = min.toString();
    return min.substr(0, 4) + '-' + min.substr(4, 2) + '-' + min.substr(6, 2);
  }
}
// }}}

/** getMaxDate() 获取最大日期 {{{
  * 可以传入多个array、object或string格式的日期作为参数比较
  *
  * @param mix date                     日期。array、object或string
  * @param mix date2, date3, ...dateN   日期。array、object或string
  * return string                       YYYY-MM-DD
  */
function getMaxDate(date)
{
  var dates = [];
  for(var c = arguments.length; c--;)
  {
    var type = typeof(arguments[c]);
    if(type == 'object')
    {
      for(var i in arguments[c])
      {
        if(typeof(arguments[c][i]) == 'string')
        {
          dates.push(arguments[c][i]);
        }
      }
    }
    else if(type == 'string')
    {
      dates.push(arguments[c]);
    }
  }

  var max = -Infinity;
  for(var c = dates.length; c--;)
  {
    if(/^\d{4}\-\d{2}\-\d{2}$/.test(dates[c]))
    {
      var t = parseInt(dates[c].replace(/-/g, ''));
      if(t > max)
      {
        max = t;
      }
    }
  }

  if(max == -Infinity)
  {
    return '';
  }
  else
  {
    max = max.toString();
    return max.substr(0, 4) + '-' + max.substr(4, 2) + '-' + max.substr(6, 2);
  }
}
// }}}

/** getLastDayDate() 获取指定日期的前一天的日期 {{{
  * 如果指定的日期不正确，指定为今日
  *
  * @param string date      指定日期。YYYY-MM-DD
  * return string
  */
function getLastDayDate()
{
  var D = new Date(), date = '', split = [];

  if(arguments.length > 0) date = arguments[0];
  if(/^\d{4}\-\d{2}\-\d{2}$/.test(date))
  {
    split = date.split('-');
  }
  else
  {
    split[0] = D.getFullYear();
    split[1] = D.getMonth() + 1;
    split[2] = D.getDate();
  }


  D.setFullYear(split[0]);
  D.setMonth(parseInt(split[1]) - 1);
  D.setDate(split[2]);
  var time = D.getTime();

  time -= 3600 * 24 * 1000;
  D.setTime(time);

  var month = D.getMonth() + 1;
  if(month < 10) month = '0' + month;
  var day = D.getDate();
  if(day < 10) day = '0' + day;
  return D.getFullYear() + '-' + month + '-' + day;
}
// }}}

/** getDate() 计算日期 {{{
  * 目前只支持月运算
  *
  * @param string expression      计算表达式.用空格分开的两部分，第一部分是数量，例如-1、5；第二部分是单位，例如week、month
  * @param string date            用来计算的日期，如不指定则为今天。YYYY-MM-DD
  * return string
  */
function getDate(expression)
{
  var D = new Date(),
      expression = expression.split(' '),
      year = '',
      month = '',
      day = '';
  expression[0] = parseInt(expression[0]);

  if(arguments.length > 1 && /^\d{4}\-\d{2}\-\d{2}$/.test(arguments[1]))
  {
    var t = arguments[1].split('-');
    year = parseFloat(t[0]);
    D.setFullYear(year);
    month = parseFloat(t[1]);
    D.setMonth(month - 1);
    day = parseFloat(t[2]);
    D.setDate(day);
  }
  else
  {
    year = D.getFullYear();
    month = D.getMonth() + 1;
    day = D.getDate();
  }

  if(!expression[0]) return year + '-' + month + '-' + day;

  switch(expression[1])
  {
    case 'day':
    {
      D.setTime(D.getTime() + expression[0] * 3600 * 24 * 1000);

      var month = D.getMonth() + 1;
      if(month < 10) month = '0' + month;

      var day = D.getDate();
      if(day < 10) day = '0' + day;

      return D.getFullYear() + '-' + month + '-' + day;
    }
    case 'month':
    {
      if(expression[0] > 0)
      {
        month += expression[0];
        var years = parseInt(month / 13);

        month = month % 12;
        if(month == 0) month = 12;
        if(month < 10) month = '0' + month;

        return (year + years) + '-' + (month) + '-' + day;
      }
      else
      {
        var new_month = expression[0] - 1;

        var years = parseInt(new_month / 12);
        var new_month = (month + expression[0]) % 12;

        if(new_month < 1)
        {
          new_month = 12 - Math.abs(new_month);
        }

        if(Math.abs(new_month) > month + 1) years--;
        if(new_month < 10) new_month = '0' + new_month;

        return (year + years) + '-' + new_month + '-' + day;
      }
    }
  }
}
// }}}

/** parseCookie() 解析cookie为对象 {{{
  *
  * return object
  */
function parseCookie()
{
  var cookie = document.cookie,
      result = {};

  if(cookie != '')
  {
    cookie = cookie.split('; ');
    for(var c = cookie.length; c--;)
    {
      var t = cookie[c].split('=');
      result[t[0]] = t[1];
    }
  }

  return result;
}
// }}}

/** setCookie() 写入cookie {{{
  *
  * @param string key         名称
  * @param string value       值
  * @param int    expire      过期时间（秒数）。如不指定，默认为0
  * return bool
  */
function setCookie(key, value)
{
  var expire = arguments[2],
      expires = '';
  if(typeof(expire) != 'undefined')
  {
    var date = new Date();
    date.setTime(date.getTime() + expire);
    expires = '; expires=' + date.toGMTString();
  }

  document.cookie = key + '=' + value + expires;
  return true;
}
// }}}

/** getCookie() 获取cookie {{{
  *
  * @param string key     cookie名称
  * return string
  */
function getCookie(key)
{
  var cookie = parseCookie();
  return cookie[key] || null;
}
// }}}

/** sortTable() 根据某列排序tbody {{{
  *
  * @param string ID        tbody的ID
  * @param int cellIndex    排序列的索引
  * @param string filter    按照指定的类型格式化单元数据。目前仅支持number
  * return bool
  */
function sortTable(ID, cellIndex)
{
  var filter = arguments[2];
  switch(filter)
  {
    case 'number':
    {
      filter = function(value)
               {
                 return parseFloat(value.replace(/[^\d\.]/g, ''));
               };
      break;
    }
    default:
    {
      filter = function(value){return value;};
    }
  }

  var tbody = $$(ID),
      copy = tbody.cloneNode(false),
      relation = {},
      content = [],
      content_backup = [];

  for(var c = tbody.rows.length; c--;)
  {
    var HTML = filter(tbody.rows[c].cells[cellIndex].innerHTML);
    relation[c] = HTML;
    content.push(HTML);
    content_backup.push(HTML);
  }

  content.sort(
                function(a, b)
                {
                  if(a > b)
                  {
                    return 1;
                  }
                  else if(a < b)
                  {
                    return -1;
                  }
                  else
                  {
                    return 0;
                  }
                }
              );
  if(content.toString() == content_backup.reverse().toString())
  {
    content.reverse();
  }

  var length = content.length;
  for(var C = 0; C < length; C++)
  {
    for(var i in relation)
    {
      if(content[C] == relation[i])
      {
        delete(relation[i]);
        break;
      }
    }

    copy.appendChild(tbody.rows[i].cloneNode(true));
  }

  tbody.parentNode.replaceChild(copy, tbody);
}
// }}}

/** parseBool() 将变量转换为布尔值 {{{
  *
  * @param mix value      待转换的变量。可以是number、string、null、undefined或object。
                          如果是number，    零值为假，其它为真；
                          如果是string，    ''、'false'为假，其它为真；
                          如果是null，      为假；
                          如果是undefined， 为假。
  * return bool
  */
function parseBool(value)
{
  switch(typeof(value))
  {
    case 'object':
    {
      return value !== null;
    }
    case 'undefined':
    {
      return false;
    }
    case 'number':
    {
      return parseFloat(value) != 0;
    }
    case 'string':
    {
      if(value == '' || value == 'false' || value == '0')
      {
        return false;
      }
    }
    default:
    {
      return true;
    }
  }
}
//}}}

/* insertAfter() 在某节点之后插入新节点 {{{
 *
 * @param object newElement       新节点
 * @param object targetElement    目标节点
 *
 * return bool
 */
function insertAfter(newElement, targetElement)
{
  var parent = targetElement.parentNode;

  if(targetElement.parentNode.lastChild == targetElement)
  {
    targetElement.parentNode.appendChild(newElement);
  }
  else
  {
    targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
  }

  return true;
}
// }}}
