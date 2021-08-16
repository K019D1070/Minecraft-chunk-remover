# Minecraft chunk remover

## 概要
一部のチャンクを除いた,ワールドの削除(地形ファイルの初期化)を行います。

資源ワールドの自動再生成に使うことを想定しており,拠点だけ残すような使い方ができます。

サーバーを止めておかないと消せません。(消せるけどサーバーが反映してくれないと思う)
## 使い方

### 依存モジュールをインストール
```shell
  npm install
```
### coonfig/defaul.mjsを適宜編集
```json
{
  "serverPath": "String [サーバーの実行ファイルがある場所]",
  "worlds": [
    {
      "name": "String [ワールドの名前]",
      "keepChunk": [
        {
          "x": "Number [残したいチャンクのx座標]",
          "y": "Number [残したいチャンクのy座標]"
        },
        {
          "x": "Number [残したいチャンクのx座標]",
          "y": "Number [残したいチャンクのy座標]"
        }
      ]
    },
    {
      "name": "String [ワールドの名前]",
      "keepChunk": [
        {
          "x": "Number [残したいチャンクのx座標]",
          "y": "Number [残したいチャンクのy座標]"
        },
        {
          "x": "Number [残したいチャンクのx座標]",
          "y": "Number [残したいチャンクのy座標]"
        }
      ]
    }
  ]
}
```
### 削除実行
`npm run remove`

## 余談
Windowsでしか動作確認してないですけどOS依存なことはしてないはずなので`node ./src/index.mjs`とかで動くと思います。
