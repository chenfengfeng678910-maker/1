// 存储选中的文件
let selectedFile = null;

// 1. 监听文件选择
document.getElementById('fileSelect').addEventListener('change', (e) => {
  selectedFile = e.target.files[0];
  if (selectedFile) {
    console.log('选中文件：', selectedFile.name);
  }
});

// 2. 保存文件到插件缓存
document.getElementById('saveBtn').addEventListener('click', () => {
  if (!selectedFile) {
    alert('请先选择文件！');
    return;
  }
  // 把文件转成二进制存储
  const reader = new FileReader();
  reader.readAsArrayBuffer(selectedFile);
  reader.onload = () => {
    chrome.storage.local.set({
      flowUploadFile: {
        name: selectedFile.name,
        type: selectedFile.type,
        data: Array.from(new Uint8Array(reader.result))
      }
    }, () => {
      alert('文件保存成功！');
    });
  };
});

// 3. 发送指令给页面，执行自动上传
document.getElementById('startBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: 'startAutoUpload' });
  window.close(); // 上传后关闭弹窗
});
