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
    const generatedKeysTitle = document.getElementById('generatedKeysTitle');
    const gameSelect = document.getElementById('gameSelect');
    const copyStatus = document.getElementById('copyStatus');
    const gameSelectGroup = document.getElementById('gameSelectGroup');
    const keyCountGroup = document.getElementById('keyCountGroup');

    startBtn.addEventListener('click', async () => {
        const gameChoice = parseInt(gameSelect.value);
        const keyCount = parseInt(keyCountSelect.value);
        const game = games[gameChoice];

        // Hide the form sections and show progress
        gameSelectGroup.classList.add('hidden');
        keyCountGroup.classList.add('hidden');
        startBtn.classList.add('hidden');
        progressContainer.classList.remove('hidden');

        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        progressLog.textContent = 'Generating keys...';

        const keys = [];
        for (let i = 0; i < keyCount; i++) {
            // Simulate key generation
            await new Promise(resolve => setTimeout(resolve, EVENTS_DELAY / keyCount));
            keys.push(`KEY-${Math.random().toString(36).substr(2, 10).toUpperCase()}`);
            const progress = ((i + 1) / keyCount) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }

        progressLog.textContent = 'Keys generated!';
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            keyContainer.classList.remove('hidden');
            generatedKeysTitle.classList.remove('hidden');
            keysList.innerHTML = keys.map(key => `<div class="key-item"><input type="text" value="${key}" readonly><button class="copyKeyBtn" data-key="${key}">Copy</button></div>`).join('');
            copyAllBtn.classList.remove('hidden');
        }, 1000);
    });

    copyAllBtn.addEventListener('click', () => {
        const inputs = keysList.querySelectorAll('input');
        const textToCopy = Array.from(inputs).map(input => input.value).join('\n');
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                copyStatus.textContent = 'All keys copied to clipboard!';
                copyStatus.classList.remove('hidden');
                setTimeout(() => copyStatus.classList.add('hidden'), 2000);
            })
            .catch(err => console.error('Failed to copy keys: ', err));
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('copyKeyBtn')) {
            const key = event.target.dataset.key;
            navigator.clipboard.writeText(key)
                .then(() => {
                    copyStatus.textContent = `Key "${key}" copied to clipboard!`;
                    copyStatus.classList.remove('hidden');
                    setTimeout(() => copyStatus.classList.add('hidden'), 2000);
                })
                .catch(err => console.error('Failed to copy key: ', err));
        }
    });
});
