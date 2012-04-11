function HTML5(){};

new HTML5();

/** isSupport() 检查当前浏览器是否支持某元素 {{{
 *
 * @param string element   带有继承关系的元素名称，例如：input.date
 * return bool
 */
HTML5.prototype.isSupport = function(element)
{
  var browser = getBrowser();

  switch(element)
  {
    case 'input.date':
    {
      return browser.indexOf('Opera 9') >= 0;
    }
    case 'Web Workers':
    {
      return browser.indexOf('IE') == -1;
    }
    case 'JSON':
    {
      return browser.indexOf('IE') == -1;
    }
    default: return false;
  }
}
// }}}

var HTML5 = new HTML5();
