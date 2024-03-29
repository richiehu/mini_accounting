YAHOO.widget.RadioTaskNode = function(oData, oParent, expanded, checked) {
    if (oData) { 
        this.init(oData, oParent, expanded);
        this.setUpLabel(oData);
        this.setUpCheck(checked);
    }
};

YAHOO.extend(YAHOO.widget.RadioTaskNode, YAHOO.widget.TaskNode, {

    /**
     * True if checkstate is 1 (some children checked) or 2 (all children checked),
     * false if 0.
     * @type boolean
     */
    checked: false,

    /**
     * checkState
     * 0=unchecked, 1=some children checked, 2=all children checked
     * @type int
     */
    checkState: 0,

    taskNodeParentChange: function() {
        //this.updateParent();
    },

    setUpCheck: function(checked) {
        // if this node is checked by default, run the check code to update
        // the parent's display state
        if (checked && checked === true) {
            this.check();
        // otherwise the parent needs to be updated only if its checkstate 
        // needs to change from fully selected to partially selected
        } else if (this.parent && 2 === this.parent.checkState) {
             //this.updateParent();
        }

        // set up the custom event on the tree for checkClick
        /**
         * Custom event that is fired when the check box is clicked.  The
         * custom event is defined on the tree instance, so there is a single
         * event that handles all nodes in the tree.  The node clicked is 
         * provided as an argument.  Note, your custom node implentation can
         * implement its own node specific events this way.
         *
         * @event checkClick
         * @for YAHOO.widget.TreeView
         * @param {YAHOO.widget.Node} node the node clicked
         */
        if (this.tree && !this.tree.hasEvent("checkClick")) {
            this.tree.createEvent("checkClick", this.tree);
        }

        this.subscribe("parentChange", this.taskNodeParentChange);

    },

    /**
     * The id of the check element
     * @for YAHOO.widget.TaskNode
     * @type string
     */
    getCheckElId: function() { 
        return "ygtvcheck" + this.index; 
    },

    /**
     * Returns the check box element
     * @return the check html element (img)
     */
    getCheckEl: function() { 
        return document.getElementById(this.getCheckElId()); 
    },

    /**
     * The style of the check element, derived from its current state
     * @return {string} the css style for the current check state
     */
    getCheckStyle: function() { 
        return "ygtvcheck" + this.checkState;
    },

    /**
     * Returns the link that will invoke this node's check toggle
     * @return {string} returns the link required to adjust the checkbox state
     */
    getCheckLink: function() { 
        return "YAHOO.widget.TreeView.getNode(\'" + this.tree.id + "\'," + 
            this.index + ").checkClick()";
    },

    /**
     * Invoked when the user clicks the check box
     */
    checkClick: function() { 
        if (this.checkState === 0) {
            this.check();
        } else {
            //this.uncheck();
        }

        this.tree.fireEvent("checkClick", this);
    },

    /**
     * Refresh the state of this node's parent, and cascade up.
     */
    updateParent: function() { 
        var p = this.parent;

        if (!p || !p.updateParent) {
            return;
        }

        var somethingChecked = false;
        var somethingNotChecked = false;

        for (var i=0, l=p.children.length;i<l;i=i+1) {

            var n = p.children[i];

            if ("checked" in n) {
                if (n.checked) {
                    somethingChecked = true;
                    // checkState will be 1 if the child node has unchecked children
                    if (n.checkState === 1) {
                        somethingNotChecked = true;
                    }
                } else {
                    somethingNotChecked = true;
                }
            }
        }

        if (somethingChecked) {
            p.setCheckState( (somethingNotChecked) ? 1 : 2 );
        } else {
            p.setCheckState(0);
        }

        p.updateCheckHtml();
        p.updateParent();
    },

    /**
     * If the node has been rendered, update the html to reflect the current
     * state of the node.
     */
    updateCheckHtml: function() { 
        if (this.parent && this.parent.childrenRendered) {
            this.getCheckEl().className = this.getCheckStyle();
        }
    },

    /**
     * Updates the state.  The checked property is true if the state is 1 or 2
     * 
     * @param the new check state
     */
    setCheckState: function(state) { 
        this.checkState = state;
        this.checked = (state > 0);
    },


    /**
     * Check this node
     */
    check: function() { 
		if(YAHOO.widget.RadioTaskNode.checkedNode){
			YAHOO.widget.RadioTaskNode.checkedNode.uncheck();
		}
		YAHOO.widget.RadioTaskNode.checkedNode = this;		
        this.setCheckState(2);
        this.updateCheckHtml();
        //this.updateParent();
		//this.expand();
		if(YAHOO.widget.RadioTaskNode.updateCheckedNodes){
			YAHOO.widget.RadioTaskNode.updateCheckedNodes();
		}
    },

    /**
     * Uncheck this node
     */
    uncheck: function() { 
        this.setCheckState(0);
        this.updateCheckHtml();
        //this.updateParent();
		//this.updateCheckedNodes();	
    },

    // Overrides YAHOO.widget.TextNode
    getNodeHtml: function() { 
        var sb = [];

        var getNode = 'YAHOO.widget.TreeView.getNode(\'' +
                        this.tree.id + '\',' + this.index + ')';


        sb[sb.length] = '<table border="0" cellpadding="0" cellspacing="0">';
        sb[sb.length] = '<tr>';
        
        for (var i=0;i<this.depth;++i) {
            //sb[sb.length] = '<td class="' + this.getDepthStyle(i) + '">&#160;</td>';
            sb[sb.length] = '<td class="' + this.getDepthStyle(i) + '"></td>';
        }

        sb[sb.length] = '<td';
        sb[sb.length] = ' id="' + this.getToggleElId() + '"';
        sb[sb.length] = ' class="' + this.getStyle() + '"';
        if (this.hasChildren(true)) {
            sb[sb.length] = ' onmouseover="this.className=';
            sb[sb.length] = 'YAHOO.widget.TreeView.getNode(\'';
            sb[sb.length] = this.tree.id + '\',' + this.index +  ').getHoverStyle()"';
            sb[sb.length] = ' onmouseout="this.className=';
            sb[sb.length] = 'YAHOO.widget.TreeView.getNode(\'';
            sb[sb.length] = this.tree.id + '\',' + this.index +  ').getStyle()"';
        }
        sb[sb.length] = ' onclick="javascript:' + this.getToggleLink() + '">&#160;';
        //sb[sb.length] = '</td>';
        sb[sb.length] = '</td>';

        // check box
        sb[sb.length] = '<td';
        sb[sb.length] = ' id="' + this.getCheckElId() + '"';
        sb[sb.length] = ' class="' + this.getCheckStyle() + '"';
        sb[sb.length] = ' onclick="javascript:' + this.getCheckLink() + '">';
        //sb[sb.length] = '&#160;</td>';
        sb[sb.length] = '</td>';
        

        sb[sb.length] = '<td nowrap="nowrap">';
        sb[sb.length] = '<a';
        sb[sb.length] = ' id="' + this.labelElId + '"';
        sb[sb.length] = ' class="' + this.labelStyle + '"';
        sb[sb.length] = ' href="' + this.href + '"';
        sb[sb.length] = ' target="' + this.target + '"';
        sb[sb.length] = ' onclick="return ' + getNode + '.onLabelClick(' + getNode +')"';
        if (this.hasChildren(true)) {
            sb[sb.length] = ' onmouseover="document.getElementById(\'';
            sb[sb.length] = this.getToggleElId() + '\').className=';
            sb[sb.length] = 'YAHOO.widget.TreeView.getNode(\'';
            sb[sb.length] = this.tree.id + '\',' + this.index +  ').getHoverStyle()"';
            sb[sb.length] = ' onmouseout="document.getElementById(\'';
            sb[sb.length] = this.getToggleElId() + '\').className=';
            sb[sb.length] = 'YAHOO.widget.TreeView.getNode(\'';
            sb[sb.length] = this.tree.id + '\',' + this.index +  ').getStyle()"';
        }
        sb[sb.length] = (this.nowrap) ? ' nowrap="nowrap" ' : '';
        sb[sb.length] = ' >';
        sb[sb.length] = this.label;
        sb[sb.length] = '</a>';
        sb[sb.length] = '</td>';
        sb[sb.length] = '</tr>';
        sb[sb.length] = '</table>';

        return sb.join("");

    },

    toString: function() {
        return "TaskNode (" + this.index + ") " + this.label;
    }
});

YAHOO.widget.RadioTaskNode.checkedNode = null;
YAHOO.widget.RadioTaskNode.updateCheckedNodes = null;
