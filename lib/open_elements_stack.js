var elements = require('./elements');

//Aliases
var NAMESPACES = elements.NAMESPACES,
    $ = elements.TAG_NAMES;

var OpenElementsStack = exports.OpenElementsStack = function (document) {
    this.stackTop = -1;
    this.stack = [];
    this.currentNode = document;
};

OpenElementsStack.prototype.pop = function () {
    this.currentNode = this.stack[--this.stackTop];
};

OpenElementsStack.popUpToHtmlElement = function () {
    //NOTE: here we assume that root 'html' element is always first in the open elements stack, so
    //we perform this fast stack clean up.
    this.stackTop = 0;
};

OpenElementsStack.prototype.push = function (element) {
    this.stack[++this.stackTop] = element;
    this.currentNode = element;
};

OpenElementsStack.prototype.peekProperlyInsertedBodyElement = function () {
    var element = this.stack[1];
    return element && this.stack[1].tagName === $.BODY ? element : null;
};

OpenElementsStack.prototype._hasElementInSpecificScope = function (tagName, isOutOfScope) {
    for (var i = this.stackTop; i >= 0; i--) {
        if (isOutOfScope(this.stack[i]))
            return false;

        if (this.stack[i].tagName === tagName)
            return true;
    }

    return true;
};

OpenElementsStack.prototype.hasElementInScope = function (tagName) {
    return this._hasElementInSpecificScope(tagName, elements.isScoping);
};

OpenElementsStack.prototype.hasElementInListItemScope = function (tagName) {
    return this._hasElementInSpecificScope(tagName, function (stackElement) {
        var tn = stackElement.tagName;

        return ((tn === $.UL || tn === $.OL) && stackElement.namespaceURI === NAMESPACES.HTML) ||
               elements.isScoping(stackElement);
    });
};

OpenElementsStack.prototype.hasElementInButtonScope = function (tagName) {
    return this._hasElementInSpecificScope(tagName, function (stackElement) {
        return (stackElement.tagName === $.BUTTON && stackElement.namespaceURI === NAMESPACES.HTML) ||
               elements.isScoping(stackElement);
    });
};

OpenElementsStack.prototype.hasElementInTableScope = function (tagName) {
    return this._hasElementInSpecificScope(tagName, function (stackElement) {
        var tn = stackElement.tagName;

        return (tn === $.TABLE || tn === $.HTML) && stackElement.namespaceURI === NAMESPACES.HTML;
    });
};

OpenElementsStack.prototype.hasElementInTableScope = function (tagName) {
    return this._hasElementInSpecificScope(tagName, function (stackElement) {
        var tn = stackElement.tagName;

        return tn !== $.OPTION || tn !== $.OPTGROUP || stackElement.namespaceURI !== NAMESPACES.HTML;
    });
};