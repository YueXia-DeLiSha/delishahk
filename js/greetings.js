// 德丽莎的时辰问候 - 手动创建对话框版 (完全兼容 hexo-helper-live2d)
(function() {
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 9) return '✨ 早上好呀舰长，今天的世界TeriTeri也准时报道啦！';
    if (hour >= 9 && hour < 12) return '🌞 上午好舰长！要记得补充能量哦……比如，来一杯美味的苦瓜汁？';
    if (hour >= 12 && hour < 14) return '🍲 舰长，到点吃饭啦！';
    if (hour >= 14 && hour < 18) return '☕️ 下午好呀舰长，有点困了吗？不许偷懒哦，学园长在看着你呢！';
    if (hour >= 18 && hour < 22) return '🌙 晚上好舰长，忙碌了一天辛苦啦。无论何时，我都在你身边。';
    if (hour >= 22 || hour < 2) return '😴 舰长，已经很晚了哦。TeriTeri要你早点休息啦！';
    return '🌃 凌晨好呀舰长……这么晚还没睡，是在等我吗？';
  }

  // 创建对话框
  function createDialogBox() {
    const box = document.createElement('div');
    box.id = 'delisha-custom-dialog';
    box.style.cssText = `
      position: fixed;
      z-index: 99999;
      background: rgba(255, 255, 255, 0.9);
      color: #333;
      padding: 10px 15px;
      border-radius: 20px;
      border: 2px solid #ffc848;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      font-size: 14px;
      max-width: 200px;
      word-break: break-word;
      backdrop-filter: blur(5px);
      transition: opacity 0.5s;
      pointer-events: none;
      opacity: 0;
    `;
    document.body.appendChild(box);
    return box;
  }

  // 定位对话框到模型旁边
  function positionDialog(box) {
    // 尝试获取 Live2D 模型的 canvas 元素
    const canvas = document.querySelector('#live2d canvas, #live2d-widget canvas, canvas');
    if (!canvas) return false;

    const rect = canvas.getBoundingClientRect();
    // 将对话框放在 canvas 的左上角偏上位置
    box.style.left = (rect.left - 10) + 'px';
    box.style.top = (rect.top - 50) + 'px';
    return true;
  }

  function showGreeting() {
    // 检查本次会话是否已显示过问候
    const hasGreeted = sessionStorage.getItem('delisha_greeted_manual');
    if (hasGreeted) return;

    // 创建对话框（如果不存在）
    let dialogBox = document.getElementById('delisha-custom-dialog');
    if (!dialogBox) {
      dialogBox = createDialogBox();
    }

    // 等待模型加载并定位
    let retryCount = 0;
    const maxRetries = 20;
    const retryInterval = setInterval(() => {
      retryCount++;
      
      if (positionDialog(dialogBox)) {
        clearInterval(retryInterval);
        // 设置问候语
        dialogBox.innerHTML = getGreeting();
        dialogBox.style.opacity = '1';
        
        // 记录已问候
        sessionStorage.setItem('delisha_greeted_manual', 'true');
        
        // 5秒后淡出消失
        setTimeout(() => {
          dialogBox.style.opacity = '0';
          // 完全消失后移除元素，避免干扰
          setTimeout(() => {
            if (dialogBox.parentNode) {
              dialogBox.parentNode.removeChild(dialogBox);
            }
          }, 500);
        }, 4000);
      } else if (retryCount >= maxRetries) {
        clearInterval(retryInterval);
        // 如果始终找不到 canvas，降级为屏幕中央显示
        dialogBox.style.left = '50%';
        dialogBox.style.top = '20%';
        dialogBox.style.transform = 'translateX(-50%)';
        dialogBox.innerHTML = getGreeting();
        dialogBox.style.opacity = '1';
        sessionStorage.setItem('delisha_greeted_manual', 'true');
        setTimeout(() => {
          dialogBox.style.opacity = '0';
          setTimeout(() => {
            if (dialogBox.parentNode) {
              dialogBox.parentNode.removeChild(dialogBox);
            }
          }, 500);
        }, 4000);
      }
    }, 300);
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showGreeting);
  } else {
    showGreeting();
  }

  // 如果页面通过 Pjax 加载，重置问候状态
  document.addEventListener('pjax:complete', function() {
    sessionStorage.removeItem('delisha_greeted_manual');
    showGreeting();
  });
})();