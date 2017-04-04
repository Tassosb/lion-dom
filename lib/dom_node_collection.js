class DOMNodeCollection {
  constructor(nodes) {
    this.nodes = nodes;

  }

  html(string) {
    if (string === undefined) {
      return this.nodes[0].innerHTML;
    } else {
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].innerHTML = string;
      }
    }
  }

  empty() {
    this.html("");
  }

  append(arg) {
    this.nodes.forEach((node) => {
      if (arg instanceof DOMNodeCollection) {
        arg.nodes.forEach((argNode) => {
          node.innerHTML += (argNode.outerHTML);
        });
      } else if (arg instanceof HTMLElement) {
        node.innerHTML += (arg.outerHTML);
      } else if (typeof arg === "string") {
        node.innerHTML += arg;
      }
    });
  }

  attr(attrName, value) {
    if (value === undefined) {
      return this.nodes[0].getAttribute(attrName);
    } else {
      this.nodes.forEach((node) => {
        node.setAttribute(attrName, value);
      });
      return this.nodes;
    }
  }

  addClass(classNames) {
    classNames = classNames.split(' ');
    this.nodes.forEach((node) => {
      node.classList.add(...classNames);
    });
  }

  removeClass(classNames) {
    if (classNames === undefined) {
      this.attr('class', '');
    } else {
      classNames = classNames.split(' ');
      this.nodes.forEach((node) => {
        node.classList.remove(...classNames);
      });
    }
  }

  children() {
    let allChildren = [];
    this.nodes.forEach((node) => {
      const childArr = [].slice.call(node.children);
      allChildren = allChildren.concat(childArr);
    });

    return new DOMNodeCollection(allChildren);
  }

  parent() {
    let allParents = [];
    this.nodes.forEach((node) => {
      const nodeParent = node.parentNode;
      if (!allParents.includes(nodeParent)) {
        allParents.push(nodeParent);
      }
    });

    return new DOMNodeCollection(allParents);
  }

  find(selector) {
    let foundNodes = [];

    this.nodes.forEach((node) => {
      let matched = node.querySelectorAll(selector);
      let matchedArr = [].slice.call(matched);

      foundNodes = foundNodes.concat(matchedArr);
    });

    return new DOMNodeCollection(foundNodes);
  }

  remove() {
    this.nodes.forEach((node) => {
      node.remove();
    });
  }

  on(type, callback) {
    this.nodes.forEach((node) => {
      node.addEventListener(type, callback);
      //creates an events attribute on node in order to
      ////get event callback for a given event type in #off.
      node.events = node.events || {};

      if (node.events[type] === undefined) {
        node.events[type] = [callback];
      } else {
        node.events[type].push(callback);
      }
    });
  }

  off(type) {
    this.nodes.forEach((node) => {
      let eventCallbacks = node.events[type];
      eventCallbacks.forEach((callback) => {
        node.removeEventListener(type, callback);
      });
    });
  }

}

module.exports = DOMNodeCollection;
