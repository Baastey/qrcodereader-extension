document.getElementById('scan-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('qr-input');
    const file = fileInput.files[0];

    if (file) {
        readAndScanImage(file);
    } else {
        alert('Bitte wählen Sie eine Datei aus.');
    }
});

function readAndScanImage(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

            if (qrCode) {
                if (isValidHttpUrl(qrCode.data)) {
                    document.getElementById('result').innerHTML = `<a href="${qrCode.data}" target="_blank">${qrCode.data}</a>`;
                } else {
                    document.getElementById('result').textContent = qrCode.data;
                }
            } else {
                document.getElementById('result').textContent = 'Kein QR-Code gefunden.';
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}
