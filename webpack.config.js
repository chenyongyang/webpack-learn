const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './js/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
        publicPath: '/dist/' // 静态资源只认这个publicPath
        /**
         * 总结：
         * 当我们手动创建index.html，并手动指定css 或js 静态文件路径时
         * 保证path和publicPath的设置一致
         * 
         * 当我们使用html-webpack-plugin时，分两种情况：
         * 在dev模式中，path和publicPath不需要保持一致，devServer会自动将所有文件的路径都统一好；
         * 在pro模式中，保证path和publicPath一致
         * 
         * 当使用了html-webpack-plugin，它会自动将publicPath当做所有资源的URL前缀
         * 因此production模式，就要保持和输出路径一致
         * development模式，因为devServer所认定的打包路径就是publicPath，因此和输出路径无关
         */
    },
    module: {
        rules:[
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[hash:8].[ext]'
                }
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            // title: 'webpack-learn',
            // filename: 'webpack-learn.html',
            // template: 'template/index.html'
        })
    ],
    devServer: {
        // Content not from webpack is served from
        // 这里的路径就是index.html 或者assets一些静态资源
        // 假如把contentBase设置成根目录，就相当于让devServer去根目录查找，也就是电脑上的硬盘了
        // 此时访问localhost:8080
        // 会出现这个错误：Error: EPERM: operation not permitted, stat 'E:\System Volume Information'
        // 这个也就是devServer在找index.html时，到E盘上找，自然权限不足，所以报错

        // 再设置成dist文件，想法是：因为webpack打包，output.path是dist文件夹下
        // 此时访问localhost:8080，又报错404，找到的原因是：当前目录下并没有dist文件夹，自然就404

        // 但是无论这个设置成什么，访问localhost:8080/publicPath都可以正常访问
        // 原因是：localhost:8080/publicPath 才是devServer打包后的根目录
        // 而contentBase，影响到的是当访问localhost:8080时，展示的是在contentBase目录下的内容
        contentBase: './',
        // webpack output is served from
        // devServer默认打包到根目录下，要修改打包路径，就用publicPath
        publicPath: '/dist/'
        // 这个值改成任何路径，都可以在webpack-dev-server都可以看到打包后的文件
        // 点击每个文件，地址都是localhost:8080/aaa/xxx.jpg
    }
}

/**
 * 它contentBase设置成./，它应该也会将呈现资源管理器的页面，因为没有idnex.html
 * publicPath都设置成/react-gm/build/，
 * 那么每个文件的访问路径就是：localhost:xxx/react-gm/build/xxx文件
 * 
 */