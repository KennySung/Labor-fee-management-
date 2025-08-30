document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-btn');
    const printPdfBtn = document.getElementById('print-pdf-btn');
    const previewSection = document.getElementById('preview-section');

    // 新增報酬單功能
    addBtn.addEventListener('click', (e) => {
        // 取得表單輸入的值
        const name = document.getElementById('name').value;
        const idNumber = document.getElementById('id-number').value;
        const amount = document.getElementById('amount').value;
        const date = document.getElementById('date').value;

        // 檢查所有欄位是否都已填寫
        if (!name || !idNumber || !amount || !date) {
            alert('請填寫所有欄位！');
            return;
        }

        // 計算勞務報酬扣繳稅額 (稅率為 6%)
        const taxRate = 0.06;
        const taxAmount = (parseFloat(amount) * taxRate);
        const netAmount = (parseFloat(amount) - taxAmount);

        // 動態生成 HTML 報酬單內容
        const payStubHtml = `
            <div class="pay-stub">
                <h2>勞務報酬單</h2>
                <div class="detail-row">
                    <strong>受領人姓名:</strong>
                    <span>${name}</span>
                </div>
                <div class="detail-row">
                    <strong>身分證字號:</strong>
                    <span>${idNumber}</span>
                </div>
                <div class="detail-row">
                    <strong>報酬金額:</strong>
                    <span>$${parseFloat(amount).toLocaleString('zh-TW', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="detail-row">
                    <strong>扣繳稅額 (6%):</strong>
                    <span>$${taxAmount.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="detail-row">
                    <strong>實領金額:</strong>
                    <span>$${netAmount.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="detail-row">
                    <strong>發放日期:</strong>
                    <span>${date}</span>
                </div>
            </div>
        `;

        // 將生成的 HTML 內容插入到預覽區域的最前面
        const firstChild = previewSection.firstChild;
        if (firstChild && firstChild.tagName === 'P') {
            previewSection.innerHTML = payStubHtml;
        } else {
            previewSection.insertAdjacentHTML('afterbegin', payStubHtml);
        }

        // 清空表單欄位以供下次使用
        document.getElementById('name').value = '';
        document.getElementById('id-number').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('date').value = '';
    });

    // 轉存 PDF 功能
    printPdfBtn.addEventListener('click', () => {
        if (previewSection.innerHTML.trim().includes('已新增的勞務報酬單將會顯示在這裡')) {
            alert('請先新增一張報酬單！');
            return;
        }

        window.print();
    });
});
