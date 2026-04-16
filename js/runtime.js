(() => {
  const startTime = new Date('2023-03-28 00:00:00').getTime();
  
  // 尝试多种可能的页脚容器选择器
  function findFooterContainer() {
    const selectors = [
      '.footer-links',           // 原主题可能使用
      '.footer .copyright',      // 常见版权信息位置
      '.site-footer',            // 部分主题的页脚类
      'footer .footer-inner',    // 内层容器
      'footer',                  // 最终降级使用整个footer
    ];
    
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  
  // 创建或获取显示元素
  function getRuntimeElement() {
    let el = document.getElementById('site-runtime');
    if (el) return el;
    
    const container = findFooterContainer();
    if (!container) {
      console.warn('未找到页脚容器，计时器无法插入');
      return null;
    }
    
    el = document.createElement('span');
    el.id = 'site-runtime';
    el.style.marginLeft = '8px';
    el.style.whiteSpace = 'nowrap';
    
    // 尝试添加到版权信息后，否则追加到容器末尾
    const copyright = container.querySelector('.copyright, .site-info, .footer-copyright');
    if (copyright) {
      copyright.appendChild(el);
    } else {
      container.appendChild(el);
    }
    
    return el;
  }
  
  function updateRuntime() {
    const el = getRuntimeElement();
    if (!el) return;
    
    const diff = Date.now() - startTime;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, '0');
    
    el.innerHTML = ` | 本站已运行 ${days}天 ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  
  // 初始化（支持Pjax）
  function init() {
    updateRuntime();
    // 避免重复创建计时器
    if (window._runtimeInterval) clearInterval(window._runtimeInterval);
    window._runtimeInterval = setInterval(updateRuntime, 1000);
  }
  
  // 监听页面加载和Pjax完成事件
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
  // 如果页面已加载（脚本在DOM之后执行），立即执行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 100);
  }
})();