/** makeTree() 绘制左侧节点树 {{{
  *
  * @param string date    日期。YYYY-MM-DD
  * return bool
  */
function makeTree()
{
  $.get(
         '/getProductTree.php',
         {},
         function(data)
         {
           data = data.substr(0, data.lastIndexOf('<!-'));
           tree.nodes = JSON.parse(data);
           $$('div_tree').innerHTML = tree.toString(); 
           setTimeout(
                       function()
                       {
                         tree.focus(NodeId, true);
                         tree.expand(tree.currentNode.id, true);
                       },
                       100
                     )
         }
       );

  return true;
}
// }}}

/** makeTable() 绘制用户列表table {{{
  *
  * return void
  */
function makeTable()
{
  for(var i in user)
  {
    if(i > 0)
    {
      appendRow(i);
    }
  }

  resizeTree();
}
// }}}

/** appendRow() 向table中插入一行用户数据 {{{
  *
  * @param int UserId     用户ID
  * return bool
  */
function appendRow(UserId)
{
  var tbody = $$('tbd'),
      U = user[UserId],
      P = U.privilege,
      tr, td, select, checkbox, button;

  tr = document.createElement('tr');
  tr.setAttribute('UserId', UserId);
  tr.align = 'center';
  tr.style.background = tbody.rows.length % 2 ? '#FFFFFF' : '#FFF0FF';
  tbody.appendChild(tr);

  td = document.createElement('td');
  td.innerHTML = U.name;
  tr.appendChild(td);

  td = document.createElement('td');
  td.innerHTML = U.user_info;
  tr.appendChild(td);

  td = document.createElement('td');
  select = document.createElement('select');
  for(var i in user_group)
  {
    select.options[select.options.length] = new Option(user_group[i].name, user_group[i].id);
  }
  select.name = 'user_group[' + U.id + ']';
  for(var c = select.options.length; c--;)
  {
    if(select.options[c].value == U.group_id)
    {
      select.selectedIndex = c;
      break;
    }
  }
  select.onchange = function()
                    {
                      changeUserGroup(this);
                    };
  td.appendChild(select);
  tr.appendChild(td);

  td = document.createElement('td');
  for(var I in action)
  {
    checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'privilege[' + U.id + ']';
    checkbox.value = I;
    checkbox.onclick = function()
                       {
                         changePrivilege(this);
                       };
    td.appendChild(checkbox);
    td.appendChild(document.createTextNode(action[I] + ' '));
  }
  tr.appendChild(td);

  td = document.createElement('td');
  button = document.createElement('input');
  button.setAttribute('UserId', UserId);
  button.type = 'button';
  button.value = '更新';
  button.onclick = function()
                   {
                     modify(this.getAttribute('UserId'));
                   };
  td.appendChild(button);
  tr.appendChild(td);

  changeUserGroup(select);
}
// }}}

/** changeUserGroup() 当用户组select被改变时触发的事件 {{{
  * 主要是根据用户组设置权限复选框的选中及禁用状态
  *
  * @param object user_group      用户组select对象
  * return bool
  */
function changeUserGroup(user_group)
{
  var UserId = /\d+/.exec(user_group.name),
      privilege = document.getElementsByName('privilege[' + UserId + ']');

  switch(user_group.value)
  {
    case ROOT_GID:
    {
      for(var c = privilege.length; c--;)
      {
        privilege[c].checked = true;
        privilege[c].disabled = true;
      }
      break;
    }
    case ADMIN_GID:
    {
      for(var c = privilege.length; c--;)
      {
        var checkbox = privilege[c],
            P = user[UserId]['privilege'][c + 1];
        if(typeof(P) == 'undefined')
        {
          checkbox.checked = false;
          checkbox.disabled = false;
        }
        else
        {
          checkbox.checked = true;
          checkbox.disabled = P != NodeId;
        }
      }
      break;
    }
    case USER_GID:
    {
      for(var c = privilege.length; c--;)
      {
        var checkbox = privilege[c];
        if(c > 0)
        {
          checkbox.checked = false;
          checkbox.disabled = true;
        }
        else
        {
          var P = user[UserId]['privilege'][c + 1];
          checkbox.checked = true;
          checkbox.disabled = P != NodeId;
        }
      }
      break;
    }
    default:
    {
      for(var c = privilege.length; c--;)
      {
        privilege[c].checked = false;
        privilege[c].disabled = true;
      }
    }
  }
}
// }}}

/** changePrivilege(target) 当点击权限复选框时触发的事件 {{{
  * 主要是设定复选框的联动状态
  *
  * return bool
  */
function changePrivilege(target)
{
  var privilege = document.getElementsByName('privilege[' + /\d+/.exec(target.name) + ']');

  if(target.checked)
  {
    for(var c = 0, length = privilege.length; c < length; c++)
    {
      if(privilege[c] == target)
      {
        break;
      }
      privilege[c].checked = true;
    }
  }
  else
  {
    for(var c = privilege.length; c--;)
    {
      if(privilege[c] == target)
      {
        break;
      }
      privilege[c].checked = false;
    }
  }

  return true;
}
// }}}

/** add() 添加用户及权限 {{{
  *
  * return bool
  */
function add()
{
  var user_name = document.getElementsByName('user_name[0]')[0],
      user_info = document.getElementsByName('user_info[0]')[0],
      user_group = document.getElementsByName('user_group[0]')[0],
      privilege = document.getElementsByName('privilege[0]'),
      action = [];
  user_name.value = user_name.value.replace(/ /g, '', user_name.value);
  user_info.value = user_info.value.replace(/ /g, '', user_info.value);

  if(user_name.value == '')
  {
    alert('请填写用户名');
    user_name.focus();
    return false;
  }

  for(var i in user)
  {
    if(user[i].name == user_name.value)
    {
      alert('用户 ' + user_name.value + ' 已存在，请编辑他/她的权限');
      return false;
    }
  }

  if(user_info.value == '')
  {
    alert('请填写真实姓名');
    user_info.focus();
    return false;
  }

  if(user_group.value == '')
  {
    alert('请选择用户组');
    return false;
  }

  for(var c = privilege.length; c--;)
  {
    if(privilege[c].checked)
    {
      action.push(privilege[c].value);
    }
  }
  if(action.length == 0)
  {
    alert('请指定至少一个权限');
    return false;
  }


  $.get(
         'add.php',
         {
           'NodeId'     : NodeId,
           'name'       : user_name.value,
           'user_info'  : user_info.value,
           'user_group' : user_group.value,
           'action'     : action.join(',')
         },
         function(response)
         {
           response = JSON.parse(getResText(response));

           if(response.status)
           {
             var U = response.user;
             user[U.id] = U;
             appendRow(U.id);

             user_name.value = '';
             user_info.value = '';
             user_group.selectedIndex = 0;
             changeUserGroup(user_group);

             return true;
           }
           else
           {
             alert('添加失败：' + response.message);
             return false;
           }
         }
       );
}
// }}}

/** modify() 修改权限 {{{
  *
  * @param int UserId     用户ID
  * return bool
  */
function modify(UserId)
{
  var user_group = document.getElementsByName('user_group[' + UserId + ']')[0],
      privilege = document.getElementsByName('privilege[' + UserId + ']'),
      U = user[UserId],
      action = [],
      modifyPrivilege = function()
                        {
                          $.get(
                                 '/privilege/modify.php',
                                 {
                                   'NodeId' : NodeId,
                                   'UserId' : UserId,
                                   'action' : action.join(',')
                                 },
                                 function(response)
                                 {
                                   response = JSON.parse(getResText(response));
                                   if(response.status)
                                   {
                                     alert('更新完毕');
                                   }
                                   else
                                   {
                                     alert('设定用户权限失败：' + response.message);
                                   }
                                 }
                               );
                        };
  for(var c = privilege.length; c--;)
  {
    if(privilege[c].checked)
    {
      action.push(privilege[c].value);
    }
  }

  if(user_group.value != U.group_id)
  {
    if(user_group.value == ROOT_GID)
    {
      if(!confirm('将用户添加至管理员组，将删除之前对他/她单独设置的各节点权限，而这些操作不可逆。是否继续？'))
      {
        return false;
      }
    }
    else if(user_group.value == USER_GID && !confirm('降级用户至二级用户组将删除他/她在全站的赋权、回收权限，并且无法恢复。是否继续？'))
    {
      return false;
    }

    $.get(
           '/privilege/modifyUsersGroup.php',
           {
             'UserId'  : UserId,
             'GroupId' : user_group.value
           },
           function(response)
           {
             response = JSON.parse(getResText(response));
             if(response.status)
             {
               if(user_group.value != ROOT_GID)
               {
                 modifyPrivilege();
               }
               else
               {
                 alert('更新完毕');
               }
             }
             else
             {
               alert('修改用户所属组失败：' + response.message);
             }
           }
         );
  }
  else
  {
    modifyPrivilege();
  }
}
// }}}

/** search() 搜索 {{{
  *
  * return void
  */
function search()
{
  var tbody = $$('tbd'),
      name = document.getElementsByName('name')[0].value,
      user_info = document.getElementsByName('user_info')[0].value,
      user_group = document.getElementsByName('user_group')[0].value,
      privilege = document.getElementsByName('privilege'),
      action = {};
  for(var c = privilege.length; c--;)
  {
    var P = privilege[c];
    if(P.value != 'all')
    {
      action[P.getAttribute('action')] = parseBool(P.value);
    }
  }


  for(var C = tbody.rows.length; C--;)
  {
    var UserId = tbody.rows[C].getAttribute('UserId'),
        U = user[UserId],
        display = '';

    if(U.name.indexOf(name) == -1 || U.user_info.indexOf(user_info) == -1 || user_group != '' && U.group_id != user_group)
    {
      display = 'none';
    }
    else
    {
      var P = U.privilege;
      {
        for(var i in action)
        {
          if(!((action[i] && (U.group_id == ROOT_GID || parseBool(P[i]))) || (!action[i] && (U.group_id != ROOT_GID && !parseBool(P[i])))))
          {
            display = 'none';
            break;
          }
        }
      }
    }

    tbody.rows[C].style.display = display;
  }
}
// }}}

/** resizeTree() 设定左侧产品树的高度 {{{
  *
  * return bool
  */
function resizeTree()
{
  var left = $$('left'),
      right = $$('right');

  if(right.clientHeight > 450)
  {
    left.style.height = right.clientHeight + 'px';
  }
  else
  {
    left.style.height = '450px';
  }

  return true;
}
// }}}
