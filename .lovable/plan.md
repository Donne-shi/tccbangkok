## 功能规划：主日学内容管理系统

### 1. 启用 Lovable Cloud（后端基础设施）
- 数据库：存储每周主日学内容（标题、日期、摘要、诗歌链接、视频链接等）
- 文件存储：上传PPT文件
- Edge Function：验证管理密码

### 2. 数据库设计
创建 `sunday_school_content` 表：
- `id` - 主键
- `category` - 分类（youth / children）
- `title` - 课程标题
- `date` - 日期
- `year` - 年份（用于分组）
- `summary` - 文字摘要
- `ppt_url` - PPT文件链接（存储在Storage中）
- `song_links` - 诗歌链接（JSON数组）
- `video_links` - 视频链接（JSON数组）
- `created_at` - 创建时间

创建 Storage bucket `sunday-school-files` 用于存储PPT文件。

### 3. 前台展示页面
- 在"教会服侍"页面或新建独立页面 `/sunday-school`
- 两个Tab：青少年主日学 / 儿童主日学
- 按年份分组展示，最新的在最上面
- 每条内容显示：标题、日期、摘要、PPT下载、诗歌和视频链接

### 4. 管理后台（密码保护）
- 路由 `/admin`，输入预设密码即可进入
- 密码存储在环境变量中（通过 Secrets 管理）
- 后台功能：
  - 查看所有已上传的内容列表
  - 添加新内容（表单：标题、日期、分类、摘要、上传PPT、添加链接）
  - 编辑/删除已有内容
- 简洁的管理界面，操作直观

### 5. 导航更新
- 在网站导航中添加"主日学"入口
- 在管理后台不显示在公开导航中（通过直接访问 /admin 进入）
