const DOMNodeCollection = require('./dom_node_collection.js');

const funcQueue = [];


Window.prototype.$l = function (arg) {
  if (typeof arg === 'string') {
    const nodeList = document.querySelectorAll(arg);
    const nodeArray = [].slice.call(nodeList);
    return new DOMNodeCollection(nodeArray);
  } else if (arg instanceof HTMLElement) {
    return new DOMNodeCollection([arg]);
  } else if (arg instanceof Function) {
    if (document.readyState === 'complete') {
      arg();
    } else {
      funcQueue.push(arg);
    }
  }
};

document.addEventListener("DOMContentLoaded", function() {
  funcQueue.forEach((func) => {
    func();
  });
});

$l.extend = function(firstObj, ...otherObjs) {
  otherObjs.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      firstObj[key] = obj[key];
    });
  });
  return firstObj;
};

const defaults = {
  success: function (res) {console.log(res);},
  error: function () {console.log("error :(");},
  url: window.location.pathname,
  method: 'GET',
  data: "",
  contentType: "application/x-www-form-urlencoded; charset=UTF-8"
};

$l.ajax = function(options) {
  options = options || {};
  options = $l.extend(defaults, options);
  const xhr = new XMLHttpRequest();

  xhr.open(options.method, options.url);

  xhr.onload = function () {
    if (xhr.status === 200) {
      options.success(JSON.parse(xhr.response));
    } else {
      options.error();
    }
  };

  xhr.send(options.data);
};
