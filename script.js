// 加載 CSV 文件並解析
async function loadQuestions() {
    const response = await fetch('questions.csv');
    const text = await response.text();
    const rows = text.split('\n').slice(1); // 移除標頭行
    return rows.map(row => {
        const [題號, 題目, 選項A, 選項B, 選項C, 選項D, Answer] = row.split(',');
        return { 題號, 題目, 選項A, 選項B, 選項C, 選項D, Answer: parseInt(Answer) };
    });
}

// 隨機選取 10 題
function getRandomQuestions(questions, count) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 顯示當前題目
function displayQuestion(question, index, total) {
    document.getElementById('question-number').textContent = `題號 ${question.題號} (${index + 1}/${total})`;
    document.getElementById('question-text').textContent = question.題目;
    document.getElementById('option1').textContent = question.選項A;
    document.getElementById('option2').textContent = question.選項B;
    document.getElementById('option3').textContent = question.選項C;
    document.getElementById('option4').textContent = question.選項D;
    document.getElementById('user-answer').value = '';
    document.getElementById('result').className = '';
    document.getElementById('result').textContent = '';
}

// 主邏輯
document.addEventListener('DOMContentLoaded', async () => {
    const questions = await loadQuestions();
    const selectedQuestions = getRandomQuestions(questions, 10);
    let currentIndex = 0;

    // 顯示第一題
    displayQuestion(selectedQuestions[currentIndex], currentIndex, 10);

    // 答案輸入監聽
    const answerInput = document.getElementById('user-answer');
    answerInput.addEventListener('input', () => {
        const userAnswer = parseInt(answerInput.value);
        const correctAnswer = selectedQuestions[currentIndex].Answer;

        if (userAnswer >= 1 && userAnswer <= 4) {
            if (userAnswer === correctAnswer) {
                document.getElementById('result').className = 'correct';
                setTimeout(() => {
                    currentIndex++;
                    if (currentIndex < 10) {
                        displayQuestion(selectedQuestions[currentIndex], currentIndex, 10);
                    } else {
                        document.getElementById('question-container').style.display = 'none';
                        document.getElementById('end-screen').style.display = 'block';
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 3000);
                    }
                }, 1000);
            } else {
                document.getElementById('result').className = 'incorrect';
            }
        }
    });

    // 中途離開返回首頁
    window.onbeforeunload = () => {
        if (currentIndex < 10) {
            window.location.href = 'index.html';
        }
    };
});