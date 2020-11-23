export default [
  // 基于 src/page 路径
  {
    path: '/',
    component: './index',
    routes: [
      { path: '/balloons', component: '@/pages/balloons/index' },
      { path: '/demo', component: '@/pages/demo/index' },
      { path: '/sameKey', component: '@/pages/sameKey/index' },
      { path: '/blocks', component: '@/pages/blocks/index' },
      {
        path: '/radiogroup',
        component: '@/pages/radioGroup/index',
      },
      { exact: true, path: '/', redirect: '/balloons' },
    ],
  },
  { exact: true, path: '/', redirect: '/' },
];
