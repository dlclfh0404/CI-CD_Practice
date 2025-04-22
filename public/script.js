// 입력창과 목록 요소를 가져옴
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

// 할 일을 추가하는 함수
function addTodo() {
  // 아무것도 안 썼으면 추가 안 함
  if (input.value === '') return;

  const li = document.createElement('li');        // 리스트 항목 만들기
  const text = input.value;                       // 입력한 텍스트 저장
  const number = list.children.length + 1;        // 항목 번호는 현재 목록 개수 + 1

  li.textContent = number + '. ' + text;          // 번호 + 내용 붙여서 li에 넣기

  const btn = document.createElement('button');   // 삭제 버튼 만들기
  btn.textContent = '삭제';

  // 삭제 버튼 클릭 시 항목 제거 + 번호 다시 정렬
  btn.onclick = function () {
    list.removeChild(li);
    updateNumbers();
  };

  // 항목 클릭하면 완료 처리 (줄 긋기)
  li.onclick = function () {
    li.classList.toggle('done');
  };

  li.appendChild(btn);        // 삭제 버튼을 li에 붙임
  list.appendChild(li);       // li를 목록에 추가
  input.value = '';           // 입력창 비우기
}

// 삭제 후 번호를 다시 매기는 함수
function updateNumbers() {
  const items = list.children;
  for (let i = 0; i < items.length; i++) {
    const li = items[i];
    const btn = li.querySelector('button');

    // "삭제"라는 텍스트는 빼고, 실제 할 일 텍스트만 추출
    const fullText = li.textContent.replace('삭제', '').trim();
    const dotIndex = fullText.indexOf('. ');
    const textOnly = dotIndex !== -1 ? fullText.slice(dotIndex + 2) : fullText;

    // 번호 다시 붙이기
    li.firstChild.textContent = (i + 1) + '. ' + textOnly;
  }
}
