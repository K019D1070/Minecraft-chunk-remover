# Minecraft regenerator

## 概要
指定された一部のチャンクを除いて,指定されたチャンクがある.mcaファイルからチャンクを削除します。

資源ワールドの自動再生成に使うことを想定しています。

## 使い方
### coonfig/defaul.mjsを適宜編集
keepChunkに残したいチャンクのx,z座標を書いてpathでregionディレクトリを指定する。
### 削除実行
`npm run remove`



Windowsでしか動作確認してないですけどOS依存なことはしてないはずなので`node ./src/index.mjs`とかで動くと思います。

## 余談