export default [
  // 基于 src/page 路径
  {
    path: '/',
    component: './index',
    routes: [
      // 气球
      { path: '/balloons', component: '@/pages/balloons/index' },
      { path: '/balls', component: '@/pages/balls/index' },
      // { path: '/demo', component: '@/pages/demo/index' },
      // 钥匙页
      { path: '/sameKey', component: '@/pages/sameKey/index' },
      { path: '/multiplechoice', component: '@/pages/multipleChoice/index' },
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
      {
        path: '/radiosimple/shapeTwo',
        component: '@/pages/radioSimple/shapeTwo/index',
      },
      { path: '/bearandcar', component: '@/pages/bearAndCar/index' },
      // --== 游戏 ==--
      { path: '/game/findpark', component: '@/pages/game/findPark/index' },
      // 送货
      { path: '/delivery', component: '@/pages/delivery/index' },
      // 调用原生页面
      { path: '/bridge', component: '@/pages/bridge/index' },

      { exact: true, path: '/', redirect: '/balloons' },
    ],
  },
  { exact: true, path: '/', redirect: '/balloons' },
];
