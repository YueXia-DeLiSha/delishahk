// live2d-touch.js - 为德丽莎添加触摸反馈
(function() {
  // 等待 L2Dwidget 加载
  function initTouchFeedback() {
    if (!window.L2Dwidget) {
      setTimeout(initTouchFeedback, 200);
      return;
    }

    // 显示自定义对话框
    function showCustomMessage(text) {
      // 创建一个浮层来显示消息
      const msg = document.createElement('div');
      msg.style.cssText = `
        position: fixed; z-index: 99999; background: rgba(255,255,255,0.9);
        color: #333; padding: 8px 15px; border-radius: 20px; border: 2px solid #ffc848;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1); font-size: 14px; max-width: 200px;
        backdrop-filter: blur(5px); transition: opacity 0.3s; pointer-events: none;
      `;
      document.body.appendChild(msg);
      
      // 定位到模型附近
      const canvas = document.querySelector('#live2d canvas, #live2d-widget canvas, canvas');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        msg.style.left = (rect.left - 10) + 'px';
        msg.style.top = (rect.top - 50) + 'px';
      } else {
        msg.style.left = '50%'; msg.style.top = '20%'; msg.style.transform = 'translateX(-50%)';
      }
      
      msg.textContent = text;
      setTimeout(() => { msg.style.opacity = '0'; setTimeout(() => msg.remove(), 300); }, 2000);
    }

    // 定义点击不同部位时的反馈语（你可以自由修改这些台词）
    const touchMessages = {
      tap_body: ['呀，舰长，你碰到我了！', '嘿嘿，有什么事吗？', 'TeriTeri~'],
      tap_face: ['呜…不要摸我的脸啦！', '学园长的脸是能随便摸的吗！'],
      tap_head: ['嘿嘿，舰长！', '要摸摸头吗？'],
      tap_belly: ['呀！那里不行！'],
      tap_leg: ['腿有什么好碰的啦！']
    };

    // 监听点击事件
    window.L2Dwidget.on('*', (eventName) => {
      // 只处理tap事件
      if (!eventName.startsWith('tap')) return;
      
      const messages = touchMessages[eventName];
      if (messages && messages.length) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        showCustomMessage(randomMsg);
      }
    });
    
    console.log('✅ 德丽莎触摸反馈已启用！');
  }

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTouchFeedback);
  } else {
    initTouchFeedback();
  }
})();