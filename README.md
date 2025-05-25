**매주 하실 일:**

1.  **새로운 주차 HTML 파일 만들기**: (예: `25-22nd.html`)
    * 이 파일은 이전의 "주차별 페이지 템플릿" (`bibleStudyHelper`의 최종 형태)을 기반으로 만듭니다. 즉, `<section class="page-specific-content">` 안에 해당 주차의 실제 내용을 모두 포함하고 있어야 합니다.
    * `<title>` 태그를 해당 주차에 맞게 수정합니다.
    * 이 파일에도 `style.css` 링크, `menuData.js` 스크립트, 그리고 메뉴 생성 및 검색/클릭 효과를 위한 JavaScript가 모두 포함되어 있어야 합니다. (템플릿을 복사하면 자연스럽게 포함됩니다.)
2.  **`menuData.js` 파일 수정**:
    * `weeklyBibleStudies` 배열의 **맨 위에** 새로운 주차 정보를 추가합니다.
        ```javascript
        // menuData.js
        const weeklyBibleStudies = [
            { title: "22주차 새 주제", date: "...", number: "22nd", file: "25-22nd.html" },
            { title: "영원히 행복하게 사는 방법", date: "...", number: "21st", file: "25-21st.html" },
            // ... (이하 생략)
        ];
        ```
3.  **`index.html` 파일은 수정할 필요 없음**: JavaScript가 알아서 `menuData.js`의 최신 내용을 가져와 보여줍니다.
4.  **GitHub에 업로드**: 새로 만든 주차 HTML 파일과 수정된 `menuData.js` 파일을 업로드합니다. (`index.html`은 변경되지 않았으므로 다시 올릴 필요 없습니다.)

이제 `index.html`은 이 코드로 교체하시고, 각 주차별 파일(예: `25-20th.html`, `25-21st.html`)은 이전 템플릿을 기반으로 실제 내용을 담고 있도록 구성하시면 됩니다.

이 방식으로 진행하시면 `index.html`을 매주 업데이트하는 번거로움이 사라집
