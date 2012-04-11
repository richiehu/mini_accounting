(function(){
var tree;
function init(){
	var url = 'getUniversalProductTree.php';
	var callback = {
		cache:false,
		success: function(oResponse){
			var xmlDoc = oResponse.responseXML;
			tree = new YAHOO.widget.TreeView("treeDiv1");
			var treeRoot = tree.getRoot();
			var cnElement = (xmlDoc.getElementsByTagName("_1")).item(0);
			var cnElementId = cnElement.getAttribute('data');
			var cnElementName = cnElement.getAttribute('label');
			var cnNode = new YAHOO.widget.TextNode({label: cnElementName, nodeid: cnElementId}, treeRoot, true);
			createNodes(cnElement, cnNode);
			tree.draw();
			tree.expandAll();
		}
	};
	YAHOO.util.Connect.asyncRequest('GET', url, callback);
}
function createNodes(tmpElement, tmpNode){
	for(var i=0; i<tmpElement.childNodes.length; i++){
		var childElement = tmpElement.childNodes[i];
		var childNid = childElement.getAttribute('data');
		var childName = childElement.getAttribute('label');
		var newNode = new YAHOO.widget.TextNode({label: childName, nodeid: childNid}, tmpNode, false);
		createNodes(childElement, newNode);
	}
}
YAHOO.util.Event.on("expand", "click", function(e) {
	tree.expandAll();
	YAHOO.util.Event.preventDefault(e);
});
YAHOO.util.Event.on("collapse", "click", function(e) {
	tree.collapseAll();
	YAHOO.util.Event.preventDefault(e);
});
YAHOO.util.Event.onDOMReady(init);
})();
