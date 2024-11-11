function AlarmToResetCode(ulUK, uiLmtD, ucACB) {
    // ��֤����
    let j = 0;
    const ucTempUCB = new Array(10);
    const ulTempB = new Array(6);
    
    // ���Ʋ�ת��״̬��
    for (let i = 0; i < 10; i++) {
        ucTempUCB[i] = ucACB[i].charCodeAt(0);
        // Сдת��д
        if (ucTempUCB[i] >= 97 && ucTempUCB[i] <= 122) {
            ucTempUCB[i] -= 32;
        }
        if (ucTempUCB[i] >= 65 && ucTempUCB[i] <= 90) {
            j++;
        }
    }

    // ��֤��������
    if (j < 10 || ulUK < 100000 || ulUK > 999999) {
        return "0000000000";
    }

    // ʹ�� BigInt �������������
    ulUK = BigInt(ulUK);
    uiLmtD = BigInt(uiLmtD);

    // ��һ���ּ���
    for (let i = 0; i < 6; i++) {
        ulTempB[i] = BigInt(ucTempUCB[i * 2 + (i > 4 ? -1 : 0)] - 65);
    }

    let ulTempUKH = ulTempB[5];
    for (let i = 4; i >= 0; i--) {
        ulTempUKH = ulTempUKH * 26n + ulTempB[i];
    }
    
    ulTempUKH = ulTempUKH ^ 0x5555n;
    ulTempUKH = ulTempUKH / 3n;

    // �ڶ����ּ���
    for (let i = 0; i < 4; i++) {
        ulTempB[i] = BigInt(ucTempUCB[i * 2 + 1] - 65);
    }

    let ulTempSNH = ulTempB[3];
    for (let i = 2; i >= 0; i--) {
        ulTempSNH = ulTempSNH * 26n + ulTempB[i];
    }
    
    ulTempSNH = ulTempSNH ^ 0xAAAAn;
    ulTempSNH = ulTempSNH >> 2n;  // ����4

    let uiTempWH = ulTempSNH % 10n;
    uiTempWH = uiTempWH * 100n;
    uiTempWH = uiTempWH + (ulTempUKH / 1000000n);

    let ulTemp3 = uiTempWH;
    ulTempB[0] = ulTemp3 % 10n;
    ulTemp3 = ulTemp3 / 10n;
    ulTempB[1] = ulTemp3 % 10n;
    ulTemp3 = ulTemp3 / 10n;
    ulTempB[2] = ulTemp3 % 10n;

    uiTempWH = (ulTempB[2] * 100n) + (ulTempB[0] * 10n) + ulTempB[1];

    // ���ռ���
    ulTemp3 = ulUK % 1000000n;
    ulTempUKH = ulTemp3;
    ulTemp3 = uiTempWH % 1000n;
    let ulTemp4 = ulTemp3 % 100n;
    ulTempUKH = ulTempUKH + (ulTemp4 * 1000000n);
    ulTempUKH = ulTempUKH * 2n;

    ulTemp4 = ulTemp3 / 100n;
    ulTemp3 = uiLmtD;
    ulTempSNH = (ulTemp3 * 10n) + ulTemp4;
    ulTempSNH = ulTempSNH * 3n;

    ulTempUKH = ulTempUKH ^ 0x3333n;
    ulTempSNH = ulTempSNH ^ 0xCCCCn;

    // ת��Ϊ��ĸ
    const result = new Array(10);
    
    // ���� ulTempUKH
    for(let i = 0; i < 6; i++) {
        ulTempB[i] = Number(ulTempUKH % 26n);
        ulTempUKH = ulTempUKH / 26n;
    }
    
    result[0] = String.fromCharCode(ulTempB[0] + 65);
    result[2] = String.fromCharCode(ulTempB[1] + 65);
    result[4] = String.fromCharCode(ulTempB[2] + 65);
    result[6] = String.fromCharCode(ulTempB[3] + 65);
    result[8] = String.fromCharCode(ulTempB[4] + 65);
    result[9] = String.fromCharCode(ulTempB[5] + 65);

    // ���� ulTempSNH
    for(let i = 0; i < 4; i++) {
        ulTempB[i] = Number(ulTempSNH % 26n);
        ulTempSNH = ulTempSNH / 26n;
    }
    
    result[1] = String.fromCharCode(ulTempB[0] + 65);
    result[3] = String.fromCharCode(ulTempB[1] + 65);
    result[5] = String.fromCharCode(ulTempB[2] + 65);
    result[7] = String.fromCharCode(ulTempB[3] + 65);

    return result.join('');
}

document.getElementById('calculateBtn').addEventListener('click', function() {
    // ��ȡ����ֵ
    const password = parseInt(document.getElementById('devicePassword').value);
    const statusCode = document.getElementById('statusCode').value;
    const days = parseInt(document.getElementById('days').value);

    // ������֤
    if (isNaN(password) || password < 100000 || password > 999999) {
        alert('�豸���������6λ����');
        return;
    }

    if (statusCode.length !== 10) {
        alert('״̬�������10λ�ַ�');
        return;
    }

    if (isNaN(days) || days < 0 || days > 9999) {
        alert('����������0-9999֮��');
        return;
    }

    // �����㷨���㸴λ��
    const resetCode = AlarmToResetCode(password, days, statusCode);
    
    // ��ʾ���
    document.getElementById('resetCode').value = resetCode;
});

// �����������
document.getElementById('devicePassword').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value.length > 6) {
        this.value = this.value.slice(0, 6);
    }
});

document.getElementById('statusCode').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});

document.getElementById('days').addEventListener('input', function(e) {
    if (this.value > 9999) {
        this.value = 9999;
    }
    if (this.value < 0) {
        this.value = 0;
    }
});

// ���ƹ���
document.getElementById('copyBtn').addEventListener('click', function() {
    const resetCode = document.getElementById('resetCode');
    if (resetCode.value) {
        navigator.clipboard.writeText(resetCode.value)
            .then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '&#x5DF2;&#x590D;&#x5236;&#xFF01;';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 1500);
            })
            .catch(err => {
                alert('&#x590D;&#x5236;&#x5931;&#x8D25;&#xFF0C;&#x8BF7;&#x624B;&#x52A8;&#x590D;&#x5236;');
            });
    }
}); 