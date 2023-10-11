import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'; // 自动导入
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite'; // icon相关
import IconsResolver from 'unplugin-icons/resolver'; // icon相关
import ElementPlus from 'unplugin-element-plus/vite';
// import postcsspxtoviewport8plugin from 'postcss-px-to-viewport-8-plugin';

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({
      // options
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          prefix: false,
          enabledCollections: ['ep'] // 这是可选的，默认启用 Iconify 支持的所有集合['mdi']
        }),
      ],
    }),
    Icons({
      autoInstall: true,
      compiler: "vue3",
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  // 服务配置
  server: {
    port: 8807,
    host: '0.0.0.0',
  },
  // css: {
  //   postcss: {
  //     plugins: [
  //       postcsspxtoviewport8plugin({
  //         unitToConvert: 'px',
  //         viewportWidth: 1920,
  //         unitPrecision: 5, // 单位转换后保留的精度
  //         propList: ['*'], // 能转化为vw的属性列表
  //         viewportUnit: 'vw', // 希望使用的视口单位
  //         fontViewportUnit: 'vw', // 字体使用的视口单位
  //         selectorBlackList: [], // 需要忽略的CSS选择器
  //         minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
  //         mediaQuery: true, // 媒体查询里的单位是否需要转换单位
  //         replace: true, //  是否直接更换属性值，而不添加备用属性
  //         exclude: [/node_modules\/element-plus/], // 忽略某些文件夹下的文件或特定文件
  //       }) as any,
  //     ]
  //   }
  // }
})
