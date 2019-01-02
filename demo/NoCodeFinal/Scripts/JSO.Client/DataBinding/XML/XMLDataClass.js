/**
*	XMLDataClass
*	XML data class.  Interface between the models/views and xml element data
*/
(function () {
	JSO.Client.DataBinding.XMLDataClass = JSO.Client.LinkedList.extend({
		framework: 'JSO.Client',
		constructor: JSO.Client.DataBinding.XMLDataClass,
		construct: function (id, rootTypename) {
			this.datanode = JSO.Client.Globals.DAL.getXMLNode('id', id, xmlDoc.getElementsByTagName('data')[0]);
			this.metanode = JSO.Client.Globals.DAL.getXMLNode('typename', this.datanode.tagName, xmlDoc.getElementsByTagName('meta')[0]);
			this.id = id || -1;
			this.idString = padNumber((this.id == -1 ? 0 : this.id), 32);
			this.typename = this.datanode.tagName;
			this.metatype = this.metanode.tagName;
			this.name = this.datanode.attributes['name'] ? this.datanode.attributes['name'].value : this.typename + this.idString;
			this.inheritsFrom = this.metanode.attributes['inheritsFrom'] ? this.metanode.attributes['inheritsFrom'].value : '';
			this.rootTypename = rootTypename;
			this.framework = this.metanode.attributes['framework'] ? this.metanode.attributes['framework'].value : '';
			this.content = this.metanode.attributes['content'] ? this.metanode.attributes['content'].value : '';
			this.typechain = [];
			this.typeChainString = '';
			this.attributes = this.attributes || {};
			this.attributeList = [];
			this.childIds = [];
			this.bindings = {};
			this.bound = false;
			this.dirty = false;
			this.hasExpression = false;
			this.loadTypeChain(this.metanode, this.typename);
			this.attributeList.sort();
			this.loadAttributes();

			//Write the attribute name onto this object and initialize its value
			for (var name in this.attributes) {
				this[name] = this.attributes[name].first().value;
			}

			//Store children of the object for fast loading at runtime
			var childNodes = this.datanode.childNodes;
			for (var i = 0; i < childNodes.length; i++) {
				if (JSO.Client.Globals.DAL.isValidXMLNode(childNodes[i])) {
					var data = JSO.Client.Globals.DAL.getXMLNode('id', childNodes[i].attributes['id'].value, xmlDoc.getElementsByTagName('data')[0]);
					var meta = JSO.Client.Globals.DAL.getXMLNode('typename', data.tagName, xmlDoc.getElementsByTagName('meta')[0]);
					this.childIds.push({
						id: childNodes[i].attributes['id'].value,
						typename: data.tagName,
						rootTypename: JSO.Client.Globals.DAL.cache.types[data.tagName].rootTypename,
						metatype: meta.tagName
					});
				}
			}

			//Attach external framework bindings
			if (this.framework) this.bindings[this.framework] = JSO.Client.DataBinding.External.Factory.create(this.content, this.framework, this);
			//Attach any expression bindings
			if (this.hasExpression) this.bindings.expression = new JSO.Client.DataBinding.ExpressionClass(this);

			for (var name in this.attributes) {
				var attr = this.attributes[name].first();
				attr.value = JSO.Client.Globals.parsers.parse(attr.value, attr.dt);

				if (this.framework || this.hasExpression) {
					//Attach getters and setters to the object instance
					Object.defineProperty(this, name, {
						get: attr.find('XMLAttribute').rootGetter.bind(attr.find('XMLAttribute')),
						set: attr.find('XMLAttribute').rootSetter.bind(attr.find('XMLAttribute'))
					});
					
					this[name] = attr.value;
				} else {
					//No data bindings, so just write out all attributes onto the class
					this[name] = attr.value;
				}
			}


			this._super();
		},
		//Builds inheritance type chain of the object based on source XML data
		loadTypeChain: function (nod, typename) {
			//Get to the bottom first and load type chain up
			if (nod.attributes['inheritsFrom']) {
				var nextNode = JSO.Client.Globals.DAL.getXMLNode('typename', nod.attributes['inheritsFrom'].value, xmlDoc.getElementsByTagName('meta')[0]);
				if (nod.attributes['inheritsFrom'] && nod.attributes['inheritsFrom'].value != typename) this.loadTypeChain(nextNode, nod.attributes['inheritsFrom'].value);
			}

			//Make type chain string
			this.typechain.push(nod);
			this.typeChainString = this.typeChainString + (this.typeChainString == '' ? '' : '.') + typename;
			if (nod.attributes['framework']) this.framework = nod.attributes['framework'].value

			//Track the root physical boundModel/view
			if ((nod.tagName == 'boundModel' && JSO.Client.Model.Factory.hasType(typename)) || (nod.tagName == 'view' && JSO.Client.View.Factory.hasType(typename))) this.rootTypename = typename;

			//Maintain list of all attributes for sorting and building later
			var i = nod.attributes.length;
			while (i--) {
				if (this.attributeList.indexOf(nod.attributes[i].name) == -1) this.attributeList.push(nod.attributes[i].name);
			}

			var attr = nod.firstChild;
			while (attr != undefined) {
				if (JSO.Client.Globals.DAL.isValidXMLNode(attr)) {
					if (this.attributeList.indexOf(attr.attributes['typename'].value) == -1) this.attributeList.push(attr.attributes['typename'].value);
				}
				attr = attr.nextSibling;
			}
		},
		//Load attributes of the class, including their inheritance chain
		loadAttributes: function () {
			//Build attributes and add their antecedants
			for (var i = 0; i < this.typechain.length; i++) {
				var objectNode = this.typechain[i];
				if (objectNode) {
					for (var j = 0; j < this.attributeList.length; j++) {
						var xmlAttr = JSO.Client.Globals.DAL.getXMLNode('typename', this.attributeList[j], objectNode);
						var dataAttr = this.attributes[this.attributeList[j]];

						if (dataAttr == undefined && xmlAttr != undefined) {
							//First attribute *element* instance, create a new binding
							if (JSO.Client.Globals.DAL.isValidXMLNode(xmlAttr)) {
								dataAttr = new JSO.Client.DataBinding.XMLAttribute(this, objectNode, xmlAttr);
								this.attributes[dataAttr.name] = dataAttr;
								if (dataAttr.expression) this.hasExpression = true;
							}
						} else if (dataAttr != undefined) {
							//Next attribute *element* instance for the attribute, add new binding in the inheritance chain
							var nextAttr = new JSO.Client.DataBinding.XMLAttribute(this, objectNode, xmlAttr || dataAttr.attrNode);
							dataAttr.clonable = false;
							dataAttr.insertBefore(nextAttr);
							dataAttr.channel = JSO.Client.Globals.BINDING_CHANNEL.NONE;
							this.attributes[nextAttr.name] = nextAttr;
							if (nextAttr.expression) this.hasExpression = true;
						}
					}
				}
			}
			//Get attributes from the object data node and add a new binding and update the value (if appropriate)
			var m = this.datanode.attributes.length;
			while (m--) {
				var dataAttr = this.attributes[this.datanode.attributes[m].name];
				if (dataAttr) {
					var nextAttr = new JSO.Client.DataBinding.XMLAttribute(this, dataAttr.modelNode, dataAttr.attrNode, this.datanode);
					dataAttr.clonable = false;
					dataAttr.insertBefore(nextAttr);
					dataAttr.channel = JSO.Client.Globals.BINDING_CHANNEL.NONE;
					this.attributes[nextAttr.name] = nextAttr;
					if (nextAttr.expression) this.hasExpression = true;
				}
			}
		},
		//Writes the full object attribute bindings to the console
		auditChain: function () {
			for (var name in this.attributes) {
				console.log(this.typeChainString + '.' + name);
				console.log(this.attributes[name].auditChain());
			}
		},
		destroy: function () {
			if (this.visible) this.hide();
			for (var name in this.attributes) {
				this.attributes[name].first().destroy();
				if (this.bindings) delete this.bindings;
				delete this.attributes[name];
				delete this[name];
			}
			this._super();
			this.attributes = {};
			this.bindings = {};
		},
		show: function () {
			if (this.framework && this.bindings[this.framework]) this.bindings[this.framework].show();
			//if(this.next) this.next.show();
			if (this.events.show && !this.visible) {
				if (this.eventContext) this.events.show.apply(this.eventContext, [this]);
			}
			this.visible = true;
		},
		hide: function () {
			if (this.framework && this.bindings[this.framework]) this.bindings[this.framework].hide();
			//if(this.next) this.next.hide();
			if (this.events.hide && this.visible) {
				if (this.eventContext) this.events.hide.apply(this.eventContext, [this]);
			}
			this.visible = false;
		}
	});
})();