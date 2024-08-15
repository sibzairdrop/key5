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
    const gameSelect = document.getElementById('gameSelect');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressLog = document.getElementById('progressLog');
    const keyContainer = document.getElementById('keyContainer');
    const keysList = document.getElementById('keysList');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const generatedKeysTitle = document.getElementById('generatedKeysTitle');
    const generateMoreBtn = document.getElementById('generateMoreBtn');
    const keyCountLabel = document.getElementById('keyCountLabel');
    const copyStatus = document.getElementById('copyStatus');
    const gameSelectGroup = document.getElementById('gameSelectGroup');
    const keyCountGroup = document.getElementById('keyCountGroup');

    const copyToClipboard = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                copyStatus.classList.remove('hidden');
                setTimeout(() => copyStatus.classList.add('hidden'), 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';  // Avoid scrolling to bottom of page
            textArea.style.top = '0';
            textArea.style.left = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
                if (successful) {
                    copyStatus.classList.remove('hidden');
                    setTimeout(() => copyStatus.classList.add('hidden'), 2000);
                }
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
        }
    };

    startBtn.addEventListener('click', async () => {
        const selectedGame = gameSelect.value;
        const keyCount = parseInt(keyCountSelect.value);
        const { appToken, promoId } = games[selectedGame];

        if (!appToken || !promoId) {
            console.error('Invalid game selected');
            return;
        }

        const clientId = generateClientId();
        const clientToken = await login(clientId, appToken);

        progressContainer.classList.remove('hidden');
        keyContainer.classList.add('hidden');
        generatedKeysTitle.classList.add('hidden');
        copyAllBtn.classList.add('hidden');

        let keys = [];

        for (let i = 0; i < keyCount; i++) {
            let hasCode = false;
            while (!hasCode) {
                hasCode = await emulateProgress(clientToken, promoId);
                await sleep(delayRandom() * EVENTS_DELAY);
            }
            const key = await generateKey(clientToken, promoId);
            keys.push(key);
            const keyItem = document.createElement('div');
            keyItem.className = 'key-item';
            keyItem.innerHTML = `
                <input type="text" value="${key}" readonly>
                <button class="copyKeyBtn">Copy</button>
            `;
            keysList.appendChild(keyItem);
        }

        copyAllBtn.classList.remove('hidden');
        generatedKeysTitle.classList.remove('hidden');
        keyContainer.classList.remove('hidden');
        progressContainer.classList.add('hidden');

        document.querySelectorAll('.copyKeyBtn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                copyToClipboard(keys[index]);
            });
        });

        copyAllBtn.addEventListener('click', () => {
            copyToClipboard(keys.join('\n'));
        });

        progressBar.style.width = '100%';
        progressText.innerText = '100%';
        progressLog.innerText = 'Complete';

        startBtn.classList.remove('hidden');
        keyCountSelect.classList.remove('hidden');
        gameSelect.classList.remove('hidden');
        startBtn.disabled = false;
    });

    generateMoreBtn.addEventListener('click', () => {
        progressContainer.classList.add('hidden');
        keyContainer.classList.add('hidden');
        startBtn.classList.remove('hidden');
        keyCountSelect.classList.remove('hidden');
        gameSelect.classList.remove('hidden');
        generatedKeysTitle.classList.add('hidden');
        copyAllBtn.classList.add('hidden');
        keysList.innerHTML = '';
        keyCountLabel.innerText = 'Number of keys:';
        
        // Show the form sections again
        gameSelectGroup.style.display = 'block';
        keyCountGroup.style.display = 'block';
    });

    const generateClientId = () => {
        const timestamp = Date.now();
        const randomNumbers = Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join('');
        return `${timestamp}-${randomNumbers}`;
    };

    const login = async (clientId, appToken) => {
        const response = await fetch('https://api.gamepromo.io/promo/login-client', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                appToken,
                clientId,
                clientOrigin: 'deviceid'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        const data = await response.json();
        return data.clientToken;
    };

    const emulateProgress = async (clientToken, promoId) => {
        const response = await fetch('https://api.gamepromo.io/promo/register-event', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${clientToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                promoId,
                eventId: generateUUID(),
                eventOrigin: 'undefined'
            })
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.hasCode;
    };

    const generateKey = async (clientToken, promoId) => {
        const response = await fetch('https://api.gamepromo.io/promo/create-code', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${clientToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                promoId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate key');
        }

        const data = await response.json();
        return data.promoCode;
    };

    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const delayRandom = () => Math.random() / 3 + 1;

    document.getElementById('telegramChannelBtn').addEventListener('click', () => {
        window.open('https://t.me/keyganhamster', '_blank');
    });

    document.getElementById('telegramChannelBtn2').addEventListener('click', () => {
        window.open('https://t.me/sibz_airdrop', '_blank');
    });
});
