export default [
  // 基于 src/page 路径
  {
    path: '/',
    component: './index',
    routes: [
      // 气球
      { path: '/balloons', component: '@/pages/balloons/index' },
      // { path: '/demo', component: '@/pages/demo/index' },
      // 钥匙页
      { path: '/sameKey', component: '@/pages/sameKey/index' },
      // 方块移动页
      { path: '/blocks', component: '@/pages/blocks/index' },
      {
        path: '/radiogroup',
        component: '@/pages/radioGroup/index',
      },
      {
        path: '/radiosimple',
        component: '@/pages/radioSimple/index',
      },
      // 送货
      { path: '/delivery', component: '@/pages/delivery/index' },
      { exact: true, path: '/', redirect: '/balloons' },
    ],
  },
  { exact: true, path: '/', redirect: '/balloons' },
];
