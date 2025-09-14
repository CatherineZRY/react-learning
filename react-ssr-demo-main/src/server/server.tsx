import express from 'express';
import path from 'path';
import { ssrRender } from './utils';

const clientDistDir = path.join(__dirname, '..\\dist\\client');

const app = express();

app.use(express.static(clientDistDir));

app.get('*', (req: express.Request, res: express.Response) => {
  try {
    console.log('Request path:', req.path);
    const finalHtml = ssrRender(req);  // 这里可能抛出错误
    res.send(finalHtml);
  } catch (error) {
    console.error('SSR Error:', error);
    // 降级到客户端渲染
    res.sendFile(path.join(clientDistDir, 'index.html'));
  }
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log(`http://127.0.0.1:${PORT}`);
});
