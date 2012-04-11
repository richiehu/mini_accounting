YAHOO.widget.HotlistTree = function(id, oConfigs){
	if (id) { 
		this.init(id); 
		if(oConfigs && oConfigs.childrenUrl && oConfigs.parentParamName){
			this.childrenReqUrl = oConfigs.childrenUrl + '?' + oConfigs.parentParamName + '=';
		}
		if(oConfigs && oConfigs.onLabelClick){
			this.onLabelClick = oConfigs.onLabelClick;
		}
		this.initTree(this.onLabelClick);
	}
};

YAHOO.extend(YAHOO.widget.HotlistTree, YAHOO.widget.TreeView, {
	childrenReqUrl: null,
	onLabelClick: null,
	curLabelEl: null,
	highLightLabel: function(node){
		if(this.curLabelEl){
			this.curLabelEl.style.backgroundColor = '';
			this.curLabelEl.style.color = '';
		}
		this.curLabelEl = node.getLabelEl();
		this.curLabelEl.style.backgroundColor = '#0A246A';
		this.curLabelEl.style.color = '#FFFFFF';
	},
	initTree: function(onLabelClick){
		this.setDynamicLoad(this.loadNodeData, 1);
		var root = this.getRoot();
		var sUrl =  this.childrenReqUrl + '-1';
		var callback = {
			cache:false,
			success: function(oResponse){
				var resText = oResponse.responseText.split('<!--')[0];
				var cnNodeArray = eval('('+resText+')');
				var cnNode = new YAHOO.widget.TextNode({
					label: cnNodeArray[0].RELA_PATH+' ('+cnNodeArray[0].SPACEID+')', 
					nodeid: cnNodeArray[0].NODEID, 
					fullPath: cnNodeArray[0].FULL_PATH, 
					spaceid: cnNodeArray[0].SPACEID, 
					url: cnNodeArray[0].URL,
					is_stop: cnNodeArray[0].IS_STOP
				}, root, true); 
				cnNode.onLabelClick = this.onLabelClick; 
				this.buildTree(cnNode);
			},
			scope: this
		};
		YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
	},
	createChildren: function(parentNode, childNodesArray, expanded){
		for(var i = 0; i < childNodesArray.length; i++){
			var childNode = new YAHOO.widget.TextNode({
				label: childNodesArray[i].RELA_PATH+' ('+childNodesArray[i].SPACEID+')', 
				nodeid: childNodesArray[i].NODEID, 
				fullPath: childNodesArray[i].FULL_PATH, 
				spaceid: childNodesArray[i].SPACEID, 
				url: childNodesArray[i].URL,
				is_stop: childNodesArray[i].IS_STOP
			}, parentNode, expanded); 
			childNode.onLabelClick = this.onLabelClick; 
		}
	},
	buildTree: function(cnNode){
		var sUrl = this.childrenReqUrl + cnNode.data.nodeid;
		var callback = {
			cache:false,
			success: function(oResponse){
				var resText = oResponse.responseText.split('<!--')[0];
				var childNodesArray = eval('('+resText+')');
				this.createChildren(cnNode, childNodesArray, false);
				this.draw();
			},
			scope: this
		};
		YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
	},
	loadNodeData: function(node, fnLoadComplete){
		var parentId = node.data.nodeid;
		var sUrl = this.tree.childrenReqUrl + parentId;
		var callback = {
			cache:false,
			success: function(oResponse){
				var resText = oResponse.responseText.split('<!--')[0];
				var childNodesArray = eval('('+resText+')');
				this.createChildren(node, childNodesArray, false);
				fnLoadComplete();
			},
			scope: this.tree
		};
		YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
	}
});
