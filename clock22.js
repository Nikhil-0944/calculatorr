const digitalTime = document.getElementById('digitalTime');
const digitalDate = document.getElementById('digitalDate');
 
function pad(n){ return n.toString().padStart(2, '0'); }
 
function tick(){
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
 
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  digitalTime.textContent = `${pad(h12)}:${pad(m)}:${pad(s)} ${ampm}`;
 
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  digitalDate.textContent = `${days[now.getDay()]} · ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
 
  requestAnimationFrame(tick);
}
 
tick();