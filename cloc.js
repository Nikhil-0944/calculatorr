const ticksGroups=document.getElementById('ticks');
const center = 190, radius= 172;

for(let i = 0; i < 60; i++){
    const isMajor = i % 5 === 0;
    if (isMajor && (i === 0 || i === 15 || i === 30 || i === 45)) continue;
    const angle = (i*6) * Math.PI / 180;
    const outerR = radius;
    const innerR= isMajor ? radius-16 : radius - 8;
    const x1 = center + outerR * Math.sin(angle);
    const y1 = center - outerR * Math.cos(angle);
    const x2 = center + innerR * Math.sin(angle);
    const y2 = center - innerR * Math.cos(angle);
     
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', isMajor ? 'tick-major' : 'tick-minor');
    ticksGroups.appendChild(line);

}

const hourHand = document.getElementById('hour');
const minuteHand = document.getElementById('minute');
const secondHand = document.getElementById('second');

function tick() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();

    const secDeg = (s + ms / 1000) * 6;
    const minDeg = (m + s / 60) * 6;
    const hourDeg = ((h % 12) + m / 60) * 30;

    secondHand.style.transform = `rotate(${secDeg}deg)`;
    minuteHand.style.transform = `rotate(${minDeg}deg)`;
    hourHand.style.transform = `rotate(${hourDeg}deg)`;

    requestAnimationFrame(tick);
}

tick();

function hello(){
    
}