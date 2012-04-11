(function(){
var tree;
function init(){
	var url = '/getProNodesProxy.php';
	var callback = {
		cache:false,
		success: function(oResponse){
			var xmlDoc = oResponse.responseXML;
			tree = new YAHOO.widget.TreeView("treeDiv1");
			var treeRoot = tree.getRoot();
			var cnElement = (xmlDoc.getElementsByTagName("_1")).item(0);
			var cnElementId = cnElement.getAttribute('data');
			var cnElementName = cnElement.getAttribute('label');
			var cnNode = new YAHOO.widget.RadioTaskNode({label: cnElementName, nodeid: cnElementId, parentLabel: treeRoot.label}, treeRoot, true);
			createNodes(cnElement, cnNode);
			tree.draw();
		}
	};
	YAHOO.util.Connect.asyncRequest('GET', url, callback);
}
function createNodes(tmpElement, tmpNode){
	for(var i=0; i<tmpElement.childNodes.length; i++){
		var childElement = tmpElement.childNodes[i];
		var childNid = childElement.getAttribute('data');
		var childName = childElement.getAttribute('label');
		var newNode = new YAHOO.widget.RadioTaskNode({label: childName, nodeid: childNid, parentLabel: tmpNode.label}, tmpNode, false);
		createNodes(childElement, newNode);
	}
}
//handler for expanding all nodes
YAHOO.util.Event.on("expand", "click", function(e) {
	tree.expandAll();
	YAHOO.util.Event.preventDefault(e);
});

//handler for collapsing all nodes
YAHOO.util.Event.on("collapse", "click", function(e) {
	tree.collapseAll();
	YAHOO.util.Event.preventDefault(e);
});

function onLabelClick(node) {
	new YAHOO.widget.RadioTaskNode("new", node, false);
	node.refresh();
	return false;
}

YAHOO.widget.RadioTaskNode.updateCheckedNodes = function(){
	var parentLabel = YAHOO.widget.RadioTaskNode.checkedNode.data.parentLabel;
	var v = parentLabel ? parentLabel + "->" : '';
	document.getElementById('productDesc').value = v + YAHOO.widget.RadioTaskNode.checkedNode.label;
	document.getElementById('productID').value = YAHOO.widget.RadioTaskNode.checkedNode.data.nodeid;
};
YAHOO.util.Event.onDOMReady(init);
})();
