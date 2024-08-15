document.addEventListener('DOMContentLoaded', () => {
    const EVENTS_DELAY = 20000;

    const games = {
        1: {
            name: 'Riding Extreme 3D',
            appToken: 'd28721be-fd2d-4b45-869e-9f253b554e50',
            promoId: '43e35910-c168-4634-ad4f-52fd764a843f',
        },
        2: {
            name: 'Chain Cube 2048',
            appToken: 'd1690a07-3780-4068-810f-9b5bbf2931b2',
            promoId: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',
        },
        3: {
            name: 'My Clone Army',
            appToken: '74ee0b5b-775e-4bee-974f-63e7f4d5bacb',
            promoId: 'fe693b26-b342-4159-8808-15e3ff7f8767',
        },
        4: {
            name: 'Train Miner',
            appToken: '82647f43-3f87-402d-88dd-09a90025313f',
            promoId: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
        },
        5: {
            name: 'Merge Away',
            appToken: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833',
            promoId: 'dc128d28-c45b-411c-98ff-ac7726fbaea4'
        }
    };

    const startBtn = document.getElementById('startBtn');
    const keyCountSelect = document.getElementById('keyCountSelect');
    const keyCountLabel = document.getElementById('keyCountLabel');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressLog = document.getElementById('progressLog');
    const keyContainer = document.getElementById('keyContainer');
    const keysList = document.getElementById('keysList');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const generateMoreBtn = document.getElementById('generateMoreBtn');
    const copyStatus = document.getElementById('copyStatus');
    const sourceCodeBtn = document.getElementById('sourceCode');
    const gameSelect = document.getElementById('gameSelect');
    
    startBtn.addEventListener('click', () => {
        const gameId = gameSelect.value;
        const keyCount = parseInt(keyCountSelect.value);

        if (!gameId || !keyCount) {
            alert('Please select both game and number of keys.');
            return;
        }

        const { appToken, promoId } = games[gameId];
        startGeneration(appToken, promoId, keyCount);
    });

    function startGeneration(appToken, promoId, keyCount) {
        progressContainer.classList.remove('hidden');
        keyContainer.classList.add('hidden');
        generateMoreBtn.classList.add('hidden');
        copyStatus.classList.add('hidden');

        let progress = 0;
        progressText.textContent = `0%`;
        progressBar.style.width = '0%';
        progressLog.textContent = 'Generating keys...';

        const intervalId = setInterval(() => {
            progress += 10;
            if (progress > 100) {
                progress = 100;
                clearInterval(intervalId);
                progressLog.textContent = 'Generation complete!';
                displayKeys(keyCount);
            }

            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
        }, EVENTS_DELAY / 10);
    }

    function displayKeys(count) {
        keysList.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const key = `KEY-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
            const keyItem = document.createElement('div');
            keyItem.className = 'key-item';
            keyItem.innerHTML = `
                <input type="text" value="${key}" readonly />
                <button class="copyKeyBtn" data-key="${key}">Copy</button>
            `;
            keysList.appendChild(keyItem);
        }

        keyContainer.classList.remove('hidden');
        generateMoreBtn.classList.remove('hidden');
        copyAllBtn.classList.remove('hidden');
    }

    keysList.addEventListener('click', (e) => {
        if (e.target.classList.contains('copyKeyBtn')) {
            const key = e.target.dataset.key;
            copyToClipboard(key);
            copyStatus.classList.remove('hidden');
            copyStatus.textContent = 'Key copied to clipboard!';
            setTimeout(() => copyStatus.classList.add('hidden'), 2000);
        }
    });

    copyAllBtn.addEventListener('click', () => {
        const keys = Array.from(keysList.querySelectorAll('input')).map(input => input.value);
        keys.forEach(key => copyToClipboard(key));
        copyStatus.classList.remove('hidden');
        copyStatus.textContent = 'All keys copied to clipboard!';
        setTimeout(() => copyStatus.classList.add('hidden'), 2000);
    });

    generateMoreBtn.addEventListener('click', () => {
        keyContainer.classList.add('hidden');
        progressContainer.classList.add('hidden');
    });

    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    sourceCodeBtn.addEventListener('click', () => {
        window.open('https://github.com/your-repo-url', '_blank');
    });
});
