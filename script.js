let participants = [];

// Parse CSV
function parseCSV(text) {
    const lines = text.split("\n");
    const result = [];
    for(let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if(line) {
            const [name, phone] = line.split(",");
            result.push({name: name.trim(), phone: phone ? phone.trim() : ""});
        }
    }
    return result;
}

// Load CSV
document.getElementById('loadCsv').addEventListener('click', () => {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    if(!file) {
        alert("Please select a CSV file!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        participants = parseCSV(e.target.result);
        displayParticipants();
    };
    reader.readAsText(file);
});

// Display participants
function displayParticipants() {
    const list = document.getElementById('participantsList');
    list.innerHTML = '';
    participants.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.name} - ${p.phone}`;
        list.appendChild(li);
    });
}

// Draw Lottery
document.getElementById('drawLottery').addEventListener('click', () => {
    const numWinners = parseInt(document.getElementById('numWinners').value);
    if(numWinners > participants.length) {
        alert("Not enough participants!");
        return;
    }

    const shuffled = [...participants].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, numWinners);

    displayWinners(winners);
    launchConfetti();
});

// Display Winners
function displayWinners(winners) {
    const list = document.getElementById('winnersList');
    list.innerHTML = '';
    winners.forEach(w => {
        const li = document.createElement('li');
        li.textContent = `${w.name} - ${w.phone}`;
        li.classList.add('winner');
        list.appendChild(li);
    });
}

// --- Confetti Effect ---
function launchConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiCount = 150;
    const confetti = [];

    for(let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCount,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05
        });
    }

    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        confetti.forEach((c, i) => {
            ctx.beginPath();
            ctx.lineWidth = c.r;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
            ctx.stroke();
        });
        update();
    }

    function update() {
        confetti.forEach((c, i) => {
            c.tiltAngle += c.tiltAngleIncrement;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.tilt = Math.sin(c.tiltAngle) * 15;

            if(c.y > canvas.height) {
                confetti[i] = { 
                    x: Math.random() * canvas.width,
                    y: -10,
                    r: c.r,
                    d: c.d,
                    color: c.color,
                    tilt: c.tilt,
                    tiltAngle: 0,
                    tiltAngleIncrement: c.tiltAngleIncrement
                };
            }
        });
    }

    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    animate();
}
