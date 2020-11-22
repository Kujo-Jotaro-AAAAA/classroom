export default [
  // 基于 src/page 路径
  {
    path: '/',
    component: './index',
    routes: [
      { path: '/balloons', component: '@/pages/balloons/index' },
      { path: '/part', component: '@/pages/part/index' },
      { path: '/demo', component: '@/pages/demo/index' },
      { exact: true, path: '/', redirect: '/balloons' },
    ]
  },
  { exact: true, path: '/', redirect: '/' },
]
