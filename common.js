// --- 1. 전역에서 사용할 요소들을 미리 찾아 변수에 저장 ---
const menuToggleButton = document.getElementById('menuToggleButton');
const sidebarMenu = document.getElementById('sidebarMenu');
const overlay = document.querySelector('.overlay');
const searchInput = document.getElementById('searchInput');
const archiveLinksUl = document.getElementById('archiveLinks');
// 'latestWeekContentContainer'는 index.html에만 존재함. 다른 페이지에서는 null이 됨.
const contentContainer = document.getElementById('latestWeekContentContainer'); 

// --- 2. 함수 정의 ---

/**
 * menuData.js를 기반으로 사이드바 메뉴를 동적으로 생성하는 함수
 */
function generateSidebarMenu() {
    if (typeof weeklyBibleStudies === 'undefined' || weeklyBibleStudies.length === 0) {
        archiveLinksUl.innerHTML = '<li>메뉴 데이터가 없습니다.</li>';
        return;
    }

    archiveLinksUl.innerHTML = ''; // 기존 메뉴 초기화

    const currentPath = window.location.pathname;
    let currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    // 현재 페이지가 루트('/')나 index.html이면, 최신 게시글 파일을 활성화 대상으로 지정
    if (currentFile === '' || currentFile === 'index.html') {
        currentFile = weeklyBibleStudies[0].file;
    }

    weeklyBibleStudies.forEach(study => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = study.file;
        link.innerHTML = `<span class="title">${study.title}</span><span class="date">${study.date} - <i>${study.number}</i></span>`;

        // 현재 페이지의 파일명과 메뉴의 파일명이 일치하면 active 클래스 추가
        if (currentFile === study.file) {
            link.classList.add('active-page-link');
        }

        listItem.appendChild(link);
        archiveLinksUl.appendChild(listItem);
    });
}

/**
 * 구절(.verse) 요소를 클릭했을 때 시각적 효과를 주는 함수
 * @param {string} selector - 클릭 이벤트를 추가할 요소의 CSS 선택자
 */
function attachVerseClickListeners(selector) {
    document.querySelectorAll(selector).forEach(verse => {
        // 이미 이벤트 리스너가 부착된 요소는 건너뛰어 중복 방지
        if (verse.dataset.listenerAttached === 'true') return;

        verse.addEventListener('click', function() {
            this.style.transform = 'scale(1.015)';
            setTimeout(() => { this.style.transform = 'scale(1)'; }, 150);
        });
        verse.dataset.listenerAttached = 'true';
    });
}

/**
 * [index.html 전용] 최신 주차 내용을 동적으로 불러오는 함수
 */
function loadLatestWeekContent() {
    // 이 함수는 'contentContainer' 요소가 있는 index.html에서만 실행됨
    if (!contentContainer) {
        return;
    }

    if (typeof weeklyBibleStudies !== 'undefined' && weeklyBibleStudies.length > 0) {
        const latestStudy = weeklyBibleStudies[0]; // menuData.js의 첫 번째 항목이 최신

        fetch(latestStudy.file)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(htmlText => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');
                const specificContent = doc.querySelector('.page-specific-content');

                if (specificContent) {
                    contentContainer.innerHTML = specificContent.innerHTML;
                    // 동적으로 불러온 콘텐츠 내부의 .verse 요소들에 클릭 효과 추가
                    attachVerseClickListeners('#latestWeekContentContainer .verse');
                } else {
                    contentContainer.innerHTML = `<p style="text-align:center; color:red;">콘텐츠 영역을 찾지 못했습니다.</p>`;
                }
            })
            .catch(error => {
                console.error('최신 내용 로드 중 오류:', error);
                contentContainer.innerHTML = `<p style="text-align:center; color:red;">최신 내용을 불러오는 중 오류가 발생했습니다.</p>`;
            });
    } else {
        contentContainer.innerHTML = '<p style="text-align:center; color:red;">메뉴 데이터를 찾을 수 없습니다.</p>';
    }
}

/**
 * 검색창에 입력된 내용에 따라 현재 페이지의 질문 그룹을 필터링하는 함수
 */
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // 검색 범위: index.html에서는 contentContainer, 다른 페이지에서는 .page-specific-content
    const searchScope = contentContainer || document.querySelector('.page-specific-content');
    if (!searchScope) return;

    const questionGroups = searchScope.querySelectorAll('.question-group');
    
    questionGroups.forEach(group => {
        const groupText = group.textContent.toLowerCase();
        const isMatch = groupText.includes(searchTerm);

        group.style.display = isMatch ? 'block' : 'none';
        
        // 검색어가 있을 때 일치하는 항목에 배경색 하이라이트 적용하고, 없으면 원래대로
        if (isMatch && searchTerm) {
            group.style.background = 'linear-gradient(135deg, #fff5e1 0%, #ffeccf 100%)';
        } else {
            // 검색어가 없을 때는 background 스타일을 제거하여 CSS에 정의된 스타일로 돌아가게 함
            group.style.background = '';
        }
    });
}


// --- 3. 이벤트 리스너 연결 ---

// 메뉴 토글 버튼과 오버레이 클릭 이벤트
menuToggleButton.addEventListener('click', () => {
    sidebarMenu.classList.toggle('open');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    sidebarMenu.classList.remove('open');
    overlay.classList.remove('active');
});

// 검색창 입력 이벤트
searchInput.addEventListener('input', handleSearch);


// --- 4. 페이지 로드 시 초기 실행 ---

// 1. 사이드바 메뉴 생성
generateSidebarMenu();

// 2. index.html일 경우 최신 내용 로드
loadLatestWeekContent();

// 3. 각 주차별 페이지의 정적 콘텐츠에 클릭 리스너 부착
// (index.html에서는 동적 로드 후 attachVerseClickListeners가 별도로 호출됨)
attachVerseClickListeners('.page-specific-content .verse');
