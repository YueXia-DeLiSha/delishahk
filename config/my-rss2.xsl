<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml">

<xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>

<xsl:template match="/">
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
    <title><xsl:value-of select="/rss/channel/title"/> · 订阅文章</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        background: #f7f9fc;
        color: #1e2a3a;
        line-height: 1.5;
        padding: 2rem 1rem;
      }
      .container {
        max-width: 1000px;
        margin: 0 auto;
      }
      .site-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 28px;
        padding: 2rem;
        margin-bottom: 2rem;
        color: white;
        box-shadow: 0 12px 24px -12px rgba(0,0,0,0.2);
      }
      .site-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .site-meta {
        display: flex;
        gap: 1.5rem;
        margin-top: 1rem;
        font-size: 0.9rem;
        flex-wrap: wrap;
      }
      .entry-list {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
      .entry-card {
        background: white;
        border-radius: 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        transition: all 0.2s ease;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .entry-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 24px -12px rgba(0,0,0,0.15);
      }
      /* 封面图区域：完整显示，不裁剪 */
      .entry-cover {
        width: 100%;
        background: #f0f2f5;
        border-top-left-radius: 24px;
        border-top-right-radius: 24px;
      }
      .entry-cover img {
        width: 100%;
        height: auto;
        display: block;
        border-top-left-radius: 24px;
        border-top-right-radius: 24px;
      }
      .entry-inner {
        padding: 1.8rem;
      }
      .entry-title {
        font-size: 1.6rem;
        margin: 0 0 0.5rem 0;
      }
      .entry-title a {
        color: #1e2a3a;
        text-decoration: none;
      }
      .entry-title a:hover {
        color: #667eea;
        text-decoration: underline;
      }
      .entry-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.85rem;
        color: #5c6b7a;
        margin-bottom: 1rem;
        border-bottom: 1px solid #eef2f6;
        padding-bottom: 0.8rem;
      }
      .entry-date::before { content: "📅 "; }
      .entry-cats::before { content: "📂 "; }
      .category {
        background: #eef2ff;
        padding: 0.2rem 0.6rem;
        border-radius: 20px;
        font-size: 0.75rem;
        color: #4f46e5;
      }
      .entry-summary {
        color: #2d3e50;
        margin: 0.8rem 0;
        line-height: 1.6;
      }
      .read-more {
        display: inline-block;
        margin-top: 0.8rem;
        background: #f0f2f5;
        padding: 0.4rem 1rem;
        border-radius: 30px;
        font-size: 0.85rem;
        color: #4f46e5;
        text-decoration: none;
      }
      .footer {
        margin-top: 3rem;
        text-align: center;
        font-size: 0.8rem;
        color: #6c7a89;
        border-top: 1px solid #e2e8f0;
        padding-top: 2rem;
      }
      @media (max-width: 640px) {
        .entry-inner { padding: 1.2rem; }
        .entry-title { font-size: 1.3rem; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="site-header">
        <div class="site-title"><xsl:value-of select="/rss/channel/title"/></div>
        <div class="site-meta">
          <span>📝 文章总数：<xsl:value-of select="count(/rss/channel/item)"/></span>
          <span>🕒 最后更新：<xsl:value-of select="/rss/channel/lastBuildDate"/></span>
          <span>📡 <a href="{/rss/channel/link}/rss2.xml" style="color:white;">订阅源</a></span>
        </div>
      </div>

      <div class="entry-list">
        <xsl:for-each select="/rss/channel/item">
          <div class="entry-card">
            <!-- 封面图：如有则完整显示 -->
            <xsl:if test="enclosure">
              <div class="entry-cover">
                <img>
                  <xsl:attribute name="src">
                    <xsl:value-of select="enclosure/@url"/>
                  </xsl:attribute>
                  <xsl:attribute name="alt">封面图：<xsl:value-of select="title"/></xsl:attribute>
                </img>
              </div>
            </xsl:if>
            <div class="entry-inner">
              <h2 class="entry-title">
                <a href="{link}"><xsl:value-of select="title"/></a>
              </h2>
              <div class="entry-meta">
                <span class="entry-date"><xsl:value-of select="pubDate"/></span>
                <xsl:if test="category">
                  <span class="entry-cats">
                    <xsl:for-each select="category">
                      <span class="category"><xsl:value-of select="."/></span>
                    </xsl:for-each>
                  </span>
                </xsl:if>
              </div>
              <div class="entry-summary">
                <xsl:choose>
                  <xsl:when test="description">
                    <xsl:value-of select="description" disable-output-escaping="yes"/>
                  </xsl:when>
                  <xsl:otherwise>暂无摘要。</xsl:otherwise>
                </xsl:choose>
              </div>
              <a class="read-more" href="{link}">阅读全文 →</a>
            </div>
          </div>
        </xsl:for-each>
      </div>
      <div class="footer">
        <p>© 挽着红月缓缓走 · <a href="/">返回博客首页</a></p>
      </div>
    </div>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet>