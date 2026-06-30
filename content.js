// 从插件缓存读取保存的文件
async function getSavedFile() {
  return new Promise(resolve => {
    chrome.storage.local.get('flowUploadFile', (res) => {
      if (!res.flowUploadFile) return resolve(null);
      const { name, type, data } = res.flowUploadFile;
      const blob = new Blob([new Uint8Array(data)], { type });
      resolve(new File([blob], name, { type }));
    });
  });
}

// 自动上传主逻辑
async function autoUpload() {
  const file = await getSavedFile();
  if (!file) {
    alert('未保存文件，请先在插件里选择并保存！');
    return;
  }

  // 1. 找到Flow页面的上传输入框
  const fileInput = document.querySelector('input[type="file"]');
  if (!fileInput) {
    alert('请先打开Flow的上传弹窗，再点击自动上传！');
    return;
  }

  // 2. 自动填充文件到输入框
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;
  fileInput.dispatchEvent(new Event('change', { bubbles: true }));

  // 3. 自动点击上传确认按钮（延迟1秒，等页面加载）
  setTimeout(() => {
    const submitBtn = document.querySelector(
      'button[type="submit"], [aria-label*="上传"], [aria-label*="Upload"]'
    );
    if (submitBtn) submitBtn.click();
    console.log('自动上传完成！');
  }, 1000);
}

// 监听插件弹窗的上传指令
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'startAutoUpload') autoUpload();
});

// 可选：页面加载自动上传（取消注释即可）
// window.addEventListener('load', () => {
//   setTimeout(autoUpload, 2000);
// });
