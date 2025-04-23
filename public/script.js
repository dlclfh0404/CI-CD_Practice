// 입력창과 목록 요소를 가져옴
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

// 할 일을 추가하는 함수
function addTodo() {
  const text = input.value.trim(); // 입력값 앞뒤 공백 제거

  if (text === '') return; // 아무것도 안 쓰면 추가 안 함

  const li = document.createElement('li');
  const number = list.children.length + 1;

  // 텍스트와 번호 조합
  li.textContent = `${number}. ${text}`;

  // 삭제 버튼 만들기
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '삭제';

  // 삭제 버튼 클릭 시: 삭제 확인 → 삭제 + 번호 갱신
  deleteBtn.onclick = function () {
    const confirmDelete = confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      list.removeChild(li);
      updateNumbers();
    }
  };

  // 완료 토글 (줄긋기)
  li.onclick = function (e) {
    // 삭제 버튼 눌렀을 때는 줄긋기 막기
    if (e.target === deleteBtn) return;
    li.classList.toggle('done');
  };

  // 구성 및 추가
  li.appendChild(deleteBtn);
  list.appendChild(li);
  input.value = ''; // 입력창 비우기
}

// 삭제 후 번호를 다시 매기는 함수
function updateNumbers() {
  const items = Array.from(list.children);
  items.forEach((li, index) => {
    const deleteBtn = li.querySelector('button');

    // 삭제 버튼 제외한 텍스트만 추출
    const fullText = li.textContent.replace('삭제', '').trim();
    const dotIndex = fullText.indexOf('. ');
    const textOnly = dotIndex !== -1 ? fullText.slice(dotIndex + 2) : fullText;

    // 번호 다시 설정
    li.firstChild.textContent = `${index + 1}. ${textOnly}`;
  });
}

