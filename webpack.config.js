var path = require("path");

//加入插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');   //產生內含有css的js檔案轉成css檔
const SpritesmithPlugin = require('webpack-spritesmith');  //CSS Sprite

module.exports ={
	mode:'development',
	entry:'./src/index.js',   //設定做為入口的檔案
	output:{
		path: path.resolve(__dirname ,'dist'), //儲存打包完成檔案的位置
		filename:'bundle.js'  //儲存打包完成檔案的名稱
	},
	module: {
		rules:[
			{
				//test檔案類型打包
				//打包sass|scss|css三種類型
				test: /\.(sa|sc|c)ss$/, // /\.(sass|scss|css)$/,       
				use:
				[
					//類型打包的內部順位要注意
					{
                        loader: MiniCssExtractPlugin.loader  //順位3 引入MiniCssExtractPlugin 這個loader
                    },
					{
						loader: 'css-loader',    //順位2 css-loader
						options: {
							modules: false,
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',   //順位1 sass-loader
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				//打包圖片
                test: /\.(jpe?g|png|gif|svg)$/,
                use: 
				[
                    {
                        loader: 'url-loader',
                        options: { limit: 400 }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: { byPassOnDebug: true }
                    }
                ]
            },
		]
	},    
	//使用plugin
	plugins: [
        new MiniCssExtractPlugin({ //第一個物件
            filename: 'style.scss',
        }),
		new SpritesmithPlugin({  //第二個物件
            src: {
                cwd: path.resolve(__dirname, 'src/sprite'),  //准备合并成sprit的图片存放文件夹
                //glob: '**/*.png'  
                glob: '**/*.{jpg,png}'   // ** 代表所有子目錄
            },
            target: {
                image: path.resolve(__dirname, 'src/images/sprite.png'),  // sprite图片的保存路径
                css: path.resolve(__dirname, 'src/styles/_sprites.scss')  // 生成的sass保存的路径
            },

            apiOptions: {
                cssImageRef: "../images/sprite.png" //css會根据该指引找到sprite图片
            }
        }),
		
	],
	//npm run watch 查看網站的呈現
	devServer:{
		open: true,
		contentBase: path.join(__dirname, '.'),
		compress: true,
		port: 9000
	}
};
