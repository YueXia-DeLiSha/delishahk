(() => {
  const startTime = new Date('2023-03-28 00:00:00').getTime();
  
  // 要查找的目标文字（根据你的配置文件 footer.links 中的内容修改）
  const TARGET_TEXT = '可以分享文章或者赞赏支持一下哦';
  
  // 创建计时器容器（块级元素，独占一行）
  function createRuntimeContainer() {
    const div = document.createElement('div');
    div.id = 'site-runtime-container';
    div.style.marginTop = '8px';
    div.style.fontSize = '14px';
    div.style.opacity = '0.8';
    div.style.textAlign = 'center'; // 手机居中，桌面可自行调整
    div.innerHTML = '<span id="site-runtime">加载中...</span>';
    return div;
  }
  
  // 查找目标元素并插入计时器容器
  function insertRuntimeContainer() {
    // 避免重复插入
    if (document.getElementById('site-runtime-container')) return;
    
    // 方法1：遍历所有链接，找到包含目标文字的 <a> 标签
    const allLinks = document.querySelectorAll('footer a, footer span, footer p, footer div');
    let targetElement = null;
    
    for (let el of allLinks) {
      if (el.textContent && el.textContent.includes(TARGET_TEXT)) {
        targetElement = el;
        break;
      }
    }
    
    // 方法2：如果没找到，降级使用页脚通用容器
    if (!targetElement) {
      console.warn(`未找到文字"${TARGET_TEXT}"，计时器将插入页脚底部`);
      const footer = document.querySelector('footer');
      if (footer) {
        targetElement = footer.lastElementChild;
      }
    }
    
    if (!targetElement) return;
    
    const container = createRuntimeContainer();
    // 插入到目标元素之后（作为兄弟元素）
    targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
  }
  
  // 更新时间显示
  function updateRuntime() {
    const el = document.getElementById('site-runtime');
    if (!el) return;
    
    const diff = Date.now() - startTime;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, '0');
    
    el.textContent = `本站已运行 ${days}天 ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  
  // 初始化
  function init() {
    insertRuntimeContainer();
    updateRuntime();
    if (window._runtimeInterval) clearInterval(window._runtimeInterval);
    window._runtimeInterval = setInterval(updateRuntime, 1000);
  }
  
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 100);
  }
})();