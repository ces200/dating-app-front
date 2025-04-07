document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
  
    // 사용자가 입력한 데이터 가져오기
    const photos = document.getElementById('photos').files;
    const gender = document.getElementById('gender').value;
    const birthYear = document.getElementById('birthYear').value;
    const location = document.getElementById('location').value;
    const job = document.getElementById('job').value;
    const hobby = document.getElementById('hobby').value;
    const other = document.getElementById('other').value;
  
    // 사진 파일 처리 (예: 사진 URL 생성)
    const photoUrls = [];
    for (let i = 0; i < photos.length; i++) {
      photoUrls.push(URL.createObjectURL(photos[i])); // 로컬 URL 생성 (임시)
    }
  
    // Google Apps Script API 호출
    const response = await fetch('https://script.google.com/macros/s/AKfycbxTMPgDATnAbEZBpK7aDdrqvVNrXWZ2R4IAhV3VRq0Ca9_vy3k7OsU0VLLSbGZ6-A0NbA/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        photoUrls,
        gender,
        birthYear,
        location,
        job,
        hobby,
        other
      })
    });
  
    const result = await response.json();
    console.log(result); // 성공 메시지 출력
  });
  
  async function loadUsers() {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxTMPgDATnAbEZBpK7aDdrqvVNrXWZ2R4IAhV3VRq0Ca9_vy3k7OsU0VLLSbGZ6-A0NbA/exec');
    const users = await response.json();
  
    const userList = document.getElementById('userList');
    
    userList.innerHTML = users.map((user, index) => `
      <div class="${user[7] === '품절' ? 'sold-out' : ''}">
        <img src="${user[0]}" alt="사진">
        <p>성별: ${user[1]}</p>
        <p>출생년도: ${user[2]}</p>
        <p>거주지: ${user[3]}</p>
        <p>직업: ${user[4]}</p>
        <p>취미: ${user[5]}</p>
        ${user[7] === '품절' ? '<p>품절</p>' : `<button onclick="markAsSold(${index + 1})">품절 처리</button>`}
      </div>
    `).join('');
  }
  
  async function markAsSold(rowIndex) {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxTMPgDATnAbEZBpK7aDdrqvVNrXWZ2R4IAhV3VRq0Ca9_vy3k7OsU0VLLSbGZ6-A0NbA/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', rowIndex })
    });
  
    const result = await response.json();
    alert(result.message);
    
    loadUsers(); // 데이터 다시 로드하여 변경사항 반영
  }
  
  // 초기 조회 페이지 로드
  loadUsers();
  
