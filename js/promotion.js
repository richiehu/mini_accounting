var tree = new MzTreeView('tree'),
    data = (),
    node = (),
    date_completed = hour_computing == 23 ? date_computing : getDate('-1 day', dat    e_computing),
     date_end = getCookie('promotion_date_end') || $_GET.date_end || date_completed     || date_now,
 chart = null;
tree.setIconPath('/images/');
tree.setURL(location.pathname);
function makeTree(callback)
{
 var date_end = $$('date_end').value;

 if(typeof(node[date_end]) == 'undefined')
 {
 $.get(
     'getNode.php',
            {
          {
             'module' : $_GET.module,
             'date'   : date_end
          },
          function(response)
          {
             response = JSON.parse(getResText(response));
             if(response.status)
             {
                node[date_end] = response.data;
               var N = node[date_end];

               $$('currNodename').innerHTML = N[$_GET.node_id].name;

               var name = [];
               for(var i in N)
               {
                 if($_GET.module == 'classify' || N[i].fid !== null)
                 {
                   name.push(
                              {
                                'id'   : N[i].id,
                                'value' : N[i].name
                              }
                            );
                 }
               }
               $('#fid').autocomplete(
                                       {
                                         'source' : name,
                                         'select' : function(e, data)
                                                     {
                                                       location = modifyQueryString    ('node_id', data.item.id);
                                                     },
                                          'delay'  : 10
                                        }
                                      );
               makeTree();
              }
              else
              {
                alert('获取媒体树失败：' + response.message);
              }
            }
          );
   }
   else
   {
     var data = {};
    for(var i in node[date_end])
     {
       var D = node[date_end][i];
       if(typeof(D) == 'object')
       {
         data[D.parent_id + '_' + D.id] = 'text:' + D.name + ';data:module=' + $_GE    T.module + '&type=' + $_GET.type + '&node_id=' + D.id;
       }
     }

     tree.nodes = data;
     $$('treeDiv').innerHTML = tree.toString();

     setTimeout(
                 function()
                 {
                   tree.focus($_GET.node_id || 1, true);
                   tree.expand(tree.currentNode.id, true);
                 },
                 100
               )

     makeTable();
     makeChart();
   }
 }


}
