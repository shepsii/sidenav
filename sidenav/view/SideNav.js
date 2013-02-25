Ext.define('SideNav.view.SideNav', {
  extend: 'Ext.Container',
  
  xtype: 'sidenav',

  config: {
    cls: 'sidenav',
    items: [
      {
        xtype: 'container',
        docked: 'top',
        left: 0,
        height: '100%',
        layout: 'card',
        itemId: 'left',
        cls: 'left',
        zIndex: 1,
        html: 'This is your left hand container. Normally for navigation'
      },
      {
        xtype: 'container',
        docked: 'top',
        right: 0,
        height: '100%',
        layout: 'card',
        cls: 'right',
        itemId: 'right',
        zIndex: 2,
        html: 'This is your right hand container. Normally for search'
      },
      {
        xtype: 'container',
        zIndex: 3,
        itemId: 'main',
        cls: 'main',
        layout: {
          type: 'card'
        },
        scrollable: null,
        draggable: 'horizontal',
        items: [
          {
            xtype: 'toolbar',
            itemId: 'topToolbar',
            cls: 'top-toolbar',
            docked: 'top',
            title: 'Page Title',
            items: [
            {
              xtype: 'button',
              docked: 'right',
              itemId: 'showRightBtn',
              margin: '.3em .3em .3em 0',
              ui: 'action-round',
              iconCls: 'list',
              iconMask: true,
              text: ''
            },
            {
              xtype: 'button',
              docked: 'left',
              itemId: 'showLeftBtn',
              margin: '.3em 0 .3em .3em',
              ui: 'action-round',
              iconCls: 'list',
              iconMask: true,
              text: ''
            }
            ]
          },
          {
            xtype: 'container',
            html: 'currently selected page'
          }
        ]
      }
    ]
  }

});