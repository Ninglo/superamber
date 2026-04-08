# 腾讯 OCR 配置

## 1. 准备密钥
在腾讯云控制台创建 API 密钥，得到：
- `SecretId`
- `SecretKey`

## 2. 启动本地代理（必须）
在 `Super Amber` 项目根目录执行：

```bash
cd "/path/to/superamber"
export TENCENT_SECRET_ID="你的SecretId"
export TENCENT_SECRET_KEY="你的SecretKey"
export TENCENT_REGION="ap-guangzhou"
npm run ocr:proxy
```

默认会监听：`http://127.0.0.1:8787`

## 3. 启动前端
另开一个终端：

```bash
cd "/path/to/superamber"
npm run dev
```

## 4. 页面内设置
打开“图片识别导入”弹窗后填写：
- 识别引擎：`腾讯优先（失败自动回退本地）`
- 识别引擎：`腾讯优先（默认不回退）`
- 腾讯代理地址：`http://127.0.0.1:8787`
- 腾讯地域：`ap-guangzhou`
- 腾讯接口：`自动（优先最新AI接口）`
  - 当前自动策略：`ExtractDocMulti -> GeneralAccurateOCR -> GeneralBasicOCR`
- 腾讯失败回退本地OCR：默认关闭（建议先关闭，便于定位云端问题）

## 5. 自检
浏览器访问：
- `http://127.0.0.1:8787/health`

返回 `{ "ok": true }` 代表代理已就绪。
